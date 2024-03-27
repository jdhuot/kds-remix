import { getAllJobs, createOrUpdateJob, getClientId, createOrUpdateClient } from '~/firebase.jsx';
import TurndownService from 'turndown';
import OpenAI from 'openai';
import cheerio from 'cheerio';


export async function action({ request }) {

  const data = await request.json();

  console.log("data: ", data)

  const currentYear = new Date().getFullYear();

  // Open AI
  const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY
  });
  const instructions = `
  Context - an email came in to a drywall sanding company called Klassen Drywall Sanding. The email could be from a client company and contain a work order for drywall sanding services. First, if the from email address contains "robsdrywall", please scan the email content which is formatted in markdown, and if there is a table present, please DISREGARD all rows in the table which do not start with "Klassen" in the first column (but don't disregard the first heading row). Next parse the relevant data from the email sender and body content into a fully structured JSON object like this:  {
    "jobAddress":<string>, 
    "jobStartDate":<string>, // formatted like YYYY-MM-DD
    "quantity":<Number>, // this is the number of board feet
    "notes":<string>,
    "timeframe":<string>,
    "client":<string>
  }
  notes - 1. the quantity should be in square feet / board feet, but the value returned should just be a number format, like: 1026. 2. For notes, please include any and all relavent notes that would be useful such as specific contact information, or notes about the job site. 3. For the client field, please apply the relevant company that ideally appears to match from the following options: Rob's Drywall, SPAAR, or New Interiors Ltd (this will likely be indicated by the sender of the email) it also should never be: "Klassen" however, if it's a new client, just put the new client name. 4. Please scan for the appropriate date to use for Job start date. Job start date set in the object should be formatted like: year-month-day (eg: 2024-03-27) The year will almost always be the current year (${currentYear}). 5. sometimes the email may contain rows or data pertaining to other companies for different somewhat related services like texturing, please disregard any data relevant to those companies and only filter for relavent data for Klassen Drywall Services. 6. For Timeframe, only set as either AM or PM if it's mentioned (and only if it appears to relate specifically to Klassen Drywall Sanding), otherwise set Timeframe to "".
  `;

  // HELPERS
  function modifyJob(jobObj, emailBodyHtml) {

    // Check if the "Client" key value contains "spa" and update it to "SPAAR" if true
    if (jobObj.client && jobObj.client?.toLowerCase().includes("spa")) {
      jobObj.client = "SPAAR";
    } else if (jobObj.client && jobObj.client?.toLowerCase().includes("rob")) {
    jobObj.client = "Rob's Drywall";
    }

    if (
      jobObj.client == null || 
      jobObj.client == "null" ||
      jobObj.client == false || 
      jobObj.client == "false" ||
      jobObj.client == "undefined" ||
      jobObj.client == undefined ||
      jobObj.client == "" ||
      jobObj.client == '' 
    ) {
      const spaar = ["spaar"]
      if (containsKeywords(emailBodyHtml, spaar)) {
        jobObj.client = "SPAAR"
      }
      const robs = ["robs drywall", "rob's drywall","robsdrywall"]
      if (containsKeywords(emailBodyHtml, robs)) {
        jobObj.client = "Rob's Drywall"
      }
    }


    // Extract the year from the "Job Start Date" and update it to the current year if it's less
    let jobStartDate = jobObj.jobStartDate;
    if (jobStartDate) {
      const dateParts = jobStartDate.split("-");
      const currentYear = new Date().getFullYear();
      const jobYear = parseInt(dateParts[0]);

      if (jobYear < currentYear) {
        dateParts[0] = currentYear;
        jobObj.jobStartDate = dateParts.join("-");
      }
    }
    return jobObj;
  }

  // Markdown
  const turndownService = new TurndownService();
  function convertHtmlToMarkdown(html) {
    return turndownService.turndown(html);
  }


  async function sendToGPT3(senderInfo, markdownContent, instructions) {
    const prompt = `instructions: ${instructions}\n\nemail sender: ${senderInfo}\n\nemail body (markdown): ${markdownContent}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      // model: 'gpt-3.5-turbo',
      model: 'gpt-4-1106-preview'
    });

    let inputString = completion.choices[0].message.content;

    // Find the start and end positions of the object within the string
    const start = inputString.indexOf("{");
    const end = inputString.lastIndexOf("}") + 1;
    // Extract the object substring
    const objectString = inputString.slice(start, end);
    // Parse the object string into an actual JavaScript object
    const parsedObject1 = JSON.parse(objectString);

    modifyJob(parsedObject1, markdownContent);

    console.log("parsedObject1: ", parsedObject1);
    // I've got the initial data baby

    return { originalInput: prompt, originalOutput: parsedObject1 }    
  }



  function containsKeywords(text, keywords) {
    // Create a regex pattern that looks for any of the keywords, case-insensitively
    const pattern = new RegExp(keywords.join("|"), "i");
    return pattern.test(text);
  }


  async function fetchFirebaseJobs(parsedObject, emailHtml) {

    const fetchJobs = await getAllJobs();

    const jobsArray = Object.entries(fetchJobs).map(([key, value]) => ({
      id: key,
      ...value
    }));

    let existingItem = jobsArray.filter(item => item.jobAddress?.toLowerCase() === parsedObject.jobAddress?.toLowerCase());

    if (existingItem.length > 0) {
      // job exists, just update
      parsedObject.id = newId;
      const jobObj = {
        id: existingItem.id,
        clientId: existingItem.clientId,
        crewId: existingItem.crewId,
        dateUpdated: new Date().toString(),
        jobAddress: existingItem.jobAddress,
        jobStartDate: parsedObject.jobStartDate,
        notes: existingItem.notes + " | Updated Notes: " + parsedObject.notes,
        quantity: parsedObject.quantity,
        timeframe: parsedObject.timeframe,
        status: "Updated",
        autoUpdated: new Date().toString(),
        email: existingItem.email + " | Updated Email: " + emailHtml
      }
      await createOrUpdateJob(jobObj)
      console.log("updated job in firebase")
      
    } else {
      // job doesn't exist, let's create it
      let clientId = await getClientId(parsedObject.client)

      console.log("clientId: ", clientId);

      if (!clientId) {
        clientId = await createOrUpdateClient({ id: null, name: parsedObject.client })
      }
      const jobObj = {
        id: null,
        clientId: clientId,
        crewId: null,
        dateUpdated: new Date().toString(),
        jobAddress: parsedObject.jobAddress,
        jobStartDate: parsedObject.jobStartDate,
        notes: parsedObject.notes,
        quantity: parsedObject.quantity,
        timeframe: parsedObject.timeframe,
        status: "New",
        autoUpdated: false,
        email: emailHtml
      }
      await createOrUpdateJob(jobObj)

    }


  }


  

  const senderInfo = data.sender;
  const emailBodyHTML = data.bodyHtml;
  let emailMarkdown = convertHtmlToMarkdown(emailBodyHTML);
  const keywords = ["work order", "robsdrywall", "spaar", "sanding", "job site", "job address", "sand", "job order"];

  if (containsKeywords(emailBodyHTML, keywords)) {
    console.log("Email body contains one of the keywords.");

    if (senderInfo.includes('robsdrywall')) {

      // Load the HTML string into Cheerio
      const $ = cheerio.load(emailBodyHTML);

      const keywords = ['job address', 'klassen', 'company', 'sand', '-'];

      const filteredTrsArray = $('tr').filter(function() {
        const textContent = $(this).text().toLowerCase();
        return keywords.some(keyword => textContent.includes(keyword.toLowerCase()));
      }).get();
    
      const $tableToReplace = $('.WordSection1 > table');
      if ($tableToReplace.length) {
        const $newTable = $('<table></table>');
        const $tbody = $('<tbody></tbody>');
        
        $tbody.append(filteredTrsArray);
        $newTable.append($tbody);
    
        $tableToReplace.replaceWith($newTable);
      }
    
      const updatedHtml = $.html();


      emailMarkdown = convertHtmlToMarkdown(updatedHtml); // modified markdown for robs drywall

    }

    const jobFromGpt = await sendToGPT3(senderInfo, emailMarkdown, instructions).catch((error) => {
      console.log("Error with OpenAI API: ", error);
    });

    jobFromGpt.bodyHtml = emailBodyHTML;

    console.log("jobFromGpt: ", jobFromGpt);

    // await fetchFirebaseJobs(jobFromGpt.originalOutput, emailBodyHTML).catch((error) => {
    //   console.log("Error with adding to Firebase: ", error);
    // })
  
    // return {
    //   statusCode: 200,
    //   body: JSON.stringify({"res": "endpoint hit, sent to GPT and Firebase!"})
    // };

    await fetch(`http://localhost:3000/kds-2`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobFromGpt)
    });


    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"res": "endpoint hit, sent to KDS-2!"})
    };
    

  } else {
    console.log("Email body does not contain any of the keywords.");

    return {
      statusCode: 200,
      body: JSON.stringify({"res": "endpoint hit, but email didn't contain keywords.."})
    };
  }




};
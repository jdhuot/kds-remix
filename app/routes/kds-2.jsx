import { getAllJobs, createOrUpdateJob, getClientId, createOrUpdateClient } from '~/firebase.jsx';
import OpenAI from 'openai';



export async function action({ request }) {

  const data = await request.json();

  console.log("data in kds-2: ", data)

  // Open AI registration
  const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY
  });

  // HELPERS

  function modifyJob(jobObj) {

    // Check if the "Client" key value contains "spa" and update it to "SPAAR" if true
    if (jobObj.client && jobObj.client.toLowerCase().includes("spa")) {
      jobObj.client = "SPAAR";
    } else if (jobObj.client && jobObj.client.toLowerCase().includes("rob")) {
    jobObj.client = "Rob's Drywall";
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


  async function sendToGPT3(originalInput, originalOutput) {
    const prompt = originalInput;
    const prompt2 = `Please look over the initial instructions sent to Chat GPT earlier, along with the initial inputs, and then analyze the initial output from Chat GPT to see if it accurately followed the instructions. If there are errors, please fix and output the correct object. Do not return any notes or clarifications, but only JSON format. ############################## Initial instructions and input: ${prompt} ############################# Initial output: ${originalOutput}`;


    const completion2 = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt2 }],
      // model: 'gpt-3.5-turbo',
      model: 'gpt-4-1106-preview'
    });

    let inputString2 = completion2.choices[0].message.content;

    console.log("inputString2: ", inputString2);

    // Find the start and end positions of the object within the string
    const start2 = inputString2.indexOf("{");
    const end2 = inputString2.lastIndexOf("}") + 1;
    // Extract the object substring
    const objectString2 = inputString2.slice(start2, end2);
    // Parse the object string into an actual JavaScript object
    console.log("objectString2: ", objectString2);
    const parsedObject2 = JSON.parse(objectString2);

    modifyJob(parsedObject2);

    console.log("parsedObject2: ", parsedObject2);

    return parsedObject2;
    
  }


  async function fetchFirebaseJobs(parsedObject, emailHtml) {

    const fetchJobs = await getAllJobs();

    const jobsArray = Object.entries(fetchJobs).map(([key, value]) => ({
      id: key,
      ...value
    }));

    let existingItem = jobsArray.filter(item => item.jobAddress.toLowerCase() === parsedObject.jobAddress.toLowerCase());

    if (existingItem.length > 0) {
      // job exists, just update
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
      let clientId = await getClientId()
      if (!clientId && parsedObject.client && parsedObject.client !== "") {
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


  const originalInput = data.originalInput;
  const originalOutput = data.originalOutput;
  const emailBodyHTML = data.bodyHtml;
  // console.log("res.data.payload.parts: ", res.data.payload.parts);
  // console.log("emailMarkdown: ", emailMarkdown);


  const jobFromGpt = await sendToGPT3(originalInput, originalOutput).catch((error) => {
    console.log("Error with OpenAI API: ", error);
  });

  await fetchFirebaseJobs(jobFromGpt, emailBodyHTML).catch((error) => {
    console.log("Error with Webflow API: ", error);
  })

  return {
    statusCode: 200,
    body: JSON.stringify({"res": "endpoint hit, sent to GPT/Webflow!"})
  };
      




};

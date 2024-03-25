import { initializeApp } from 'firebase/app';
import { getDatabase, get, ref, onValue, set, update, push } from 'firebase/database';
import { generateDateTimeId, arrayToObj } from '~/utils/tools';

const firebaseConfig = {
  apiKey: "AIzaSyDdYDwthlPPjHv66W_Hl9oRAuYTXXiTSmM",
  authDomain: "kds-remix.firebaseapp.com",
  projectId: "kds-remix",
  storageBucket: "kds-remix.appspot.com",
  messagingSenderId: "38823345299",
  appId: "1:38823345299:web:0ccdcef41485fa6660a166"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);


export const getAllData = async (path) => {
  const dbRef = ref(database, `${path}/`);
  
  try {
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
        const data = snapshot.val();
        // console.log(`${path} Data: `, data);
        return data;
    } else {
        //no data
        return null;
    }
  } catch (error) {
      console.error(error);
      throw new Error(`Error fetchin ${path} from Firebase`);
  }
}

export const getAllClients = () => getAllData('clients');
export const getAllCrew = () => getAllData('crew');


export const getAllJobs = async () => {
  const dbRef = ref(database, 'jobs/');
  const clientsObj = await getAllClients();
  const crewsObj = await getAllCrew();

  // const clientsObj = arrayToObj(clientsArray);
  // const crewsObj = arrayToObj(crewArray);

  try {
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
        const data = snapshot.val();
        for (let i in data) {
          let job = data[i];
          job['client'] = clientsObj[job.clientId]
          job['crew'] = crewsObj[job.crewId]
        }
        console.log("getAllJobs Data: ", data);
        return data;
    } else {
        //no data
        return null;
    }
  } catch (error) {
      console.error(error);
      throw new Error("Error fetching getAllJobs data from Firebase");
  }
}

export const createOrUpdateJob = async (job) => {
  // Decide if it's a new job or editing an existing one based on job id
  const newId = generateDateTimeId();
  const dbRef = ref(database, 'jobs/' + (job.id || newId));
  
  try {

    if (job.id) {
      // Update existing job
      await update(dbRef, job);
      console.log("updated job");
    } else {
      // Add new job
      job['id'] = newId;
      await set(dbRef, job);
      console.log("created new job");
    }

  } catch (error) {
    console.error(error);
    throw new Error("Error with createOrUpdateJob");
  }

}


export const createOrUpdateClient = async (item) => {
  // Decide if it's a new item or editing an existing one based on client id
  const newId = generateDateTimeId();
  const dbRef = ref(database, 'clients/' + (item.id || newId));
  
  try {

    if (item.id) {
      // Update existing client
      await update(dbRef, item);
      console.log("updated client");
    } else {
      // Add new client
      item['id'] = newId;
      await set(dbRef, item);
      console.log("created new client");
    }

  } catch (error) {
    console.error(error);
    throw new Error("Error with createOrUpdateClient");
  }

}


export const createOrUpdateCrew = async (item) => {
  // Decide if it's a new item or editing an existing one based on id
  const newId = generateDateTimeId();
  const dbRef = ref(database, 'crew/' + (item.id || newId));
  
  try {

    if (item.id) {
      // Update existing crew
      await update(dbRef, item);
      console.log("updated crew");
    } else {
      // Add new crew
      item['id'] = newId;
      await set(dbRef, item);
      console.log("created new crew");
    }

  } catch (error) {
    console.error(error);
    throw new Error("Error with createOrUpdateCrew");
  }

}
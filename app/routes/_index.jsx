import { database, getAllJobs, createOrUpdateJob, getAllClients, getAllCrew, createOrUpdateClient, createOrUpdateCrew } from '~/firebase.jsx';
import { ref, onValue, set, update, push } from 'firebase/database';
import { useState, useEffect } from 'react';
import Header from '~/components/Header';
import DateNav from '~/components/DateNav';
import JobList from '~/components/JobList';
import { useLoaderData } from '@remix-run/react';
import { redirect } from '@remix-run/react';

import { useNavigate } from 'react-router-dom';
import JobForm from '~/components/JobForm';
import ClientForm from '~/components/ClientForm';
import CrewForm from '~/components/CrewForm';
import { json } from '@remix-run/react';

export const meta = () => {
  return [
    { title: "KDS Jobs" },
    { name: "description", content: "Welcome to KDS" },
  ];
};

export async function loader() {
  const jobs = await getAllJobs();
  const clients = await getAllClients();
  const crew = await getAllCrew();
  return {
    jobs,
    clients,
    crew
  }

}
export async function action({ request }) {
  const formData = await request.formData();
  const formId = formData.get("formId");

  if (formId == 'jobs') {
    const job = Object.fromEntries(formData);
    delete job.formId;
    console.log("job: ", job);
    if (job.id == '') {
      job.id = null;
    }
    await createOrUpdateJob(job);
  } else if (formId == 'clients') {
    const client = Object.fromEntries(formData);
    delete client.formId;
    if (client.id == '') {
      client.id = null;
    }
    await createOrUpdateClient(client);
    
  } else if (formId == 'crew') {
    const crew = Object.fromEntries(formData);
    delete crew.formId;
    if (crew.id == '') {
      crew.id = null;
    }
    await createOrUpdateCrew(crew);
  }

  return json({message: "updated"});
  // return redirect('/');
}

export default function Index() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const data = useLoaderData();
  const jobs = data.jobs;
  const crewObj = data.crew;
  const clientsObj = data.clients;
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [totalBoardFeet, setTotalBoardFeet] = useState(0);

  console.log("Jobs: ", jobs)

  const jobsArray = Object.entries(jobs).map(([key, value]) => ({
    id: key,
    ...value
  }));

  const clientsArray = Object.entries(clientsObj).map(([key, value]) => ({
    id: key,
    ...value
  }));

  const crewArray = Object.entries(crewObj).map(([key, value]) => ({
    id: key,
    ...value
  }));



  console.log("jobsArray: ", jobsArray);

  // Filter jobs based on selected date
  useEffect(() => {
    console.log("running update")
    if (jobsArray.length > 0) {
      let filteredList = jobsArray.filter(job => {
        // const jobDate = new Date(job.jobStartDate);
        const jobDate = new Date(`${job.jobStartDate}T00:00`);
        return jobDate.toDateString() == selectedDate.toDateString();
      });
      const total = filteredList.reduce((total, item) => {
        return total + Number(item.quantity);
      }, 0);
      setTotalBoardFeet(total);
      setFilteredJobs(filteredList);
    }
  },[selectedDate])

  console.log("filteredJobs: ", filteredJobs)


  const navigate = useNavigate();


  return (
    <div>
      <Header username="admin" />
      <DateNav initialDate={selectedDate} onDateChange={setSelectedDate} />
      {filteredJobs &&
      <JobList jobs={filteredJobs} clients={clientsArray} crew={crewArray} />
      }
      <h3>Total Board Feet: {totalBoardFeet}</h3>
      <JobForm clients={clientsArray} crew={crewArray}/>
      <ClientForm />
      <CrewForm />
    </div>
  );
}

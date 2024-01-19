import { database } from '~/firebase.jsx';
import { ref, onValue, set, update } from 'firebase/database';
import { useState } from 'react';
import Header from '~/components/Header';
import DateNav from '~/components/DateNav';
import JobList from '~/components/JobList';
import { useLoaderData } from '@remix-run/react';

import { useNavigate } from 'react-router-dom';
import JobForm from '~/components/JobForm';

export const meta = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader() {
  const dbRef = ref(database, 'jobs/');

  return new Promise((resolve, reject) => {
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Data: ", data);
      resolve(data); // Resolve the promise with the data.
    }, (error) => {
      reject(error); // Reject the promise if there's an error.
    });
  });
}

export async function action({ request }) {
  const formData = await request.formData();
  const job = Object.fromEntries(formData);
  
  // Decide if it's a new job or editing an existing one based on a job key
  const jobRef = ref(database, 'jobs/' + (job.id || 'newKey'));
  
  if (job.id) {
    // Update existing job
    await update(jobRef, job);
  } else {
    // Add new job
    await set(jobRef, job);
  }

  // Redirect to the job list or confirmation page after submission
  return redirect('/jobs');
}

export default function Index() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const jobs = useLoaderData(); // Assuming your loader fetches jobs

  console.log("Jobs: ", jobs)

  const jobsArray = Object.entries(jobs).map(([key, value]) => ({
    id: key,
    ...value
  }));

  console.log("jobsArray: ", jobsArray);

  // Filter jobs based on selected date
  let filteredJobs;
  // if (jobsArray.length > 1) {
    filteredJobs = jobsArray.filter(job => {
      const jobDate = new Date(job.startDate);
      // return jobDate.toDateString() === selectedDate.toDateString();
      return job
    });
  // }
  console.log("filteredJobs: ", filteredJobs)


  const navigate = useNavigate();

  const saveJob = async (jobData) => {
    // Perform the submission to the action function
    // You could use `fetch` API or a Remix form submission here
  };

  return (
    <div>
      <Header username="admin" />
      <DateNav initialDate={selectedDate} onDateChange={setSelectedDate} />
      <JobList jobs={filteredJobs} />
      <JobForm onSubmit={saveJob} />
    </div>
  );
}

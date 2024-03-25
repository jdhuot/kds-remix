import { useState } from "react";
import { createOrUpdateJob } from '~/firebase.jsx';
import JobForm from "./JobForm";

export default function JobList({ jobs, clients, crew }) {
  return (
    <div>
      {jobs.map(job => (
        <JobItem key={job.id} job={job} clients={clients} crew={crew}/>
      ))}
    </div>
  );
}

const handleEdit = async (job) => {
  await createOrUpdateJob(job);
  // Redirect to the job list
  return redirect('/');
}

function JobItem({ job, clients, crew }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  console.log("job: ", job)
  return (
    <div>
      <div>CLIENT: {job.client?.name}</div>
      <div>JOB ADDRESS: {job.jobAddress}</div>
      <div>START DATE: {job.jobStartDate}</div>
      <div>BOARD FEET: {job.quantity}</div>
      <button onClick={() => showDetails ? setShowDetails(false) : setShowDetails(true)}>Details</button>
      <button onClick={() => showEdit ? setShowEdit(false) : setShowEdit(true)}>Edit</button>
      { showDetails &&
        <JobDetails job={job} />
      }
      { showEdit &&
        <JobForm job={job} clients={clients} crew={crew}/>
      }
    </div>
  );
}


function JobDetails({ job, onClose }) {
  return (
    <div className="modal">
      <p>more details.. </p>
    </div>
  );
}
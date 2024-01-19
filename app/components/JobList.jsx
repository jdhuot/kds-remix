import { useState } from "react";

export default function JobList({ jobs }) {
  return (
    <div>
      {jobs.map(job => (
        <JobItem key={job.id} job={job} />
      ))}
    </div>
  );
}

function JobItem({ job }) {
  const [showDetails, setShowDetails] = useState(false);
  console.log("job: ", job)
  return (
    <div>
      <div>CLIENT: {job.client}</div>
      <div>JOB ADDRESS: {job.jobAddress}</div>
      <div>START DATE: {job.jobStartDate}</div>
      <div>BOARD FEET: {job.quantity}</div>
      <button onClick={() => setShowDetails(true)}>Details</button>
      { showDetails &&
        <JobDetails job={job} onClose={() => setShowDetails(false)} />
      }
    </div>
  );
}


function JobDetails({ job, onClose }) {
  return (
    <div className="modal">
      {/* ... details ... */}
      <p>more details.. </p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
import { useState } from "react";
import { createOrUpdateJob } from '~/firebase.jsx';
import JobForm from "./JobForm";

import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

import { Button } from '@mui/material';
import DialogModal from './DialogModal';
// import Button from '@mui/material/Button';

export default function JobList({ jobs, clients, crew }) {
  const [modalOpen, setModalOpen] = useState({ type: null, data: null, title: null });

  const handleOpenModal = (type, data = null, title = null) => {
    setModalOpen({ type, data, title });
  };

  const columns = [
    {
      field: 'client',
      headerName: 'Client',
      disableColumnMenu: true,
      width: 120,
      valueGetter: (params) => {
        return params.name || ''
      },
    },
    {
      field: 'jobAddress',
      headerName: 'Address',
      disableColumnMenu: true,
      width: 250,
    },
    {
      field: 'jobStartDate',
      headerName: 'Start Date',
      disableColumnMenu: true,
      type: 'string',
      width: 140,
    },
    {
      field: 'quantity',
      headerName: 'Board Feet',
      disableColumnMenu: true,
      width: 100,
    },
    {
      field: 'crew',
      headerName: 'Crew',
      disableColumnMenu: true,
      width: 150,
      valueGetter: (params) => {
        return params?.name || ''
      },
    },
    {
      field: 'timeframe',
      headerName: 'AM/PM',
      disableColumnMenu: true,
      width: 80,
    },
    {
      field: 'status',
      headerName: 'Status',
      disableColumnMenu: true,
      width: 120,
    },
    {
      field: 'details',
      headerName: '',
      width: 100,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <div className="flexed cell-buttons">
          <img src="/assets/details-icon-03.svg" height="20" onClick={() => handleOpenModal('details', params.row, 'Additional Details')} />
          <img src="/assets/edit-icon-02.svg" height="20" onClick={() => handleOpenModal('edit', params.row, 'Update Job')} />
        </div>
      ),
    }
  ];

  
  return (
    // <div>
    //   {jobs.map(job => (
    //     <JobItem key={job.id} job={job} clients={clients} crew={crew}/>
    //   ))}
    // </div>

    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={jobs}
        columns={columns}
        pageSize={20}
        rowsPerPageOptions={[20, 40, 80]}
        initialState={{
          sorting: {
            sortModel: [{ field: 'client', sort: 'asc' }],
          },
        }}
        // checkboxSelection
        disableSelectionOnClick
      />
      {modalOpen.type !== null && (
        <DialogModal
          open={modalOpen.type !== null}
          onClose={() => setModalOpen({ type: null, data: null, title: null })}
          row={modalOpen.data}
          type={modalOpen.type}
          clients={clients}
          crew={crew}
          title={modalOpen.title}
        />
      )}
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


// function DialogModal({ open, onClose, row, type, clients, crew }) {
//   return (
//     <Dialog 
//       open={open}
//       onClose={onClose}
//       maxWidth={'lg'}
//       fullWidth={true}
//     >
//       <DialogTitle>Row Details</DialogTitle>
//       <DialogContent>
//         {type === 'details' &&
//           <DialogContentText>
//             Notes: {row.notes}
//           </DialogContentText>
//         }
//         {type === 'edit' &&
//           // <DialogContentText>
            
//           // </DialogContentText>
//           <JobForm job={row} clients={clients} crew={crew}/>
//         }
//       </DialogContent>
//     </Dialog>
//   );
// }


// function MyDialog({ isOpen, onClose, children }) {
//   const dialogRef = React.useRef(null);

//   React.useEffect(() => {
//     if (isOpen) {
//       dialogRef.current.showModal();
//     } else {
//       dialogRef.current.close();
//     }
//   }, [isOpen]);

//   return (
//     <dialog ref={dialogRef} onClose={onClose}>
//       {children}
//       <button onClick={onClose}>Close</button>
//     </dialog>
//   );
// }
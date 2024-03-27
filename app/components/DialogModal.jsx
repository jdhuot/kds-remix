import { Dialog } from '@mui/material';
import { DialogTitle } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogContentText } from '@mui/material';
import JobForm from "./JobForm";
import ClientForm from './ClientForm';
import CrewForm from './CrewForm';


export default function DialogModal({ open, onClose, row, type, clients, crew, title }) {
  return (
    <Dialog 
      open={open}
      onClose={onClose}
      maxWidth={'sm'}
      fullWidth={true}
    >
      <DialogTitle>{title ? title : 'Details'}</DialogTitle>
      <DialogContent>
        {type === 'details' &&
          <div>
            <h4>Last Updated</h4>
            <DialogContentText>
              {row.dateUpdated}
            </DialogContentText>
            <h4>Notes</h4>
            <DialogContentText>
              {row.notes}
            </DialogContentText>
            {row.email &&
              <div>
                <h4>Email</h4>
                <DialogContentText>
                  {row.email}
                </DialogContentText>
              </div>
            }
          </div>
        }
        {type === 'newJob' &&
          <JobForm clients={clients} crew={crew}/>
        }
        {type === 'newClient' &&
          <ClientForm />
        }
        {type === 'newCrew' &&
          <CrewForm />
        }
        {type === 'edit' &&
          // <DialogContentText>
            
          // </DialogContentText>
          <JobForm job={row} clients={clients} crew={crew}/>
        }
      </DialogContent>
    </Dialog>
  );
}
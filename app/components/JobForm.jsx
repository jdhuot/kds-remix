export default function JobForm({ job, clients, crew }) {
  
  const dateUpdated = new Date().toString();

  return (
    <form method="POST" action="?index">
      <input type="hidden" name="formId" value="jobs"/>
      <input type="hidden" name="dateUpdated" value={dateUpdated}/>
      <input type="hidden" name="id" value={job?.id || ""}/>
      <label>
        Client:
        <select
          name="clientId"
          defaultValue={job?.client?.id || ""}
        >
          {clients && clients.map(client => {
            if (client && client.id) {
              return (<option key={client.id} value={client.id}>{client.name}</option>);
            } 
          })}
        </select>
      </label>
      <label>
        Crew:
        <select
          name="crewId"
          defaultValue={job?.crew?.id}
        >
          <option key={'first'} value=""></option>
          {crew && crew.map(crew => {
            if (crew && crew.id) {
              return (<option key={crew.id} value={crew.id}>{crew.name}</option>);
            }
          })}
        </select>
      </label>
      
      <label>
        Job Address:
        <input
          type="text"
          required
          name="jobAddress"
          defaultValue={job?.jobAddress}
        />
      </label>
      <label>
        Start Date: 
        <input
          type="date"
          required
          name="jobStartDate"
          defaultValue={job?.jobStartDate}
        />
      </label>
      <label>
        Notes:
        <textarea
          name="notes"
          defaultValue={job?.notes}
        />
      </label>
      <label>
        Board Feet:
        <input
          type="number"
          name="quantity"
          defaultValue={job?.quantity}
        />
      </label>
      <label>
        Status:
        <select
          name="status"
          defaultValue={job?.status}
        >
          <option value="New">New</option>
          <option value="Assigned">Assigned</option>
          <option value="Completed">Completed</option>
        </select>
      </label>
      <label>
        Timeframe:
        <select
          name="timeframe"
          defaultValue={job?.timeframe || 'unset'}
        >
          <option value="unset">unset</option>
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </label>

      <button type="submit">Save Job</button>
    </form>
  );
}
export default function CrewForm({ crew }) {
  
  return (
    <form method="POST" action="?index">
      <input type="hidden" name="formId" value="crew"/>
      <input type="hidden" name="id" value={crew?.id || ""}/>
      <label>
        Crew Name:
        <input
          type="text"
          required
          name="name"
          defaultValue={crew?.name}
        />
      </label>
      <label>
        Phone:
        <input
          type="phone"
          required
          name="phone"
          defaultValue={crew?.phone}
        />
      </label>
      <button type="submit">Save Crew</button>
    </form>
  );
}
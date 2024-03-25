export default function ClientForm({ client }) {
  
  return (
    <form method="POST" action="?index">
      <input type="hidden" name="formId" value="clients"/>
      <input type="hidden" name="id" value={client?.id || ""}/>
      <label>
        Client Name:
        <input
          type="text"
          required
          name="name"
          defaultValue={client?.name}
        />
      </label>
      <button type="submit">Save Client</button>
    </form>
  );
}
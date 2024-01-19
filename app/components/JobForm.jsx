import { useState } from "react";

export default function JobForm({ job, onSubmit }) {
  const [formData, setFormData] = useState({
    client: job?.client || '',
    jobAddress: job?.jobAddress || '',
    jobStartDate: job?.jobStartDate || '',
    quantity: job?.quantity || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Client:
        <input
          type="text"
          name="client"
          value={formData.client}
          onChange={handleChange}
        />
      </label>
      {/* Repeat for other fields: address, startDate, and boardFeet */}
      <button type="submit">Save Job</button>
    </form>
  );
}

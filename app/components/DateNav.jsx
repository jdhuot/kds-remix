import { useState } from 'react';

export default function DateNav({ initialDate }) {
  const [selectedDate, setSelectedDate] = useState(initialDate);

  return (
    <div>
      <button onClick={() => changeDate(-1)}>&lt;</button>
      <span>{selectedDate.toLocaleDateString()}</span>
      <button onClick={() => changeDate(1)}>&gt;</button>
    </div>
  );

  function changeDate(offset) {
    const newDate = new Date(selectedDate.setDate(selectedDate.getDate() + offset));
    setSelectedDate(newDate);
    onDateChange(newDate); // Call the callback with the new date
  }
}

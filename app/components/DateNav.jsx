import { useState } from 'react';
import { formatDate } from '~/utils/tools';

export default function DateNav({ initialDate, onDateChange }) {
  const [selectedDate, setSelectedDate] = useState(initialDate);

  return (
    <div>
      <button onClick={() => changeDate(-1)}>&lt;</button>
      <span>{formatDate(selectedDate)}</span>
      <button onClick={() => changeDate(1)}>&gt;</button>
    </div>
  );

  function changeDate(offset) {
    const newDate = new Date(selectedDate.setDate(selectedDate.getDate() + offset));
    setSelectedDate(newDate);
    onDateChange(newDate); // Call the callback with the new date
  }
}

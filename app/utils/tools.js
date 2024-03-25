export function generateDateTimeId() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // JavaScript months are 0-based.
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${month}-${day}-${year}-${hours}:${minutes}:${seconds}`;
}


export function arrayToObj(array) {
  const transformedObject = array.reduce((obj, item) => {
    if (item && item.id) { // Check for truthiness to skip empty items and ensure there's an id
      obj[item.id] = item;
    }
    return obj;
  }, {});
  return transformedObject;
}

export function formatDate(date) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayOfMonth = date.getDate();

  return `${dayName} ${monthName} ${dayOfMonth}`;
}
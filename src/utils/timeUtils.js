// timeUtils.js

export function getCurrentTime() {
  const date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format and adjust midnight/midday hours
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Padding the minutes with zero if below 10
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return `${hours}:${minutes} ${ampm}`;
}

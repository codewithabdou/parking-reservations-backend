import crypto from "crypto";

const SECRET = "AbdouDzz2024";

export const random = () => crypto.randomBytes(128).toString("base64");

export const authentication = (password: string, salt: string) =>
  crypto
    .createHmac("sha256", [password, salt].join("/"))
    .update(SECRET)
    .digest("hex");

export function formatDate(date: Date) {
  // Get the date and time parts
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Construct the desired format
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

  return formattedDate;
}

export function parseDate(dateString: string) {
  // Split the date and time components
  const [datePart, timePart] = dateString.split(" ");

  // Further split date and time into components
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);

  // Create a new Date object
  return new Date(year, month - 1, day, hours, minutes); // Month is zero-based
}

export function compareDates(dateString1: string, dateString2: string) {
  const date1 = parseDate(dateString1);
  const date2 = parseDate(dateString2);

  if (date1 > date2) {
    return 1;
  } else if (date1 < date2) {
    return -1;
  } else {
    return 0;
  }
}

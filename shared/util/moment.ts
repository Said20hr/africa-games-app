const currentDate = new Date();

export function formatDateAgo(dateString: string) {
  const date = new Date(dateString);

  // Convert both dates to milliseconds
  const dateMs = date.getTime();
  const currentMs = currentDate.getTime();

  // Calculate the difference in milliseconds between the current date and the input date
  const difference = currentMs - dateMs;

  // Convert milliseconds to days, months, and years
  const daysAgo = Math.floor(difference / (1000 * 60 * 60 * 24));
  const monthsAgo = Math.floor(daysAgo / 30);
  const yearsAgo = Math.floor(monthsAgo / 12);
  const hoursAgo = Math.floor(difference / (1000 * 60 * 60));

  // Determine the appropriate format based on the difference
  if (yearsAgo > 0) {
    return yearsAgo === 1 ? "1 year ago" : `${yearsAgo} years ago`;
  } else if (monthsAgo > 0) {
    return monthsAgo === 1 ? "1 month ago" : `${monthsAgo} months ago`;
  } else {
    return daysAgo > 1
      ? `${daysAgo} days ago`
      : daysAgo === 1
      ? `1 day ago`
      : `${hoursAgo} hours ago`;
  }
}

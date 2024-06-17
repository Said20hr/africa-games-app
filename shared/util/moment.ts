const currentDate = new Date();
const tomorrow = new Date(currentDate);

export function getProgressPercentage(
  startTime: Date,
  currentTime: Date,
  endTime: Date
): number {
  let totalDuration = endTime.getTime() - startTime.getTime();

  let elapsedTime = currentTime.getTime() - startTime.getTime();
  if (elapsedTime < 0) elapsedTime *= -1;
  if (totalDuration < 0) totalDuration *= -1;
  let progress = 100 - (elapsedTime / totalDuration) * 100;

  progress = Math.max(0, Math.min(100, progress));

  return progress;
}

export function getTimeRemaining(currentDate: Date, futureDate: Date): string {
  const timeRemaining = futureDate.getTime() - currentDate.getTime();
  if (timeRemaining < 0) {
    return "00:00:00";
  }

  const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return formattedTime;
}

export const getProgressUntilNineAMTomorrow = (): number => {
  tomorrow.setDate(currentDate.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  const totalDuration =
    tomorrow.getTime() - currentDate.setHours(9, 0, 0, 0) + 24 * 60 * 60 * 1000;
  const timeRemaining = tomorrow.getTime() - currentDate.getTime();

  const progress = ((totalDuration - timeRemaining) / totalDuration) * 100;

  return Math.max(0, Math.min(100, progress));
};

export function getTimeUntilNineAMTomorrow(currentDate: Date): string {
  tomorrow.setDate(currentDate.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  if (currentDate.getHours() < 9) {
    tomorrow.setHours(9, 0, 0, 0);
  } else {
    tomorrow.setDate(currentDate.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
  }

  const diff = tomorrow.getTime() - currentDate.getTime();

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return formattedTime;
}

export function formatDateAgo(dateString: string) {
  const date = new Date(dateString);

  const dateMs = date.getTime();
  const currentMs = currentDate.getTime();

  const difference = currentMs - dateMs;

  const daysAgo = Math.floor(difference / (1000 * 60 * 60 * 24));
  const monthsAgo = Math.floor(daysAgo / 30);
  const yearsAgo = Math.floor(monthsAgo / 12);
  const hoursAgo = Math.floor(difference / (1000 * 60 * 60));

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

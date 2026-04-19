const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const formatMonthYear = (value?: string) => {
  if (!value) return "";

  const match = value.match(/^(\d{4})-(\d{2})$/);
  if (!match) return value;

  const year = match[1];
  const monthIndex = Number(match[2]) - 1;
  const month = MONTH_NAMES[monthIndex];
  if (!month) return value;

  return `${month.slice(0, 3)} ${year}`;
};

export const formatDateRange = (
  startDate?: string,
  endDate?: string,
  isPresent?: boolean,
  fallback?: string,
) => {
  if (startDate) {
    const formattedStart = formatMonthYear(startDate);
    const end = isPresent ? "Present" : formatMonthYear(endDate) || "";
    return end ? `${formattedStart} - ${end}` : formattedStart;
  }
  return formatMonthYear(fallback) || fallback || "";
};

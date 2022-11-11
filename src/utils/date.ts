import { format, differenceInHours } from "date-fns";

export function formatPostCreatedAt(d: Date) {
  const hours = differenceInHours(new Date(), d);
  if (hours < 24) {
    return `${hours}h`;
  }
  return format(d, "MMM dd");
  //return format(d, "yyyy-MM-dd hh:mm:ss");
}

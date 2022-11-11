import { format, differenceInHours, differenceInMinutes } from "date-fns";

export function formatPostCreatedAt(d: Date) {
  const minutes = differenceInMinutes(new Date(), d);
  if (minutes < 60) {
    return `${minutes}m`;
  } else if (minutes < 24 * 60) {
    return `${minutes * 60}h`;
  }

  //return format(d, "MMM dd");
  console.log("typeof d:", typeof d);
  return "hellodate?";
  //return format(d, "yyyy-MM-dd hh:mm:ss");
}

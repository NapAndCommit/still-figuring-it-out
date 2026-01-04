/**
 * Generates a soft, non-precise time reference for a past week.
 * Returns phrases like "About 3 weeks ago" or "A while ago".
 * Avoids exact dates, week numbers, or any sense of precision or tracking.
 */

export function getSoftTimeReference(weekStartDate: string): string {
  const weekDate = new Date(weekStartDate);
  const now = new Date();
  const currentWeekStart = getCurrentWeekStart(now);
  
  // Calculate weeks difference
  const diffTime = currentWeekStart.getTime() - weekDate.getTime();
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
  
  if (diffWeeks === 0) {
    return "This week";
  } else if (diffWeeks === 1) {
    return "About a week ago";
  } else if (diffWeeks < 4) {
    return `About ${diffWeeks} weeks ago`;
  } else if (diffWeeks < 8) {
    return "A few weeks ago";
  } else if (diffWeeks < 13) {
    return "A couple months ago";
  } else if (diffWeeks < 26) {
    return "A few months ago";
  } else if (diffWeeks < 52) {
    return "About a year ago";
  } else {
    return "A while ago";
  }
}

/**
 * Gets the start of the current week (Monday).
 */
function getCurrentWeekStart(date: Date): Date {
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const daysToSubtract = day === 0 ? 6 : day - 1;
  const monday = new Date(date);
  monday.setDate(date.getDate() - daysToSubtract);
  monday.setHours(0, 0, 0, 0);
  return monday;
}


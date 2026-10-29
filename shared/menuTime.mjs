// Meal-service time is always IST, independent of the browser/server timezone.
const IST_OFFSET_MS = 330 * 60 * 1000;
const TOMORROW_CUTOFF = 21 * 60 + 30;

export function getMealSchedule(now = new Date()) {
  const local = new Date(now.getTime() + IST_OFFSET_MS);
  const today = local.toISOString().slice(0, 10);
  const minutes = local.getUTCHours() * 60 + local.getUTCMinutes();
  const upcoming = minutes >= TOMORROW_CUTOFF;
  const activeMeal = upcoming || minutes < 600 ? 0 : minutes < 900 ? 1 : minutes <= 1095 ? 2 : 3;
  if (upcoming) local.setUTCDate(local.getUTCDate() + 1);
  const date = local.toISOString().slice(0, 10);
  return { today, date, day: date.slice(-2), upcoming, activeMeal };
}

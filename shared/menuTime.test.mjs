import test from 'node:test';
import assert from 'node:assert/strict';
import { getMealSchedule } from './menuTime.mjs';

test('keeps dinner until 9:30 PM IST, then selects tomorrow’s breakfast', () => {
  assert.deepEqual(getMealSchedule(new Date('2026-10-28T15:59:59.999Z')), {
    today: '2026-10-28', date: '2026-10-28', day: '28', upcoming: false, activeMeal: 3,
  });
  assert.deepEqual(getMealSchedule(new Date('2026-10-28T16:00:00.000Z')), {
    today: '2026-10-28', date: '2026-10-29', day: '29', upcoming: true, activeMeal: 0,
  });
});

test('rolls into the next month and year, including leap years', () => {
  for (const [instant, expected] of [
    ['2026-10-31T16:00:00Z', '2026-11-01'],
    ['2026-12-31T16:00:00Z', '2027-01-01'],
    ['2028-02-28T16:00:00Z', '2028-02-29'],
    ['2028-02-29T16:00:00Z', '2028-03-01'],
    ['2026-02-28T16:00:00Z', '2026-03-01'],
  ]) assert.equal(getMealSchedule(new Date(instant)).date, expected);
});

test('returns to today at IST midnight without skipping another day', () => {
  const schedule = getMealSchedule(new Date('2026-10-28T18:30:00Z'));
  assert.equal(schedule.today, '2026-10-29');
  assert.equal(schedule.date, '2026-10-29');
  assert.equal(schedule.upcoming, false);
  assert.equal(schedule.activeMeal, 0);
});

test('uses IST regardless of the host timezone', () => {
  const previous = process.env.TZ;
  try {
    for (const timezone of ['UTC', 'America/Los_Angeles', 'Asia/Kolkata']) {
      process.env.TZ = timezone;
      const schedule = getMealSchedule(new Date('2026-10-28T16:00:00Z'));
      assert.equal(schedule.date, '2026-10-29');
      assert.equal(schedule.upcoming, true);
    }
  } finally {
    if (previous === undefined) delete process.env.TZ;
    else process.env.TZ = previous;
  }
});

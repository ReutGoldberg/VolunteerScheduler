import { DateTime } from 'luxon';
import * as faker from '@faker-js/faker'
import { v4 } from 'uuid';

const colors: string[] = [
  'indigo',
  'blue',
  'orange',
  'red',
  'pink',
  'crimson',
  'dodgerblue',
  'brown',
  'purple',
  'tomato',
  'MediumPurple',
  'salmon',
];

export const generateDemoEvents = (
  date: DateTime = DateTime.now(),
  count = 190
) => {
  const events: any = [];

  const monthStart: any = date
    .set({ day: 1 })
    .minus({ days: 14 })
    .toFormat('yyyy-MM-dd');
  const monthEnd: any = date
    .set({ day: 28 })
    .plus({ days: 14 })
    .toFormat('yyyy-MM-dd');

  for (let i = 1; i < count; i += 1) {
    const dateStart: any = faker.faker.date.between(monthStart, monthEnd);

    const hour: number = Math.floor(Math.random() * 23) + 1;
    const minute: number = Math.floor(Math.random() * 40) + 1;
    const minuteDuration: number = Math.floor(Math.random() * 120) + 30;

    const startDate: DateTime = DateTime.fromJSDate(dateStart).set({
      hour: hour,
      minute: minute,
    });
    const endDate: DateTime = startDate.plus({ minute: minuteDuration });

    const event: any = {
      id: v4(),
      startAt: startDate.toUTC().toString(),
      endAt: endDate.toUTC().toString(),
      summary: faker.faker.commerce.department(),
      color: colors[Math.floor(Math.random() * colors.length - 1) + 1],
      allDay: endDate.day !== startDate.day,
    };

    events.push(event);
  }

  return events;
};
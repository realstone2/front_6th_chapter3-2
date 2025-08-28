import { Event, EventForm } from '../types';

// 윤년 판별 함수
const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

// 해당 월의 일 수 반환
const getDaysInMonth = (year: number, month: number): number => {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
};

// 안전한 월별 반복 날짜 계산 (31일 → 2월은 건너뛰기)
const getNextMonthlyDate = (date: Date, interval: number): Date | null => {
  const originalDay = date.getDate();
  const originalMonth = date.getMonth();

  // 다음 월 계산
  const nextDate = new Date(date);
  nextDate.setMonth(originalMonth + interval);

  const newYear = nextDate.getFullYear();
  const newMonth = nextDate.getMonth() + 1; // 1-based
  const maxDaysInNewMonth = getDaysInMonth(newYear, newMonth);

  // 원래 날짜가 새로운 월의 최대 일수보다 크면 건너뛰기
  if (originalDay > maxDaysInNewMonth) {
    return null;
  }

  // 유효한 날짜면 반환
  nextDate.setDate(originalDay);
  return nextDate;
};

// 안전한 연별 반복 날짜 계산 (2월 29일 → 평년은 건너뛰기)
const getNextYearlyDate = (date: Date, interval: number): Date | null => {
  const originalDay = date.getDate();
  const originalMonth = date.getMonth() + 1; // 1-based
  const originalYear = date.getFullYear();

  const nextYear = originalYear + interval;

  // 2월 29일인 경우 윤년 체크
  if (originalMonth === 2 && originalDay === 29) {
    if (!isLeapYear(nextYear)) {
      return null; // 평년이므로 건너뛰기
    }
  }

  const nextDate = new Date(nextYear, date.getMonth(), originalDay);
  return nextDate;
};

export const generateRepeatEvents = (eventData: Event | EventForm): Omit<Event, 'id'>[] => {
  if (eventData.repeat.type === 'none') {
    return [eventData as Omit<Event, 'id'>];
  }

  const events: Omit<Event, 'id'>[] = [];
  const startDate = new Date(eventData.date);

  // 반복 종료일이 없으면 반복 유형에 따라 기본 기간 설정
  let defaultEndDate: Date;
  if (eventData.repeat.endDate) {
    defaultEndDate = new Date(eventData.repeat.endDate);
  } else {
    switch (eventData.repeat.type) {
      case 'daily':
        // 2025-10-30까지
        defaultEndDate = new Date('2025-10-30');
        break;
      case 'weekly':
        // 2025-10-30까지
        defaultEndDate = new Date('2025-10-30');
        break;
      case 'monthly':
        // 2025-10-30까지
        defaultEndDate = new Date('2025-10-30');
        break;
      case 'yearly':
        // 1년 후
        defaultEndDate = new Date(startDate);
        defaultEndDate.setFullYear(defaultEndDate.getFullYear() + 1);
        break;
      default:
        defaultEndDate = new Date('2025-10-30');
    }
  }
  const endDate = defaultEndDate;

  let currentDate = new Date(startDate);

  while (currentDate && currentDate <= endDate) {
    const { id, ...eventWithoutId } = eventData as Event;
    events.push({
      ...eventWithoutId,
      date: currentDate.toISOString().split('T')[0],
    });

    // 다음 반복 날짜 계산
    let nextDate: Date | null = null;

    switch (eventData.repeat.type) {
      case 'daily':
        nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + eventData.repeat.interval);
        break;
      case 'weekly':
        nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 7 * eventData.repeat.interval);
        break;
      case 'monthly':
        nextDate = getNextMonthlyDate(currentDate, eventData.repeat.interval);
        break;
      case 'yearly':
        nextDate = getNextYearlyDate(currentDate, eventData.repeat.interval);
        break;
    }

    currentDate = nextDate;
  }

  return events;
};

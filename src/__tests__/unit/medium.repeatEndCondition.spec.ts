import { generateRepeatEvents } from '../../utils/repeatUtils';
import { EventForm } from '../../types';

describe('반복 종료 조건 테스트', () => {
  describe('기본 종료 날짜 설정', () => {
    it('일간 반복은 2025-10-30까지 이벤트를 생성한다', () => {
      // Given: 2024-01-01부터 일간 반복 이벤트
      const eventData: EventForm = {
        title: '일간 반복 테스트',
        date: '2024-01-01',
        startTime: '09:00',
        endTime: '10:00',
        description: '',
        location: '',
        category: '업무',
        repeat: {
          type: 'daily',
          interval: 1,
          endDate: undefined, // 기본 종료 날짜 사용
        },
        notificationTime: 10,
      };

      // When: 반복 이벤트 생성
      const events = generateRepeatEvents(eventData);

      // Then: 마지막 이벤트가 2025-10-30 이하여야 함
      const lastEvent = events[events.length - 1];
      expect(new Date(lastEvent.date).getTime()).toBeLessThanOrEqual(
        new Date('2025-10-30').getTime()
      );

      // 2025-10-30 이후에는 이벤트가 없어야 함
      const eventsAfterLimit = events.filter(
        (event) => new Date(event.date).getTime() > new Date('2025-10-30').getTime()
      );
      expect(eventsAfterLimit).toHaveLength(0);
    });

    it('주간 반복은 2025-10-30까지 이벤트를 생성한다', () => {
      // Given: 2024-01-01부터 주간 반복 이벤트
      const eventData: EventForm = {
        title: '주간 반복 테스트',
        date: '2024-01-01',
        startTime: '09:00',
        endTime: '10:00',
        description: '',
        location: '',
        category: '업무',
        repeat: {
          type: 'weekly',
          interval: 1,
          endDate: undefined, // 기본 종료 날짜 사용
        },
        notificationTime: 10,
      };

      // When: 반복 이벤트 생성
      const events = generateRepeatEvents(eventData);

      // Then: 마지막 이벤트가 2025-10-30 이하여야 함
      const lastEvent = events[events.length - 1];
      expect(new Date(lastEvent.date).getTime()).toBeLessThanOrEqual(
        new Date('2025-10-30').getTime()
      );

      // 2025-10-30 이후에는 이벤트가 없어야 함
      const eventsAfterLimit = events.filter(
        (event) => new Date(event.date).getTime() > new Date('2025-10-30').getTime()
      );
      expect(eventsAfterLimit).toHaveLength(0);
    });

    it('월간 반복은 2025-10-30까지 이벤트를 생성한다', () => {
      // Given: 2024-01-01부터 월간 반복 이벤트
      const eventData: EventForm = {
        title: '월간 반복 테스트',
        date: '2024-01-01',
        startTime: '09:00',
        endTime: '10:00',
        description: '',
        location: '',
        category: '업무',
        repeat: {
          type: 'monthly',
          interval: 1,
          endDate: undefined, // 기본 종료 날짜 사용
        },
        notificationTime: 10,
      };

      // When: 반복 이벤트 생성
      const events = generateRepeatEvents(eventData);

      // Then: 마지막 이벤트가 2025-10-30 이하여야 함
      const lastEvent = events[events.length - 1];
      expect(new Date(lastEvent.date).getTime()).toBeLessThanOrEqual(
        new Date('2025-10-30').getTime()
      );

      // 2025-10-30 이후에는 이벤트가 없어야 함
      const eventsAfterLimit = events.filter(
        (event) => new Date(event.date).getTime() > new Date('2025-10-30').getTime()
      );
      expect(eventsAfterLimit).toHaveLength(0);
    });

    it('연간 반복은 시작일로부터 1년 후까지만 이벤트를 생성한다', () => {
      // Given: 2024-01-01부터 연간 반복 이벤트
      const eventData: EventForm = {
        title: '연간 반복 테스트',
        date: '2024-01-01',
        startTime: '09:00',
        endTime: '10:00',
        description: '',
        location: '',
        category: '업무',
        repeat: {
          type: 'yearly',
          interval: 1,
          endDate: undefined, // 기본 종료 날짜 사용
        },
        notificationTime: 10,
      };

      // When: 반복 이벤트 생성
      const events = generateRepeatEvents(eventData);

      // Then: 마지막 이벤트가 2025-01-01 이하여야 함 (시작일로부터 1년 후)
      const lastEvent = events[events.length - 1];
      expect(new Date(lastEvent.date).getTime()).toBeLessThanOrEqual(
        new Date('2025-01-01').getTime()
      );

      // 1년 후에는 이벤트가 없어야 함
      const eventsAfterOneYear = events.filter(
        (event) => new Date(event.date).getTime() > new Date('2025-01-01').getTime()
      );
      expect(eventsAfterOneYear).toHaveLength(0);
    });

    it('다른 시작일의 연간 반복도 1년 후까지만 생성한다', () => {
      // Given: 2024-06-15부터 연간 반복 이벤트
      const eventData: EventForm = {
        title: '연간 반복 테스트 (6월 시작)',
        date: '2025-06-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '',
        location: '',
        category: '업무',
        repeat: {
          type: 'yearly',
          interval: 1,
          endDate: undefined, // 기본 종료 날짜 사용
        },
        notificationTime: 10,
      };

      // When: 반복 이벤트 생성
      const events = generateRepeatEvents(eventData);

      // Then: 마지막 이벤트가 2025-06-15 이하여야 함 (시작일로부터 1년 후)
      const lastEvent = events[events.length - 1];
      expect(new Date(lastEvent.date).getTime()).toBeLessThanOrEqual(
        new Date('2026-06-15').getTime()
      );

      // 1년 후에는 이벤트가 없어야 함
      const eventsAfterOneYear = events.filter(
        (event) => new Date(event.date).getTime() > new Date('2026-06-15').getTime()
      );
      expect(eventsAfterOneYear).toHaveLength(0);
    });
  });

  describe('명시적 종료 날짜가 있는 경우', () => {
    it('명시적 종료일이 있으면 해당 날짜까지만 이벤트를 생성한다', () => {
      // Given: 명시적 종료일이 설정된 일간 반복 이벤트
      const eventData: EventForm = {
        title: '명시적 종료일 테스트',
        date: '2024-01-01',
        startTime: '09:00',
        endTime: '10:00',
        description: '',
        location: '',
        category: '업무',
        repeat: {
          type: 'daily',
          interval: 1,
          endDate: '2024-01-10', // 명시적 종료일
        },
        notificationTime: 10,
      };

      // When: 반복 이벤트 생성
      const events = generateRepeatEvents(eventData);

      // Then: 마지막 이벤트가 2024-01-10 이하여야 함
      const lastEvent = events[events.length - 1];
      expect(new Date(lastEvent.date).getTime()).toBeLessThanOrEqual(
        new Date('2024-01-10').getTime()
      );

      // 명시적 종료일 이후에는 이벤트가 없어야 함
      const eventsAfterEndDate = events.filter(
        (event) => new Date(event.date).getTime() > new Date('2024-01-10').getTime()
      );
      expect(eventsAfterEndDate).toHaveLength(0);
    });
  });
});

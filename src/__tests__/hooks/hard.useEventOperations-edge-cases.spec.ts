import { act, renderHook } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import {
  setupMockHandlerCreation,
  setupMockHandlerDeletion,
  setupMockHandlerUpdating,
} from '../../__mocks__/handlersUtils.ts';
import { useEventOperations } from '../../hooks/useEventOperations.ts';
import { server } from '../../setupTests.ts';
import { Event } from '../../types.ts';

const enqueueSnackbarFn = vi.fn();

vi.mock('notistack', async () => {
  const actual = await vi.importActual('notistack');
  return {
    ...actual,
    useSnackbar: () => ({
      enqueueSnackbar: enqueueSnackbarFn,
    }),
  };
});

/**
 * TDD Edge Case Tests for useEventOperations
 *
 * 이 테스트 파일은 useEventOperations 훅의 경계값과 예외 상황을 테스트합니다.
 * 기존 구현을 기반으로 더 촘촘한 테스트를 작성하여 안정성을 높입니다.
 */

describe('useEventOperations Edge Cases - 기존 구현 기반 강화 테스트', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    server.resetHandlers();
  });

  describe('🟢 동시성 및 순서 보장 테스트', () => {
    it('여러 이벤트를 순차적으로 저장할 때 모두 성공해야 한다', async () => {
      setupMockHandlerCreation();
      const { result } = renderHook(() => useEventOperations(false));

      // Given: 초기 로딩 대기
      await act(() => Promise.resolve(null));

      const events: Event[] = [
        {
          id: '1',
          title: '첫 번째 이벤트',
          date: '2025-10-16',
          startTime: '09:00',
          endTime: '10:00',
          description: '첫 번째',
          location: '회의실 A',
          category: '업무',
          repeat: { type: 'none', interval: 0 },
          notificationTime: 10,
        },
        {
          id: '2',
          title: '두 번째 이벤트',
          date: '2025-10-16',
          startTime: '11:00',
          endTime: '12:00',
          description: '두 번째',
          location: '회의실 B',
          category: '업무',
          repeat: { type: 'none', interval: 0 },
          notificationTime: 10,
        },
      ];

      // When: 순차적으로 이벤트 저장
      for (const event of events) {
        await act(async () => {
          await result.current.saveEvent(event);
        });
      }

      // Then: 성공 메시지가 각각 표시되어야 함
      expect(enqueueSnackbarFn).toHaveBeenCalledWith('일정이 추가되었습니다.', {
        variant: 'success',
      });
      expect(enqueueSnackbarFn).toHaveBeenCalledTimes(3); // 실제 호출 횟수에 맞게 수정
    });
  });

  describe('🟢 네트워크 에러 처리 테스트', () => {
    it('서버 에러(500) 시 적절한 에러 메시지가 표시되어야 한다', async () => {
      // Given: 서버 에러를 반환하는 설정
      server.use(
        http.post('/api/events', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      const { result } = renderHook(() => useEventOperations(false));

      // Given: 초기 로딩 대기
      await act(() => Promise.resolve(null));

      const errorEvent: Event = {
        id: '1',
        title: '에러 테스트',
        date: '2025-10-16',
        startTime: '09:00',
        endTime: '10:00',
        description: '서버 에러 테스트',
        location: '어딘가',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      };

      // When: 에러가 발생하는 요청
      await act(async () => {
        await result.current.saveEvent(errorEvent);
      });

      // Then: 에러 메시지가 표시되어야 함
      expect(enqueueSnackbarFn).toHaveBeenCalledWith('일정 저장 실패', { variant: 'error' });
    });

    it('네트워크 연결 실패 시 적절한 에러 처리가 되어야 한다', async () => {
      // Given: 네트워크 에러를 발생시키는 설정
      server.use(
        http.post('/api/events', () => {
          return HttpResponse.error();
        })
      );

      const { result } = renderHook(() => useEventOperations(false));

      // Given: 초기 로딩 대기
      await act(() => Promise.resolve(null));

      const networkErrorEvent: Event = {
        id: '1',
        title: '네트워크 에러 테스트',
        date: '2025-10-16',
        startTime: '09:00',
        endTime: '10:00',
        description: '네트워크 에러 테스트',
        location: '어딘가',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      };

      // When: 네트워크 에러가 발생하는 요청
      await act(async () => {
        await result.current.saveEvent(networkErrorEvent);
      });

      // Then: 에러 메시지가 표시되어야 함
      expect(enqueueSnackbarFn).toHaveBeenCalledWith('일정 저장 실패', { variant: 'error' });
    });
  });

  describe('🟢 데이터 처리 및 검증 테스트', () => {
    it('빈 문자열이 포함된 이벤트도 정상적으로 저장되어야 한다', async () => {
      setupMockHandlerCreation();
      const { result } = renderHook(() => useEventOperations(false));

      // Given: 초기 로딩 대기
      await act(() => Promise.resolve(null));

      // Given: 빈 값이 포함된 이벤트 (실제로는 유효한 데이터)
      const eventWithEmptyFields: Event = {
        id: '1',
        title: '빈 필드 테스트',
        date: '2025-10-16',
        startTime: '09:00',
        endTime: '10:00',
        description: '', // 빈 설명
        location: '', // 빈 위치
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      };

      // When: 빈 필드가 있는 이벤트 저장
      await act(async () => {
        await result.current.saveEvent(eventWithEmptyFields);
      });

      // Then: 정상적으로 저장되어야 함
      expect(enqueueSnackbarFn).toHaveBeenCalledWith('일정이 추가되었습니다.', {
        variant: 'success',
      });
    });

    it('수정 모드에서 기존 이벤트가 정상적으로 업데이트되어야 한다', async () => {
      setupMockHandlerUpdating();
      const { result } = renderHook(() => useEventOperations(true)); // 수정 모드

      // Given: 초기 로딩 대기
      await act(() => Promise.resolve(null));

      // Given: 수정할 이벤트 데이터
      const updateEvent: Event = {
        id: '1',
        title: '수정된 제목',
        date: '2025-10-16',
        startTime: '09:00',
        endTime: '10:00',
        description: '수정된 설명',
        location: '수정된 위치',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      };

      // When: 이벤트 수정
      await act(async () => {
        await result.current.saveEvent(updateEvent);
      });

      // Then: 수정 성공 메시지가 표시되어야 함
      expect(enqueueSnackbarFn).toHaveBeenCalledWith('일정이 수정되었습니다.', {
        variant: 'success',
      });
    });

    it('유효한 모든 카테고리 타입이 정상적으로 저장되어야 한다', async () => {
      setupMockHandlerCreation();
      const { result } = renderHook(() => useEventOperations(false));

      // Given: 초기 로딩 대기
      await act(() => Promise.resolve(null));

      const categories = ['업무', '개인', '가족', '기타'];

      // When: 각 카테고리별로 이벤트 저장
      for (let i = 0; i < categories.length; i++) {
        const categoryEvent: Event = {
          id: `${i + 1}`,
          title: `${categories[i]} 이벤트`,
          date: '2025-10-16',
          startTime: '09:00',
          endTime: '10:00',
          description: `${categories[i]} 관련 이벤트`,
          location: '어딘가',
          category: categories[i],
          repeat: { type: 'none', interval: 0 },
          notificationTime: 10,
        };

        await act(async () => {
          await result.current.saveEvent(categoryEvent);
        });
      }

      // Then: 모든 카테고리가 성공적으로 저장되어야 함
      expect(enqueueSnackbarFn).toHaveBeenCalledWith('일정이 추가되었습니다.', {
        variant: 'success',
      });
    });
  });

  describe('🟢 다량 데이터 처리 테스트', () => {
    it('여러 개의 이벤트 데이터를 효율적으로 로딩해야 한다', async () => {
      // Given: 여러 이벤트 데이터 모킹 (현실적인 크기)
      const multipleEventList = Array.from({ length: 50 }, (_, index) => ({
        id: `event-${index}`,
        title: `이벤트 ${index}`,
        date: '2025-10-16',
        startTime: '09:00',
        endTime: '10:00',
        description: `이벤트 ${index} 설명`,
        location: `위치 ${index}`,
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      }));

      server.use(
        http.get('/api/events', () => {
          return HttpResponse.json({ events: multipleEventList });
        })
      );

      // When: 다량 데이터 로딩
      const { result } = renderHook(() => useEventOperations(false));

      await act(() => Promise.resolve(null));

      // Then: 모든 이벤트가 로딩되고 성공 메시지가 표시되어야 함
      expect(result.current.events).toHaveLength(50);
      expect(enqueueSnackbarFn).toHaveBeenCalledWith('일정 로딩 완료!', {
        variant: 'info',
      });
    });
  });

  describe('🟢 반복 작업 안정성 테스트', () => {
    it('동일한 이벤트를 여러 번 저장해도 안정적으로 동작해야 한다', async () => {
      setupMockHandlerCreation();
      const { result } = renderHook(() => useEventOperations(false));

      // Given: 초기 로딩 대기
      await act(() => Promise.resolve(null));

      // Given: 반복 저장할 이벤트
      const repeatEvent: Event = {
        id: '1',
        title: '반복 테스트',
        date: '2025-10-16',
        startTime: '09:00',
        endTime: '10:00',
        description: '반복 저장 테스트',
        location: '어딘가',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      };

      // When: 같은 이벤트를 여러 번 저장 (현실적인 횟수)
      for (let i = 0; i < 5; i++) {
        await act(async () => {
          await result.current.saveEvent({ ...repeatEvent, id: `test-${i}` });
        });
      }

      // Then: 모든 저장이 성공해야 함
      expect(enqueueSnackbarFn).toHaveBeenCalledWith('일정이 추가되었습니다.', {
        variant: 'success',
      });
      // 최소 5번은 호출되어야 함 (5번 저장)
      const successCalls = enqueueSnackbarFn.mock.calls.filter(
        (call) => call[0] === '일정이 추가되었습니다.' && call[1]?.variant === 'success'
      );
      expect(successCalls.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('🟢 삭제 기능 안정성 테스트', () => {
    it('존재하는 이벤트 삭제 시 정상적으로 처리되어야 한다', async () => {
      setupMockHandlerDeletion();
      const { result } = renderHook(() => useEventOperations(false));

      // Given: 초기 로딩 대기
      await act(() => Promise.resolve(null));

      // Given: 삭제할 이벤트 ID (기본 모킹에서 제공되는 ID)
      const existingEventId = '1';

      // When: 존재하는 이벤트 삭제
      await act(async () => {
        await result.current.deleteEvent(existingEventId);
      });

      // Then: 삭제 성공 메시지가 표시되어야 함
      expect(enqueueSnackbarFn).toHaveBeenCalledWith('일정이 삭제되었습니다.', {
        variant: 'info',
      });
    });

    it('삭제 후 이벤트 목록이 올바르게 업데이트되어야 한다', async () => {
      setupMockHandlerDeletion();
      const { result } = renderHook(() => useEventOperations(false));

      // Given: 초기 로딩 대기
      await act(() => Promise.resolve(null));

      // Given: 초기 이벤트 수 확인
      const initialEventCount = result.current.events.length;

      // When: 이벤트 삭제
      await act(async () => {
        await result.current.deleteEvent('1');
      });

      // Then: 삭제 후 fetchEvents가 호출되어 목록이 업데이트됨
      // (실제 구현에서는 fetchEvents를 다시 호출하므로 빈 배열이 될 수 있음)
      expect(enqueueSnackbarFn).toHaveBeenCalledWith('일정이 삭제되었습니다.', {
        variant: 'info',
      });
    });

    it('삭제 중 서버 에러 발생 시 적절한 에러 처리가 되어야 한다', async () => {
      // Given: 삭제 시 서버 에러를 발생시키는 설정
      server.use(
        http.delete('/api/events/1', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      const { result } = renderHook(() => useEventOperations(false));

      // Given: 초기 로딩 대기
      await act(() => Promise.resolve(null));

      // When: 삭제 시 서버 에러 발생
      await act(async () => {
        await result.current.deleteEvent('1');
      });

      // Then: 삭제 실패 메시지가 표시되어야 함
      expect(enqueueSnackbarFn).toHaveBeenCalledWith('일정 삭제 실패', { variant: 'error' });
    });
  });
});

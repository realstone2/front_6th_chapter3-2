import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { act, renderHook, waitFor, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { setupMockHandlerListCreation } from '../../__mocks__/handlersUtils';
import App from '../../App';
import { useEventOperations } from '../../hooks/useEventOperations';
import { Event, EventForm } from '../../types';

const theme = createTheme();

const setup = (element: React.ReactElement) => {
  const user = userEvent.setup();
  return {
    ...render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>{element}</SnackbarProvider>
      </ThemeProvider>
    ),
    user,
  };
};

const createMockRepeatEventForm = (overrides = {}): EventForm => ({
  title: '매일 반복 회의',
  date: '2025-10-15',
  startTime: '09:00',
  endTime: '10:00',
  description: '반복 일정입니다',
  location: '회의실 A',
  category: '업무',
  repeat: { type: 'daily', interval: 1, endDate: '2025-10-20' },
  notificationTime: 10,
  ...overrides,
});

describe('반복 일정 단일 수정 기능', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('반복 일정의 일부 속성만 수정해도 단일 일정으로 변경된다', async () => {
    // Given: 빈 상태에서 시작
    setupMockHandlerListCreation();
    const { result } = renderHook(() => useEventOperations(false, vi.fn()));

    // 1단계: 월간 반복 일정 생성
    const monthlyEventForm = createMockRepeatEventForm({
      title: '월간 보고서',
      repeat: { type: 'monthly', interval: 1, endDate: '2025-12-31' },
    });

    await act(async () => {
      await result.current.saveEvent(monthlyEventForm);
    });

    // 반복 일정이 생성되었는지 확인
    await waitFor(() => {
      const monthlyEvents = result.current.events.filter((e) => e.title === '월간 보고서');
      expect(monthlyEvents.length).toBeGreaterThan(0);
      expect(monthlyEvents[0].repeat.type).toBe('monthly');
    });

    // 2단계: 생성된 반복 일정을 수정
    const createdEvent = result.current.events.find((e) => e.title === '월간 보고서');
    const { result: editResult } = renderHook(() => useEventOperations(true, vi.fn()));

    await waitFor(() => {
      expect(editResult.current.events.length).toBeGreaterThan(0);
    });

    // When: 제목과 설명을 변경하면서 단일 일정으로 변경
    const editedEvent = {
      ...createdEvent!,
      title: '수정된 월간 보고서',
      description: '내용이 변경됨',
      repeat: { type: 'none' as const, interval: 0 },
    };

    await act(async () => {
      await editResult.current.saveEvent(editedEvent);
    });

    // Then: 반복 정보가 제거되고 단일 일정이 됨
    await waitFor(() => {
      const updatedEvent = editResult.current.events.find((e) => e.id === createdEvent!.id);
      expect(updatedEvent?.repeat.type).toBe('none');
      expect(updatedEvent?.title).toBe('수정된 월간 보고서');
      expect(updatedEvent?.description).toBe('내용이 변경됨');
    });
  });
});

describe('UI 반복 아이콘 표시/제거 검증', () => {
  it('반복 일정을 수정하면 달력 뷰에서 반복 아이콘이 사라진다', async () => {
    // Given: 반복 일정이 포함된 앱 화면
    setupMockHandlerListCreation([
      {
        id: '1',
        title: '주간 리뷰',
        date: '2025-10-15',
        startTime: '14:00',
        endTime: '15:00',
        description: '팀 회의',
        location: '회의실',
        category: '업무',
        repeat: { type: 'weekly', interval: 1, endDate: '2025-11-15' },
        notificationTime: 10,
      },
    ]);

    const { user } = setup(<App />);

    // When: 월별 뷰에서 반복 아이콘이 표시되는지 확인
    await waitFor(() => {
      const monthView = within(screen.getByTestId('month-view'));
      expect(monthView.getByTestId('repeat-icon')).toBeInTheDocument();
    });

    // And: 이벤트를 수정하여 반복 설정 해제
    const eventList = within(screen.getByTestId('event-list'));
    const editButtons = eventList.getAllByLabelText('Edit event');
    await user.click(editButtons[0]);

    // 반복 일정 체크박스 해제
    const repeatCheckbox = screen.getByRole('checkbox', { name: '반복 일정' });
    await user.click(repeatCheckbox);

    // 수정 완료
    await user.click(screen.getByTestId('event-submit-button'));

    // Then: 달력 뷰에서 반복 아이콘이 사라짐
    await waitFor(() => {
      const monthView = within(screen.getByTestId('month-view'));
      expect(monthView.queryByTestId('repeat-icon')).not.toBeInTheDocument();
    });

    // And: 주별 뷰로 전환해도 반복 아이콘이 없음
    await user.click(within(screen.getByLabelText('뷰 타입 선택')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'week-option' }));
    await waitFor(() => {
      const weekView = within(screen.getByTestId('week-view'));
      expect(weekView.queryByTestId('repeat-icon')).not.toBeInTheDocument();
    });
  });
});

describe('반복 일정 단일 삭제 기능', () => {
  it('반복 일정을 삭제하면 해당 일정만 삭제된다', async () => {
    // Given: 반복 일정이 여러 개 존재함
    setupMockHandlerListCreation();
    const { result } = renderHook(() => useEventOperations(false, vi.fn()));

    // 1단계: 매일 반복 일정 생성 (여러 일정이 생성됨)
    const dailyEventForm = createMockRepeatEventForm({
      title: '매일 스탠드업',
      date: '2025-10-15',
      repeat: { type: 'daily', interval: 1, endDate: '2025-10-17' }, // 3일간 반복
    });

    await act(async () => {
      await result.current.saveEvent(dailyEventForm);
    });

    // 반복 일정들이 생성되었는지 확인
    await waitFor(() => {
      const standupEvents = result.current.events.filter((e) => e.title === '매일 스탠드업');
      expect(standupEvents.length).toBe(3); // 10/15, 10/16, 10/17
    });

    // 2단계: 특정 날짜의 반복 일정만 삭제
    const eventsToDelete = result.current.events.filter((e) => e.title === '매일 스탠드업');
    const middleEvent = eventsToDelete.find((e) => e.date === '2025-10-16');
    expect(middleEvent).toBeDefined();

    // When: 특정 날짜(10/16)의 반복 일정만 삭제
    await act(async () => {
      await result.current.deleteEvent(middleEvent!.id);
    });

    // Then: 해당 날짜만 삭제되고 다른 반복 일정은 유지됨
    await waitFor(() => {
      const remainingEvents = result.current.events.filter((e) => e.title === '매일 스탠드업');
      expect(remainingEvents.length).toBe(2); // 10/15, 10/17만 남음

      const deletedEvent = remainingEvents.find((e) => e.date === '2025-10-16');
      expect(deletedEvent).toBeUndefined(); // 10/16은 삭제됨

      const firstEvent = remainingEvents.find((e) => e.date === '2025-10-15');
      const lastEvent = remainingEvents.find((e) => e.date === '2025-10-17');
      expect(firstEvent).toBeDefined(); // 10/15는 유지됨
      expect(lastEvent).toBeDefined(); // 10/17은 유지됨
    });
  });

  it('반복 일정의 첫 번째 일정을 삭제해도 나머지는 유지된다', async () => {
    // Given: 주간 반복 일정이 존재함
    setupMockHandlerListCreation();
    const { result } = renderHook(() => useEventOperations(false, vi.fn()));

    const weeklyEventForm = createMockRepeatEventForm({
      title: '주간 미팅',
      date: '2025-10-15',
      repeat: { type: 'weekly', interval: 1, endDate: '2025-10-29' }, // 3주간 반복
    });

    await act(async () => {
      await result.current.saveEvent(weeklyEventForm);
    });

    // 주간 반복 일정들이 생성되었는지 확인
    await waitFor(() => {
      const weeklyEvents = result.current.events.filter((e) => e.title === '주간 미팅');
      expect(weeklyEvents.length).toBe(3); // 10/15, 10/22, 10/29
    });

    // When: 첫 번째 반복 일정을 삭제
    const eventsToDelete = result.current.events.filter((e) => e.title === '주간 미팅');
    const firstEvent = eventsToDelete.find((e) => e.date === '2025-10-15');

    await act(async () => {
      await result.current.deleteEvent(firstEvent!.id);
    });

    // Then: 첫 번째만 삭제되고 나머지는 유지됨
    await waitFor(() => {
      const remainingEvents = result.current.events.filter((e) => e.title === '주간 미팅');
      expect(remainingEvents.length).toBe(2); // 10/22, 10/29만 남음

      const deletedEvent = remainingEvents.find((e) => e.date === '2025-10-15');
      expect(deletedEvent).toBeUndefined(); // 10/15는 삭제됨

      const secondEvent = remainingEvents.find((e) => e.date === '2025-10-22');
      const thirdEvent = remainingEvents.find((e) => e.date === '2025-10-29');
      expect(secondEvent).toBeDefined(); // 10/22는 유지됨
      expect(thirdEvent).toBeDefined(); // 10/29는 유지됨
    });
  });

  it('반복 일정의 마지막 일정을 삭제해도 나머지는 유지된다', async () => {
    // Given: 반복 일정이 존재함
    setupMockHandlerListCreation();
    const { result } = renderHook(() => useEventOperations(false, vi.fn()));

    const monthlyEventForm = createMockRepeatEventForm({
      title: '월간 보고',
      date: '2025-10-15',
      repeat: { type: 'monthly', interval: 1, endDate: '2025-12-15' }, // 3개월간 반복
    });

    await act(async () => {
      await result.current.saveEvent(monthlyEventForm);
    });

    // When: 마지막 반복 일정을 삭제
    await waitFor(() => {
      const monthlyEvents = result.current.events.filter((e) => e.title === '월간 보고');
      expect(monthlyEvents.length).toBe(3); // 10/15, 11/15, 12/15
    });

    const eventsToDelete = result.current.events.filter((e) => e.title === '월간 보고');
    const lastEvent = eventsToDelete.find((e) => e.date === '2025-12-15');

    await act(async () => {
      await result.current.deleteEvent(lastEvent!.id);
    });

    // Then: 마지막만 삭제되고 나머지는 유지됨
    await waitFor(() => {
      const remainingEvents = result.current.events.filter((e) => e.title === '월간 보고');
      expect(remainingEvents.length).toBe(2); // 10/15, 11/15만 남음

      const deletedEvent = remainingEvents.find((e) => e.date === '2025-12-15');
      expect(deletedEvent).toBeUndefined(); // 12/15는 삭제됨

      const firstEvent = remainingEvents.find((e) => e.date === '2025-10-15');
      const secondEvent = remainingEvents.find((e) => e.date === '2025-11-15');
      expect(firstEvent).toBeDefined(); // 10/15는 유지됨
      expect(secondEvent).toBeDefined(); // 11/15는 유지됨
    });
  });
});

describe('반복 정보 변경 검증', () => {
  it('원래 단일 일정을 수정해도 단일 일정으로 유지된다', async () => {
    // Given: 빈 상태에서 시작
    setupMockHandlerListCreation();
    const { result } = renderHook(() => useEventOperations(false, vi.fn()));

    // 1단계: 단일 일정 생성 (반복 안함)
    const singleEventForm = createMockRepeatEventForm({
      title: '단일 회의',
      repeat: { type: 'none', interval: 0 },
    });

    await act(async () => {
      await result.current.saveEvent(singleEventForm);
    });

    // 단일 일정이 생성되었는지 확인
    await waitFor(() => {
      const singleEvents = result.current.events.filter((e) => e.title === '단일 회의');
      expect(singleEvents.length).toBe(1);
      expect(singleEvents[0].repeat.type).toBe('none');
    });

    // 2단계: 생성된 단일 일정을 수정
    const createdEvent = result.current.events.find((e) => e.title === '단일 회의');
    const { result: editResult } = renderHook(() => useEventOperations(true, vi.fn()));

    await waitFor(() => {
      expect(editResult.current.events.length).toBeGreaterThan(0);
    });

    // When: 단일 일정을 수정
    const editedEvent = {
      ...createdEvent!,
      title: '수정된 단일 회의',
      repeat: { type: 'none' as const, interval: 0 },
    };

    await act(async () => {
      await editResult.current.saveEvent(editedEvent);
    });

    // Then: 여전히 단일 일정으로 유지됨
    await waitFor(() => {
      const updatedEvent = editResult.current.events.find((e) => e.id === createdEvent!.id);
      expect(updatedEvent?.repeat.type).toBe('none');
      expect(updatedEvent?.title).toBe('수정된 단일 회의');
    });
  });
});

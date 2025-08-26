import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen, within } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';
import { ReactElement } from 'react';

import { setupMockHandlerListCreation } from '../__mocks__/handlersUtils';
import App from '../App';
import { Event } from '../types';

const theme = createTheme();

const setup = (element: ReactElement) => {
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

// 참고: saveRepeatSchedule 함수는 Phase 3 (반복 생성 UI 활성화) 때 필요하면 추가할 예정

describe('사용자 반복 일정 관리 여정', () => {
  it('사용자가 반복 일정을 확인하면 반복 정보가 표시된다', async () => {
    // Given: 반복 일정이 미리 생성되어 있음
    const repeatEvent: Event = {
      id: '1',
      title: '매일 스탠드업',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '09:30',
      description: '팀 스탠드업 미팅',
      location: '회의실 A',
      category: '업무',
      repeat: { type: 'daily', interval: 1 },
      notificationTime: 10,
    };

    setupMockHandlerListCreation([repeatEvent]);
    setup(<App />);

    // When: 일정 목록을 확인
    await screen.findByText('일정 로딩 완료!');
    const eventList = within(screen.getByTestId('event-list'));

    // Then: 반복 정보가 표시됨
    expect(eventList.getByText('매일 스탠드업')).toBeInTheDocument();
    expect(eventList.getByText(/반복:.*1.*일.*마다/)).toBeInTheDocument();
  });

  it('반복 일정에는 반복 아이콘이 표시된다', async () => {
    // Given: 반복 일정이 존재함
    const repeatEvent: Event = {
      id: '1',
      title: '매일 운동',
      date: '2025-10-01',
      startTime: '07:00',
      endTime: '08:00',
      description: '아침 운동',
      location: '헬스장',
      category: '개인',
      repeat: { type: 'daily', interval: 1 },
      notificationTime: 10,
    };

    setupMockHandlerListCreation([repeatEvent]);
    const { user } = setup(<App />);

    // When: 월별 뷰를 확인
    await screen.findByText('일정 로딩 완료!');
    const monthView = within(screen.getByTestId('month-view'));

    // Then: 반복 아이콘이 표시됨
    expect(monthView.getByTestId('repeat-icon')).toBeInTheDocument();

    // When: 주별 뷰로 전환
    await user.click(within(screen.getByLabelText('뷰 타입 선택')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'week-option' }));

    // Then: 주별 뷰에서도 반복 아이콘이 표시됨
    const weekView = within(screen.getByTestId('week-view'));
    expect(weekView.getByTestId('repeat-icon')).toBeInTheDocument();
  });

  it('반복 일정은 목록에서 반복 유형을 텍스트로 표시한다', async () => {
    // Given: 다양한 반복 유형의 일정들이 존재함
    const repeatEvents: Event[] = [
      {
        id: '1',
        title: '매일 미팅',
        date: '2025-10-01',
        startTime: '09:00',
        endTime: '10:00',
        description: '매일 미팅',
        location: '회의실',
        category: '업무',
        repeat: { type: 'daily', interval: 1 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '주간 리뷰',
        date: '2025-10-01',
        startTime: '14:00',
        endTime: '15:00',
        description: '주간 리뷰',
        location: '회의실',
        category: '업무',
        repeat: { type: 'weekly', interval: 1 },
        notificationTime: 10,
      },
      {
        id: '3',
        title: '월간 보고',
        date: '2025-10-01',
        startTime: '16:00',
        endTime: '17:00',
        description: '월간 보고',
        location: '회의실',
        category: '업무',
        repeat: { type: 'monthly', interval: 1 },
        notificationTime: 10,
      },
    ];

    setupMockHandlerListCreation(repeatEvents);
    setup(<App />);

    // When: 일정 목록을 확인
    await screen.findByText('일정 로딩 완료!');
    const eventList = within(screen.getByTestId('event-list'));

    // Then: 각 반복 유형이 텍스트로 표시됨
    expect(eventList.getByText(/반복:.*1.*일.*마다/)).toBeInTheDocument();
    expect(eventList.getByText(/반복:.*1.*주.*마다/)).toBeInTheDocument();
    expect(eventList.getByText(/반복:.*1.*월.*마다/)).toBeInTheDocument();
  });
});

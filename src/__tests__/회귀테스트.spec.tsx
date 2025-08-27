import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { act, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';
import { ReactElement } from 'react';
import { vi } from 'vitest';

import { setupMockHandlerCreation } from '../__mocks__/handlersUtils';
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

// 🧪 회귀테스트: 반복일정 기능 추가 후 기존 충돌 검사 로직 검증
describe('회귀테스트: 반복일정과 기존 단일일정 충돌 검사', () => {
  it('반복일정 생성 시 기존 단일일정과 충돌하는 경우 경고가 표시된다', async () => {
    // Given: 기존 단일 일정이 존재함
    const existingEvent: Event = {
      id: '1',
      title: '기존 회의',
      date: '2025-10-15',
      startTime: '14:00',
      endTime: '15:00',
      description: '중요한 팀 미팅',
      location: '회의실 A',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };

    setupMockHandlerCreation([existingEvent]);

    const { user } = setup(<App />);

    // When: 기존 일정과 시간이 겹치는 반복 일정을 생성
    await user.click(screen.getAllByText('일정 추가')[0]);
    await user.type(screen.getByLabelText('제목'), '매일 스탠드업');
    await user.type(screen.getByLabelText('날짜'), '2025-10-15');
    await user.type(screen.getByLabelText('시작 시간'), '14:30');
    await user.type(screen.getByLabelText('종료 시간'), '15:30');
    await user.type(screen.getByLabelText('설명'), '팀 스탠드업 미팅');
    await user.type(screen.getByLabelText('위치'), '회의실 B');
    await user.click(screen.getByLabelText('카테고리'));

    // 반복 일정 활성화
    const repeatCheckbox = screen.getByRole('checkbox', { name: '반복 일정' });
    await user.click(repeatCheckbox);

    // 매일 반복 선택
    await user.click(within(screen.getByLabelText('반복 유형')).getByRole('combobox'));
    await user.click(screen.getByTestId('repeat-daily'));

    // When: 일정 추가 버튼 클릭
    const submitButton = screen.getByRole('button', { name: '일정 추가' });
    await user.click(submitButton);

    // Then: 충돌 경고가 표시됨
    expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
    expect(screen.getByText(/다음 일정과 겹칩니다/)).toBeInTheDocument();
    expect(screen.getByText('기존 회의 (2025-10-15 14:00-15:00)')).toBeInTheDocument();
  });

  it('반복일정의 특정 날짜가 기존 일정과 충돌하지 않는 경우 정상 생성된다', async () => {
    // Given: 기존 단일 일정이 있지만 시간이 다름
    const existingEvent: Event = {
      id: '1',
      title: '기존 회의',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '아침 미팅',
      location: '회의실 A',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };

    setupMockHandlerCreation([existingEvent]);
    const { user } = setup(<App />);

    // When: 기존 일정과 시간이 겹치지 않는 반복 일정을 생성
    await user.click(screen.getAllByText('일정 추가')[0]);
    await user.type(screen.getByLabelText('제목'), '매일 운동');
    await user.type(screen.getByLabelText('날짜'), '2025-10-15');
    await user.type(screen.getByLabelText('시작 시간'), '18:00');
    await user.type(screen.getByLabelText('종료 시간'), '19:00');
    await user.type(screen.getByLabelText('설명'), '저녁 운동');
    await user.type(screen.getByLabelText('위치'), '헬스장');
    await user.click(screen.getByLabelText('카테고리'));

    // 반복 일정 활성화
    const repeatCheckbox = screen.getByRole('checkbox', { name: '반복 일정' });
    await user.click(repeatCheckbox);

    // 매일 반복 선택
    await user.click(within(screen.getByLabelText('반복 유형')).getByRole('combobox'));
    await user.click(screen.getByTestId('repeat-daily'));

    // When: 일정 추가 버튼 클릭
    const submitButton = screen.getByRole('button', { name: '일정 추가' });
    await user.click(submitButton);

    // Then: 충돌 경고 없이 일정이 생성됨
    expect(screen.queryByText('일정 겹침 경고')).not.toBeInTheDocument();

    // 일정이 성공적으로 생성되었는지 확인
    await screen.findByText('일정이 추가되었습니다.');
  });
});

describe('회귀테스트: 검색 기능', () => {
  it('반복일정이 검색 기능에 정상적으로 포함된다', async () => {
    // Given: 반복 일정과 단일 일정이 혼재함
    const existingEvents: Event[] = [
      {
        id: '1',
        title: '기존 단일 회의',
        date: '2025-10-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '중요한 단일 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '매일 운동',
        date: '2025-10-15',
        startTime: '18:00',
        endTime: '19:00',
        description: '헬스장에서 운동하기',
        location: '헬스장',
        category: '개인',
        repeat: { type: 'daily', interval: 1 },
        notificationTime: 10,
      },
      {
        id: '3',
        title: '매일 운동',
        date: '2025-10-16',
        startTime: '18:00',
        endTime: '19:00',
        description: '헬스장에서 운동하기',
        location: '헬스장',
        category: '개인',
        repeat: { type: 'daily', interval: 1 },
        notificationTime: 10,
      },
    ];

    setupMockHandlerCreation(existingEvents);
    const { user } = setup(<App />);

    // 일정 로딩 대기
    await screen.findByText('일정 로딩 완료!');

    // When: "운동"으로 검색
    const searchInput = screen.getByPlaceholderText('검색어를 입력하세요');
    await user.type(searchInput, '운동');

    // Then: 반복일정들이 검색 결과에 나타남
    const eventList = within(screen.getByTestId('event-list'));

    expect(eventList.getAllByText('매일 운동')).toHaveLength(2); // 10/15, 10/16 두 개 모두
    expect(eventList.getAllByText('헬스장에서 운동하기')).toHaveLength(2);
    expect(eventList.queryByText('기존 단일 회의')).not.toBeInTheDocument(); // 검색어에 맞지 않음

    // When: 검색어를 "회의"로 변경
    await user.clear(searchInput);
    await user.type(searchInput, '회의');

    // Then: 반복일정들이 검색 결과에 나타남

    // Then: 단일 일정만 검색 결과에 나타남
    expect(eventList.getByText('기존 단일 회의')).toBeInTheDocument();
    expect(eventList.queryByText('매일 운동')).not.toBeInTheDocument();

    // When: 검색어를 "헬스장"으로 변경 (위치 기반 검색)
    await user.clear(searchInput);
    await user.type(searchInput, '헬스장');

    // Then: 위치가 "헬스장"인 반복일정들이 검색됨
    expect(eventList.getAllByText('매일 운동')).toHaveLength(2);
    expect(eventList.queryByText('기존 단일 회의')).not.toBeInTheDocument();
  });

  it('반복일정이 있는 상태에서 검색 결과가 없으면 적절한 메시지를 표시한다', async () => {
    // Given: 반복 일정만 존재함
    const repeatEvents: Event[] = [
      {
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
      },
    ];

    setupMockHandlerCreation(repeatEvents);
    const { user } = setup(<App />);

    // 일정 로딩 대기
    await screen.findByText('일정 로딩 완료!');

    // When: 존재하지 않는 키워드로 검색
    const searchInput = screen.getByPlaceholderText('검색어를 입력하세요');
    await user.type(searchInput, '존재하지않는키워드');

    // Then: 검색 결과 없음 메시지가 표시됨
    expect(screen.getByText('검색 결과가 없습니다.')).toBeInTheDocument();
    expect(screen.queryByText('매일 스탠드업')).not.toBeInTheDocument();
  });
});

describe('회귀테스트: 알림 기능', () => {
  it('반복일정에 대한 알림이 각 일정마다 정상 동작한다', async () => {
    // Given: 반복 일정들이 존재함
    const now = new Date('2025-10-15T08:50:00'); // 8시 50분
    vi.setSystemTime(now);

    const repeatEvents: Event[] = [
      {
        id: '1',
        title: '매일 스탠드업',
        date: '2025-10-15',
        startTime: '09:00', // 10분 후 시작
        endTime: '09:30',
        description: '팀 스탠드업 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'daily', interval: 1 },
        notificationTime: 10, // 10분 전 알림
      },
      {
        id: '2',
        title: '매일 스탠드업',
        date: '2025-10-16',
        startTime: '09:00', // 내일 같은 시간
        endTime: '09:30',
        description: '팀 스탠드업 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'daily', interval: 1 },
        notificationTime: 10, // 10분 전 알림
      },
    ];

    setupMockHandlerCreation(repeatEvents);

    setup(<App />);

    // 일정 로딩 대기
    await screen.findByText('일정 로딩 완료!');

    // When: 첫 번째 반복일정의 알림 시간이 됨 (정확히 10분 전)
    act(() => {
      vi.setSystemTime(new Date('2025-10-15T08:50:00')); // 첫 번째 일정 10분 전
      vi.advanceTimersByTime(1000); // 1초 경과로 알림 체크 트리거
    });

    // Then: 첫 번째 반복일정에 대한 알림이 나타남
    expect(screen.getByText('10분 후 매일 스탠드업 일정이 시작됩니다.')).toBeInTheDocument();
  });
});

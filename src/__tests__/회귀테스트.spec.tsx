import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';
import { ReactElement } from 'react';

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

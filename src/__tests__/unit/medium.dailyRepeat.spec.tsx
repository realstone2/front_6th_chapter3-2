import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';

import { setupMockHandlerListCreation } from '../../__mocks__/handlersUtils';
import App from '../../App';
import { server } from '../../setupTests';

const theme = createTheme();

const setup = () => {
  const user = userEvent.setup();

  return {
    ...render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </ThemeProvider>
    ),
    user,
  };
};

describe('매일 반복 일정 생성 및 표시', () => {
  beforeEach(() => {
    // 독립적인 테스트 환경 구성
    server.resetHandlers();
    setupMockHandlerListCreation();
  });

  it('일정을 생성하면 캘린더에 표시된다', async () => {
    // Given: 사용자가 일정을 생성
    const { user } = setup();

    // 먼저 일정 추가 폼 열기
    await user.click(screen.getAllByText('일정 추가')[0]);

    // 제목 입력
    const titleInput = screen.getByLabelText('제목');
    await user.type(titleInput, '매일 운동');

    // 날짜를 현재 날짜로 설정 (캘린더가 현재 월을 보고 있으므로)
    const today = new Date().toISOString().split('T')[0];
    const dateInput = screen.getByLabelText('날짜');
    await user.clear(dateInput);
    await user.type(dateInput, today);

    // 시간 설정
    const startTimeInput = screen.getByLabelText('시작 시간');
    await user.clear(startTimeInput);
    await user.type(startTimeInput, '07:00');

    const endTimeInput = screen.getByLabelText('종료 시간');
    await user.clear(endTimeInput);
    await user.type(endTimeInput, '08:00');

    // 반복 일정 설정
    const repeatCheckbox = screen.getByRole('checkbox', { name: '반복 일정' });
    await user.click(repeatCheckbox);

    // 매일 반복 선택
    await user.click(within(screen.getByLabelText('반복 유형')).getByRole('combobox'));
    await user.click(screen.getByTestId('repeat-daily'));

    // When: 일정 추가 버튼 클릭 (매일 반복 일정)
    const submitButton = screen.getByRole('button', { name: '일정 추가' });
    await user.click(submitButton);

    // Then: 일정이 생성되어 캘린더에 표시됨 (비동기 처리 대기)
    const dailyExerciseEvents = await screen.findAllByText('매일 운동');
    expect(dailyExerciseEvents.length).toBeGreaterThan(0);
    expect(dailyExerciseEvents[0]).toBeInTheDocument();
  });
});

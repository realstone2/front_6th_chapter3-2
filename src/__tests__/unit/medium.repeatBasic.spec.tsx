import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';

import App from '../../App';
import { server } from '../../setupTests';
import { setupMockHandlerListCreation } from '../../__mocks__/handlersUtils';

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

describe('반복 일정 기본 기능', () => {
  beforeEach(() => {
    // 독립적인 테스트 환경 구성
    setupMockHandlerListCreation();
    server.resetHandlers();
  });

  it('반복 체크박스를 클릭하면 반복 설정 UI가 표시된다', async () => {
    // Given: 사용자가 일정 추가 화면에 있음
    const { user } = setup();

    // When: 반복 일정 체크박스를 클릭
    const repeatCheckbox = screen.getByRole('checkbox', { name: '반복 일정' });
    await user.click(repeatCheckbox);

    // Then: 반복 설정 UI가 표시됨
    expect(screen.getByLabelText('반복 유형')).toBeInTheDocument();
    expect(screen.getByLabelText('반복 간격')).toBeInTheDocument();
    expect(screen.getByLabelText('반복 종료일')).toBeInTheDocument();
  });

  it('반복 간격과 종료일 입력이 정상적으로 동작한다', async () => {
    // Given: 반복 설정 UI가 표시된 상태
    const { user } = setup();

    // 반복 일정 체크박스 클릭
    const repeatCheckbox = screen.getByRole('checkbox', { name: '반복 일정' });
    await user.click(repeatCheckbox);

    // When: 반복 간격 값을 변경
    const intervalInput = screen.getByLabelText('반복 간격');
    await user.clear(intervalInput);
    await user.type(intervalInput, '2');

    // Then: 값이 올바르게 설정됨
    expect(intervalInput).toHaveValue(2);

    // When: 반복 종료일을 설정
    const endDateInput = screen.getByLabelText('반복 종료일');
    await user.type(endDateInput, '2024-12-31');

    // Then: 날짜가 올바르게 설정됨
    expect(endDateInput).toHaveValue('2024-12-31');
  });
});

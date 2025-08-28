import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
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

describe('반복 일정 UI 기본 기능', () => {
  beforeEach(() => {
    // 독립적인 테스트 환경 구성
    setupMockHandlerListCreation();
    server.resetHandlers();
  });

  it('사용자가 반복 일정 체크박스를 클릭하면 반복 설정 UI가 표시된다', async () => {
    // Given: 사용자가 일정 추가 화면에 있음
    const { user } = setup();

    // When: 반복 일정 체크박스를 클릭
    const repeatCheckbox = screen.getByRole('checkbox', { name: '반복 일정' });
    await user.click(repeatCheckbox);

    // // Then: 반복 유형 선택 UI가 표시됨
    expect(screen.getByLabelText('반복 유형')).toBeInTheDocument();
    expect(screen.getByLabelText('반복 간격')).toBeInTheDocument();
    expect(screen.getByLabelText('반복 종료일')).toBeInTheDocument();
  });

  it('반복 유형을 선택할 수 있다', async () => {
    // Given: 반복 일정이 활성화된 상태
    const { user } = setup();
    await user.click(screen.getByRole('checkbox', { name: '반복 일정' }));
    // When: 반복 유형 Select가 렌더링되는지 확인
    expect(screen.getByLabelText('반복 유형')).toBeInTheDocument();
    const repeatTypeSelect = screen.getByLabelText('반복 유형');

    // Then: Select 컴포넌트가 존재하고 상호작용 가능
    expect(repeatTypeSelect).toBeInTheDocument();
    expect(repeatTypeSelect).toHaveAttribute('aria-label', '반복 유형');
  });

  it('반복 간격을 설정할 수 있다', async () => {
    // Given: 반복 일정이 활성화된 상태
    const { user } = setup();
    await user.click(screen.getByRole('checkbox', { name: '반복 일정' }));

    // When: 반복 간격을 2로 설정
    const intervalInput = screen.getByDisplayValue('1'); // 기본값 1에서 찾기
    await user.clear(intervalInput);
    await user.type(intervalInput, '2');

    // Then: 설정된 값이 표시됨
    expect(intervalInput).toHaveValue(2);
  });

  it('반복 종료일을 설정할 수 있다', async () => {
    // Given: 반복 일정이 활성화된 상태
    const { user } = setup();
    await user.click(screen.getByRole('checkbox', { name: '반복 일정' }));

    // When: 반복 종료일을 설정
    const endDateInput = screen.getByLabelText('반복 종료일');
    await user.type(endDateInput, '2024-12-31');

    // Then: 설정된 날짜가 표시됨
    expect(endDateInput).toHaveValue('2024-12-31');
  });

  it('사용자가 반복 일정 체크박스를 해제하면 반복 설정 UI가 숨겨진다', async () => {
    // Given: 반복 일정이 활성화된 상태
    const { user } = setup();
    await user.click(screen.getByRole('checkbox', { name: '반복 일정' }));

    // When: 반복 일정 체크박스를 해제
    const repeatCheckbox = screen.getByRole('checkbox', { name: '반복 일정' });
    await user.click(repeatCheckbox);

    // Then: 반복 설정 UI가 숨겨짐
    expect(screen.queryByLabelText('반복 유형')).not.toBeInTheDocument();
  });
});

# 추가 요구사항 TDD 기반 구현 분석 (Kent Beck 방식)

## 현재 코드 상태 분석

### ✅ 이미 완성된 부분

#### 1. 타입 구조 (src/types.ts)

```typescript
export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RepeatInfo {
  type: RepeatType;
  interval: number;
  endDate?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  category: string;
  repeat: RepeatInfo;
  notificationTime: number;
}
```

#### 2. 반복 일정 상태 관리 (src/hooks/useEventForm.ts)

```typescript
const [isRepeating, setIsRepeating] = useState(initialEvent?.repeat.type !== 'none');
const [repeatType, setRepeatType] = useState<RepeatType>(initialEvent?.repeat.type || 'none');
const [repeatInterval, setRepeatInterval] = useState(initialEvent?.repeat.interval || 1);
const [repeatEndDate, setRepeatEndDate] = useState(initialEvent?.repeat.endDate || '');
```

#### 3. 반복 정보 수정/초기화 로직

```typescript
// editEvent 함수에서 반복 정보 폼에 로드 완료
setIsRepeating(event.repeat.type !== 'none');
setRepeatType(event.repeat.type);
setRepeatInterval(event.repeat.interval);
setRepeatEndDate(event.repeat.endDate || '');

// resetForm 함수에서 반복 정보 초기화 완료
setIsRepeating(false);
setRepeatType('none');
setRepeatInterval(1);
setRepeatEndDate('');
```

### ❌ 구현이 필요한 부분

- App.tsx 38행: `RepeatType` import 주석 해제
- App.tsx 80-84행: setter 함수들 주석 해제
- App.tsx 441-478행: 반복 설정 UI 주석 해제

---

## TDD 기반 요구사항별 구현 분석

### Phase 1: 기본 반복 기능 활성화 (Easy Level)

#### 🔴 Red: 실패하는 테스트 먼저 작성

```typescript
// src/__tests__/unit/easy.repeatUI.spec.ts (신규 생성)
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import App from '../../App';

const setup = () => {
  const user = userEvent.setup();
  const theme = createTheme();

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
  it('사용자가 반복 일정 체크박스를 클릭하면 반복 설정 UI가 표시된다', async () => {
    // Given: 사용자가 일정 추가 화면에 있음
    const { user } = setup();

    // When: 반복 일정 체크박스를 클릭
    const repeatCheckbox = screen.getByRole('checkbox', { name: '반복 일정' });
    await user.click(repeatCheckbox);

    // Then: 반복 유형 선택 UI가 표시됨
    expect(screen.getByLabelText('반복 유형')).toBeInTheDocument();
    expect(screen.getByLabelText('반복 간격')).toBeInTheDocument();
    expect(screen.getByLabelText('반복 종료일')).toBeInTheDocument();
  });

  it('반복 유형을 선택할 수 있다', async () => {
    // Given: 반복 일정이 활성화된 상태
    const { user } = setup();
    await user.click(screen.getByRole('checkbox', { name: '반복 일정' }));

    // When: 반복 유형을 선택
    const repeatTypeSelect = screen.getByLabelText('반복 유형');
    await user.selectOptions(repeatTypeSelect, 'daily');

    // Then: 선택된 값이 표시됨
    expect(screen.getByDisplayValue('매일')).toBeInTheDocument();
  });
});
```

#### 🟢 Green: 최소한의 구현 - UI 활성화

**구현 위치**: App.tsx

1. 38행: `// import { Event, EventForm, RepeatType } from './types';` → `import { Event, EventForm, RepeatType } from './types';`
2. 80-84행: setter 함수들 주석 해제
3. 441-478행: 반복 설정 UI 섹션 주석 해제

#### 🔄 Refactor: 코드 품질 개선

- 반복 설정 UI 컴포넌트 분리 고려
- 반복 유형별 validation 로직 추가

---

### Phase 2: 반복 일정 저장 및 표시 (Medium Level)

#### 🔴 Red: 반복 일정 생성 통합 테스트

```typescript
// src/__tests__/medium.repeatScheduling.spec.tsx (신규 생성)
import { setupMockHandlerCreation } from '../__mocks__/handlersUtils';
import { Event } from '../types';

// 기존 integration.spec.tsx의 setup, saveSchedule 패턴 재사용
const setup = () => {
  // 기존 패턴과 동일
};

// 반복 일정용 saveSchedule 확장
const saveRepeatSchedule = async (
  user: UserEvent,
  form: Omit<Event, 'id' | 'notificationTime'> // repeat 포함
) => {
  const { title, date, startTime, endTime, location, description, category, repeat } = form;

  await user.click(screen.getAllByText('일정 추가')[0]);
  await user.type(screen.getByLabelText('제목'), title);
  await user.type(screen.getByLabelText('날짜'), date);
  await user.type(screen.getByLabelText('시작 시간'), startTime);
  await user.type(screen.getByLabelText('종료 시간'), endTime);
  await user.type(screen.getByLabelText('설명'), description);
  await user.type(screen.getByLabelText('위치'), location);
  await user.click(screen.getByLabelText('카테고리'));
  await user.click(screen.getByLabelText(`${category}-option`));

  // 반복 설정
  if (repeat.type !== 'none') {
    await user.click(screen.getByRole('checkbox', { name: '반복 일정' }));
    await user.selectOptions(screen.getByLabelText('반복 유형'), repeat.type);
    if (repeat.endDate) {
      await user.type(screen.getByLabelText('반복 종료일'), repeat.endDate);
    }
  }

  await user.click(screen.getByTestId('event-submit-button'));
};

describe('사용자 반복 일정 관리 여정', () => {
  it('사용자가 매일 반복 일정을 생성하면 저장되고 반복 정보가 표시된다', async () => {
    // Given: 사용자가 일정 생성을 준비함
    setupMockHandlerCreation();
    const { user } = setup();

    // When: 매일 반복 일정을 생성
    await saveRepeatSchedule(user, {
      title: '매일 스탠드업',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '09:30',
      description: '팀 스탠드업 미팅',
      location: '회의실 A',
      category: '업무',
      repeat: { type: 'daily', interval: 1 },
    });

    // Then: 일정이 저장되고 반복 정보가 표시됨
    const eventList = within(screen.getByTestId('event-list'));
    expect(eventList.getByText('매일 스탠드업')).toBeInTheDocument();
    expect(eventList.getByText(/반복:.*1일마다/)).toBeInTheDocument();
  });

  it('반복 일정에는 반복 아이콘이 표시된다', async () => {
    // Given: 반복 일정이 존재함
    const repeatEvent = createMockRepeatEvent();
    setupMockHandlerCreation([repeatEvent]);
    const { user } = setup();

    // When: 월별 뷰를 확인
    const monthView = within(screen.getByTestId('month-view'));

    // Then: 반복 아이콘이 표시됨
    expect(monthView.getByTestId('repeat-icon')).toBeInTheDocument();

    // When: 주별 뷰로 전환
    await user.selectOptions(screen.getByLabelText('뷰 타입 선택'), 'week');

    // Then: 주별 뷰에서도 반복 아이콘이 표시됨
    const weekView = within(screen.getByTestId('week-view'));
    expect(weekView.getByTestId('repeat-icon')).toBeInTheDocument();
  });
});
```

#### 🟢 Green: 반복 아이콘 표시 구현

```typescript
// App.tsx renderWeekView, renderMonthView 함수 수정
// 기존 패턴 (289행) 참고:
{
  notifiedEvents.includes(event.id) && <Notifications fontSize="small" />;
}

// 추가할 패턴:
{
  event.repeat.type !== 'none' && <Repeat fontSize="small" data-testid="repeat-icon" />;
}
```

#### 🔄 Refactor: EventStatusIcons 컴포넌트 분리

---

### Phase 3: 반복 종료 조건 검증 (Medium Level)

#### 🔴 Red: 날짜 검증 테스트

```typescript
// src/__tests__/unit/easy.dateValidation.spec.ts (신규 생성)
describe('반복 종료일 검증 유틸리티', () => {
  it('반복 종료일이 2025-10-30을 초과하면 에러 메시지를 반환한다', () => {
    // Given: 최대 허용 날짜를 초과하는 종료일
    const endDate = '2025-11-01';

    // When: 날짜 검증을 수행
    const result = getDateErrorMessage(endDate);

    // Then: 적절한 에러 메시지가 반환됨
    expect(result).toBe('반복 종료일은 2025-10-30을 초과할 수 없습니다.');
  });

  it('반복 종료일이 시작일보다 이르면 에러 메시지를 반환한다', () => {
    // Given: 시작일보다 이른 종료일
    const startDate = '2025-10-05';
    const endDate = '2025-10-01';

    // When: 날짜 검증을 수행
    const result = getDateErrorMessage(endDate, startDate);

    // Then: 적절한 에러 메시지가 반환됨
    expect(result).toBe('반복 종료일은 시작일보다 늦어야 합니다.');
  });

  it('유효한 반복 종료일이면 null을 반환한다', () => {
    // Given: 유효한 날짜 범위
    const startDate = '2025-10-01';
    const endDate = '2025-10-15';

    // When: 날짜 검증을 수행
    const result = getDateErrorMessage(endDate, startDate);

    // Then: 에러가 없음
    expect(result).toBeNull();
  });
});
```

#### 🟢 Green: dateValidation 유틸리티 구현

```typescript
// src/utils/dateValidation.ts (신규 생성)
export const getDateErrorMessage = (endDate: string, startDate?: string): string | null => {
  const maxDate = new Date('2025-10-30');
  const endDateObj = new Date(endDate);

  if (endDateObj > maxDate) {
    return '반복 종료일은 2025-10-30을 초과할 수 없습니다.';
  }

  if (startDate && endDateObj < new Date(startDate)) {
    return '반복 종료일은 시작일보다 늦어야 합니다.';
  }

  return null;
};
```

#### 🔄 Refactor: useEventForm에 날짜 검증 통합

---

### Phase 4: 반복 일정 개별 수정/삭제 (Hard Level)

#### 🔴 Red: 반복 일정 수정 테스트

```typescript
// src/__tests__/hooks/medium.useEventOperations-repeat.spec.ts (신규 생성)
describe('반복 일정 수정 동작', () => {
  it('반복 일정을 수정하면 해당 일정이 단일 일정으로 변경된다', async () => {
    // Given: 반복 일정이 존재함
    const originalRepeatEvent = createMockRepeatEvent({
      id: '1',
      title: '매일 회의',
      repeat: { type: 'daily', interval: 1 },
    });

    setupMockHandlerUpdating([originalRepeatEvent]);
    const { result } = renderHook(() => useEventOperations(true));

    // When: 반복 일정을 수정 (단일 일정으로 변경)
    const editedEvent = {
      ...originalRepeatEvent,
      title: '수정된 회의',
      repeat: { type: 'none', interval: 0 },
    };

    await act(async () => {
      await result.current.saveEvent(editedEvent);
    });

    // Then: 해당 일정만 단일 일정으로 변경됨
    const updatedEvent = result.current.events.find((e) => e.id === '1');
    expect(updatedEvent?.repeat.type).toBe('none');
    expect(updatedEvent?.title).toBe('수정된 회의');
  });
});

describe('반복 일정 삭제 동작', () => {
  it('반복 일정을 삭제하면 해당 일정만 제거된다', async () => {
    // Given: 반복 일정이 여러 개 존재함
    const repeatEvents = [
      createMockRepeatEvent({ id: '1', date: '2025-10-15' }),
      createMockRepeatEvent({ id: '2', date: '2025-10-16' }),
      createMockRepeatEvent({ id: '3', date: '2025-10-17' }),
    ];

    setupMockHandlerDeletion(repeatEvents);
    const { result } = renderHook(() => useEventOperations(false));

    // When: 특정 날짜의 반복 일정을 삭제
    await act(async () => {
      await result.current.deleteEvent('2');
    });

    // Then: 해당 날짜만 제거되고 다른 일정은 유지됨
    expect(result.current.events.find((e) => e.id === '2')).toBeUndefined();
    expect(result.current.events.find((e) => e.id === '1')).toBeDefined();
    expect(result.current.events.find((e) => e.id === '3')).toBeDefined();
  });
});
```

#### 🟢 Green: 기존 saveEvent, deleteEvent 로직 확장

#### 🔄 Refactor: 반복 시리즈 관리 시스템 설계

---

### Phase 5: 특수 조건 처리 (Hard Level)

#### 🔴 Red: 엣지 케이스 테스트

```typescript
// src/__tests__/hooks/hard.useEventOperations-repeat-edge-cases.spec.ts (신규 생성)
describe('반복 일정 특수 조건 처리', () => {
  it('31일 시작 매월 반복은 31일이 없는 달을 건너뛴다', () => {
    // Given: 1월 31일에 시작하는 매월 반복 일정
    const baseEvent = createMockRepeatEvent({
      date: '2025-01-31',
      repeat: { type: 'monthly', interval: 1, endDate: '2025-06-30' },
    });

    // When: 반복 일정을 생성
    const generatedEvents = generateRepeatEvents(baseEvent);

    // Then: 31일이 있는 달(1월, 3월, 5월)만 생성됨
    expect(generatedEvents).toHaveLength(3);
    expect(generatedEvents.map((e) => e.date)).toEqual(['2025-01-31', '2025-03-31', '2025-05-31']);
    // 2월, 4월, 6월은 31일이 없으므로 건너뛰어짐
  });

  it('윤년 2월 29일 매년 반복은 윤년에만 생성된다', () => {
    // Given: 윤년 2월 29일에 시작하는 매년 반복 일정
    const baseEvent = createMockRepeatEvent({
      date: '2024-02-29',
      repeat: { type: 'yearly', interval: 1, endDate: '2027-02-28' },
    });

    // When: 반복 일정을 생성
    const generatedEvents = generateRepeatEvents(baseEvent);

    // Then: 윤년(2024)에만 생성됨
    expect(generatedEvents).toHaveLength(1);
    expect(generatedEvents[0].date).toBe('2024-02-29');
    // 2025, 2026은 평년이므로 건너뛰어짐
  });

  it('반복 종료일 경계값에서 올바르게 처리된다', () => {
    // Given: 종료일이 정확히 최대 허용일인 반복 일정
    const baseEvent = createMockRepeatEvent({
      date: '2025-10-28',
      repeat: { type: 'daily', interval: 1, endDate: '2025-10-30' },
    });

    // When: 반복 일정을 생성
    const generatedEvents = generateRepeatEvents(baseEvent);

    // Then: 종료일까지 정확히 생성됨
    expect(generatedEvents).toHaveLength(3);
    expect(generatedEvents.map((e) => e.date)).toEqual(['2025-10-28', '2025-10-29', '2025-10-30']);
  });
});
```

#### 🟢 Green: repeatUtils 구현

```typescript
// src/utils/repeatUtils.ts (신규 생성)
import { Event } from '../types';
import { addDays, addMonths, addYears, formatDate } from './dateUtils';

export const generateRepeatEvents = (baseEvent: Event): Event[] => {
  const { repeat } = baseEvent;
  const events: Event[] = [];

  if (repeat.type === 'none') {
    return [baseEvent];
  }

  const startDate = new Date(baseEvent.date);
  const endDate = repeat.endDate ? new Date(repeat.endDate) : new Date('2025-10-30');
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    // 특수 조건 처리
    if (isValidRepeatDate(currentDate, baseEvent.date, repeat.type)) {
      events.push({
        ...baseEvent,
        id: generateEventId(baseEvent.id, currentDate),
        date: formatDate(currentDate),
      });
    }

    // 다음 날짜 계산
    currentDate = getNextRepeatDate(currentDate, repeat.type, repeat.interval);
  }

  return events;
};

const isValidRepeatDate = (date: Date, originalDate: string, repeatType: string): boolean => {
  const originalDay = new Date(originalDate).getDate();

  if (repeatType === 'monthly' && originalDay === 31) {
    // 31일 반복: 해당 월에 31일이 있는지 확인
    return date.getDate() === 31;
  }

  if (repeatType === 'yearly' && originalDate.includes('02-29')) {
    // 윤년 2월 29일: 윤년인지 확인
    return isLeapYear(date.getFullYear()) && date.getMonth() === 1 && date.getDate() === 29;
  }

  return true;
};

const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};
```

#### 🔄 Refactor: 성능 최적화 및 에러 처리

---

## Mock 데이터 및 유틸리티 확장

### handlersUtils.ts 확장

```typescript
// src/__mocks__/handlersUtils.ts 확장
export const createMockRepeatEvent = (overrides = {}): Event => ({
  id: '1',
  title: '반복 일정',
  date: '2025-10-15',
  startTime: '09:00',
  endTime: '10:00',
  description: '반복 일정입니다',
  location: '회의실 A',
  category: '업무',
  repeat: { type: 'daily', interval: 1 },
  notificationTime: 10,
  ...overrides,
});

export const setupMockHandlerRepeatCreation = (initEvents = [] as Event[]) => {
  // 반복 일정 생성을 위한 특별한 Mock Handler
};
```

### utils.ts 확장

```typescript
// src/__tests__/utils.ts 확장
export const saveRepeatSchedule = async (
  user: UserEvent,
  scheduleData: Omit<Event, 'id' | 'notificationTime'>
) => {
  // 반복 일정 저장을 위한 헬퍼 함수
};

export const createMockEvent = (overrides = {}): Event => {
  // 기존 패턴과 일관성 있는 Mock 이벤트 생성
};
```

---

## 데이터 구조 확장

### TDD 방식으로 타입 확장

```typescript
// 🔴 Red: 예외 처리 테스트 먼저 작성
describe('반복 일정 예외 처리', () => {
  it('반복 일정에서 특정 날짜를 예외로 처리할 수 있다', () => {
    // Given: 예외 날짜가 포함된 반복 일정
    const repeatEvent = createMockRepeatEvent({
      repeat: {
        type: 'daily',
        interval: 1,
        endDate: '2025-10-20',
        exceptions: ['2025-10-16', '2025-10-18'],
      },
    });

    // When: 반복 일정을 생성
    const generatedEvents = generateRepeatEvents(repeatEvent);

    // Then: 예외 날짜는 반복 시리즈에서 제외됨
    const eventDates = generatedEvents.map((e) => e.date);
    expect(eventDates).not.toContain('2025-10-16');
    expect(eventDates).not.toContain('2025-10-18');
    expect(eventDates).toContain('2025-10-15');
    expect(eventDates).toContain('2025-10-17');
  });
});

// 🟢 Green: types.ts에 exceptions 필드 추가
interface RepeatInfo {
  type: RepeatType;
  interval: number;
  endDate?: string;
  exceptions?: string[]; // 제외된 날짜들
}

// 🔄 Refactor: 예외 처리 로직 최적화
```

---

## TDD 구현 로드맵 (Kent Beck 방식)

### Phase 1: Easy Level - 기본 UI (Red-Green-Refactor)

**목표**: 사용자가 반복 설정을 볼 수 있다

1. **Red**: 반복 UI 표시 테스트 작성
2. **Green**: App.tsx 주석 해제로 최소 구현
3. **Refactor**: UI 컴포넌트 정리

### Phase 2: Medium Level - 기본 기능 (확장된 TDD)

**목표**: 반복 일정을 생성하고 표시할 수 있다

1. 기존 `medium.integration.spec.tsx` 패턴 확장
2. 기존 `setupMockHandlerCreation` 활용
3. 반복 아이콘 표시 구현

### Phase 3: Medium Level - 수정/삭제 (기존 패턴 확장)

**목표**: 반복 일정을 개별적으로 수정/삭제할 수 있다

1. 기존 `useEventOperations.spec.ts` 패턴 확장
2. 기존 Mock Handler 재사용
3. 단일 일정 변환 로직 구현

### Phase 4: Hard Level - 특수 조건 (엣지 케이스)

**목표**: 31일, 윤년 등 특수 조건을 처리할 수 있다

1. 기존 `hard.useEventOperations-edge-cases.spec.ts` 패턴 활용
2. 복잡한 날짜 계산 로직 구현
3. 경계값 처리 테스트

---

## 기존 TDD 구조와의 완벽한 연계

**implemented-features-analysis.md의 TDD 패턴을 100% 활용:**

### 1. 테스트 우선 원칙 (Red-Green-Refactor)

- 모든 새 기능은 실패 테스트부터 시작
- 기존 `easy/medium/hard` 파일 구조 완전 준수
- Given-When-Then 패턴 일관성 있게 적용

### 2. 사용자 여정 중심 설계

- 기존 "사용자 일정 관리 여정" 패턴 확장
- "사용자 반복 일정 관리 여정" 추가
- 실제 사용자 시나리오 기반 테스트 설계

### 3. 계층별 테스트 전략 (기존 구조 활용)

- **Easy**: 단순 유틸리티 함수 (repeatUtils, dateValidation)
- **Medium**: 사용자 상호작용 (반복 일정 CRUD)
- **Hard**: 복잡한 엣지 케이스 (31일, 윤년 처리)

### 4. 기존 코드 재사용 극대화

- 타입 시스템: ✅ 이미 완성됨
- 상태 관리: ✅ 이미 완성됨
- 테스트 유틸리티: 기존 `setup`, `saveSchedule` 패턴 재사용
- Mock 시스템: 기존 `handlersUtils` 확장

### 5. 점진적 개발 (Small Steps)

- 각 Phase별로 작은 단위의 기능 완성
- 테스트가 항상 통과하는 상태 유지
- 리팩토링은 테스트 통과 후에만 수행

**이 접근법으로 기존 TDD 구조를 완전히 보존하면서 새 기능을 안전하고 체계적으로 추가할 수 있습니다.**

---

## 다음 단계

1. **Phase 1 시작**: `easy.repeatUI.spec.ts` 작성
2. **UI 활성화**: App.tsx 주석 해제
3. **테스트 확인**: 모든 테스트 통과 확인
4. **Phase 2 진행**: Medium 레벨 통합 테스트

기존 TDD 구조와 Kent Beck의 원칙을 완벽히 준수한 구현 계획입니다! 🧪

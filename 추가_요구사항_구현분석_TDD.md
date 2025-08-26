# 추가 요구사항 TDD 기반 구현 분석

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

## TDD 기반 요구사항별 구현 분석

### 1. (필수) 반복 유형 선택

#### 🔴 Red: 실패하는 테스트 먼저 작성

```typescript
// src/__tests__/unit/repeatScheduling.spec.ts (신규 생성)
describe('반복 일정 기본 기능', () => {
  it('반복 유형을 선택하면 해당 설정으로 일정이 저장된다', async () => {
    const { user } = setup(<App />);

    // 반복 체크박스 활성화
    await user.click(screen.getByRole('checkbox', { name: '반복 일정' }));

    // 반복 유형 선택
    await user.selectOptions(screen.getByLabelText('반복 유형'), 'daily');

    // 일정 정보 입력 및 저장
    await saveSchedule(user, {
      title: '매일 회의',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '10:00',
      repeat: { type: 'daily', interval: 1 },
    });

    // 저장된 일정의 반복 정보 확인
    expect(screen.getByText('반복: 1일마다')).toBeInTheDocument();
  });
});
```

#### 🟢 Green: 최소한의 구현 - UI 활성화

**구현 위치**: App.tsx 38행, 80-84행, 441-478행

**필요 작업**:

- `RepeatType` import 주석 해제
- `setRepeatType`, `setRepeatInterval`, `setRepeatEndDate` 주석 해제
- 반복 설정 UI 섹션 주석 해제

#### 🔄 Refactor: 코드 품질 개선

- 반복 설정 UI를 별도 컴포넌트로 분리
- 반복 유형별 validation 로직 추가

---

### 2. (필수) 반복 일정 표시

#### 🔴 Red: 반복 아이콘 표시 테스트

```typescript
// src/__tests__/integration/repeatDisplay.spec.tsx (신규 생성)
describe('반복 일정 표시', () => {
  it('반복 일정에는 반복 아이콘이 표시된다', async () => {
    const repeatEvent = {
      id: '1',
      title: '매일 회의',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '10:00',
      repeat: { type: 'daily', interval: 1 },
      // ... 기타 필드
    };

    render(<App />, {
      preloadedState: { events: [repeatEvent] },
    });

    // 월별 뷰에서 반복 아이콘 확인
    const monthView = within(screen.getByTestId('month-view'));
    expect(monthView.getByTestId('repeat-icon')).toBeInTheDocument();

    // 주별 뷰에서도 반복 아이콘 확인
    await user.selectOptions(screen.getByLabelText('뷰 타입 선택'), 'week');
    const weekView = within(screen.getByTestId('week-view'));
    expect(weekView.getByTestId('repeat-icon')).toBeInTheDocument();
  });
});
```

#### 🟢 Green: 기존 알림 아이콘 패턴 활용

```typescript
// App.tsx renderWeekView, renderMonthView 함수 수정
// 기존 패턴 (289행):
{
  notifiedEvents.includes(event.id) && <Notifications fontSize="small" />;
}

// 추가할 패턴:
{
  event.repeat.type !== 'none' && <Repeat fontSize="small" data-testid="repeat-icon" />;
}
```

#### 🔄 Refactor: 아이콘 컴포넌트화

- 이벤트 상태별 아이콘을 관리하는 EventStatusIcons 컴포넌트 생성
- 반복 타입별 다른 아이콘 표시 고려

---

### 3. (필수) 반복 종료 조건

#### 🔴 Red: 날짜 검증 테스트 (기존 timeValidation 패턴 확장)

```typescript
// src/__tests__/unit/dateValidation.spec.ts (신규 생성)
describe('반복 종료일 검증', () => {
  it('반복 종료일이 2025-10-30을 초과하면 에러가 발생한다', () => {
    const result = getDateErrorMessage('2025-11-01');
    expect(result).toBe('반복 종료일은 2025-10-30을 초과할 수 없습니다.');
  });

  it('반복 종료일이 시작일보다 이르면 에러가 발생한다', () => {
    const result = getDateErrorMessage('2025-10-01', '2025-10-05');
    expect(result).toBe('반복 종료일은 시작일보다 늦어야 합니다.');
  });
});
```

#### 🟢 Green: 기존 timeValidation.ts 패턴 활용

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

### 4. (필수) 반복 일정 단일 수정

#### 🔴 Red: 기존 수정 테스트 확장

```typescript
// src/__tests__/hooks/medium.useEventOperations.spec.ts 확장
describe('반복 일정 수정', () => {
  it('반복 일정을 수정하면 해당 일정만 단일 일정으로 변경된다', async () => {
    // 기존 164행 패턴 확장
    const originalRepeatEvent = {
      id: '1',
      title: '매일 회의',
      repeat: { type: 'daily', interval: 1 },
      // ... 기타 필드
    };

    const { result } = renderHook(() => useEventOperations(true));

    // 반복 일정 수정
    const updatedEvent = {
      ...originalRepeatEvent,
      title: '수정된 회의',
      repeat: { type: 'none', interval: 0 }, // 단일 일정으로 변경
    };

    await act(async () => {
      await result.current.saveEvent(updatedEvent);
    });

    expect(result.current.events[0].repeat.type).toBe('none');
  });
});
```

#### 🟢 Green: 기존 saveEvent 로직 확장

#### 🔄 Refactor: 반복 시리즈 관리 시스템 설계

---

### 5. (필수) 반복 일정 단일 삭제

#### 🔴 Red: 기존 삭제 테스트 확장

```typescript
// src/__tests__/hooks/medium.useEventOperations.spec.ts 확장
describe('반복 일정 삭제', () => {
  it('반복 일정을 삭제하면 해당 날짜만 제거되고 시리즈는 유지된다', async () => {
    // 기존 227행 패턴 확장
    const { result } = renderHook(() => useEventOperations(false));

    await act(async () => {
      await result.current.deleteEvent('1'); // 특정 날짜의 반복 일정 삭제
    });

    // 해당 날짜는 삭제되었지만 반복 시리즈는 유지
    expect(result.current.events.filter((e) => e.id === '1')).toHaveLength(0);
    expect(result.current.events.filter((e) => e.repeat.type === 'daily')).toHaveLength(2); // 나머지 반복 일정들
  });
});
```

#### 🟢 Green: 기존 deleteEvent 로직 확장

#### 🔄 Refactor: 예외 처리 시스템 구현

---

## 고급 기능 구현

### 반복 일정 생성 알고리즘

#### 🔴 Red: 특수 조건 테스트

```typescript
// src/__tests__/unit/repeatGeneration.spec.ts (신규 생성)
describe('반복 일정 생성', () => {
  it('31일 매월 반복은 31일이 없는 달을 건너뛴다', () => {
    const baseEvent = {
      date: '2025-01-31',
      repeat: { type: 'monthly', interval: 1, endDate: '2025-04-30' },
    };
    const generatedEvents = generateRepeatEvents(baseEvent);

    // 1/31, 3/31만 생성되어야 함 (2월은 건너뛰기)
    expect(generatedEvents).toHaveLength(2);
    expect(generatedEvents[0].date).toBe('2025-01-31');
    expect(generatedEvents[1].date).toBe('2025-03-31');
  });

  it('윤년 29일 매년 반복은 29일에만 생성된다', () => {
    const baseEvent = {
      date: '2024-02-29',
      repeat: { type: 'yearly', interval: 1, endDate: '2027-02-28' },
    };
    const generatedEvents = generateRepeatEvents(baseEvent);

    // 2024-02-29만 생성되어야 함 (2025, 2026은 평년이므로 건너뛰기)
    expect(generatedEvents).toHaveLength(1);
    expect(generatedEvents[0].date).toBe('2024-02-29');
  });
});
```

#### 🟢 Green: 기존 dateUtils 패턴 확장

```typescript
// src/utils/repeatUtils.ts (신규 생성)
export const generateRepeatEvents = (baseEvent: Event): Event[] => {
  // 기존 dateUtils.ts의 날짜 계산 로직 활용
  // 특수 조건 처리 로직 구현
};
```

#### 🔄 Refactor: 성능 최적화 및 에러 처리

---

## 데이터 구조 확장

### TDD 방식으로 타입 확장

```typescript
// 🔴 Red: 예외 처리 테스트 먼저 작성
it('반복 일정에서 특정 날짜를 예외로 처리할 수 있다', () => {
  const repeatEvent = {
    repeat: {
      type: 'daily',
      interval: 1,
      exceptions: ['2025-10-16'],
    },
  };
  // 예외 날짜는 반복 시리즈에서 제외되어야 함
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

## TDD 기반 구현 로드맵

### Phase 1: 기본 UI 활성화 (Red-Green-Refactor)

1. **Red**: 반복 설정 UI 테스트 작성
2. **Green**: App.tsx 주석 해제로 최소 구현
3. **Refactor**: UI 컴포넌트 분리 및 정리

### Phase 2: 반복 로직 구현 (기존 TDD 패턴 확장)

1. 기존 `useEventOperations.spec.ts` 패턴 활용
2. 기존 `dateUtils.spec.ts` 패턴 확장
3. 기존 `eventOverlap.spec.ts` 패턴 활용

### Phase 3: 통합 테스트 (기존 integration.spec.tsx 확장)

1. 기존 `medium.integration.spec.tsx` 패턴 확장
2. 사용자 여정 중심 테스트 추가

### Phase 4: 엣지 케이스 (기존 hard 테스트 패턴)

1. 기존 `hard.useEventOperations-edge-cases.spec.ts` 패턴 활용
2. 31일, 윤년, 예외 처리 등

---

## 기존 TDD 구조와의 완벽한 연계

**implemented-features-analysis.md에서 확인된 TDD 패턴들을 완전히 활용:**

### 1. 테스트 우선 원칙 유지

- 모든 새 기능은 실패 테스트부터 시작
- 기존 테스트 파일 구조와 일관성 유지

### 2. 사용자 여정 중심 설계

- 기존의 "사용자 일정 관리 여정" 패턴 확장
- "사용자 반복 일정 관리 여정" 추가

### 3. 계층별 테스트 전략

- **Unit**: 유틸리티 함수 (repeatUtils, dateValidation)
- **Integration**: 사용자 상호작용 (반복 일정 생성, 수정, 삭제)
- **E2E**: 전체 반복 일정 워크플로우

### 4. 기존 코드 재사용 극대화

- 타입 시스템: 이미 완성됨
- 상태 관리: 이미 완성됨
- 테스트 유틸리티: 기존 것 활용

**이 접근법으로 기존 TDD 구조를 손상시키지 않으면서 새 기능을 안정적으로 추가할 수 있습니다.**

---

이 분석을 바탕으로 구현을 진행하시겠습니까, 아니면 특정 부분에 대해 더 자세한 분석이 필요하신가요?

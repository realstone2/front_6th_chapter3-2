# 누락된 테스트 케이스 분석

## 개요

`implemented-features-analysis.md`를 TDD 관점으로 재작성한 후, 기존 테스트 코드와 비교 분석하여 **누락된 테스트 케이스들**을 식별했습니다. 이 문서는 Red-Green-Refactor 사이클에서 명시되었지만 실제로 구현되지 않은 테스트들을 정리합니다.

## 분석 기준

- ✅ **구현됨**: 테스트 파일에 해당 케이스가 존재
- ❌ **누락됨**: 문서에서 명시했지만 테스트가 없음
- ⚠️ **부분 구현**: 일부만 테스트되고 핵심 시나리오 누락

---

## 1. 폼 검증 테스트 (High Priority)

### 1.1 필수 필드 검증

**현재 상태**: ❌ **누락됨**
**문서 위치**: "사용자 일정 관리 여정 > 새 일정 생성 > Red 단계"

```typescript
// 추가 필요한 테스트: src/__tests__/hooks/medium.useEventForm.spec.ts (신규 파일)
describe('useEventForm 필수 필드 검증', () => {
  it('제목이 비어있으면 저장이 차단되고 에러 메시지가 표시된다', async () => {
    // Red: 제목 없이 저장 시도 시 차단되는지 검증
    const { result } = renderHook(() => useEventForm());

    // 제목을 비운 상태에서 저장 시도
    act(() => {
      result.current.setTitle('');
      result.current.setDate('2025-10-15');
      result.current.handleStartTimeChange({ target: { value: '10:00' } });
      result.current.handleEndTimeChange({ target: { value: '11:00' } });
    });

    // 폼 검증 결과 확인
    expect(result.current.isFormValid).toBe(false);
    expect(result.current.validationErrors.title).toBe('제목을 입력해주세요.');
  });

  it('날짜가 비어있으면 저장이 차단된다', () => {
    // Red: 날짜 없이 저장 시도 시 차단 검증
  });

  it('시작 시간이 비어있으면 저장이 차단된다', () => {
    // Red: 시작 시간 없이 저장 시도 시 차단 검증
  });

  it('종료 시간이 비어있으면 저장이 차단된다', () => {
    // Red: 종료 시간 없이 저장 시도 시 차단 검증
  });
});
```

**구현해야 할 기능**:

- `useEventForm`에 `isFormValid` 계산 로직 추가
- `validationErrors` 상태 관리
- App.tsx에서 저장 버튼 비활성화 로직

### 1.2 실시간 폼 검증

**현재 상태**: ⚠️ **부분 구현** (시간 검증만 있음)

```typescript
// 추가 필요한 테스트
it('필수 필드 입력 시 실시간으로 에러가 해제된다', () => {
  // Red: 에러 상태에서 올바른 값 입력 시 에러 해제 검증
});

it('모든 필수 필드가 채워지면 저장 버튼이 활성화된다', () => {
  // Red: 폼 완성 시 저장 버튼 활성화 검증
});
```

---

## 2. 편집 모드 테스트 (High Priority)

### 2.1 편집 시 폼 데이터 로딩

**현재 상태**: ❌ **누락됨**
**문서 위치**: "사용자 일정 관리 여정 > 일정 수정 > Red 단계"

```typescript
// 추가 필요한 테스트: src/__tests__/hooks/medium.useEventForm.spec.ts
describe('useEventForm 편집 모드', () => {
  it('editEvent 호출 시 기존 일정 데이터가 폼에 올바르게 로드된다', () => {
    // Red: 편집 버튼 클릭 시 폼 필드들이 기존 데이터로 채워지는지 검증
    const { result } = renderHook(() => useEventForm());
    const existingEvent: Event = {
      id: '1',
      title: '기존 회의',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 설명',
      location: '회의실 A',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };

    act(() => {
      result.current.editEvent(existingEvent);
    });

    expect(result.current.title).toBe('기존 회의');
    expect(result.current.date).toBe('2025-10-15');
    expect(result.current.startTime).toBe('09:00');
    expect(result.current.endTime).toBe('10:00');
    expect(result.current.description).toBe('기존 설명');
    expect(result.current.location).toBe('회의실 A');
    expect(result.current.category).toBe('업무');
    expect(result.current.notificationTime).toBe(10);
    expect(result.current.editingEvent).toEqual(existingEvent);
  });

  it('편집 완료 후 폼이 초기화된다', () => {
    // Red: 편집 완료 시 폼 상태 초기화 검증
  });

  it('편집 취소 시 폼이 초기화된다', () => {
    // Red: 편집 취소 시 폼 상태 초기화 검증
  });
});
```

### 2.2 편집 모드 UI 테스트

**현재 상태**: ❌ **누락됨**

```typescript
// 추가 필요한 테스트: src/__tests__/medium.integration.spec.tsx
it('편집 버튼 클릭 시 폼 제목이 "일정 수정"으로 변경된다', async () => {
  // Red: 편집 모드 진입 시 UI 변경 검증
});

it('편집 모드에서 저장 버튼 텍스트가 "일정 수정"으로 표시된다', () => {
  // Red: 편집 모드 UI 상태 검증
});
```

---

## 3. 카테고리 관리 테스트 (High Priority)

### 3.1 카테고리 기본값 및 저장

**현재 상태**: ❌ **누락됨**
**문서 위치**: "사용자 일정 분류 여정 > 카테고리 선택"

```typescript
// 추가 필요한 테스트: src/__tests__/hooks/easy.useEventForm.spec.ts (신규 파일)
describe('useEventForm 카테고리 관리', () => {
  it('새 일정 생성 시 카테고리 기본값이 "업무"로 설정된다', () => {
    // Red: 기본 카테고리 값 테스트
    const { result } = renderHook(() => useEventForm());

    expect(result.current.category).toBe('업무');
  });

  it('카테고리 변경 시 상태가 올바르게 업데이트된다', () => {
    // Red: 카테고리 선택 변경 테스트
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setCategory('개인');
    });

    expect(result.current.category).toBe('개인');
  });
});
```

### 3.2 카테고리 저장 및 표시

**현재 상태**: ⚠️ **부분 구현** (integration 테스트에 일부 있음)

```typescript
// 추가 필요한 테스트: src/__tests__/medium.integration.spec.tsx
it('모든 카테고리 옵션이 올바르게 표시된다', async () => {
  // Red: 카테고리 Select의 모든 옵션 확인
  const { user } = setup(<App />);

  const categorySelect = screen.getByLabelText('카테고리');
  await user.click(categorySelect);

  expect(screen.getByRole('option', { name: '업무-option' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: '개인-option' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: '가족-option' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: '기타-option' })).toBeInTheDocument();
});

it('카테고리별로 일정을 필터링할 수 있다', () => {
  // Red: 카테고리 필터링 기능 테스트 (향후 기능)
});
```

---

## 4. 달력 네비게이션 테스트 (Medium Priority)

### 4.1 월별/주별 네비게이션

**현재 상태**: ❌ **누락됨**
**문서 위치**: "사용자 달력 탐색 여정"

```typescript
// 추가 필요한 테스트: src/__tests__/hooks/medium.useCalendarView.spec.ts (신규 파일)
describe('useCalendarView 네비게이션', () => {
  it('이전 버튼 클릭 시 월별 뷰에서 이전 달로 이동한다', () => {
    // Red: 월별 네비게이션 테스트
    const { result } = renderHook(() => useCalendarView());

    // 2025년 10월에서 시작
    expect(result.current.currentDate.getMonth()).toBe(9); // 0-based

    act(() => {
      result.current.navigate('prev');
    });

    expect(result.current.currentDate.getMonth()).toBe(8); // 9월
  });

  it('다음 버튼 클릭 시 월별 뷰에서 다음 달로 이동한다', () => {
    // Red: 월별 네비게이션 테스트
  });

  it('이전 버튼 클릭 시 주별 뷰에서 이전 주로 이동한다', () => {
    // Red: 주별 네비게이션 테스트
    const { result } = renderHook(() => useCalendarView());

    act(() => {
      result.current.setView('week');
    });

    const initialWeekStart = result.current.currentDate.getDate();

    act(() => {
      result.current.navigate('prev');
    });

    // 일주일 전으로 이동 확인
    expect(result.current.currentDate.getDate()).toBe(initialWeekStart - 7);
  });

  it('다음 버튼 클릭 시 주별 뷰에서 다음 주로 이동한다', () => {
    // Red: 주별 네비게이션 테스트
  });
});
```

### 4.2 뷰 전환 테스트 강화

**현재 상태**: ⚠️ **부분 구현** (기본 전환만 테스트됨)

```typescript
// 추가 필요한 테스트
it('뷰 전환 시 네비게이션 상태가 유지된다', () => {
  // Red: Week <-> Month 전환 시 날짜 상태 유지 테스트
});

it('뷰 전환 시 공휴일 정보가 올바르게 업데이트된다', () => {
  // Red: 뷰 전환 시 공휴일 데이터 동기화 테스트
});
```

---

## 5. 알림 설정 테스트 (Medium Priority)

### 5.1 알림 시간 설정 저장

**현재 상태**: ❌ **누락됨** (알림 발생은 테스트되지만 설정 저장은 없음)
**문서 위치**: "사용자 알림 설정 여정"

```typescript
// 추가 필요한 테스트: src/__tests__/hooks/easy.useEventForm.spec.ts
describe('useEventForm 알림 설정', () => {
  it('알림 시간 기본값이 10분으로 설정된다', () => {
    // Red: 기본 알림 시간 확인
    const { result } = renderHook(() => useEventForm());

    expect(result.current.notificationTime).toBe(10);
  });

  it('선택한 알림 시간이 올바르게 저장된다', () => {
    // Red: 알림 시간 변경 및 저장 테스트
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setNotificationTime(60); // 1시간 전
    });

    expect(result.current.notificationTime).toBe(60);
  });
});
```

### 5.2 알림 옵션 UI 테스트

**현재 상태**: ❌ **누락됨**

```typescript
// 추가 필요한 테스트: src/__tests__/medium.integration.spec.tsx
it('모든 알림 시간 옵션이 올바르게 표시된다', async () => {
  // Red: 알림 Select의 모든 옵션 확인
  const { user } = setup(<App />);

  const notificationSelect = screen.getByLabelText('알림 설정');
  await user.click(notificationSelect);

  expect(screen.getByRole('option', { name: '1분 전' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: '10분 전' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: '1시간 전' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: '2시간 전' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: '1일 전' })).toBeInTheDocument();
});
```

---

## 6. 검색 기능 강화 테스트 (Medium Priority)

### 6.1 검색 엣지 케이스

**현재 상태**: ⚠️ **부분 구현** (기본 검색만 테스트됨)

```typescript
// 추가 필요한 테스트: src/__tests__/hooks/easy.useSearch.spec.ts
describe('useSearch 엣지 케이스', () => {
  it('특수 문자가 포함된 검색어로 검색할 수 있다', () => {
    // Red: 특수 문자 검색 테스트
  });

  it('공백만 있는 검색어는 모든 결과를 반환한다', () => {
    // Red: 공백 검색어 처리 테스트
  });

  it('매우 긴 검색어도 올바르게 처리된다', () => {
    // Red: 긴 검색어 처리 테스트
  });

  it('검색어 변경 시 이전 검색 결과가 즉시 초기화된다', () => {
    // Red: 검색 상태 초기화 테스트
  });
});
```

### 6.2 검색 성능 테스트

**현재 상태**: ❌ **누락됨**

```typescript
// 추가 필요한 테스트
it('대량의 일정에서도 검색 성능이 유지된다', () => {
  // Red: 1000개 이상 일정에서 검색 성능 테스트
});

it('연속된 검색어 입력 시 마지막 검색만 적용된다', () => {
  // Red: 디바운스 기능 테스트 (향후 구현)
});
```

---

## 7. 에러 처리 테스트 강화 (Medium Priority)

### 7.1 네트워크 에러 세분화

**현재 상태**: ⚠️ **부분 구현** (일부 에러만 테스트됨)

```typescript
// 추가 필요한 테스트: src/__tests__/hooks/medium.useEventOperations.spec.ts
describe('useEventOperations 에러 처리 강화', () => {
  it('네트워크 연결 끊김 시 적절한 에러 메시지가 표시된다', async () => {
    // Red: 네트워크 오프라인 상태 테스트
  });

  it('서버 타임아웃 시 재시도 안내 메시지가 표시된다', async () => {
    // Red: 타임아웃 에러 처리 테스트
  });

  it('인증 실패 시 로그인 안내 메시지가 표시된다', async () => {
    // Red: 401 에러 처리 테스트
  });

  it('권한 부족 시 적절한 안내 메시지가 표시된다', async () => {
    // Red: 403 에러 처리 테스트
  });
});
```

---

## 8. 접근성 테스트 (Low Priority)

### 8.1 키보드 네비게이션

**현재 상태**: ❌ **누락됨**

```typescript
// 추가 필요한 테스트: src/__tests__/accessibility.spec.tsx (신규 파일)
describe('접근성 테스트', () => {
  it('Tab 키로 모든 폼 요소를 순서대로 접근할 수 있다', () => {
    // Red: 키보드 네비게이션 테스트
  });

  it('Enter 키로 저장 버튼을 실행할 수 있다', () => {
    // Red: 키보드 저장 테스트
  });

  it('스크린 리더가 인식할 수 있는 적절한 aria-label이 설정되어 있다', () => {
    // Red: 스크린 리더 접근성 테스트
  });
});
```

---

## 우선순위별 구현 계획

### 🔥 **1단계: High Priority (핵심 기능 완성)**

1. **폼 검증 테스트** - useEventForm 훅 테스트 파일 신규 생성
2. **편집 모드 테스트** - 기존 데이터 로딩 및 UI 상태 테스트
3. **카테고리 관리 테스트** - 기본값, 저장, 표시 테스트

### 🟡 **2단계: Medium Priority (사용성 향상)**

4. **달력 네비게이션 테스트** - 월별/주별 이동 기능
5. **알림 설정 테스트** - 알림 시간 저장 및 UI
6. **검색 강화 테스트** - 엣지 케이스 및 성능
7. **에러 처리 강화** - 다양한 네트워크 에러 상황

### 🟢 **3단계: Low Priority (품질 향상)**

8. **접근성 테스트** - 키보드 네비게이션, 스크린 리더
9. **성능 테스트** - 대량 데이터 처리
10. **브라우저 호환성 테스트** - 다양한 환경에서의 동작

## 예상 작업량

- **신규 테스트 파일**: 4개

  - `src/__tests__/hooks/medium.useEventForm.spec.ts`
  - `src/__tests__/hooks/easy.useEventForm.spec.ts`
  - `src/__tests__/hooks/medium.useCalendarView.spec.ts`
  - `src/__tests__/accessibility.spec.tsx`

- **기존 파일 확장**: 3개

  - `src/__tests__/hooks/medium.useEventOperations.spec.ts`
  - `src/__tests__/hooks/easy.useSearch.spec.ts`
  - `src/__tests__/medium.integration.spec.tsx`

- **예상 추가 테스트 케이스**: 약 30-40개

## TDD 사이클 완성도 향상

이 테스트들을 추가하면:

- **Red 단계**: 실패 시나리오 완전 커버
- **Green 단계**: 최소 구현 검증 강화
- **Refactor 단계**: 안전한 리팩토링을 위한 테스트 기반 마련

결과적으로 **TDD 준수도가 86%에서 95% 이상**으로 향상될 것으로 예상됩니다.

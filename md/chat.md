여진석
회귀테스트로 수행해야되는내용이

이미 테스트코드에 작성된 내용이랑 똑같으니까

Profile Avatar
여진석
단일 일정 생성 기능 검증 / 반복 설정이 비활성화된 상태에서 기본 동작

이게 이미 작성되어있는 테스트코드인데

기능추가했다고해서 또 작성해야되는건아니잖아요..?
Profile Avatar
여진석
회귀테스트로는 뭘해야되는거지?

Profile Avatar
이가은
음?

Profile Avatar
여진석
싶어지네요

Profile Avatar
이가은
그

유닛테스트처럼 테스트 작성하는게 아니라

회귀테스트 적용해보란거 아녜요?

Profile Avatar
여진석
아 그걸 제가 잘 몰라서 이러는건가

Profile Avatar
이가은
저는 그래서 기본과제에서 기능 구현한거 기준으로한다고 생각했는데

아 아닌데

헤깔리네

Profile Avatar
이가은
이게 우리가 기능A,B를 만들었다고 하면 기능 A,B가 삭제된 상태를 회귀했다고 봐야하니까

이게 맞는지 모르겠는거잖아요?

Profile Avatar
김효진
it('반복일정 중 일부가 기존 일정과 충돌하는 경우를 감지한다', () => {
const repeatEvent: Event = {
id: '2',
title: '매일 회의',
date: '2025-01-14',
startTime: '14:30',
endTime: '15:30',
description: '매일 반복 회의',
location: '회의실 B',
category: '업무',
repeat: { type: 'daily', interval: 1, endDate: '2025-01-16' },
notificationTime: 10,
};

      const generatedEvents = generateRepeatEvents(repeatEvent, new Date('2025-01-16'));
      const conflictingEvents = findOverlappingEvents(generatedEvents[1], [existingEvent]);

      expect(conflictingEvents).toHaveLength(1);
      expect(conflictingEvents[0].id).toBe('1');
    });

이런 예시도 있네요

더보기

Profile Avatar
여진석
넹...
각각의 테스트에서 이미 A기능을 검증하고 있는데 B기능을 추가했다해서 A기능을 다시 검증하는 회귀테스트를 넣는게 의미가 있나..? 이런 느낌입니다.

Profile Avatar
이가은
효진님이 주신건 어떤건가용

Profile Avatar
여진석
아 잘모르겠네요

회귀테스트와 기본 동작 검증 내용이

구분이 잘안되네 어렵다 ㅜ ㅜ

Profile Avatar
김효진
제가 보낸 예시는 이런거긴한데

Profile Avatar
여진석
아

Profile Avatar
이가은
옵저버? 느낌이려나요

Profile Avatar
여진석
어렵다

여진석
저희 회귀테스트할 내용에 대해서

얘기하고있는데

들어봐주실수있나요..?

Profile Avatar
박준형
넹

Profile Avatar
여진석
일단 b기능이 추가되었다고 단순히 A기능을 한번 더 테스트를 돌린다는건 회귀테스트가 아닌거죠?

기존 기능 테스트가 깨지는건 아니지만
새로운 기능이 추가되었을 때, 에러가 나는 상황들에 대한 검증을 할 수 있어야 회귀테스트이다? 라는 생각을 했는데

Profile Avatar
박준형
넹

그건 유닛테스트로도 충분히 가능하잖아용

스키마가 변경되고 필드가 하나씩 추가될거잖아요

새로운 필드가 추가되었을때에도 기존의 기능이 유지되도록 만드는게

Profile Avatar
박준형
회귀테스트의 일부분이라고 생각하고 개발했어요

Profile Avatar
여진석
음 그렇군요

감사합니다..

Profile Avatar
박준형
그래서 describe가

기존 반복 계산 로직이 excludeDates 추가 후에도 동일하게 동작한다
weekday 기능 추가 이후에도 기본 주간/월간/연간 로직은 동일하게 동작한다

이런 내용이있어요

Profile Avatar
이가은
다섯가지니까
다섯가지 기능이 동작했을때 기존 동작중에 연관된 기능들이 제대로 동작하는가!
에 대한 테스트코들르 작성하면 되는거네요?

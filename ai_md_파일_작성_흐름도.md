## Kent beck Agent 구성

1. bmad qa agent 구조 분석 md 파일 생성
2. 퍼플렉시티로 kent beck 프롬프트.md 구성
3. kent beck 프롬프트 md파일 + bmad qa agent 구조 분석 md 파일 => kent beck agent 설계 md 파일 구성
4. 설계 md 파일에 코드 수정 절대 금지 등의 rule 커스텀으로 추가 반영하여 md파일 수정
5. md파일 기반으로 agent 생성

## Test 코드 점검

1. bmad analyst에게 현재 프로젝트 분석 및 기본기능 구현 내용 정리 md 파일 생성
2. 분석된 md파일 기반으로 kent beck agent에게 test 코드의 흐름과 app.tsx에 구현된 내용을 분석해서 정리 및 개선하여 md파일로 생성
3. 해당 md파일을 기반으로 전체 앱 테스트코드 개선
4. 분석해서 정리된 md파일과 추가\_요구사항.md 파일을 이용하여 TDD 개발 어떻게할지 설계
5. 지금까지 작성된 md파일들을 활용하여 테스트 작성 시작
   <img width="517" height="421" alt="image" src="https://github.com/user-attachments/assets/d6b04258-3bee-44a4-8509-512293f9b907" />
6. 작성 완료된 테스트 코드들을 간단한것 부터 하나씩 작업 진행

## 1번 기능 작업 후기

테스트코드 완성되고나서 한번에 green 단계로 진입시켰더니 먹통이 되어서 잘 작동하지 않았다.
테스트코드 하나씩 분리하면서 간단한 내용부터 요구했을 때 바로 잘 작성하였다.

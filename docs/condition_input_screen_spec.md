# 조건입력 화면 상세 스펙 (MVP v0.1)

## 1. 화면 목적
- 프로젝트별 자격/달성/보상 조건을 구조화 데이터로 등록한다.
- 관리자가 자연어가 아닌 선택형 입력으로 규칙을 만들고 검증한다.

## 2. 섹션 구성
- 기본정보
- 적용대상
- 조건 빌더
- 결과 설정
- 조건 미리보기
- 검증 결과

## 3. 필드 정의
### 기본정보
- `projectId` (필수)
- `ruleName` (필수, 3~100자)
- `ruleType` (필수: 자격조건/달성조건/보상조건)
- `effectiveFrom`, `effectiveTo` (필수, 시작<=종료)
- `enabled` (필수, boolean)

### 적용대상
- `targetType` (필수: 역할/개인/조직)
- `targetRole` (역할 선택 시 필수)
- `orgScope` (필수: 본인/직접하위/전체하위/팀전체)
- `allowDuplicate` (필수, boolean)

### 조건 빌더
- `metric` (필수: 하위 거점 수, 판매수량, 판매금액 등)
- `aggregationScope` (필수)
- `aggregationPeriod` (필수: 일/주/월/프로젝트전체)
- `operator` (필수: >=, <=, =, >, <, BETWEEN)
- `value1` (필수)
- `value2` (`BETWEEN`일 때 필수)
- `requireApproval` (필수, boolean)
- `excludeCanceled` (필수, boolean)
- `maintainPeriod` (선택)

### 결과 설정
- `resultType` (필수: 보상예정생성/자격부여/자격유지/지급제한)
- `rewardType` (보상예정생성 시 필수: 정액/비율/혼합)
- `fixedAmount` (`정액/혼합` 시 필수)
- `ratePercent` (`비율/혼합` 시 필수)
- `baseAmountMetric` (`비율/혼합` 시 필수)
- `payCycle` (필수: 1회/월/분기)
- `payCount` (필수, 1 이상)
- `maxAmount` (선택)

## 4. 기본 검증 규칙
- 필수값 누락 금지
- 날짜 역전 금지
- `BETWEEN`: `value1 <= value2`
- 보상유형별 필수 입력 강제
- 금액/비율/횟수 음수 금지

## 5. 저장 페이로드(초안)
```json
{
  "projectId": "PROJ-2026-001",
  "ruleName": "PM 거점 확보 보상",
  "ruleType": "reward",
  "effectiveFrom": "2026-05-01",
  "effectiveTo": "2026-07-31",
  "enabled": true,
  "target": {
    "targetType": "role",
    "targetRole": "PM",
    "orgScope": "direct_lower",
    "allowDuplicate": false
  },
  "condition": {
    "metric": "lower_base_count",
    "aggregationScope": "direct_lower",
    "aggregationPeriod": "project",
    "operator": ">=",
    "value1": 12,
    "value2": null,
    "requireApproval": true,
    "excludeCanceled": true,
    "maintainPeriod": null
  },
  "result": {
    "resultType": "reward_scheduled",
    "rewardType": "fixed",
    "fixedAmount": 2000000,
    "ratePercent": null,
    "baseAmountMetric": null,
    "payCycle": "month",
    "payCount": 3,
    "maxAmount": 6000000
  }
}
```

# biz_consulting

사업 컨설팅 프로젝트입니다.

---

# 바른경영 · 사업장 경영진단

Next.js App Router, TypeScript, Tailwind CSS v4로 만든 모바일 우선 경영진단 웹앱입니다.

## 실행

Node.js 24 / npm 11에서 검증했습니다.

```bash
npm ci --cache /tmp/biz-npm-cache
npm run dev
```

프로덕션 실행은 `npm run build` 후 `npm start`를 사용합니다.

## 화면

- `/` 또는 `/diagnosis`: 사업장 정보 → 월 매출·비용 → 운영 현황의 3단계 입력
- `/results`: 가장 최근 진단 결과, `?id=...`로 개별 결과 조회
- `/admin`: 진단 건수·평균 점수·집중 관리 건수, 검색·업종 필터, JSON 내보내기

## 구조

```text
src/
  app/                    # 페이지, 전역 스타일, 루트 레이아웃
  components/
    ui/                   # Button, Card, Badge, Field, ScoreBar, Status
    layout/               # 데스크톱 사이드바와 모바일 내비게이션
    diagnosis/            # 입력 폼, 진단 리포트
    admin/                # 대시보드
  lib/
    diagnosis.ts          # 입력 검증 및 순수 진단 함수
    storage.ts            # 버전별 localStorage 저장·조회
  types/diagnosis.ts      # 입력, 결과, 저장 레코드 타입
 tests/
  diagnosis.test.ts       # 계산·입력 검증 단위 테스트
  e2e/workflow.spec.ts    # 실제 브라우저 사용자 흐름
```

## 진단 기준

모든 금액은 월평균, 만원 단위입니다. 추정 영업이익 = 매출 - (원재료·매입비 + 인건비 + 임차료 + 기타 운영비).

- 수익성: `40 + 영업이익률(%) × 2`
- 비용 관리: `100 - (원재료비 + 인건비) / 매출 × 70 - 임차료 / 매출 × 60`
- 고객 유지: 재방문 고객 비율(%)
- 디지털 운영: 자가 평가(1~5) × 20

각 점수는 정수로 반올림해 0~100 범위로 제한합니다. 종합 점수는 네 점수의 동일 가중 평균을 반올림합니다. 75점 이상은 양호, 50점 이상은 개선 필요, 50점 미만은 집중 관리입니다. 75점 미만 영역은 낮은 점수 순서로 개선 제안을 표시합니다.

이 기준은 데모용 규칙이며 업종별 통계나 공식 평가 모형이 아닙니다. 세금·감가상각·대표자 인건비 등 입력하지 않은 비용은 반영하지 않습니다.

## 데이터와 한계

진단은 `bareun-diagnoses-v1` 키로 현재 브라우저의 localStorage에만 저장됩니다. 서버로 전송하거나 외부 API를 호출하지 않습니다. 다른 브라우저·기기와 공유되지 않으며 저장 공간을 지우면 삭제됩니다. 관리자 화면에는 인증이 없고, 같은 브라우저의 기록을 보여주는 데모입니다. 실제 운영에는 사용자 인증, 권한 검사, 서버 데이터베이스, 개인정보 처리 설계가 필요합니다. 공용 기기에는 실제 고객 정보를 입력하지 마세요.

## 검증

```bash
npm test
npm run typecheck
npm run build
# 환경에 Chromium이 설치된 경우
CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e
# 일반 로컬 환경에서는 브라우저 설치 후 실행
npx playwright install chromium
npm run test:e2e
```

E2E 테스트는 3000번 서버가 없으면 자동으로 개발 서버를 시작합니다. 설치된 시스템 Chromium은 `CHROMIUM_PATH`로 지정할 수 있습니다.

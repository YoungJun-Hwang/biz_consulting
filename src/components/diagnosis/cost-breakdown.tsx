import { Card, money } from '@/components/ui';
import { getFixedCostFields } from '@/lib/fixed-costs';
import type { DiagnosisInput, DiagnosisResult } from '@/types/diagnosis';

export function CostBreakdown({ input, result }: { input: DiagnosisInput; result: DiagnosisResult }) {
  const details = getFixedCostFields(input.industry).filter(field => (input.fixedCosts?.[field.id] ?? 0) > 0);
  return <section aria-label="월 비용 상세 내역" className="cost-breakdown">
    <Card>
      <div className="card-title"><h2>월 비용 상세 내역</h2><span>월평균 · 만원</span></div>
      <p className="cost-entry-note">입력하신 비용을 기준으로 계산했습니다. 고정비 합계에는 임차료와 아래 정기 비용만 포함됩니다.</p>
      {input.fixedCosts === undefined && <p className="legacy-cost-note">이 기록은 고정비 세부 입력 전 작성되었습니다. 고정비 합계에는 임차료만 표시하며, 기존 기타 운영비에 포함된 고정비는 별도로 분류하지 않았습니다.</p>}
      <dl className="cost-breakdown-list">
        <div><dt>원재료·매입비</dt><dd>{money(input.materials)}</dd></div>
        <div><dt>인건비</dt><dd>{money(input.labor)}</dd></div>
        <div className="cost-subtotal"><dt>월 고정비 합계 <small>임차료 포함</small></dt><dd>{money(result.fixedCosts)}</dd></div>
        <div className="cost-detail-row"><dt>임차료</dt><dd>{money(input.rent)}</dd></div>
        {details.map(field => <div className="cost-detail-row" key={field.id}><dt>{field.label}</dt><dd>{money(input.fixedCosts![field.id])}</dd></div>)}
        <div><dt>{input.fixedCosts === undefined ? '기타 운영비 (기존 입력)' : '그 외 기타 운영비'}</dt><dd>{money(input.other)}</dd></div>
        <div className="cost-grand-total"><dt>월 총 운영비 <small>고정비 중복 합산 없음</small></dt><dd>{money(result.costs)}</dd></div>
      </dl>
    </Card>
  </section>;
}

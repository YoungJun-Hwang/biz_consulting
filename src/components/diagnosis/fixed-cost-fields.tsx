'use client';
import { COMMON_FIXED_COSTS, getIndustryFixedCostFields, getFixedCostTotal, OTHER_FIXED_COST, type FixedCostField } from '@/lib/fixed-costs';
import type { DiagnosisErrors } from '@/types/diagnosis';
import { Field, money } from '@/components/ui';

type Props = {
  industry: string;
  costs: Record<string, number>;
  rent: number;
  errors: DiagnosisErrors;
  onChange: (id: string, amount: number) => void;
};
export function FixedCostFields({ industry, costs, rent, errors, onChange }: Props) {
  const industryFields = getIndustryFixedCostFields(industry);
  const total = rent + getFixedCostTotal(industry, costs);
  function field(item: FixedCostField) {
    return <div key={item.id} className="fixed-cost-field">
      <Field name={`fixedCosts.${item.id}`} label={item.label} type="number" min={0} step="any"
        value={Number.isNaN(costs[item.id]) ? '' : (costs[item.id] ?? 0)} suffix="만원"
        onChange={event => onChange(item.id, event.target.value === '' ? NaN : Number(event.target.value))}
        error={errors[`fixedCosts.${item.id}`]} />
      {item.hint && <p className="cost-field-hint">{item.hint}</p>}
    </div>;
  }
  return <section className="fixed-cost-fields" aria-label="고정비 세부 입력">
    <div className="fixed-cost-heading"><div><h4>매월 나가는 고정비</h4><p>각 항목의 월평균 금액을 입력하세요. 이용하지 않는 서비스는 0으로 두세요.</p></div><span>{industry}</span></div>
    <p className="cost-entry-note">묶음 요금은 대표 항목에 한 번만 입력하세요. 연간 계약 비용은 12로 나누어 입력하세요. 임차료는 위 입력값을 합계에 포함하므로 다시 입력하지 않습니다.</p>
    <details className="cost-group" open><summary>공통 운영 고정비 <span>{COMMON_FIXED_COSTS.length}개 항목</span></summary><div className="cost-field-grid">{COMMON_FIXED_COSTS.map(field)}</div></details>
    {industryFields.length > 0 && <details className="cost-group" open><summary>{industry} 맞춤 고정비 <span>{industryFields.length}개 항목</span></summary><div className="cost-field-grid">{industryFields.map(field)}</div></details>}
    <div className="cost-other">{field(OTHER_FIXED_COST)}</div>
    {errors.fixedCosts && <p className="field-error" role="alert">{errors.fixedCosts}</p>}
    <div className="fixed-cost-total" aria-live="polite"><span>월 고정비 합계 <small>임차료 포함 · 인건비 제외</small></span><strong>{Number.isFinite(total) ? money(total) : '입력 확인 필요'}<small> 만원</small></strong></div>
  </section>;
}

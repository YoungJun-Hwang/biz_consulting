export type FixedCostField = { id: string; label: string; hint?: string };
export const INDUSTRIES = ['음식점', '카페·베이커리', '미용실', '도소매업', '서비스업', '제조업', '기타'];
export const COMMON_FIXED_COSTS: FixedCostField[] = [
  { id: 'internet', label: '인터넷 회선' },
  { id: 'phone', label: '전화 요금' },
  { id: 'tv', label: 'TV 수신·구독료' },
  { id: 'cctv', label: 'CCTV·보안 서비스' },
  { id: 'tax', label: '세무기장' },
  { id: 'managementFee', label: '건물 관리비', hint: '임차료·공과금에 포함한 금액은 제외' },
  { id: 'insurance', label: '사업장 보험료', hint: '연납 보험료는 12개월로 나누어 입력' },
  { id: 'cleaning', label: '정기 청소비' },
];
const PAYMENT_FIELDS: FixedCostField[] = [
  { id: 'cardTerminal', label: '카드단말기 임대료', hint: '매출에 비례하는 카드 결제 수수료는 제외' },
  { id: 'pos', label: 'POS 이용료', hint: '단말기 임대료에 포함된 경우 중복 입력하지 마세요' },
];
const FOOD_FIELDS: FixedCostField[] = [
  ...PAYMENT_FIELDS,
  { id: 'kiosk', label: '키오스크·테이블오더 이용료' },
  { id: 'waterPurifier', label: '정수기·정기 렌탈료' },
  { id: 'pestControl', label: '정기 방역·위생관리비' },
  { id: 'kitchenMaintenance', label: '주방 장비 정기 유지비' },
];
const INDUSTRY_FIXED_COSTS: Record<string, FixedCostField[]> = {
  '음식점': FOOD_FIELDS,
  '카페·베이커리': [...FOOD_FIELDS, { id: 'coffeeMachine', label: '커피머신·제빵 장비 렌탈료' }],
  '미용실': [
    ...PAYMENT_FIELDS,
    { id: 'customerManagement', label: '고객관리 프로그램' },
    { id: 'booking', label: '예약 프로그램', hint: '고객관리 프로그램에 포함된 경우 중복 입력하지 마세요' },
    { id: 'salonEquipment', label: '미용 장비 렌탈·정기 유지비' },
    { id: 'laundry', label: '수건·가운 정기 세탁비' },
  ],
  '도소매업': [
    ...PAYMENT_FIELDS,
    { id: 'inventory', label: '재고·판매관리 프로그램' },
    { id: 'storefront', label: '쇼핑몰·온라인 판매 서비스 월정액' },
    { id: 'warehouse', label: '창고 정기 이용료', hint: '임차료에 포함하지 않은 창고 비용' },
  ],
  '서비스업': [
    ...PAYMENT_FIELDS,
    { id: 'customerManagement', label: '고객관리 프로그램' },
    { id: 'booking', label: '예약 프로그램' },
    { id: 'workSoftware', label: '업무 프로그램 구독료' },
  ],
  '제조업': [
    { id: 'machinery', label: '생산 설비 리스·렌탈료' },
    { id: 'maintenance', label: '설비 정기 유지보수비' },
    { id: 'productionSoftware', label: '생산·재고관리 프로그램' },
    { id: 'safety', label: '정기 안전관리비' },
  ],
};
export function getIndustryFixedCostFields(industry: string): FixedCostField[] {
  return Object.hasOwn(INDUSTRY_FIXED_COSTS, industry) ? INDUSTRY_FIXED_COSTS[industry] : [];
}
export const OTHER_FIXED_COST: FixedCostField = { id: 'otherFixed', label: '기타 고정비', hint: '위 항목에 없는 월정액·정기 계약 비용만 입력' };
export function getFixedCostFields(industry: string): FixedCostField[] {
  return [...COMMON_FIXED_COSTS, ...getIndustryFixedCostFields(industry), OTHER_FIXED_COST];
}
export function retainApplicableFixedCosts(industry: string, costs: Record<string, number> = {}): Record<string, number> {
  const allowed = new Set(getFixedCostFields(industry).map(field => field.id));
  return Object.fromEntries(Object.entries(costs).filter(([id]) => allowed.has(id)));
}
export const roundAmount = (amount: number) => Math.round(amount * 10000) / 10000;
export function getFixedCostTotal(industry: string, costs: Record<string, number> = {}): number {
  return roundAmount(getFixedCostFields(industry).reduce((total, field) => total + (costs[field.id] ?? 0), 0));
}

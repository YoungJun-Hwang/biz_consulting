import type { DiagnosisInput, DiagnosisResult, Recommendation } from '../types/diagnosis';
export function validateInput(input: DiagnosisInput): Partial<Record<keyof DiagnosisInput, string>> {
 const errors:Partial<Record<keyof DiagnosisInput,string>>={};
 for(const key of ['name','industry','region'] as const) if(!input[key].trim()) errors[key]='필수 항목을 입력해 주세요.';
 for(const key of ['revenue','materials','labor','rent','other','employees','repeatCustomers','digital'] as const) {
  const value=input[key];
  if(!Number.isFinite(value)||value<0) errors[key]='0 이상의 숫자를 입력해 주세요.';
 }
 if(input.revenue<=0) errors.revenue='매출은 0보다 커야 합니다.';
 if(!Number.isInteger(input.employees)) errors.employees='인원은 정수로 입력해 주세요.';
 if(input.repeatCustomers>100) errors.repeatCustomers='0~100%로 입력해 주세요.';
 if(input.digital<1||input.digital>5||!Number.isInteger(input.digital)) errors.digital='1~5단계 중 선택해 주세요.';
 return errors;
}
const clamp=(value:number)=>Math.max(0,Math.min(100,Math.round(value)));
export function diagnose(input: DiagnosisInput): DiagnosisResult {
 if(Object.keys(validateInput(input)).length) throw new Error('유효하지 않은 진단 입력입니다.');
 const costs=input.materials+input.labor+input.rent+input.other;
 const profit=input.revenue-costs, margin=profit/input.revenue*100;
 const categories=[
  {label:'수익성',score:clamp(40+margin*2),description:'월 영업이익률을 기준으로 평가'},
  {label:'비용 관리',score:clamp(100-(input.materials+input.labor)/input.revenue*70-input.rent/input.revenue*60),description:'원재료·인건비·임차료의 매출 대비 비중'},
  {label:'고객 유지',score:clamp(input.repeatCustomers),description:'입력한 재방문 고객 비율'},
  {label:'디지털 운영',score:clamp(input.digital*20),description:'온라인 채널 활용 자가 평가'},
 ];
 const recommendations:Recommendation[]=categories.filter(c=>c.score<75).sort((a,b)=>a.score-b.score).map(c=>({title:`${c.label} 개선부터 시작하세요`,description:({수익성:'메뉴·상품별 이익을 확인하고 저수익 상품의 가격과 구성을 조정해 보세요.', '비용 관리':'최근 3개월의 비용을 비교하고 원재료 손실과 고정비 절감 항목을 점검하세요.', '고객 유지':'재방문 혜택과 구매 후 안내를 설계하고 단골 고객의 의견을 모아 보세요.', '디지털 운영':'지도 서비스의 영업정보를 최신화하고 온라인 고객 후기 응대부터 시작하세요.'} as Record<string,string>)[c.label],priority:c.score<50?'우선 실행':'개선 권장'}));
 if(!recommendations.length) recommendations.push({title:'현재의 강점을 이어가세요',description:'매월 같은 기준으로 진단하고 수익과 고객 지표의 변화를 기록하세요.',priority:'유지 관리'});
 return {score:Math.round(categories.reduce((sum,c)=>sum+c.score,0)/categories.length),profit,margin,costs,categories,recommendations};
}

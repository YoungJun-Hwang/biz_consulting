import { test } from 'node:test';
import assert from 'node:assert/strict';
import { diagnose, validateInput } from '../src/lib/diagnosis';
const input = { name: '온기 식당', industry: '음식점', region: '서울', employees: 3, revenue: 5000, materials: 1500, labor: 1000, rent: 500, other: 500, repeatCustomers: 60, digital: 4 };
test('매출에서 전체 비용을 차감하여 이익과 이익률을 계산한다', () => {
 const result = diagnose(input);
 assert.equal(result.profit, 1500); assert.equal(result.margin, 30);
 assert.ok(result.score >= 0 && result.score <= 100);
});
test('적자 사업장은 수익성 개선 제안을 받는다', () => {
 const result = diagnose({...input, revenue: 1000});
 assert.ok(result.margin < 0); assert.ok(result.recommendations.some(r => r.title.includes('수익')));
});
test('빈 사업장명, 매출 0, 음수 비용, 범위 초과값을 거부한다', () => {
 assert.ok(Object.keys(validateInput({...input, name:' ', revenue:0, rent:-1, digital:8, repeatCustomers:101})).length >= 5);
});
test('유효한 입력과 매출보다 큰 비용을 허용한다', () => {
 assert.deepEqual(validateInput(input), {});
 assert.deepEqual(validateInput({...input, materials:10000}), {});
});

test('음식점의 세부 고정비를 임차료와 분리해 합산하고 이익에 한 번만 반영한다', () => {
 const result = diagnose({...input, fixedCosts:{pos:5,cardTerminal:2,internet:3,tv:2,phone:1,cctv:4,tax:10}});
 assert.equal(result.fixedCosts,527);
 assert.equal(result.costs,3527);
 assert.equal(result.profit,1473);
});
test('미용실 고객관리·예약 프로그램 비용이 이익과 비용 관리 점수에 반영된다', () => {
 const base={...input, industry:'미용실'};
 const result=diagnose({...base,fixedCosts:{customerManagement:30,booking:20}});
 assert.equal(result.fixedCosts,550);
 assert.equal(result.profit,1450);
 assert.ok(result.categories[1].score<diagnose(base).categories[1].score);
});
test('세부 고정비가 없는 기존 진단의 금액과 점수를 유지한다', () => {
 const result=diagnose(input);
 assert.equal(result.fixedCosts,500);
 assert.equal(result.costs,3500);
 assert.equal(result.profit,1500);
 assert.equal(result.categories[1].score,59);
});
test('세부 고정비의 음수·NaN·무한대 및 잘못된 자료형을 거부한다', () => {
 for(const fixedCosts of [{pos:-1},{pos:NaN},{pos:Infinity},null,[],5]) {
  assert.ok(Object.keys(validateInput({...input,fixedCosts} as never)).some(key=>key.startsWith('fixedCosts')));
 }
});
test('다른 업종의 숨겨진 비용과 알 수 없는 항목을 거부해 누락·오합산을 방지한다', () => {
 for(const fixedCosts of [{customerManagement:10},{unknown:10}] as Record<string,number>[]) {
  assert.ok(Object.keys(validateInput({...input,fixedCosts})).includes('fixedCosts'));
 }
});

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

import type { DiagnosisInput, DiagnosisRecord } from '@/types/diagnosis';
import {validateInput} from './diagnosis';
const KEY='bareun-diagnoses-v1';
export function loadRecords():DiagnosisRecord[] {
 const raw=localStorage.getItem(KEY);
 if(!raw) return [];
 let data:unknown;
 try {data=JSON.parse(raw);} catch {throw new Error('저장된 진단 정보를 읽을 수 없습니다. 브라우저 저장 공간을 확인해 주세요.');}
 if(!Array.isArray(data)) throw new Error('저장된 진단 정보의 형식이 올바르지 않습니다.');
 return data.filter((r):r is DiagnosisRecord=>{
  try {return typeof r.id==='string'&&typeof r.createdAt==='string'&&Number.isFinite(Date.parse(r.createdAt))&&Object.keys(validateInput(r.input)).length===0;}catch{return false;}
 });
}
export function saveRecord(input:DiagnosisInput):DiagnosisRecord {
 const record={id:crypto.randomUUID(),createdAt:new Date().toISOString(),input};
 localStorage.setItem(KEY,JSON.stringify([record,...loadRecords()]));return record;
}

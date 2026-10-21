import {test,expect, type Page} from '@playwright/test';
async function start(page:Page,industry:string){
 await page.goto('/');
 await page.getByLabel('사업장명').fill('고정비 테스트');
 await page.getByLabel('사업장 지역').fill('서울');
 await page.getByLabel('업종', {exact:false}).selectOption(industry);
 await page.getByRole('button',{name:'다음 단계'}).click();
}
async function financials(page:Page){
 for(const [label,value] of [['월평균 매출','5000'],['원재료·매입비','1500'],['인건비','1000'],['임차료','500'],['기타 운영비','500']]) await page.getByLabel(label,{exact:false}).fill(value);
}
async function finish(page:Page){
 await page.getByRole('button',{name:'다음 단계'}).click();
 await page.getByRole('button',{name:'진단 결과 확인'}).click();
 await expect(page).toHaveURL(/results\?id=/);
}
test('미용실 고객관리·예약 비용 입력과 검증, 결과 및 새로고침',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await start(page,'미용실');await financials(page);
 await page.getByLabel('고객관리 프로그램').fill('-1');
 await page.getByRole('button',{name:'다음 단계'}).click();
 await expect(page.getByText('0 이상의 금액을 입력해 주세요.')).toBeVisible();
 await page.getByLabel('고객관리 프로그램').fill('20');
 await page.getByLabel('예약 프로그램').fill('5');
 await page.getByLabel('인터넷 회선').fill('3');
 await page.getByLabel('세무기장').fill('10');
 await finish(page);
 const detail=page.getByRole('region',{name:'월 비용 상세 내역'});
 await expect(detail.getByText('고객관리 프로그램',{exact:true})).toBeVisible();
 await expect(detail.getByText('538',{exact:true})).toBeVisible();
 await expect(page.locator('.metric-grid .card').filter({hasText:'월 추정 영업이익'}).locator('.metric-value')).toHaveText('1,462만원');
 await page.reload();
 await expect(detail.getByText('538',{exact:true})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
test('업종 변경 시 공통 비용은 유지하고 숨겨진 미용실 비용은 제외한다',async({page})=>{
 await start(page,'미용실');await financials(page);
 await page.getByLabel('고객관리 프로그램').fill('20');
 await page.getByLabel('예약 프로그램').fill('5');
 await page.getByLabel('인터넷 회선').fill('3');
 await page.getByLabel('세무기장').fill('10');
 await page.getByRole('button',{name:'이전',exact:true}).click();
 await page.getByLabel('업종',{exact:false}).selectOption('음식점');
 await page.getByRole('button',{name:'다음 단계'}).click();
 await expect(page.getByLabel('고객관리 프로그램')).toHaveCount(0);
 await expect(page.getByLabel('예약 프로그램')).toHaveCount(0);
 await expect(page.getByLabel('인터넷 회선')).toHaveValue('3');
 await page.getByLabel('POS 이용료').fill('5');
 await page.getByLabel('카드단말기 임대료').fill('2');
 await finish(page);
 await expect(page.getByRole('region',{name:'월 비용 상세 내역'}).getByText('520',{exact:true})).toBeVisible();
 await expect(page.locator('.metric-grid .card').filter({hasText:'월 추정 영업이익'}).locator('.metric-value')).toHaveText('1,480만원');
});
test('기존 저장 기록의 금액을 유지하고 세부 고정비 미입력을 안내한다',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>localStorage.setItem('bareun-diagnoses-v1',JSON.stringify([{id:'legacy',createdAt:'2026-10-21T00:00:00.000Z',input:{name:'기존 식당',industry:'음식점',region:'서울',employees:3,revenue:5000,materials:1500,labor:1000,rent:500,other:500,repeatCustomers:60,digital:4}}])));
 await page.goto('/results?id=legacy');
 await expect(page.getByRole('heading',{name:/기존 식당의/})).toBeVisible();
 await expect(page.locator('.metric-grid .card').filter({hasText:'월 추정 영업이익'}).locator('.metric-value')).toHaveText('1,500만원');
 await expect(page.getByText(/이 기록은 고정비 세부 입력 전/)).toBeVisible();
});

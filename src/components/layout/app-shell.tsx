'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {ArrowUpRight, ChartNoAxesCombined, ClipboardList, LayoutDashboard, LifeBuoy, Sprout} from 'lucide-react';
import type {ReactNode} from 'react';
export function AppShell({children}:{children:ReactNode}) {
 const path=usePathname();
 const links=[{href:'/',label:'경영진단',icon:ClipboardList},{href:'/results',label:'진단 결과',icon:ChartNoAxesCombined},{href:'/admin',label:'관리자',icon:LayoutDashboard}];
 return <div className="app-shell"><aside className="sidebar"><Link href="/" className="brand"><span className="brand-icon"><Sprout size={23}/></span>바른경영<span className="brand-dot">.</span></Link><div className="workspace-label">BUSINESS CARE PLATFORM</div><nav aria-label="주 메뉴">{links.map(({href,label,icon:Icon})=><Link key={href} href={href} className={(href==='/'?(path==='/'||path==='/diagnosis'):path===href)?'nav-item active':'nav-item'}><Icon size={19}/>{label}<ArrowUpRight size={14} className="nav-arrow"/></Link>)}</nav><div className="sidebar-bottom"><div className="care-note"><span className="tiny-label">작은 변화, 더 나은 내일</span><h3>사장님의 다음 성장을<br/>함께 준비합니다.</h3><Sprout size={42} strokeWidth={1.2}/></div><div className="help-line"><LifeBuoy size={16}/> 경영진단 이용 안내</div><span className="version">© 2026 바른경영 · Demo v1.0</span></div></aside><div className="main-shell"><header className="topbar"><span className="topbar-label">우리 사업의 오늘을 살피는 시간</span><div className="topbar-right"><span className="live-dot"/>무료 경영진단<span className="avatar">B</span></div></header><main>{children}</main><footer className="footer"><span>건강한 사업의 시작, 바른경영</span><span>입력 정보는 현재 브라우저에만 저장됩니다.</span></footer></div><nav className="mobile-nav" aria-label="모바일 메뉴">{links.map(({href,label,icon:Icon})=><Link key={href} href={href} aria-current={path===href?'page':undefined}><Icon size={20}/>{label}</Link>)}</nav></div>;
}

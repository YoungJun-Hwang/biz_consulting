import type {Metadata} from 'next';
import './globals.css';
import {AppShell} from '@/components/layout/app-shell';
export const metadata:Metadata={title:'바른경영 | 사업장 경영진단',description:'우리 사업장의 현재를 이해하고 다음 성장을 준비하는 모바일 경영진단'};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="ko"><body><AppShell>{children}</AppShell></body></html>;}

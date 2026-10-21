import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
export function Button({ children, className = '', variant = 'primary', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }) {
 return <button className={`button ${variant} ${className}`} {...props}>{children}</button>;
}
export function Card({children,className=''}:{children:ReactNode;className?:string}) { return <section className={`card ${className}`}>{children}</section>; }
export function Badge({children,tone='green'}:{children:ReactNode;tone?:'green'|'amber'|'gray'}) { return <span className={`badge ${tone}`}>{children}</span>; }
export function Field({label,error,suffix,...props}:InputHTMLAttributes<HTMLInputElement>&{label:string;error?:string;suffix?:string}) {
 const id = props.id || props.name;
 return <div className="field"><label htmlFor={id}>{label}</label><div className="input-wrap"><input {...props} id={id} aria-invalid={!!error} aria-describedby={error?`${id}-error`:undefined}/>{suffix&&<span>{suffix}</span>}</div>{error&&<p className="field-error" id={`${id}-error`}>{error}</p>}</div>;
}
export function ScoreBar({label,score}:{label:string;score:number}) {return <div className="score-bar"><div><span>{label}</span><strong>{score}<small> / 100</small></strong></div><div className="bar-track"><div style={{width:`${score}%`}}/></div></div>;}
export function Status({score}:{score:number}) { return <Badge tone={score>=75?'green':score>=50?'amber':'gray'}>{score>=75?'양호':score>=50?'개선 필요':'집중 관리'}</Badge>; }
export const money=(value:number)=>new Intl.NumberFormat('ko-KR',{maximumFractionDigits:4}).format(value);

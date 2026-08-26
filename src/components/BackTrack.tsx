'use client'
import{usePathname,useRouter}from'next/navigation'
export function BackTrack(){const path=usePathname();const router=useRouter();if(path==='/')return null;return <button className="back-track" onClick={()=>history.length>1?router.back():router.push('/')} aria-label="Go back"><span>←</span> Back</button>}

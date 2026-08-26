# Full-screen snack shower — awaiting confirmation

Status: archived, not active on the website.

Required asset: `/public/assets/snack-confetti-sheet.png`

## React component

```tsx
const snackPieces=Array.from({length:30},(_,i)=>i)

function SnackBurst(){
  return <div className="snack-burst" aria-hidden="true">
    {snackPieces.map((_,i)=>{
      const cell=(i*7+Math.floor(i/3))%20
      const col=cell%5
      const row=Math.floor(cell/5)
      return <i className="snack-piece" key={i} style={{
        '--x':`${3+(i*37)%94}%`,
        '--size':`${38+(i*29)%78}px`,
        '--delay':`${(i*43)%520}ms`,
        '--duration':`${1850+(i*83)%1050}ms`,
        '--drift':`${(i%2?1:-1)*(24+(i*17)%95)}px`,
        '--spin':`${(i%2?1:-1)*(300+(i*47)%720)}deg`,
        backgroundPosition:`${col*25}% ${row*(100/3)}%`
      } as React.CSSProperties}/>
    })}
  </div>
}
```

Render `<SnackBurst key={burst}/>` at the application-provider level after incrementing `burst` during Add to Cart. Keep it mounted for 3400ms.

## CSS

```css
.snack-burst{position:fixed;inset:0;z-index:100;pointer-events:none;overflow:hidden;contain:strict}
.snack-piece{position:absolute;left:var(--x);top:calc(-1 * var(--size) - 30px);width:var(--size);aspect-ratio:1.2;background-image:url('/assets/snack-confetti-sheet.png');background-repeat:no-repeat;background-size:500% 400%;filter:drop-shadow(0 7px 7px rgba(35,18,3,.28));will-change:transform;animation:snackShower var(--duration) cubic-bezier(.17,.72,.28,1) var(--delay) both}
.snack-piece:nth-child(5n+1){--size:112px!important;z-index:2}
.snack-piece:nth-child(7n+2){--size:84px!important}
.snack-piece:nth-child(4n){filter:drop-shadow(0 5px 5px rgba(35,18,3,.22)) saturate(.94)}
@keyframes snackShower{0%{opacity:0;transform:translate3d(-50%,-12vh,0) rotate(0) scale(.55)}8%{opacity:1}78%{opacity:1}100%{opacity:0;transform:translate3d(calc(-50% + var(--drift)),112vh,0) rotate(var(--spin)) scale(1)}}
@media(prefers-reduced-motion:reduce){.snack-burst{display:none}}
```

The supplied sprite sheet already contains an alpha channel. No recreation or extraction is required if this version is approved.

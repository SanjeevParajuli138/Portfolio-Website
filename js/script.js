
/* ============================================================
    CUSTOM CURSOR
    ============================================================ */
const curDot  = document.getElementById('cursor-dot');
const curRing = document.getElementById('cursor-ring');
let mx=-200,my=-200,rx=-200,ry=-200;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
document.addEventListener('mouseleave',()=>{mx=-400;my=-400;});
(function cursorLoop(){
    curDot.style.left=mx+'px'; curDot.style.top=my+'px';
    rx+=(mx-rx)*.12; ry+=(my-ry)*.12;
    curRing.style.left=rx+'px'; curRing.style.top=ry+'px';
    requestAnimationFrame(cursorLoop);
})();
document.querySelectorAll('a,button,.proj-card,.skill-pill,.t-card,.skill-node').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
});

/* ============================================================
    LOADER
    ============================================================ */
(function initLoader(){
    const canvas=document.getElementById('loader-canvas');
    const ctx=canvas.getContext('2d');
    let W,H,blobs=[];
    function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;}
    resize(); window.addEventListener('resize',resize);
    function makeBlob(){return{x:W*(.2+Math.random()*.6),y:H*(.2+Math.random()*.6),r:120+Math.random()*200,hue:Math.random()<.5?265:45,speed:.003+Math.random()*.004,phase:Math.random()*Math.PI*2};}
    for(let i=0;i<4;i++) blobs.push(makeBlob());
    let animId;
    function drawBlobs(t){
    ctx.clearRect(0,0,W,H);
    blobs.forEach(b=>{
        const x=b.x+Math.sin(t*b.speed+b.phase)*80;
        const y=b.y+Math.cos(t*b.speed*1.3+b.phase)*60;
        const grad=ctx.createRadialGradient(x,y,0,x,y,b.r);
        grad.addColorStop(0,`hsla(${b.hue},70%,50%,0.18)`);
        grad.addColorStop(1,'transparent');
        ctx.fillStyle=grad;
        ctx.beginPath(); ctx.arc(x,y,b.r,0,Math.PI*2); ctx.fill();
    });
    animId=requestAnimationFrame(drawBlobs);
    }
    animId=requestAnimationFrame(drawBlobs);
    const nameEl=document.getElementById('loader-name');
    const name='Sanjeev Parajuli';
    name.split('').forEach((ch,i)=>{
    const s=document.createElement('span'); s.textContent=ch; nameEl.appendChild(s);
    setTimeout(()=>s.classList.add('in'),100+i*80);
    });
    setTimeout(()=>document.getElementById('loader-tagline').classList.add('in'),400);
    const bar=document.getElementById('loader-bar');
    const pct=document.getElementById('loader-pct');
    let progress=0;
    const interval=setInterval(()=>{
    progress=Math.min(100,progress+(Math.random()*6+1));
    bar.style.width=progress+'%';
    pct.textContent=Math.floor(progress)+'%';
    if(progress>=100){
        clearInterval(interval);
        setTimeout(()=>{
        const loader=document.getElementById('loader');
        loader.classList.add('out');
        loader.addEventListener('animationend',()=>{
            loader.style.display='none';
            cancelAnimationFrame(animId);
            initAuroraMesh();
            initPerspGrid();
            initSparks();
            initReveal();
        },{once:true});
        },400);
    }
    },40);
})();

/* ============================================================
    HUD CLOCK
    ============================================================ */
function updateClock(){
    const n=new Date();
    const el=document.getElementById('hud-clock');
    if(el) el.textContent=n.toLocaleTimeString('en-US',{hour12:false});
}
updateClock(); setInterval(updateClock,1000);

/* ============================================================
    HEADLINE WORD REVEAL
    ============================================================ */
(function(){
    const el=document.getElementById('headline');
    const words=['Building','Digital ','Beautiful.'];
    let delay=0.08;
    const line1=document.createElement('div');
    const line2=document.createElement('div');
    const line3=document.createElement('div');
    [line1,line2,line3].forEach((line,li)=>{
    const w=document.createElement(li===1?'em':'span');
    w.className='word'; w.textContent=words[li]; w.style.animationDelay=delay+'s';
    line.appendChild(w); el.appendChild(line); delay+=0.14;
    });
})();

/* ============================================================
    TYPEWRITER
    ============================================================ */
(function(){
    const el=document.getElementById('typewriter');
    const roles=['Full-Stack Developer','Creative Technologist','UI / UX Designer','Open Source Builder'];
    let ri=0,ci=0,del=false;
    function tick(){
    const r=roles[ri];
    el.textContent=del?r.slice(0,--ci):r.slice(0,++ci);
    if(!del&&ci===r.length){del=true;setTimeout(tick,1800);return;}
    if(del&&ci===0){del=false;ri=(ri+1)%roles.length;}
    setTimeout(tick,del?42:78);
    }
    setTimeout(tick,1200);
})();

/* ============================================================
    AURORA MESH BACKGROUND
    ============================================================ */
function initAuroraMesh(){
    const canvas=document.getElementById('canvas-mesh');
    const ctx=canvas.getContext('2d');
    const COLORS=[[88,28,180],[147,51,234],[59,7,100],[16,9,62],[8,145,178],[6,95,70],[124,58,237],[201,168,76],[232,76,43]];
    const ROWS=6,COLS=8;
    let W,H,pts=[];

    function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;buildGrid();}
    function buildGrid(){
    pts=[];
    for(let r=0;r<=ROWS;r++){
        for(let c=0;c<=COLS;c++){
        const ci=Math.floor(Math.random()*COLORS.length);
        pts.push({bx:(c/COLS)*W,by:(r/ROWS)*H,x:(c/COLS)*W+(Math.random()-.5)*W*.15,y:(r/ROWS)*H+(Math.random()-.5)*H*.15,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,color:[...COLORS[ci]],targetColor:[...COLORS[Math.floor(Math.random()*COLORS.length)]],colorT:0,colorSpeed:.002+Math.random()*.003});
        }
    }
    }
    function lerp(a,b,t){return[Math.round(a[0]+(b[0]-a[0])*t),Math.round(a[1]+(b[1]-a[1])*t),Math.round(a[2]+(b[2]-a[2])*t)];}
    let mX=W/2||400,mY=H/2||300;
    document.addEventListener('mousemove',e=>{mX=e.clientX;mY=e.clientY;});

    function update(){
    pts.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy;
        p.vx+=(p.bx-p.x)*.0008; p.vy+=(p.by-p.y)*.0008;
        p.vx*=.995; p.vy*=.995;
        const dx=p.x-mX,dy=p.y-mY,d2=dx*dx+dy*dy,R=160;
        if(d2<R*R&&d2>1){const d=Math.sqrt(d2),f=(R-d)/R*.4;p.vx+=(dx/d)*f;p.vy+=(dy/d)*f;}
        p.colorT+=p.colorSpeed;
        if(p.colorT>=1){p.colorT=0;p.color=[...p.targetColor];p.targetColor=[...COLORS[Math.floor(Math.random()*COLORS.length)]];}
    });
    }

    function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#06050f'; ctx.fillRect(0,0,W,H);
    for(let r=0;r<ROWS;r++){
        for(let c=0;c<COLS;c++){
        const tl=pts[r*(COLS+1)+c],tr=pts[r*(COLS+1)+c+1],bl=pts[(r+1)*(COLS+1)+c],br=pts[(r+1)*(COLS+1)+c+1];
        const col=lerp(tl.color,br.color,Math.sin(Date.now()*.0005+r+c)*.5+.5);
        const alpha=.22+.12*Math.sin(Date.now()*.0007+r*1.3+c*.9);
        const cx2=(tl.x+tr.x+bl.x+br.x)/4,cy2=(tl.y+tr.y+bl.y+br.y)/4;
        const grad=ctx.createRadialGradient(cx2,cy2,0,cx2,cy2,Math.max(W,H)*.25);
        grad.addColorStop(0,`rgba(${col[0]},${col[1]},${col[2]},${alpha})`);
        grad.addColorStop(1,`rgba(${col[0]},${col[1]},${col[2]},0)`);
        ctx.fillStyle=grad;
        ctx.beginPath(); ctx.moveTo(tl.x,tl.y); ctx.lineTo(tr.x,tr.y); ctx.lineTo(br.x,br.y); ctx.lineTo(bl.x,bl.y); ctx.closePath(); ctx.fill();
        }
    }
    const orbs=[{x:.2,y:.35,r:.38,col:[88,28,180],a:.13},{x:.75,y:.25,r:.35,col:[8,145,178],a:.10},{x:.5,y:.65,r:.45,col:[147,51,234],a:.10},{x:.15,y:.7,r:.3,col:[201,168,76],a:.07},{x:.85,y:.7,r:.32,col:[6,95,70],a:.09}];
    orbs.forEach(o=>{
        const pulse=Math.sin(Date.now()*.0006+o.x*10)*.04;
        const g=ctx.createRadialGradient(o.x*W,o.y*H,0,o.x*W,o.y*H,o.r*Math.max(W,H));
        g.addColorStop(0,`rgba(${o.col[0]},${o.col[1]},${o.col[2]},${o.a+pulse})`);
        g.addColorStop(1,'transparent');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    });
    for(let i=0;i<3;i++){
        const y=H*(.2+i*.28)+Math.sin(Date.now()*.0004+i*2)*H*.04;
        const col=COLORS[(i*3)%COLORS.length];
        const g=ctx.createLinearGradient(0,y-60,0,y+60);
        g.addColorStop(0,'transparent'); g.addColorStop(.5,`rgba(${col[0]},${col[1]},${col[2]},0.07)`); g.addColorStop(1,'transparent');
        ctx.fillStyle=g; ctx.fillRect(0,y-60,W,120);
    }
    }

    function loop(){update();draw();requestAnimationFrame(loop);}
    resize(); window.addEventListener('resize',resize); loop();
}

/* ============================================================
    PERSPECTIVE GRID
    ============================================================ */
function initPerspGrid(){
    const canvas=document.getElementById('canvas-grid');
    const ctx=canvas.getContext('2d');
    let W,H;
    function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;}
    resize(); window.addEventListener('resize',resize);
    const LINES=18;
    function draw(t){
    ctx.clearRect(0,0,W,H);
    const vpX=W/2+Math.sin(t*.00025)*W*.08,vpY=H*.55;
    ctx.strokeStyle='rgba(212,245,60,0.55)'; ctx.lineWidth=.5;
    const hLines=10;
    for(let i=1;i<=hLines;i++){
        const p=i/hLines,e=p*p*p,y=vpY+(H-vpY)*e;
        ctx.globalAlpha=e*.6; ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke();
    }
    ctx.globalAlpha=1;
    for(let i=0;i<=LINES;i++){
        const x=(i/LINES)*W,a=.12+(1-Math.abs((i/LINES-.5)*2))*.18;
        ctx.globalAlpha=a; ctx.beginPath(); ctx.moveTo(vpX,vpY); ctx.lineTo(x,H); ctx.stroke();
        ctx.globalAlpha=a*.4; ctx.beginPath(); ctx.moveTo(vpX,vpY); ctx.lineTo(x,0); ctx.stroke();
    }
    ctx.globalAlpha=1;
    }
    (function loop(){draw(Date.now());requestAnimationFrame(loop);})();
}

/* ============================================================
    FLOATING SPARKS
    ============================================================ */
function initSparks(){
    const canvas=document.getElementById('canvas-sparks');
    const ctx=canvas.getContext('2d');
    let W,H;
    const N=window.innerWidth<600?28:55;
    const SC=['#d4f53c','#c9a84c','#8b5cf6','#06b6d4','#f0abfc','#ffffff'];
    const sparks=[];
    function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;}
    resize(); window.addEventListener('resize',resize);
    function reset(s){s.x=Math.random()*W;s.y=H+10;s.vx=(Math.random()-.5)*.25;s.vy=-(Math.random()*.5+.2);s.life=0;s.maxLife=.5+Math.random()*.8;s.size=Math.random()*2+.3;s.color=SC[Math.floor(Math.random()*SC.length)];s.trail=[];}
    for(let i=0;i<N;i++){const s={trail:[]};reset(s);s.x=Math.random()*W;s.y=Math.random()*H;sparks.push(s);}
    function loop(){
    ctx.clearRect(0,0,W,H);
    sparks.forEach(s=>{
        s.trail.push({x:s.x,y:s.y}); if(s.trail.length>10) s.trail.shift();
        s.x+=s.vx+Math.sin(Date.now()*.001+s.y*.01)*.15; s.y+=s.vy; s.life+=.006;
        if(s.life>s.maxLife||s.y<-10) reset(s);
        const alpha=Math.sin((s.life/s.maxLife)*Math.PI)*.8;
        if(s.trail.length>2){
        for(let i=1;i<s.trail.length;i++){
            ctx.strokeStyle=s.color; ctx.globalAlpha=(i/s.trail.length)*alpha*.4;
            ctx.lineWidth=s.size*(i/s.trail.length)*.7;
            ctx.beginPath(); ctx.moveTo(s.trail[i-1].x,s.trail[i-1].y); ctx.lineTo(s.trail[i].x,s.trail[i].y); ctx.stroke();
        }
        }
        ctx.globalAlpha=alpha; ctx.fillStyle=s.color;
        ctx.beginPath(); ctx.arc(s.x,s.y,s.size,0,Math.PI*2); ctx.fill();
        ctx.globalAlpha=alpha*.25;
        const g=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.size*5);
        g.addColorStop(0,s.color); g.addColorStop(1,'transparent');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(s.x,s.y,s.size*5,0,Math.PI*2); ctx.fill();
        ctx.globalAlpha=1;
    });
    requestAnimationFrame(loop);
    }
    loop();
}

/* ============================================================
    SCROLL REVEAL
    ============================================================ */
function initReveal(){
    const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('on');});
    },{threshold:.12});
    document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
}

/* ============================================================
    PILL NAV
    ============================================================ */
(function(){
    const nav=document.getElementById('pill-nav');
    const sections=['hero','about','projects','skills','experience','testimonials','contact'];
    let shown=false;
    window.addEventListener('scroll',()=>{
    if(window.scrollY>80&&!shown){nav.classList.add('visible');shown=true;}
    if(window.scrollY<40&&shown){nav.classList.remove('visible');shown=false;}
    const btns=document.querySelectorAll('.pill-btn');
    sections.forEach(id=>{
        const sec=document.getElementById(id); if(!sec) return;
        const rect=sec.getBoundingClientRect();
        if(rect.top<=120&&rect.bottom>120){
        btns.forEach(b=>b.classList.remove('active'));
        const ab=document.querySelector(`.pill-btn[data-section="${id}"]`);
        if(ab) ab.classList.add('active');
        }
    });
    });
})();

/* ============================================================
    ORBIT SKILLS
    ============================================================ */
(function(){
    const wrap=document.getElementById('orbit-wrap'); if(!wrap) return;
    const size=wrap.offsetWidth;
    const rings = [
        {
          radius: .21,
          skills: ['HTML', 'CSS', 'Java Script', 'Git'],
          cls: 'sn-r1' // Frontend core
        },
        {
          radius: .34,
          skills: ['Tailwind', 'Boots trap', 'React', 'Java', 'Spring Boot'],
          cls: 'sn-r2' // Frameworks + Java stack
        },
        {
          radius: .47,
          skills: [
            '.NET Core', 'ASP.NET MVC', 'Entity Frame work',
            'Python', 'Machine Learning', 'OpenCV',
            'SQL', 'Docker'
          ],
          cls: 'sn-r3' // Backend + ML + tools
        }
      ];
    rings.forEach(ring=>{
    const count=ring.skills.length;
    ring.skills.forEach((skill,i)=>{
        const angle=(i/count)*360;
        const rad=ring.radius*size;
        const cx=50+rad/size*100*Math.cos((angle-90)*Math.PI/180);
        const cy=50+rad/size*100*Math.sin((angle-90)*Math.PI/180);
        const node=document.createElement('div');
        node.className=`skill-node ${ring.cls}`;
        node.textContent=skill;
        node.style.left=cx+'%'; node.style.top=cy+'%';
        node.style.transform='translate(-50%,-50%)';
        wrap.appendChild(node);
    });
    });
})();

/* ============================================================
    PROJECT DRAG SCROLL
    ============================================================ */
(function(){
    const wrap=document.getElementById('proj-track-wrap');
    let isDown=false,startX,scrollLeft;
    wrap.addEventListener('mousedown',e=>{isDown=true;wrap.classList.add('grabbing');startX=e.pageX-wrap.offsetLeft;scrollLeft=wrap.scrollLeft;});
    document.addEventListener('mouseup',()=>{isDown=false;wrap.classList.remove('grabbing');});
    wrap.addEventListener('mousemove',e=>{if(!isDown)return;e.preventDefault();wrap.scrollLeft=scrollLeft-(e.pageX-wrap.offsetLeft-startX)*1.5;});
    let tX,tSL;
    wrap.addEventListener('touchstart',e=>{tX=e.touches[0].pageX;tSL=wrap.scrollLeft;},{passive:true});
    wrap.addEventListener('touchmove',e=>{wrap.scrollLeft=tSL+(tX-e.touches[0].pageX);},{passive:true});
    document.querySelectorAll('.proj-card').forEach(card=>{
    card.addEventListener('touchend',()=>card.classList.toggle('tapped'));
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')card.classList.toggle('tapped');});
    });
})();

/* ============================================================
    TIMELINE FILL
    ============================================================ */
(function(){
    const fill=document.getElementById('tl-fill');
    const section=document.getElementById('experience');
    if(!fill||!section) return;
    function update(){
    const rect=section.getBoundingClientRect();
    const pct=Math.min(100,Math.max(0,(Math.max(0,-rect.top)/(rect.height-window.innerHeight*.5))*100));
    fill.style.height=pct+'%';
    }
    window.addEventListener('scroll',update,{passive:true}); update();
})();

/* ============================================================
    TESTIMONIAL SWIPE DECK
    ============================================================ */
(function(){
    const deck=document.getElementById('deck'); if(!deck) return;
    let cards=Array.from(deck.querySelectorAll('.t-card'));
    function setIndices(){
    cards.forEach((c,i)=>{
        c.dataset.index=i; c.style.zIndex=4-i;
        if(i===0){c.style.transform='';c.style.boxShadow='0 20px 60px rgba(0,0,0,.5)';}
        else{const rot=[0,3,-4,6][i]||i*3,ty=[0,8,16,24][i]||i*8,sc=[1,.97,.94,.91][i]||1;c.style.transform=`rotate(${rot}deg) translateY(${ty}px) scale(${sc})`;c.style.boxShadow='';}
    });
    }
    setIndices();
    let startX,isDrag=false,curX=0;
    function onStart(e){isDrag=true;startX=e.touches?e.touches[0].clientX:e.clientX;cards[0].classList.add('dragging');}
    function onMove(e){if(!isDrag)return;curX=(e.touches?e.touches[0].clientX:e.clientX)-startX;cards[0].style.transform=`translateX(${curX}px) rotate(${curX*.1}deg)`;}
    function onEnd(){
    if(!isDrag)return; isDrag=false; cards[0].classList.remove('dragging');
    if(Math.abs(curX)>80){
        const dir=curX>0?1:-1,gone=cards.shift();
        gone.style.transform=`translateX(${dir*160}%) rotate(${dir*25}deg)`;
        gone.style.opacity='0'; gone.style.transition='transform .5s ease,opacity .4s';
        setTimeout(()=>{gone.style.transition='';gone.style.transform='';gone.style.opacity='';deck.appendChild(gone);cards.push(gone);setIndices();},500);
        setIndices();
    } else {
        cards[0].style.transition='transform .4s cubic-bezier(.34,1.4,.64,1)';
        cards[0].style.transform='';
        setTimeout(()=>cards[0].style.transition='',400);
    }
    curX=0;
    }
    deck.addEventListener('mousedown',onStart);
    document.addEventListener('mousemove',onMove);
    document.addEventListener('mouseup',onEnd);
    deck.addEventListener('touchstart',onStart,{passive:true});
    deck.addEventListener('touchmove',onMove,{passive:true});
    deck.addEventListener('touchend',onEnd);
})();

/* ============================================================
    CONTACT FORM
    ============================================================ */
(function(){
    const form=document.getElementById('contact-form');
    const btn=document.getElementById('submit-btn');
    if(!form) return;
    form.addEventListener('submit',e=>{
    e.preventDefault(); btn.disabled=true;
    btn.innerHTML='Sending… <span style="display:inline-block;animation:spin360 .8s linear infinite">⌛</span>';
    setTimeout(()=>{
        btn.innerHTML='✓ Message Sent!'; btn.style.background='var(--gold)'; form.reset();
        setTimeout(()=>{
        btn.disabled=false;
        btn.innerHTML='Send Message <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
        btn.style.background='';
        },3000);
    },1800);
    });
})();

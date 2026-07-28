const performances={"2024":[{venue:"The Highlight Room",location:"New York City, United States",country:"United States"},{venue:"Panorámic",location:"Barcelona, Spain",country:"Spain"},{venue:"MotoGP VIP Suites (Private Event)",location:"Barcelona, Spain",country:"Spain"},{venue:"De Tulp",location:"Amsterdam, Netherlands",country:"Netherlands"}],"2025":[{venue:"Soho Selectors – Soho House Barcelona",location:"Barcelona, Spain",country:"Spain"},{venue:"Candelaria",location:"Santiago, Chile",country:"Chile"},{venue:"Capote Bar",location:"Bogotá, Colombia",country:"Colombia"}],"2026":[{venue:"Il Brutto",location:"Auckland, New Zealand",country:"New Zealand"},{venue:"Boat Parties",location:"Auckland, New Zealand",country:"New Zealand"},{venue:"Tanna's Inn",location:"Tokyo, Japan",country:"Japan"},{venue:"Barcelona Coffee Rave",location:"Barcelona, Spain",country:"Spain"},{venue:"Atlantic Club",location:"Barcelona, Spain",country:"Spain"},{venue:"Bus Hexperience",location:"Barcelona, Spain",country:"Spain"},{venue:"Boris Club",location:"Barcelona, Spain",country:"Spain"},{venue:"SLS Cósmico",location:"Barcelona, Spain",country:"Spain"},{venue:"Cantina 15",location:"San Salvador, El Salvador",country:"El Salvador"},{venue:"Chica Club",location:"Barcelona, Spain",country:"Spain"}]};
const countries=["Spain","United States","Netherlands","Chile","Colombia","New Zealand","Japan","El Salvador"],countryYear={Spain:"2026","United States":"2024",Netherlands:"2024",Chile:"2025",Colombia:"2025","New Zealand":"2026",Japan:"2026","El Salvador":"2026"};let year="2026",filter=null;const eventsEl=document.querySelector('#events');
function renderEvents(){eventsEl.innerHTML=performances[year].map((e,i)=>`<article class="event ${filter===e.country?'highlight':''}" data-country="${e.country}"><span class="event-index">${String(i+1).padStart(2,'0')}</span><div><h3>${e.venue}</h3><p>${e.location}</p></div><span class="event-arrow">↗</span></article>`).join('')};renderEvents();
document.querySelectorAll('.year-tabs button').forEach(b=>b.addEventListener('click',()=>{year=b.dataset.year;filter=null;document.querySelectorAll('.year-tabs button').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('[data-country-map]').forEach(x=>x.classList.remove('active'));renderEvents()}));
function selectCountry(country, control){
  filter=country;year=countryYear[country];
  document.querySelectorAll('[data-country-map]').forEach(x=>x.classList.toggle('active',x.dataset.countryMap===country));
  document.querySelectorAll('.year-tabs button').forEach(x=>x.classList.toggle('active',x.dataset.year===year));
  renderEvents();document.querySelector('#performances').scrollIntoView({behavior:'smooth'});
  setTimeout(()=>document.querySelector('.event.highlight')?.scrollIntoView({behavior:'smooth',block:'center'}),650)
}
document.querySelectorAll('[data-country-map]').forEach(el=>{
  el.addEventListener('click',()=>selectCountry(el.dataset.countryMap,el));
  el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectCountry(el.dataset.countryMap,el)}})
});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.13});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const statObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,target=+el.dataset.count,suffix=el.dataset.suffix||'';let start=0;const timer=setInterval(()=>{start++;el.textContent=start+suffix;if(start>=target)clearInterval(timer)},80);statObserver.unobserve(el)}),{threshold:.7});document.querySelectorAll('[data-count]').forEach(el=>statObserver.observe(el));
const header=document.querySelector('.header'),toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>30));toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',open)});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')}));
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;if(!reduced){addEventListener('scroll',()=>document.querySelectorAll('.parallax').forEach(el=>{const r=el.parentElement.getBoundingClientRect(),speed=Number(el.dataset.speed||.1);if(r.bottom>0&&r.top<innerHeight)el.style.transform=`translate3d(0,${-r.top*speed}px,0) scale(1.08)`}),{passive:true})}
const lightbox=document.querySelector('#lightbox'),lightboxImg=lightbox.querySelector('img');document.querySelectorAll('.gallery-item').forEach(btn=>btn.addEventListener('click',()=>{lightboxImg.src=btn.dataset.full;lightboxImg.alt=btn.querySelector('img').alt;lightbox.showModal()}));lightbox.querySelector('button').addEventListener('click',()=>lightbox.close());lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close()});addEventListener('keydown',e=>{if(e.key==='Escape'&&lightbox.open)lightbox.close()});

/* ---------- BOOKING MODAL ---------- */
const bookingDialog=document.querySelector('#booking'),bookingForm=document.querySelector('#bookingForm'),bookingStatus=document.querySelector('#bookingStatus');
/* Free email forwarding — FormSubmit.co (no account needed).
   First submission sends a one-time activation email to the address below; confirm it once and
   every later submission is forwarded straight to the inbox. Optionally replace the address with
   the hashed alias FormSubmit gives you after activation, so the mailbox is not exposed in the HTML. */
const FORM_ENDPOINT='https://formsubmit.co/ajax/hello.alexbemusic@gmail.com';

function openBooking(){bookingDialog.showModal();setTimeout(()=>bookingDialog.querySelector('#bk-name').focus(),80)}
document.querySelectorAll('[data-open-booking]').forEach(b=>b.addEventListener('click',openBooking));
bookingDialog.querySelector('.booking-close').addEventListener('click',()=>bookingDialog.close());
bookingDialog.addEventListener('click',e=>{if(e.target===bookingDialog)bookingDialog.close()});

bookingForm.addEventListener('submit',async e=>{
  e.preventDefault();
  if(!bookingForm.reportValidity())return;
  if(bookingForm._honey.value)return; /* bot trap */
  const submit=bookingForm.querySelector('button[type="submit"]');
  submit.disabled=true;bookingStatus.className='form-status sending';bookingStatus.textContent='Sending…';
  const data=Object.fromEntries(new FormData(bookingForm).entries());
  delete data._honey;
  /* GDPR: keep a record of what was consented to and when. */
  data.consent=bookingForm.consent.checked?'Yes':'No';
  data.consent_text=bookingForm.querySelector('.consent span').textContent.trim();
  data.consent_timestamp=new Date().toISOString();
  data._subject=`LXBE booking request — ${data.name}`;
  data._template='table';
  data._captcha='false';
  try{
    const res=await fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(data)});
    if(!res.ok)throw new Error('HTTP '+res.status);
    /* FormSubmit can answer 200 with success:false — e.g. while the address is still unconfirmed. */
    const json=await res.json().catch(()=>({}));
    if(String(json.success)!=='true')throw new Error(json.message||'rejected');
    bookingForm.reset();
    bookingStatus.className='form-status ok';
    bookingStatus.textContent='Request sent. We will get back to you within 48 hours.';
  }catch(err){
    bookingStatus.className='form-status error';
    bookingStatus.innerHTML='Could not send right now. Please email <a href="mailto:hello.alexbemusic@gmail.com">hello.alexbemusic@gmail.com</a>.';
  }finally{submit.disabled=false}
});

/* ----------  ---------- */
const toTop=document.querySelector('#toTop');
addEventListener('scroll',()=>toTop.classList.toggle('show',scrollY>innerHeight*.8),{passive:true});
toTop.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

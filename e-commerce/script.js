 // ====== Cart counter (localStorage ilə) ======
const cartBadge = document.getElementById('cart-count');
const LS_KEY = 'myshop_cart_count';

function getCartCount(){
  return Number(localStorage.getItem(LS_KEY) || 0);
}
function setCartCount(v){
  localStorage.setItem(LS_KEY, String(v));
  cartBadge.textContent = v;
}
setCartCount(getCartCount()); // səhifə açılarkən badge-i bərpa et

// Toast helper
const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg){
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> toast.classList.remove('show'), 1400);
}

// “Səbətə əlavə et” düymələri
document.querySelectorAll('.btn--add').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const title = btn.closest('.card')?.querySelector('.card__title')?.textContent?.trim() || 'Məhsul';
    setCartCount(getCartCount()+1);
    showToast(`Səbətə əlavə edildi: ${title}`);
    // kiçik vizual feedback
    btn.disabled = true;
    btn.textContent = 'Əlavə olundu ✓';
    setTimeout(()=>{ btn.disabled = false; btn.textContent='Səbətə əlavə et'; }, 800);
  });
});

// ====== Carousel / Slider ======
const track = document.getElementById('track');
const prevBtn = document.querySelector('.carousel__btn--prev');
const nextBtn = document.querySelector('.carousel__btn--next');

function cardWidthWithGap(){
  const card = track.querySelector('.card');
  if(!card) return 280;
  const style = getComputedStyle(track);
  const gap = parseFloat(style.columnGap || style.gap || 16);
  return card.getBoundingClientRect().width + gap;
}

function scrollByCards(dir = 1, cards = 1){
  track.scrollBy({ left: dir * cards * cardWidthWithGap(), behavior: 'smooth' });
}

prevBtn.addEventListener('click', ()=> scrollByCards(-1, 1));
nextBtn.addEventListener('click', ()=> scrollByCards( 1, 1));

// Klaviatura ilə idarə (sol/sağ oxlar)
track.setAttribute('tabindex','0');
track.addEventListener('keydown', (e)=>{
  if(e.key === 'ArrowRight') { e.preventDefault(); scrollByCards(1,1); }
  if(e.key === 'ArrowLeft')  { e.preventDefault(); scrollByCards(-1,1); }
});

// Touch sürüşdürmə (mobil)
let startX = 0, isDown = false, lastScrollLeft = 0;

track.addEventListener('pointerdown', (e)=>{
  isDown = true;
  startX = e.clientX;
  lastScrollLeft = track.scrollLeft;
  track.setPointerCapture(e.pointerId);
});
track.addEventListener('pointermove', (e)=>{
  if(!isDown) return;
  const dx = e.clientX - startX;
  track.scrollLeft = lastScrollLeft - dx;
});
['pointerup','pointercancel','pointerleave'].forEach(ev=>{
  track.addEventListener(ev, ()=> isDown=false);
});

// Knopkaları aktiv/deaktiv göstər (ux üçün)
function updateArrowState(){
  const maxScroll = track.scrollWidth - track.clientWidth - 1;
  prevBtn.disabled = track.scrollLeft <= 2;
  nextBtn.disabled = track.scrollLeft >= maxScroll;
}
['scroll','resize','load'].forEach(ev=> window.addEventListener(ev, updateArrowState));
updateArrowState();


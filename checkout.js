const readJSON=(key,fallback)=>{try{const value=localStorage.getItem(key);return value?JSON.parse(value):fallback}catch{return fallback}};
let cart=readJSON('ba_cart',[]);if(!Array.isArray(cart))cart=[];
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
function save(){localStorage.setItem('ba_cart',JSON.stringify(cart))}
function total(){return cart.reduce((a,x)=>a+(Number(x.price)||0)*(Number(x.qty)||0),0)}
function render(){
  const box=$('#cartBox');
  if(!cart.length){box.innerHTML='<div class="cart-list empty">السلة فارغة.<br><br><a class="primary" href="index.html">العودة للمنتجات</a></div>';$('#total').textContent='0.00 درهم';return}
  box.innerHTML='<div class="cart-list">'+cart.map((x,i)=>`<div class="cart-item"><div class="mini-photo">${x.image?`<img src="${esc(x.image)}" alt="${esc(x.name)}" style="width:100%;height:100%;object-fit:cover;border-radius:13px">`:'✦'}</div><div><h3>${esc(x.name)}</h3><small>${Number(x.price||0).toFixed(2)} درهم — ${esc(x.cat||'')}</small><br><button class="remove" data-remove="${i}">حذف</button></div><div class="qty"><button aria-label="نقص" data-minus="${i}">−</button><b>${Math.max(0,Number(x.qty)||0)}</b><button aria-label="زد" data-plus="${i}">+</button></div></div>`).join('')+'</div>';
  $('#total').textContent=total().toFixed(2)+' درهم';
}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-plus],[data-minus],[data-remove]');if(!b)return;
  const i=Number(b.dataset.plus??b.dataset.minus??b.dataset.remove);if(!Number.isInteger(i)||!cart[i])return;
  if(b.dataset.plus!==undefined){const stock=readJSON('ba_products',[]).find(p=>p.id===cart[i].id)?.stock;if(stock!=null&&Number(cart[i].qty)>=Number(stock)){alert('لا يمكن تجاوز المخزون المتوفر.');return}cart[i].qty=(Number(cart[i].qty)||0)+1;}
  if(b.dataset.minus!==undefined){cart[i].qty=(Number(cart[i].qty)||0)-1;if(cart[i].qty<=0)cart.splice(i,1)}
  if(b.dataset.remove!==undefined)cart.splice(i,1);
  save();render();
});
$('#submit').onclick=()=>{
  const phone=$('#phone').value.trim(),msg=$('#msg');msg.hidden=true;
  if(!cart.length){msg.hidden=false;msg.textContent='السلة فارغة.';return}
  if(!phone){msg.hidden=false;msg.textContent='يرجى إدخال رقم الهاتف للتواصل معك.';return}
  const orders=readJSON('ba_orders',[]);if(!Array.isArray(orders))return;
  orders.unshift({id:'BA-'+Date.now(),createdAt:new Date().toISOString(),name:$('#name').value.trim()||'بدون اسم',phone,city:$('#city').value.trim(),notes:$('#notes').value.trim(),items:cart,total:total(),status:'new'});
  localStorage.setItem('ba_orders',JSON.stringify(orders));
  cart=[];save();
  $('#cartBox').innerHTML='<div class="success"><h2>تم استلام طلبك ✅</h2><p>مهم: سنتواصل معك قريبًا على رقم الهاتف الذي أدخلته لتأكيد الطلبية.</p><a class="primary" href="index.html">العودة للتسوق</a></div>';
  $('#total').textContent='0.00 درهم';$('#submit').disabled=true;
};
render();

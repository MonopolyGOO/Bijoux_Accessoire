const DEMO_PRODUCTS=[
{id:'p1',name:'سلسلة ناعمة',cat:'سلاسل',description:'تصميم أنيق مناسب للبيع بالجملة',price:39,stock:25,active:true,image:''},
{id:'p2',name:'سوار فاخر',cat:'أساور',description:'لمسة ذهبية بسيطة وأنيقة',price:45,stock:18,active:true,image:''},
{id:'p3',name:'خاتم كلاسيكي',cat:'خواتم',description:'مقاس متعدد وتصميم عصري',price:29,stock:32,active:true,image:''},
{id:'p4',name:'أقراط لامعة',cat:'أقراط',description:'خفيفة ومناسبة للاستعمال اليومي',price:35,stock:21,active:true,image:''},
{id:'p5',name:'طقم أنيق',cat:'أطقم',description:'طقم متناسق للعرض في المتجر',price:89,stock:12,active:true,image:''},
{id:'p6',name:'سلسلة قلب',cat:'سلاسل',description:'تصميم ناعم ومطلوب',price:42,stock:15,active:true,image:''}
];
let products=JSON.parse(localStorage.getItem('ba_products')||'null')||DEMO_PRODUCTS;let cart=JSON.parse(localStorage.getItem('ba_cart')||'[]');
const $=s=>document.querySelector(s);const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
function save(){localStorage.setItem('ba_products',JSON.stringify(products));localStorage.setItem('ba_cart',JSON.stringify(cart));}
function count(){const n=cart.reduce((a,x)=>a+x.qty,0);$('#cartCount').textContent=n;$('#mobileCartCount').textContent=n}
function toast(t){const x=$('#toast');x.textContent=t;x.classList.add('show');clearTimeout(window.tt);window.tt=setTimeout(()=>x.classList.remove('show'),2200)}
function placeholder(p){return `<div class="placeholder">${p.cat==='أقراط'?'✦':p.cat==='خواتم'?'◯':p.cat==='أساور'?'⌁':p.cat==='أطقم'?'✧':'♡'}</div>`}
function render(cat='all'){const active=products.filter(p=>p.active!==false&&(cat==='all'||p.cat===cat));$('#status').hidden=active.length>0;$('#status').textContent='لا توجد منتجات في هذا القسم حاليًا.';$('#productsGrid').innerHTML=active.map(p=>`<article class="product"><div class="product-photo">${p.image?`<img src="${esc(p.image)}" alt="${esc(p.name)}">`:placeholder(p)}<span class="tag">${esc(p.cat)}</span></div><div class="product-body"><h3>${esc(p.name)}</h3><div class="desc">${esc(p.description)}</div><div class="price">${Number(p.price).toFixed(2)} درهم</div><div class="stock">متوفر: ${p.stock}</div><button class="add" ${p.stock<=0?'disabled':''} data-id="${esc(p.id)}">${p.stock<=0?'نفد المخزون':'أضف للسلة'}</button></div></article>`).join('')}
document.addEventListener('click',e=>{const b=e.target.closest('.add');if(b){const p=products.find(x=>x.id===b.dataset.id);if(!p)return;const i=cart.findIndex(x=>x.id===p.id);if(i>=0)cart[i].qty++;else cart.push({...p,qty:1});save();count();toast('تمت إضافة المنتج إلى السلة ✅')}});
document.querySelectorAll('.cat').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.cat').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(b.dataset.cat)}));$('#refreshBtn').onclick=()=>render(document.querySelector('.cat.active').dataset.cat);count();render();

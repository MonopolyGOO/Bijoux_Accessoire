if(sessionStorage.getItem('ba_admin')!=='1')location.href='admin-login.html';
let products=JSON.parse(localStorage.getItem('ba_products')||'[]');let orders=JSON.parse(localStorage.getItem('ba_orders')||'[]');let editId=null;
const $=s=>document.querySelector(s);const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
function save(){localStorage.setItem('ba_products',JSON.stringify(products))}function stats(){$('#sProducts').textContent=products.length;$('#sOrders').textContent=orders.length;$('#sNew').textContent=orders.filter(x=>x.status==='new').length;$('#sLow').textContent=products.filter(x=>Number(x.stock)<=5).length}
function renderProducts(){let q=$('#productSearch').value.toLowerCase();$('#productsBody').innerHTML=products.filter(p=>p.name.toLowerCase().includes(q)).map(p=>`<tr><td>${p.image?`<img class="thumb" src="${esc(p.image)}">`:'—'}</td><td>${esc(p.name)}</td><td>${esc(p.cat)}</td><td>${Number(p.price).toFixed(2)} د</td><td>${p.stock}</td><td>${p.active===false?'مخفي':'ظاهر'}</td><td><div class="actions"><button class="edit" data-edit="${p.id}">تعديل</button><button class="hide" data-toggle="${p.id}">${p.active===false?'إظهار':'إخفاء'}</button><button class="delete" data-delete="${p.id}">حذف</button></div></td></tr>`).join('')||'<tr><td colspan="7">لا توجد منتجات</td></tr>'}
const labels={new:'جديد',contacted:'تم التواصل',confirmed:'مؤكد',shipped:'تم الشحن',cancelled:'ملغى'};
function renderOrders(){let q=$('#orderSearch').value.toLowerCase();$('#ordersBody').innerHTML=orders.filter(o=>(o.name+' '+o.phone+' '+o.city).toLowerCase().includes(q)).map(o=>`<tr><td>${esc(o.name)}</td><td><a href="tel:${esc(o.phone)}">${esc(o.phone)}</a></td><td>${esc(o.city)}</td><td>${Number(o.total).toFixed(2)} د</td><td><div class="order-items">${(o.items||[]).map(i=>`<div class="order-item"><div class="order-thumb">${i.image?`<img src="${esc(i.image)}" alt="${esc(i.name)}">`:'✦'}</div><div><b>${esc(i.name)}</b><small>${esc(i.cat||'')} — ${i.qty} × ${Number(i.price).toFixed(2)} د</small></div></div>`).join('')}</div></td><td><select class="status" data-status="${o.id}">${Object.entries(labels).map(([k,v])=>`<option value="${k}" ${o.status===k?'selected':''}>${v}</option>`).join('')}</select></td><td><div class="order-actions"><button class="details-btn" data-details="${esc(o.id)}">التفاصيل</button><button class="pdf-btn" data-pdf="${esc(o.id)}">PDF</button></div></td></tr>`).join('')||'<tr><td colspan="7">لا توجد طلبات</td></tr>'}
function makePdf(order){
  const area=$('#pdfArea');
  area.innerHTML=`<div class="invoice"><div class="invoice-head"><img src="assets/logo.png"><div><h1>Bijoux Accessoire</h1><p>تفاصيل الطلبية</p></div></div><div class="invoice-meta"><div><b>رقم الطلب:</b> ${esc(order.id)}</div><div><b>التاريخ:</b> ${new Date(order.createdAt).toLocaleString('ar-MA')}</div><div><b>العميل:</b> ${esc(order.name)}</div><div><b>الهاتف:</b> ${esc(order.phone)}</div><div><b>المدينة:</b> ${esc(order.city||'—')}</div></div><h2>المنتجات</h2><div class="invoice-items">${(order.items||[]).map(i=>`<div class="invoice-item"><div class="invoice-img">${i.image?`<img src="${esc(i.image)}">`:'✦'}</div><div class="invoice-info"><b>${esc(i.name)}</b><span>القسم: ${esc(i.cat||'—')}</span><span>الكمية: ${i.qty}</span><span>السعر: ${Number(i.price).toFixed(2)} درهم</span></div><strong>${(Number(i.price)*i.qty).toFixed(2)} درهم</strong></div>`).join('')}</div><div class="invoice-total">الإجمالي: ${Number(order.total).toFixed(2)} درهم</div>${order.notes?`<div class="invoice-notes"><b>ملاحظة:</b> ${esc(order.notes)}</div>`:''}<div class="invoice-footer">مهم: سنتواصل مع العميل لتأكيد الطلبية.</div></div>`;
  const images=[...area.querySelectorAll('img')];
  const ready=Promise.all(images.map(img=>img.complete?Promise.resolve():new Promise(r=>{img.onload=r;img.onerror=r})));
  ready.then(()=>{
    if(window.html2pdf){html2pdf().set({margin:8,filename:`${order.id}-Bijoux-Accessoire.pdf`,image:{type:'jpeg',quality:.95},html2canvas:{scale:2,useCORS:true,backgroundColor:'#fff'},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'}}).from(area.firstElementChild).save();}
    else {const w=window.open('','_blank');w.document.write('<html dir="rtl"><head><title>طلب '+order.id+'</title><style>body{font-family:Arial;padding:30px}img{max-width:120px}</style></head><body>'+area.innerHTML+'</body></html>');w.document.close();w.print();}
  });
}
function reset(){editId=null;$('#formTitle').textContent='إضافة منتج';$('#saveProduct').textContent='إضافة المنتج';$('#cancel').hidden=true;$('#pName').value='';$('#pPrice').value='';$('#pStock').value='';$('#pImage').value='';$('#pFile').value='';$('#pDesc').value='';$('#pCat').value='سلاسل';$('#pActive').checked=true}
$('#saveProduct').onclick=()=>{let name=$('#pName').value.trim();if(!name){$('#formMsg').textContent='اكتب اسم المنتج.';return}let data={id:editId||'p'+Date.now(),name,cat:$('#pCat').value,price:Number($('#pPrice').value||0),stock:Number($('#pStock').value||0),image:$('#pImage').value.trim(),description:$('#pDesc').value.trim(),active:$('#pActive').checked};let file=$('#pFile').files[0];if(file){const r=new FileReader();r.onload=()=>{data.image=r.result;commit(data)};r.readAsDataURL(file)}else commit(data)};
function commit(data){if(editId){const i=products.findIndex(p=>p.id===editId);products[i]=data}else products.unshift(data);save();reset();$('#formMsg').textContent='تم الحفظ بنجاح.';renderProducts();stats()}
$('#cancel').onclick=reset;$('#productSearch').oninput=renderProducts;$('#orderSearch').oninput=renderOrders;
document.addEventListener('click',e=>{const ed=e.target.closest('[data-edit]');if(ed){let p=products.find(x=>x.id===ed.dataset.edit);if(!p)return;editId=p.id;$('#formTitle').textContent='تعديل المنتج';$('#saveProduct').textContent='حفظ التعديل';$('#cancel').hidden=false;$('#pName').value=p.name;$('#pCat').value=p.cat;$('#pPrice').value=p.price;$('#pStock').value=p.stock;$('#pImage').value=p.image?.startsWith('data:')?'':(p.image||'');$('#pDesc').value=p.description||'';$('#pActive').checked=p.active!==false;scrollTo({top:0,behavior:'smooth'})}const tg=e.target.closest('[data-toggle]');if(tg){let p=products.find(x=>x.id===tg.dataset.toggle);p.active=p.active===false;save();renderProducts();stats()}const del=e.target.closest('[data-delete]');if(del&&confirm('حذف المنتج؟')){products=products.filter(x=>x.id!==del.dataset.delete);save();renderProducts();stats()}});
document.addEventListener('change',e=>{const s=e.target.closest('[data-status]');if(s){let o=orders.find(x=>x.id===s.dataset.status);if(o)o.status=s.value;localStorage.setItem('ba_orders',JSON.stringify(orders));stats()}});document.addEventListener('click',e=>{const b=e.target.closest('[data-pdf]');if(b){const o=orders.find(x=>x.id===b.dataset.pdf);if(o)makePdf(o)}});
function showOrderDetails(order){
  const old=document.querySelector('#orderModal'); if(old) old.remove();
  const items=(order.items||[]).map(i=>`<div class="modal-item">
    <div class="modal-thumb">${i.image?`<img src="${esc(i.image)}" alt="${esc(i.name)}">`:'✦'}</div>
    <div class="modal-info"><b>${esc(i.name)}</b><span>${esc(i.cat||'منتج')}</span><span>الكمية: <strong>${Number(i.qty)||0}</strong></span><span>سعر الوحدة: ${Number(i.price||0).toFixed(2)} درهم</span></div>
    <strong>${(Number(i.price||0)*(Number(i.qty)||0)).toFixed(2)} درهم</strong>
  </div>`).join('');
  const modal=document.createElement('div'); modal.id='orderModal'; modal.className='order-modal';
  modal.innerHTML=`<div class="modal-backdrop" data-close-modal></div><div class="modal-card" dir="rtl">
    <button class="modal-close" data-close-modal>×</button>
    <div class="modal-head"><img src="assets/logo.png" alt="Bijoux Accessoire"><div><h2>تفاصيل الطلبية</h2><small>${esc(order.id)}</small></div></div>
    <div class="customer-box"><b>${esc(order.name||'بدون اسم')}</b><span>📞 ${esc(order.phone||'—')}</span><span>📍 ${esc(order.city||'—')}</span></div>
    <div class="modal-items">${items||'<p>لا توجد منتجات.</p>'}</div>
    <div class="modal-total">الإجمالي: ${Number(order.total||0).toFixed(2)} درهم</div>
    ${order.notes?`<div class="modal-notes"><b>ملاحظة:</b> ${esc(order.notes)}</div>`:''}
    <div class="modal-buttons"><a href="tel:${esc(order.phone||'')}" class="call-btn">📞 اتصال</a><button class="pdf-btn" data-modal-pdf="${esc(order.id)}">📄 PDF</button></div>
  </div>`;
  document.body.appendChild(modal);
}
document.addEventListener('click',e=>{
  const d=e.target.closest('[data-details]');
  if(d){const o=orders.find(x=>x.id===d.dataset.details);if(o)showOrderDetails(o);}
  if(e.target.closest('[data-close-modal]')){document.querySelector('#orderModal')?.remove();}
  const mp=e.target.closest('[data-modal-pdf]');
  if(mp){const o=orders.find(x=>x.id===mp.dataset.modalPdf);if(o)makePdf(o);}
});

$('#logout').onclick=()=>{sessionStorage.removeItem('ba_admin');location.href='admin-login.html'};stats();renderProducts();renderOrders();

const PASS_KEY='ba_admin_password';
if(!localStorage.getItem(PASS_KEY)) localStorage.setItem(PASS_KEY,'2003');
const changeBtn=document.querySelector('#changePassword');
if(changeBtn){changeBtn.onclick=()=>{const current=document.querySelector('#currentPassword').value;const next=document.querySelector('#newPassword').value;const confirmPass=document.querySelector('#confirmPassword').value;const msg=document.querySelector('#passwordMsg');msg.className='settings-msg';if(current!==localStorage.getItem(PASS_KEY)){msg.textContent='كلمة المرور الحالية غير صحيحة.';msg.classList.add('bad');return}if(next.length<4){msg.textContent='كلمة المرور الجديدة يجب أن تحتوي على 4 أحرف أو أرقام على الأقل.';msg.classList.add('bad');return}if(next!==confirmPass){msg.textContent='تأكيد كلمة المرور غير مطابق.';msg.classList.add('bad');return}localStorage.setItem(PASS_KEY,next);document.querySelector('#currentPassword').value='';document.querySelector('#newPassword').value='';document.querySelector('#confirmPassword').value='';msg.textContent='تم تغيير كلمة المرور بنجاح.';}}

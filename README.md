# Bijoux Accessoire — HTML/CSS/JS

نسخة ثابتة بدون Next.js أو npm، مناسبة للرفع مباشرة على Netlify أو Cloudflare Pages أو أي استضافة ملفات ثابتة.

## 1) Supabase
نفّذ ملف `supabase.sql` من النسخة الأصلية في Supabase SQL Editor.

ثم افتح `config.js` وضع:
- `window.SUPABASE_URL`
- `window.SUPABASE_ANON_KEY`

استخدم ANON KEY فقط. لا تضع Service Role Key في ملفات الموقع.

## 2) الصفحات
- `index.html` موقع العميل
- `checkout.html` السلة وتأكيد الطلب
- `admin-login.html` تسجيل دخول المدير
- `admin.html` لوحة الإدارة

## 3) GitHub
بعد فك ZIP، ارفع **محتويات المجلد مباشرة** إلى المستودع، بحيث يكون `index.html` في الجذر.

## 4) مهم
هذه نسخة Static. حماية Admin الفعلية تعتمد على Supabase Auth + RLS. لا تضع أسرارًا خاصة في JavaScript.

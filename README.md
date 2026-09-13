# Bijoux Accessoire

متجر مجوهرات وإكسسوارات بالجملة — Next.js + Supabase + Vercel.

## التشغيل
1. أنشئ مشروعًا مجانيًا في Supabase.
2. افتح SQL Editor وشغّل `supabase.sql`.
3. من Authentication > Users أنشئ مستخدم Admin بالبريد وكلمة المرور.
4. انسخ `.env.example` إلى `.env.local` وضع `NEXT_PUBLIC_SUPABASE_URL` و `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. `npm install`
6. `npm run dev`
7. انشر المشروع على Vercel وأضف نفس متغيرات البيئة.

## الروابط
- العميل: `/`
- إتمام الطلب: `/checkout`
- Admin: `/admin/login`

## ملاحظة
السياسة الحالية تعتبر كل مستخدم authenticated مديرًا. قبل فتح لوحة Admin للعامة، من الأفضل تقييد سياسات RLS على بريد Admin محدد أو جدول admin_users.

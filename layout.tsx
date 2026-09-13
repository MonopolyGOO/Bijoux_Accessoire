import './globals.css';
import Image from 'next/image';
export const metadata={title:'Bijoux Accessoire | Bijoux & Accessoires en Gros',description:'Mujawharat wa accessoires بالجملة'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ar" dir="rtl"><body><div className="top">✨ مجوهرات وإكسسوارات بالجملة — سنتواصل معك لتأكيد الطلبية</div><header className="container nav"><a href="/" className="brand"><Image src="/logo.png" alt="Bijoux Accessoire" width={58} height={58}/><span>Bijoux <b>Accessoire</b></span></a><a className="btn outline" href="/checkout">🛒 السلة</a></header>{children}</body></html>}

import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navigation() {
  const router = useRouter();
  const currentPath = router.pathname;

  const navItems = [
    { href: '/work', label: 'WORK' },
    { href: '/cv', label: 'CV' },
    { href: '/contact', label: 'CONTACT' },
    { href: '/studio-edul', label: 'STUDIO EDUL' },
  ];

  // index 페이지인 경우 모든 nav-item에 active 스타일 적용
  const isIndexPage = currentPath === '/';
  // Studio Edul 페이지인 경우 특별한 투명도 규칙 적용
  const isStudioEdulPage = currentPath === '/studio-edul';

  return (
    <nav className="flex justify-between items-center w-full max-w-[940px] mx-auto mb-[120px] px-[15px]">
      <Link href="/" className={`nav-logo ${isStudioEdulPage ? 'opacity-30 transition-opacity duration-200' : ''}`}>
        2
      </Link>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`nav-item ${currentPath === item.href || isIndexPage || isStudioEdulPage ? 'active' : ''}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}


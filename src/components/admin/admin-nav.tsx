'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/admin', label: '대시보드' },
  { href: '/admin/users', label: '사용자 관리' },
  { href: '/admin/questions', label: '질문/답변 관리' },
  { href: '/admin/tags', label: '태그 관리' },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="w-64 space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center px-4 py-2 text-sm font-medium rounded-lg
              ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }
            `}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
} 
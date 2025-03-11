'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

interface MainLayoutProps {
  children: React.ReactNode
  user?: Profile | null
}

export function MainLayout({ children, user }: MainLayoutProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">사내 QnA</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                href="/questions"
                className={`transition-colors hover:text-foreground/80 ${
                  isActive('/questions')
                    ? 'text-foreground'
                    : 'text-foreground/60'
                }`}
              >
                질문 목록
              </Link>
              <Link
                href="/questions/new"
                className={`transition-colors hover:text-foreground/80 ${
                  isActive('/questions/new')
                    ? 'text-foreground'
                    : 'text-foreground/60'
                }`}
              >
                질문하기
              </Link>
              {user?.id && (
                <Link
                  href="/my"
                  className={`transition-colors hover:text-foreground/80 ${
                    isActive('/my') ? 'text-foreground' : 'text-foreground/60'
                  }`}
                >
                  내 활동
                </Link>
              )}
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <button className="inline-flex items-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64">
                <span className="hidden lg:inline-flex">검색...</span>
                <span className="inline-flex lg:hidden">검색...</span>
                <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </button>
            </div>
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <SunIcon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">테마 변경</span>
            </button>
            <div className="flex items-center">
              {user?.id ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    {user.name}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="ml-4 text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  로그인
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="container py-6">{children}</div>
      </main>
    </div>
  )
} 
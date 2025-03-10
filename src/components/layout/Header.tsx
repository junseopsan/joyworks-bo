'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  user?: {
    name: string;
    isAdmin: boolean;
  } | null;
}

export default function Header({ user }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-primary-600">
                사내 QnA
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/questions"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/questions')
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                질문 목록
              </Link>
              <Link
                href="/questions/new"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/questions/new')
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                질문하기
              </Link>
              {user?.isAdmin && (
                <Link
                  href="/admin"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/admin')
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  관리자
                </Link>
              )}
            </nav>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className="text-sm font-medium text-gray-700 hover:text-gray-800"
                >
                  {user.name} 님
                </Link>
                <Link
                  href="/auth/logout"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  로그아웃
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-800"
                >
                  로그인
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              aria-expanded="false"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">메뉴 열기</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/questions"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/questions')
                  ? 'border-primary-500 text-primary-700 bg-primary-50'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              }`}
            >
              질문 목록
            </Link>
            <Link
              href="/questions/new"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/questions/new')
                  ? 'border-primary-500 text-primary-700 bg-primary-50'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              }`}
            >
              질문하기
            </Link>
            {user?.isAdmin && (
              <Link
                href="/admin"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive('/admin')
                    ? 'border-primary-500 text-primary-700 bg-primary-50'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                관리자
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="space-y-1">
                <Link
                  href="/profile"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                >
                  프로필
                </Link>
                <Link
                  href="/auth/logout"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                >
                  로그아웃
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  href="/auth/login"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                >
                  로그인
                </Link>
                <Link
                  href="/auth/register"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
} 
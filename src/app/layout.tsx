<<<<<<< HEAD
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { MainLayout } from '@/components/layout/main-layout'
import { Toaster } from 'sonner'
import { supabase } from '@/lib/supabase'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: '사내 QnA',
    template: '%s | 사내 QnA',
  },
  description: '사내 질문과 답변 플랫폼',
}

async function getUser() {
  const headersList = headers()
  const cookies = headersList.get('cookie')

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MainLayout user={user}>
            {children}
          </MainLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
=======
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "사내 QnA 시스템",
  description: "회사 내부 질문 및 답변 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className={`${inter.variable} font-sans h-full`}>
        {children}
      </body>
    </html>
  );
>>>>>>> 77ef2f57fd5a1fd90913989b938bfec3da466817
}

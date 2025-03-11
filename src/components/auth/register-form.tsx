'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { supabase } from '@/lib/supabase'

const registerSchema = z.object({
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다'),
  email: z.string().email('올바른 이메일 주소를 입력하세요'),
  phone: z.string().min(10, '올바른 전화번호를 입력하세요'),
  department: z.string().min(1, '부서명을 입력하세요'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword'],
})

type RegisterValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      department: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: RegisterValues) {
    setIsLoading(true)

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (signUpError) {
        throw signUpError
      }

      const { error: profileError } = await supabase.from('profiles').insert({
        id: (await supabase.auth.getUser()).data.user?.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        department: data.department,
      })

      if (profileError) {
        throw profileError
      }

      toast.success('회원가입이 완료되었습니다')
      router.push('/login')
    } catch (error) {
      toast.error('회원가입에 실패했습니다')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          이름
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          disabled={isLoading}
          {...form.register('name')}
          className="input"
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          이메일
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          disabled={isLoading}
          {...form.register('email')}
          className="input"
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor="phone"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          전화번호
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          disabled={isLoading}
          {...form.register('phone')}
          className="input"
        />
        {form.formState.errors.phone && (
          <p className="text-sm text-red-500">
            {form.formState.errors.phone.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor="department"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          부서명
        </label>
        <input
          id="department"
          type="text"
          disabled={isLoading}
          {...form.register('department')}
          className="input"
        />
        {form.formState.errors.department && (
          <p className="text-sm text-red-500">
            {form.formState.errors.department.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          disabled={isLoading}
          {...form.register('password')}
          className="input"
        />
        {form.formState.errors.password && (
          <p className="text-sm text-red-500">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          비밀번호 확인
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          disabled={isLoading}
          {...form.register('confirmPassword')}
          className="input"
        />
        {form.formState.errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>
      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isLoading}
      >
        {isLoading ? '회원가입 중...' : '회원가입'}
      </button>
    </form>
  )
} 
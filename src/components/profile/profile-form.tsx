'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

const profileSchema = z.object({
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다'),
  bio: z.string().optional(),
  website: z.string().url('올바른 URL을 입력하세요').optional().or(z.literal('')),
})

type ProfileValues = z.infer<typeof profileSchema>

interface ProfileFormProps {
  profile: Profile
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name || '',
      bio: profile.bio || '',
      website: profile.website || '',
    },
  })

  async function onSubmit(data: ProfileValues) {
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          bio: data.bio,
          website: data.website,
        })
        .eq('id', profile.id)

      if (error) {
        throw error
      }

      toast.success('프로필이 수정되었습니다')
      router.refresh()
    } catch (error) {
      toast.error('프로필 수정에 실패했습니다')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          이름
        </label>
        <input
          {...form.register('name')}
          type="text"
          className="input w-full"
          placeholder="이름을 입력하세요"
          disabled={isSubmitting}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="bio"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          소개
        </label>
        <textarea
          {...form.register('bio')}
          className="textarea h-20 w-full"
          placeholder="자기소개를 입력하세요"
          disabled={isSubmitting}
        />
        {form.formState.errors.bio && (
          <p className="text-sm text-red-500">
            {form.formState.errors.bio.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="website"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          웹사이트
        </label>
        <input
          {...form.register('website')}
          type="url"
          className="input w-full"
          placeholder="웹사이트 URL을 입력하세요"
          disabled={isSubmitting}
        />
        {form.formState.errors.website && (
          <p className="text-sm text-red-500">
            {form.formState.errors.website.message}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary"
        >
          {isSubmitting ? '수정 중...' : '프로필 수정'}
        </button>
      </div>
    </form>
  )
} 
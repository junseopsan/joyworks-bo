'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { QuestionTag } from '@/types'

interface QuestionFilterProps {
  sort: string
  filter: string
  tag: string
}

export function QuestionFilter({ sort, filter, tag }: QuestionFilterProps) {
  const router = useRouter()
  const [tags, setTags] = useState<QuestionTag[]>([])

  useEffect(() => {
    async function fetchTags() {
      const { data } = await supabase
        .from('question_tags')
        .select('*')
        .order('name')

      setTags(data || [])
    }

    fetchTags()
  }, [])

  const handleChange = (type: string, value: string) => {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set(type, value)
    searchParams.delete('page')

    router.push(`/questions?${searchParams.toString()}`)
  }

  return (
    <div className="flex items-center gap-4">
      <select
        value={sort}
        onChange={(e) => handleChange('sort', e.target.value)}
        className="select select-bordered"
      >
        <option value="latest">최신순</option>
        <option value="oldest">오래된순</option>
        <option value="most-viewed">조회순</option>
        <option value="most-answered">답변순</option>
      </select>

      <select
        value={filter}
        onChange={(e) => handleChange('filter', e.target.value)}
        className="select select-bordered"
      >
        <option value="all">전체</option>
        <option value="no-answer">답변 없음</option>
        <option value="has-answer">답변 있음</option>
      </select>

      <select
        value={tag}
        onChange={(e) => handleChange('tag', e.target.value)}
        className="select select-bordered"
      >
        <option value="">태그 전체</option>
        {tags.map((tag) => (
          <option key={tag.id} value={tag.name}>
            {tag.name}
          </option>
        ))}
      </select>
    </div>
  )
} 
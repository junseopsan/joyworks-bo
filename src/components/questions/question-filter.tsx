'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { QuestionTag } from '@/types'

interface QuestionFilterProps {
  sort: string
  filter: string
  tag: string
}

export function QuestionFilter({ sort, filter, tag }: QuestionFilterProps) {
  const router = useRouter()
  const [tags, setTags] = React.useState<QuestionTag[]>([])

  React.useEffect(() => {
    async function fetchTags() {
      const { data } = await supabase
        .from('question_tags')
        .select('name')
        .order('name')

      if (data) {
        const uniqueTags = Array.from(new Set(data.map((tag) => tag.name))).map(
          (name) => ({ name })
        )
        setTags(uniqueTags)
      }
    }

    fetchTags()
  }, [])

  const handleChange = (
    type: 'sort' | 'filter' | 'tag',
    value: string
  ) => {
    const searchParams = new URLSearchParams({
      sort: type === 'sort' ? value : sort,
      filter: type === 'filter' ? value : filter,
      tag: type === 'tag' ? value : tag,
    })

    router.push(`/questions?${searchParams.toString()}`)
  }

  return (
    <div className="flex items-center gap-4">
      <select
        value={sort}
        onChange={(e) => handleChange('sort', e.target.value)}
        className="select"
      >
        <option value="latest">최신순</option>
        <option value="oldest">오래된순</option>
        <option value="most_viewed">조회순</option>
        <option value="most_answered">답변순</option>
      </select>

      <select
        value={filter}
        onChange={(e) => handleChange('filter', e.target.value)}
        className="select"
      >
        <option value="all">전체</option>
        <option value="unsolved">미해결</option>
        <option value="solved">해결됨</option>
      </select>

      <select
        value={tag}
        onChange={(e) => handleChange('tag', e.target.value)}
        className="select"
      >
        <option value="">태그 선택</option>
        {tags.map((tag) => (
          <option key={tag.name} value={tag.name}>
            {tag.name}
          </option>
        ))}
      </select>
    </div>
  )
} 
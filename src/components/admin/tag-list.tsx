'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import type { Tag } from '@/types'

interface TagListProps {
  tags: Tag[]
}

export function TagList({ tags: initialTags }: TagListProps) {
  const [tags, setTags] = useState(initialTags)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)

  const handleEdit = async (tag: Tag) => {
    const name = prompt('태그 이름을 입력하세요:', tag.name)
    if (!name || name === tag.name) return

    try {
      const { error } = await supabase
        .from('tags')
        .update({
          name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', tag.id)

      if (error) throw error

      setTags((prev) =>
        prev.map((t) => (t.id === tag.id ? { ...t, name } : t))
      )

      toast.success('태그가 수정되었습니다')
    } catch (error) {
      console.error('Error updating tag:', error)
      toast.error('태그 수정에 실패했습니다')
    }
  }

  const handleDelete = async (tag: Tag) => {
    if (!confirm('정말 이 태그를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tag.id)

      if (error) throw error

      setTags((prev) => prev.filter((t) => t.id !== tag.id))
      toast.success('태그가 삭제되었습니다')
    } catch (error) {
      console.error('Error deleting tag:', error)
      toast.error('태그 삭제에 실패했습니다')
    }
  }

  return (
    <div className="rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-medium">이름</th>
              <th className="px-4 py-3 text-left text-sm font-medium">사용 횟수</th>
              <th className="px-4 py-3 text-left text-sm font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr key={tag.id} className="border-b">
                <td className="px-4 py-3 text-sm">{tag.name}</td>
                <td className="px-4 py-3 text-sm">
                  {tag.questions?.[0]?.count || 0}
                </td>
                <td className="px-4 py-3 text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(tag)}
                    className="text-primary hover:text-primary/80"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(tag)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 
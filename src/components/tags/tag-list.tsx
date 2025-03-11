'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Edit2, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Tag } from '@/types'

interface TagListProps {
  initialTags: Tag[]
}

export function TagList({ initialTags }: TagListProps) {
  const [tags, setTags] = useState(initialTags)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [editedName, setEditedName] = useState('')
  const [editedDescription, setEditedDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag)
    setEditedName(tag.name)
    setEditedDescription(tag.description || '')
  }

  const handleCancelEdit = () => {
    setEditingTag(null)
    setEditedName('')
    setEditedDescription('')
  }

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTag) return

    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('tags')
        .update({
          name: editedName,
          description: editedDescription,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingTag.id)

      if (error) throw error

      setTags((prev) =>
        prev.map((tag) =>
          tag.id === editingTag.id
            ? {
                ...tag,
                name: editedName,
                description: editedDescription,
              }
            : tag
        )
      )

      toast.success('태그가 수정되었습니다')
      handleCancelEdit()
    } catch (error) {
      console.error('Error updating tag:', error)
      toast.error('태그 수정에 실패했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (tag: Tag) => {
    if (!confirm('정말 이 태그를 삭제하시겠습니까?')) return

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">태그 목록</h2>
        <span className="text-sm text-muted-foreground">
          총 {tags.length}개의 태그
        </span>
      </div>

      <div className="space-y-4">
        {tags.map((tag) =>
          editingTag?.id === tag.id ? (
            <form
              key={tag.id}
              onSubmit={handleSubmitEdit}
              className="space-y-4 rounded-lg border p-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium">태그 이름</label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">설명</label>
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn btn-secondary"
                  disabled={isSubmitting}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '저장 중...' : '저장'}
                </button>
              </div>
            </form>
          ) : (
            <div
              key={tag.id}
              className="flex items-start justify-between rounded-lg border p-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{tag.name}</h3>
                  <span className="text-sm text-muted-foreground">
                    {tag.questions?.length || 0}개의 질문
                  </span>
                </div>
                {tag.description && (
                  <p className="text-sm text-muted-foreground">
                    {tag.description}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(tag)}
                  className="rounded-md p-2 hover:bg-secondary"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(tag)}
                  className="rounded-md p-2 hover:bg-secondary text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
} 
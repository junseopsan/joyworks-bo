'use client'

import { useRef, useEffect } from 'react'
import { Editor } from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'

interface MDXEditorProps {
  initialValue?: string
  onChange?: (value: string) => void
  height?: string
}

export function MDXEditor({ initialValue = '', onChange, height = '400px' }: MDXEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const editorInstanceRef = useRef<Editor | null>(null)

  useEffect(() => {
    if (!editorRef.current) return

    const editor = new Editor({
      el: editorRef.current,
      height,
      initialValue,
      initialEditType: 'markdown',
      previewStyle: 'vertical',
      onChange: () => {
        const value = editorInstanceRef.current?.getMarkdown() || ''
        onChange?.(value)
      },
    })

    editorInstanceRef.current = editor

    return () => {
      editor.destroy()
    }
  }, [height, initialValue, onChange])

  return <div ref={editorRef} />
} 
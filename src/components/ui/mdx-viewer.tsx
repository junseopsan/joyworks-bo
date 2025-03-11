'use client'

import { useEffect, useRef } from 'react'
import { Viewer } from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor-viewer.css'

interface MDXViewerProps {
  content: string
}

export function MDXViewer({ content }: MDXViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null)
  const viewerInstanceRef = useRef<Viewer | null>(null)

  useEffect(() => {
    if (!viewerRef.current) return

    const viewer = new Viewer({
      el: viewerRef.current,
      initialValue: content,
    })

    viewerInstanceRef.current = viewer

    return () => {
      viewer.destroy()
    }
  }, [content])

  return <div ref={viewerRef} />
} 
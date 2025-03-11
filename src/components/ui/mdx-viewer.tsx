'use client'

import * as React from 'react'
import { MDXEditor } from '@mdxeditor/editor'

interface MDXViewerProps {
  content: string
}

export function MDXViewer({ content }: MDXViewerProps) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <MDXEditor
        markdown={content}
        readOnly
        contentEditableClassName="!bg-transparent !p-0"
        plugins={[]}
      />
    </div>
  )
} 
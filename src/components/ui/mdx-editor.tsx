'use client'

import * as React from 'react'
import { MDXEditorMethods } from '@mdxeditor/editor'
import { MDXEditor as BaseMDXEditor } from '@mdxeditor/editor/MDXEditor'
import { headingsPlugin } from '@mdxeditor/editor/plugins/headings'
import { listsPlugin } from '@mdxeditor/editor/plugins/lists'
import { quotePlugin } from '@mdxeditor/editor/plugins/quote'
import { thematicBreakPlugin } from '@mdxeditor/editor/plugins/thematic-break'
import { markdownShortcutPlugin } from '@mdxeditor/editor/plugins/markdown-shortcut'
import { toolbarPlugin } from '@mdxeditor/editor/plugins/toolbar'
import { UndoRedo } from '@mdxeditor/editor/plugins/toolbar/components/UndoRedo'
import { BoldItalicUnderlineToggles } from '@mdxeditor/editor/plugins/toolbar/components/BoldItalicUnderlineToggles'
import { BlockTypeSelect } from '@mdxeditor/editor/plugins/toolbar/components/BlockTypeSelect'
import { CreateLink } from '@mdxeditor/editor/plugins/toolbar/components/CreateLink'
import { linkPlugin } from '@mdxeditor/editor/plugins/link'
import { linkDialogPlugin } from '@mdxeditor/editor/plugins/link-dialog'

interface MDXEditorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function MDXEditor({ value, onChange, disabled }: MDXEditorProps) {
  const ref = React.useRef<MDXEditorMethods>(null)

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <BaseMDXEditor
        ref={ref}
        markdown={value}
        onChange={onChange}
        readOnly={disabled}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <BlockTypeSelect />
                <CreateLink />
              </>
            ),
          }),
        ]}
        contentEditableClassName="min-h-[200px] p-4 rounded-md border bg-background"
      />
    </div>
  )
} 
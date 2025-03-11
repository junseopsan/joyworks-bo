'use client'

import * as React from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = React.useMemo(() => {
    const items: (number | string)[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          items.push(i)
        }
        items.push('...')
        items.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        items.push(1)
        items.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          items.push(i)
        }
      } else {
        items.push(1)
        items.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(i)
        }
        items.push('...')
        items.push(totalPages)
      }
    }

    return items
  }, [currentPage, totalPages])

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn btn-icon btn-ghost"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </button>

      {pages.map((page, index) => (
        <button
          key={index}
          onClick={() =>
            typeof page === 'number' ? onPageChange(page) : undefined
          }
          disabled={typeof page === 'string'}
          className={`btn ${
            page === currentPage
              ? 'btn-primary'
              : typeof page === 'string'
              ? 'btn-ghost cursor-default'
              : 'btn-ghost'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn btn-icon btn-ghost"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </div>
  )
} 
'use client';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author: {
    name: string;
    department?: string;
  };
}

interface CommentListProps {
  comments: Comment[];
}

export default function CommentList({ comments }: CommentListProps) {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-sm text-gray-500 py-2">
        아직 댓글이 없습니다.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {comments.map((comment) => (
        <li key={comment.id} className="bg-gray-50 rounded-md p-3">
          <div className="text-sm text-gray-700">{comment.content}</div>
          <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <span className="font-medium text-gray-900">
                {comment.author.name}
              </span>
              {comment.author.department && (
                <span className="ml-1">({comment.author.department})</span>
              )}
            </div>
            <time dateTime={comment.created_at}>
              {new Date(comment.created_at).toLocaleDateString()}
            </time>
          </div>
        </li>
      ))}
    </ul>
  );
} 
import { notFound } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { createClient } from '@/lib/supabase-server';

// 임시 컴포넌트 (실제 컴포넌트가 구현될 때까지 사용)
const AnswerForm = ({ questionId }: { questionId: string }) => (
  <div className="bg-gray-100 p-4 rounded-md">
    <p className="text-gray-500 text-center">답변 작성 폼이 여기에 표시됩니다.</p>
  </div>
);

const AnswerList = ({ answers, questionId }: { answers: any[]; questionId: string }) => (
  <div className="space-y-4">
    {answers.length === 0 ? (
      <p className="text-gray-500 text-center">아직 답변이 없습니다.</p>
    ) : (
      answers.map((answer) => (
        <div key={answer.id} className="bg-white border border-gray-200 rounded-md p-4">
          <p>{answer.content}</p>
          <div className="mt-2 text-sm text-gray-500">
            {answer.author?.name} • {new Date(answer.created_at).toLocaleDateString()}
          </div>
        </div>
      ))
    )}
  </div>
);

const CommentForm = ({ questionId, answerId }: { questionId?: string; answerId?: string }) => (
  <div className="mt-2">
    <textarea
      className="w-full p-2 border border-gray-300 rounded-md"
      placeholder="댓글을 작성하세요..."
      rows={2}
    ></textarea>
    <button className="mt-2 px-3 py-1 bg-primary-600 text-white rounded-md text-sm">
      댓글 등록
    </button>
  </div>
);

const CommentList = ({ comments }: { comments: any[] }) => (
  <div className="space-y-2 mt-2">
    {comments.length === 0 ? (
      <p className="text-sm text-gray-500">아직 댓글이 없습니다.</p>
    ) : (
      comments.map((comment) => (
        <div key={comment.id} className="bg-gray-50 p-2 rounded-md text-sm">
          <p>{comment.content}</p>
          <div className="text-xs text-gray-500 mt-1">
            {comment.author?.name} • {new Date(comment.created_at).toLocaleDateString()}
          </div>
        </div>
      ))
    )}
  </div>
);

interface QuestionPageProps {
  params: {
    id: string;
  };
}

async function getQuestion(id: string) {
  const supabase = await createClient();
  
  // 조회수 증가
  await supabase.rpc('increment_view_count', { question_id: id });
  
  const { data: question, error } = await supabase
    .from('questions')
    .select(`
      *,
      author:profiles(*),
      tags:tags_on_questions(tag:tags(*))
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching question:', error);
    return null;
  }
  
  return question;
}

async function getAnswers(questionId: string) {
  const supabase = await createClient();
  
  const { data: answers, error } = await supabase
    .from('answers')
    .select(`
      *,
      author:profiles(*),
      helpful_votes:helpful_votes(count),
      comments(*)
    `)
    .eq('question_id', questionId)
    .order('is_accepted', { ascending: false })
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching answers:', error);
    return [];
  }
  
  return answers || [];
}

async function getComments(questionId: string) {
  const supabase = await createClient();
  
  const { data: comments, error } = await supabase
    .from('comments')
    .select(`
      *,
      author:profiles(*)
    `)
    .eq('question_id', questionId)
    .is('answer_id', null)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
  
  return comments || [];
}

async function getSimilarQuestions(questionId: string, title: string) {
  const supabase = await createClient();
  
  const { data: questions, error } = await supabase
    .from('questions')
    .select(`
      id,
      title,
      created_at,
      view_count,
      answers(count)
    `)
    .neq('id', questionId)
    .textSearch('title', title, {
      type: 'websearch',
      config: 'english',
    })
    .limit(5);
  
  if (error) {
    console.error('Error fetching similar questions:', error);
    return [];
  }
  
  return questions || [];
}

export default async function QuestionPage({ params }: QuestionPageProps) {
  const question = await getQuestion(params.id);
  
  if (!question) {
    notFound();
  }
  
  const [answers, comments, similarQuestions] = await Promise.all([
    getAnswers(params.id),
    getComments(params.id),
    getSimilarQuestions(params.id, question.title),
  ]);

  return (
    <MainLayout>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 break-words">
                {question.title}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {new Date(question.created_at).toLocaleDateString()} • 조회수 {question.view_count}
              </p>
            </div>
            <Link
              href="/questions"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              목록으로
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="prose max-w-none">
            {question.content}
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {question.tags?.map((tagItem: any) => (
              <span
                key={tagItem.tag.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
              >
                {tagItem.tag.name}
              </span>
            ))}
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-500">
                  <span className="text-lg font-medium leading-none text-white">
                    {question.author.name.charAt(0)}
                  </span>
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {question.author.name}
                </p>
                <p className="text-sm text-gray-500">
                  {question.author.department || '부서 정보 없음'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 질문에 대한 댓글 */}
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">댓글</h2>
          <CommentList comments={comments} />
          <div className="mt-4">
            <CommentForm questionId={params.id} />
          </div>
        </div>
        
        {/* 답변 목록 */}
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">
            {answers.length > 0 ? `${answers.length}개의 답변` : '아직 답변이 없습니다'}
          </h2>
          <AnswerList answers={answers} questionId={params.id} />
        </div>
        
        {/* 답변 작성 폼 */}
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">답변 작성</h2>
          <AnswerForm questionId={params.id} />
        </div>
        
        {/* 유사한 질문 */}
        {similarQuestions.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">유사한 질문</h2>
            <ul className="divide-y divide-gray-200">
              {similarQuestions.map((similarQuestion) => (
                <li key={similarQuestion.id} className="py-3">
                  <Link
                    href={`/questions/${similarQuestion.id}`}
                    className="block hover:bg-gray-50"
                  >
                    <p className="text-sm font-medium text-primary-600 hover:text-primary-700">
                      {similarQuestion.title}
                    </p>
                    <div className="mt-1 flex items-center text-xs text-gray-500">
                      <span>{similarQuestion.answers.length} 답변</span>
                      <span className="mx-1">•</span>
                      <span>{similarQuestion.view_count} 조회</span>
                      <span className="mx-1">•</span>
                      <span>
                        {new Date(similarQuestion.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </MainLayout>
  );
} 
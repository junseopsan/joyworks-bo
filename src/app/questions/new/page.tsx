'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { createClient } from '@/lib/supabase-client';

interface Tag {
  id: string;
  name: string;
}

export default function NewQuestionPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [similarQuestions, setSimilarQuestions] = useState<any[]>([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // 태그 목록 가져오기
    const fetchTags = async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');

      if (!error && data) {
        setAvailableTags(data);
      }
    };

    fetchTags();
  }, [supabase]);

  // 제목이 변경될 때 유사한 질문 검색
  useEffect(() => {
    const searchSimilarQuestions = async () => {
      if (title.length < 3) {
        setSimilarQuestions([]);
        return;
      }

      const { data, error } = await supabase
        .from('questions')
        .select(`
          id,
          title,
          content,
          created_at,
          author:profiles(name)
        `)
        .textSearch('title', title, {
          type: 'websearch',
          config: 'english',
        })
        .limit(3);

      if (!error && data) {
        setSimilarQuestions(data);
      }
    };

    const debounce = setTimeout(() => {
      searchSimilarQuestions();
    }, 500);

    return () => clearTimeout(debounce);
  }, [title, supabase]);

  const handleTagSelect = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleAddNewTag = async () => {
    if (!newTag.trim()) return;

    // 이미 존재하는 태그인지 확인
    const existingTag = availableTags.find(
      (tag) => tag.name.toLowerCase() === newTag.toLowerCase()
    );

    if (existingTag) {
      if (!selectedTags.includes(existingTag.id)) {
        setSelectedTags([...selectedTags, existingTag.id]);
      }
      setNewTag('');
      return;
    }

    // 새 태그 추가
    const { data, error } = await supabase
      .from('tags')
      .insert({ name: newTag.trim() })
      .select();

    if (error) {
      setError('태그 추가 중 오류가 발생했습니다.');
      return;
    }

    if (data && data.length > 0) {
      setAvailableTags([...availableTags, data[0]]);
      setSelectedTags([...selectedTags, data[0].id]);
      setNewTag('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 현재 로그인한 사용자 정보 가져오기
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('로그인이 필요합니다.');
      }

      // 질문 등록
      const { data: questionData, error: questionError } = await supabase
        .from('questions')
        .insert({
          title,
          content,
          author_id: user.id,
          is_notice: false,
          view_count: 0,
        })
        .select();

      if (questionError) {
        throw questionError;
      }

      if (questionData && questionData.length > 0) {
        const questionId = questionData[0].id;

        // 태그 연결
        if (selectedTags.length > 0) {
          const tagsToInsert = selectedTags.map((tagId) => ({
            question_id: questionId,
            tag_id: tagId,
          }));

          const { error: tagError } = await supabase
            .from('tags_on_questions')
            .insert(tagsToInsert);

          if (tagError) {
            console.error('태그 연결 중 오류:', tagError);
          }
        }

        router.push(`/questions/${questionId}`);
      }
    } catch (error: any) {
      setError(error.message || '질문 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            새 질문 작성
          </h1>

          {similarQuestions.length > 0 && (
            <div className="mb-6 bg-yellow-50 p-4 rounded-md">
              <h2 className="text-sm font-medium text-yellow-800 mb-2">
                유사한 질문이 있습니다. 확인해 보세요:
              </h2>
              <ul className="space-y-2">
                {similarQuestions.map((question) => (
                  <li key={question.id}>
                    <a
                      href={`/questions/${question.id}`}
                      className="text-yellow-700 hover:text-yellow-900 hover:underline"
                    >
                      {question.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                제목
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                내용
              </label>
              <textarea
                id="content"
                name="content"
                rows={8}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                태그
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {availableTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagSelect(tag.id)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      selectedTags.includes(tag.id)
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  placeholder="새 태그 추가"
                  className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddNewTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddNewTag}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  추가
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '등록 중...' : '질문 등록'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
} 
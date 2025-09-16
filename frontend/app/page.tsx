'use client';

import { useEffect, useState, FormEvent } from 'react';

type StudyRecord = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  last_reviewed_at: string;
};

export default function Home() {
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchRecords = async () => {
    try {
      setError(null);
      // 相対パスに統一（Next の rewrites で 8080 にプロキシ）
      const res = await fetch('/api/records', { cache: 'no-store' });
      if (!res.ok) throw new Error('データの取得に失敗しました');
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : '予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) throw new Error('記録の作成に失敗しました');
      setTitle('');
      setContent('');
      await fetchRecords();
    } catch (e) {
      setError(e instanceof Error ? e.message : '予期せぬエラーが発生しました');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center">
        <p className="text-gray-500">読み込み中...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold mb-4">学習記録アプリ</h1>

      {error && (
        <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-3 text-red-700">
          エラー: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトル"
          required
          className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="内容"
          required
          rows={5}
          className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-2xl bg-black px-5 py-2 text-white disabled:opacity-60"
          >
            {submitting ? '登録中…' : '登録'}
          </button>
          <button
            type="button"
            onClick={fetchRecords}
            className="rounded-2xl border border-gray-300 px-5 py-2"
          >
            再読み込み
          </button>
        </div>
      </form>

      <h2 className="text-xl font-semibold mb-2">学習記録一覧</h2>
      {records.length === 0 ? (
        <p className="text-gray-500">記録はありません。</p>
      ) : (
        <ul className="space-y-3">
          {records.map((r) => (
            <li key={r.id} className="rounded-xl border border-gray-200 p-4">
              <h3 className="text-lg font-medium">{r.title}</h3>
              <p className="mt-1 whitespace-pre-wrap text-gray-700">{r.content}</p>
              <div className="mt-2 text-xs text-gray-500">
                追加: {new Date(r.created_at).toLocaleString()} / 最終復習: {new Date(r.last_reviewed_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
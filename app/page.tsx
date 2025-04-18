'use client';
import { useState } from 'react';

export default function HomePage() {
  const [alias, setAlias] = useState('');
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setShortUrl(null);
    setCopied(false);

    const res = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alias, url }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Something went wrong');
    } else {
      setShortUrl(data.shortUrl);
    }
  }

  function handleCopy() {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  return (
    <main className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-2">URL Shortener</h1>
      <p className="text-gray-600 mb-6 text-center">
        Shorten your long URLs into compact, shareable links
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label htmlFor="url" className="block text-sm font-medium mb-1">
            URL
          </label>
          <input
            id="url"
            type="url"
            placeholder="https://example.com/your/long/url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="alias" className="block text-sm font-medium mb-1">
            Custom Alias
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-600 text-sm">
              {baseUrl}/
            </span>
            <input
              id="alias"
              placeholder="your-alias"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className="flex-1 border border-gray-300 rounded-r-md px-3 py-2 focus:outline-none focus:ring"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Shorten
        </button>
      </form>

      {error && (
        <p className="mt-4 text-red-600">{error}</p>
      )}

      {shortUrl && (
        <div className="mt-6 w-full max-w-lg bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <a href={shortUrl} target="_blank" className="text-blue-600 underline break-all">
            {shortUrl}
          </a>
          <button
            onClick={handleCopy}
            className="ml-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </main>
  );
}

import React, { useState } from 'react';

interface BrowserProps {
  windowId?: string;
}

const bookmarks = [
  { name: 'Wikipedia', url: 'https://en.wikipedia.org' },
  { name: 'MDN', url: 'https://developer.mozilla.org' },
  { name: 'GitHub', url: 'https://github.com' },
];

export default function Browser({ windowId }: BrowserProps) {
  const [url, setUrl] = useState('https://en.wikipedia.org');
  const [inputUrl, setInputUrl] = useState('https://en.wikipedia.org');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let newUrl = inputUrl;
    if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
      newUrl = 'https://' + newUrl;
    }
    setUrl(newUrl);
    setInputUrl(newUrl);
    setIsLoading(true);
    setHasError(false);
  };

  const handleBookmarkClick = (bookmarkUrl: string) => {
    setUrl(bookmarkUrl);
    setInputUrl(bookmarkUrl);
    setIsLoading(true);
    setHasError(false);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-200">
      {/* Toolbar */}
      <div className="bg-gray-300 border-b-2 border-gray-400 p-2">
        <form onSubmit={handleNavigate} className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-3 py-1 bg-gray-200 border-2 text-xs hover:bg-gray-300"
            style={{ boxShadow: 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080' }}
          >
            🔄 Refresh
          </button>
          <div className="flex-1 flex items-center bg-white border-2 px-2">
            <span className="text-xs text-gray-500 mr-1">🔒</span>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-1 text-xs outline-none"
              placeholder="Enter URL..."
            />
          </div>
          <button
            type="submit"
            className="px-4 py-1 bg-blue-500 text-white border-2 text-xs hover:bg-blue-600"
            style={{ boxShadow: 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080' }}
          >
            Go
          </button>
        </form>

        {/* Bookmarks */}
        <div className="flex gap-2">
          {bookmarks.map((bookmark) => (
            <button
              key={bookmark.url}
              onClick={() => handleBookmarkClick(bookmark.url)}
              className="px-2 py-1 bg-gray-200 border-2 text-xs hover:bg-gray-300"
              style={{ boxShadow: 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080' }}
            >
              {bookmark.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center">
              <div className="text-4xl mb-2 animate-spin">🔄</div>
              <p className="text-sm text-gray-600">Loading {url}...</p>
            </div>
          </div>
        )}

        {hasError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center p-8">
              <div className="text-6xl mb-4">🚫</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                This site refuses to be framed
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                The website <strong>{url}</strong> has X-Frame-Options set to DENY or SAMEORIGIN.
              </p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-500 text-white text-sm hover:bg-blue-600"
              >
                Open in new tab →
              </a>
            </div>
          </div>
        ) : (
          <iframe
            src={url}
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title="Browser content"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-gray-300 border-t-2 border-gray-400 px-2 py-1 text-xs text-gray-600">
        {isLoading ? 'Loading...' : hasError ? 'Error loading page' : 'Done'}
      </div>
    </div>
  );
}

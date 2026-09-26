import React, { useState } from 'react';

export default function Browser() {
  const [url, setUrl] = useState('https://example.com');
  const [inputUrl, setInputUrl] = useState('https://example.com');
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let newUrl = inputUrl;
    if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
      newUrl = 'https://' + newUrl;
    }
    setUrl(newUrl);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <article className="h-full w-full flex flex-col bg-white" role="main" aria-label="Browser application">
      {/* Browser chrome */}
      <div className="bg-gray-200 border-b border-gray-400">
        {/* Tab bar */}
        <div className="flex items-center px-2 pt-1">
          <div className="bg-white rounded-t px-3 py-1 text-xs border border-gray-400 border-b-0 flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            <span className="max-w-32 truncate">New Tab</span>
            <button className="text-gray-400 hover:text-gray-600 text-xs" aria-label="Close tab">×</button>
          </div>
          <button className="ml-1 text-gray-500 hover:text-gray-700 px-2 text-lg" aria-label="New tab">+</button>
        </div>

        {/* URL bar */}
        <form onSubmit={handleNavigate} className="flex items-center px-2 py-1.5 gap-1">
          <button type="button" className="p-1 hover:bg-gray-300 rounded text-sm" aria-label="Go back">◀</button>
          <button type="button" className="p-1 hover:bg-gray-300 rounded text-sm" aria-label="Go forward">▶</button>
          <button type="button" className="p-1 hover:bg-gray-300 rounded text-sm" aria-label="Reload" onClick={() => setIsLoading(true)}>
            {isLoading ? '⏳' : '🔄'}
          </button>
          <div className="flex-1 flex items-center bg-white border border-gray-400 rounded-full px-3 py-1">
            <span className="text-green-600 text-xs mr-1">🔒</span>
            <input
              type="text"
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              className="flex-1 text-xs outline-none bg-transparent"
              aria-label="Address bar"
            />
          </div>
          <button type="submit" className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600" aria-label="Go">
            Go
          </button>
        </form>
      </div>

      {/* Content area */}
      <div className="flex-1 relative overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="text-center">
              <div className="animate-spin text-4xl mb-2">🔄</div>
              <p className="text-sm text-gray-500">Loading {url}...</p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-8">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">🌐</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Retro Browser</h2>
              <p className="text-gray-600 text-sm mb-4">
                This is a simulated browser window. In a production environment, this would render external content.
              </p>
              <div className="bg-white rounded-lg shadow-md p-4 text-left">
                <h3 className="font-bold text-sm mb-2">Quick Links:</h3>
                <ul className="space-y-1 text-xs">
                  <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">📂 GitHub</a></li>
                  <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">💼 LinkedIn</a></li>
                  <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">🐦 Twitter</a></li>
                  <li><a href="mailto:hello@example.com" className="text-blue-600 hover:underline">📧 Email Me</a></li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="bg-gray-100 border-t border-gray-300 px-3 py-0.5 text-xs text-gray-500 flex items-center">
        <span>{isLoading ? 'Loading...' : 'Done'}</span>
        <span className="ml-auto">Retro Browser v1.0</span>
      </div>
    </article>
  );
}

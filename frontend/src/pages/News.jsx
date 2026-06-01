import React, { useState, useEffect } from 'react';
import * as api from '../api/api';
import NewsCard from '../components/NewsCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        setError('');
        const data = await api.getNews();
        setNews(data);
      } catch (err) {
        console.error(err);
        setError('Failed to retrieve bulletins from the MERN server.');
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  const handleOpenArticle = (article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  return (
    <div className="p-margin-desktop max-w-container-max mx-auto w-full pt-10">
      {/* Editorial Header */}
      <section className="mb-12 text-left">
        <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest block mb-4 font-bold text-xs">
          EDITORIAL DESK
        </span>
        <h1 className="font-display-lg text-display-lg text-primary mb-6">
          Bulletins, announcements, and field notes.
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Rumi House updates are archived as readable records instead of scattered notices, maintaining a clean chronicle of campus excellence.
        </p>
      </section>

      {error && (
        <div className="p-4 mb-6 bg-error-container text-on-error-container border border-error text-xs rounded" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <LoadingState count={6} />
        </div>
      ) : news.length === 0 ? (
        <EmptyState
          message="No seasonal news bulletins or publications are currently archived."
          actionLabel="Refresh News"
          onAction={() => window.location.reload()}
        />
      ) : (
        <div className="space-y-16 mb-20">
          {/* Spotlight Grid (Featured + Sidebar News Stack) */}
          <div className="grid grid-cols-12 gap-gutter">
            {/* Featured Spotlight Card (Left) */}
            <article className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 bg-white border border-outline-variant overflow-hidden">
              <div className="h-64 md:h-auto relative bg-surface-container">
                <img 
                  className="w-full h-full object-cover" 
                  alt={news[0].title}
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5TAJP-TNMW6xQV-A4k9730zX2t288n0gTzgY0M30OtFfazFQcFF4mSI1iwE9LDY-UrkYfCjKsssOWYsZpz7Aac9WM02gf1UiumgfYyIMO4GVpAcdXjpDbSmH1WZwNR9LPzBWvAODBH9Z03yfuTNt6eRb01sLxgYeB8jbMd9_YLgQHCZQDENGUMG0Eui-Nv1mSMPgwbHaqN-WJAq5MPhVYAj3lhBTYREnpfzuxPUf_soX_m7iNwxFa9ksoDqrILgkFW7qOOceGDdYp"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/95 text-primary text-[9px] font-bold px-3 py-1 rounded-sm border border-outline-variant uppercase tracking-widest font-label-uppercase text-label-uppercase">
                    {news[0].category}
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center text-left">
                <span className="font-label-uppercase text-[10px] text-secondary font-bold block mb-4 uppercase tracking-widest">
                  Featured Bulletin
                </span>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-6 font-bold leading-tight">
                  {news[0].title}
                </h3>
                <p className="text-on-surface-variant font-body-sm mb-6 leading-relaxed line-clamp-3">
                  {news[0].summary}
                </p>
                <button 
                  onClick={() => handleOpenArticle(news[0])} 
                  className="text-primary font-bold hover:underline self-start border-0 bg-transparent cursor-pointer font-label-uppercase text-label-uppercase text-xs tracking-wider"
                >
                  Read full report →
                </button>
              </div>
            </article>

            {/* Sidebar News Stack (Right) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              {news.slice(1, 4).map((item, idx) => {
                const borderClass = idx % 2 === 0 ? 'border-l-primary' : 'border-l-secondary';
                return (
                  <article 
                    key={item._id} 
                    className={`p-6 bg-white border border-outline-variant border-l-4 ${borderClass} flex flex-col justify-between text-left`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase font-mono">
                          {new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-[9px] font-bold bg-surface-container px-2 py-0.5 text-on-surface-variant uppercase tracking-wider rounded-sm font-label-uppercase text-label-uppercase">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-primary mb-2 line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-body-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleOpenArticle(item)}
                      className="text-xs text-primary font-bold hover:underline self-start mt-4 border-0 bg-transparent cursor-pointer font-label-uppercase text-label-uppercase tracking-wider"
                    >
                      Read bulletin →
                    </button>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Remaining Bulletins in Bento Grid Layout */}
          {news.length > 4 && (
            <div className="space-y-6 pt-8 border-t border-outline-variant/60">
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold text-left">
                Journal Archives
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.slice(4).map((item) => (
                  <NewsCard
                    key={item._id}
                    newsItem={item}
                    onReadMore={() => handleOpenArticle(item)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedArticle ? selectedArticle.title : ''}
      >
        {selectedArticle && (
          <div className="article-reader p-2 text-left">
            <div className="article-meta border-b border-outline-variant pb-4 mb-6 flex flex-wrap gap-4 justify-between text-xs text-on-surface-variant">
              <span>Written by <strong>{selectedArticle.publishedBy ? selectedArticle.publishedBy.name : 'Editorial Board'}</strong></span>
              <span>Published <strong>{new Date(selectedArticle.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
            </div>
            <p className="article-summary font-bold text-body-lg text-primary mb-6 leading-relaxed">{selectedArticle.summary}</p>
            <div className="article-body font-body-md text-on-surface leading-relaxed whitespace-pre-line">{selectedArticle.content}</div>
          </div>
        )}
      </Modal>
    </div>
  );
}

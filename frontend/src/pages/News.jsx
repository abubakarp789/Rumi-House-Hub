import React, { useState, useEffect } from 'react';
import * as api from '../api/api';
import NewsCard from '../components/NewsCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import academicImg from '../assets/landing/namal-academic-block-display.jpg';

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    loadNews();
  }, []);

  const handleOpenArticle = (article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  return (
    <div className="p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full pt-10">
      {/* Editorial Header */}
      <section className="mb-12 text-left animate-fade-in-up">
        <span className="atrium-eyebrow mb-4 block">
          EDITORIAL DESK
        </span>
        <h1 className="atrium-h1 text-[2.8rem] leading-tight mb-6">
          Bulletins, announcements, and field notes.
        </h1>
        <p className="atrium-desc max-w-2xl">
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
          onAction={loadNews}
        />
      ) : (
        <div className="space-y-16 mb-20">
          {/* Featured Spotlight Card (Full Width) */}
          <article 
            className="w-full atrium-card flex flex-col group cursor-pointer animate-fade-in-up animate-delay-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--atrium-gold)] mb-12"
            onClick={() => handleOpenArticle(news[0])}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOpenArticle(news[0]);
              }
            }}
          >
            <div className={`relative bg-[#e5e9e7] overflow-hidden rounded-t-lg ${news[0].imageUrl ? 'h-auto' : 'h-80'}`}>
              <img 
                className={`w-full transition-transform duration-700 group-hover:scale-[1.01] ${news[0].imageUrl ? 'h-auto block' : 'h-full object-cover'}`} 
                alt={news[0].title}
                src={news[0].imageUrl || news[0].image || academicImg}
              />
            </div>
            <div className="p-8 flex flex-col justify-center text-left bg-gradient-to-br from-white to-surface-warm/20 rounded-b-lg">
              <div className="flex justify-between items-center mb-4">
                <span className="atrium-eyebrow text-[10px] block">
                  Featured Bulletin
                </span>
                <span className="atrium-badge px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                  {news[0].category}
                </span>
              </div>
              <h3 className="atrium-card-title text-[1.8rem] mb-4 font-semibold leading-tight group-hover:text-[var(--atrium-gold)] transition-colors duration-300">
                {news[0].title}
              </h3>
              <p className="text-[#50665b] font-body-sm mb-6 leading-relaxed">
                {news[0].summary}
              </p>
              <span className="text-[var(--atrium-green)] hover:text-[var(--atrium-gold)] font-bold self-start border-0 bg-transparent font-label-uppercase text-label-uppercase text-xs tracking-wider flex items-center gap-1 transition-colors duration-200">
                Read full report <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
              </span>
            </div>
          </article>

          {/* Remaining Bulletins in Bento Grid Layout */}
          {news.length > 1 && (
            <div className="space-y-6 pt-8 border-t border-[#e5e9e7]">
              <h3 className="atrium-h2 text-[1.8rem] font-semibold text-left">
                Journal Archives
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.slice(1).map((item) => (
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
            <div className="article-meta border-b border-[#e5e9e7] pb-4 mb-6 flex flex-wrap gap-4 justify-between text-xs text-[#71887e]">
              <span>Written by <strong>{selectedArticle.publishedBy ? selectedArticle.publishedBy.name : 'Editorial Board'}</strong></span>
              <span>Published <strong>{new Date(selectedArticle.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
            </div>
            <p className="article-summary font-bold text-body-lg text-[var(--atrium-green)] mb-6 leading-relaxed font-serif" style={{ fontFamily: 'var(--font-display)' }}>{selectedArticle.summary}</p>
            <div className="article-body font-body-md text-[#1a2f26] leading-relaxed whitespace-pre-line">{selectedArticle.content}</div>
          </div>
        )}
      </Modal>
    </div>
  );
}

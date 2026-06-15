import React from 'react';
import { Link } from 'react-router-dom';
import { formatEventDate } from '../../utils/homeContent';

function formatNewsDate(publishedAt) {
  if (!publishedAt) return '';
  try {
    const dateObj = formatEventDate(publishedAt);
    return `${dateObj.day} ${dateObj.month} ${dateObj.year}`;
  } catch (err) {
    return '';
  }
}

export default function NewsEditorial({ news }) {
  // We only show the 3 news items from the user's design image
  const displayNews = news.slice(0, 3);

  return (
    <section className="landing-section news-editorial" aria-labelledby="news-title">
      <div className="landing-container">
        {/* Section Header */}
        <div className="section-top-block">
          <span className="section-number">03</span>
          <div className="section-title-wrap">
            <div className="section-heading-block">
              <h2 id="news-title" className="section-title">Latest News</h2>
              <p className="section-desc">
                Stories, updates, and highlights from across the Namal community.
              </p>
            </div>
            <Link className="landing-text-link" to="/news">
              View All News <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* News Grid */}
        <div className="news-editorial__grid" data-testid="news-grid">
          {displayNews.map((item) => {
            const category = item.category || 'News';
            const dateString = formatNewsDate(item.publishedAt || item.createdAt || item.date);
            return (
              <article className="news-card" key={item._id || item.id || item.title}>
                <div className={`overflow-hidden relative ${item.imageUrl ? 'h-auto' : 'news-card__image-container'}`}>
                  {(item.imageUrl || item.image) && (
                    <img 
                      className={`w-full transition-transform duration-1000 ${item.imageUrl ? 'h-auto block' : 'h-full object-cover'}`} 
                      src={item.imageUrl || item.image} 
                      alt={item.title} 
                      loading="lazy" 
                    />
                  )}
                </div>
                <div className="news-card__body">
                  <span className="news-card__meta">{category} · {dateString}</span>
                  <h3 className="news-card__title">{item.title}</h3>
                  <p className="news-card__desc">{item.summary || item.description || item.content}</p>
                </div>
                <Link 
                  className="stretched-link" 
                  aria-label={`Read story: ${item.title}`} 
                  to="/news"
                  style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: 0 }}
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

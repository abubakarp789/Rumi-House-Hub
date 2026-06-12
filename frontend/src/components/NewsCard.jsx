import React from 'react';
import cleanupImg from '../assets/landing/news-cleanup.png';
import poetryImg from '../assets/landing/news-poetry.png';
import workshopImg from '../assets/landing/news-workshop.png';

const NEWS_DEFAULT_IMAGES = {
  events: cleanupImg,
  visit: cleanupImg,
  academics: poetryImg,
  literary: poetryImg,
  technology: workshopImg,
  technical: workshopImg,
  default: cleanupImg
};

export default function NewsCard({ newsItem, onReadMore }) {
  const { id, _id, title, category, publishedAt, publishedBy, summary, image } = newsItem;
  const targetId = _id || id;

  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recent Date';

  const authorName = publishedBy && typeof publishedBy === 'object' ? publishedBy.name : 'Editorial Board';

  const catLower = category ? category.toLowerCase() : 'default';
  const cardImage = image || NEWS_DEFAULT_IMAGES[catLower] || NEWS_DEFAULT_IMAGES.default;

  return (
    <article 
      className="atrium-card flex flex-col justify-between group h-full text-left cursor-pointer" 
      id={`news-card-${targetId}`}
      onClick={onReadMore}
    >
      <div>
        <div className="h-48 overflow-hidden relative">
          <img 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" 
            src={cardImage} 
            alt={`${title}`} 
          />
          <div className="absolute top-4 left-4 shadow-sm">
            <span className="atrium-badge px-3 py-1 text-[9px] tracking-widest uppercase font-bold">
              {category || 'General'}
            </span>
          </div>
        </div>

        <div className="p-6 pb-0 text-left">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-[#71887e] font-mono">
              {formattedDate}
            </span>
          </div>

          <h3 className="atrium-card-title text-[1.35rem] font-semibold mb-3 group-hover:text-[var(--atrium-gold)] transition-colors duration-300 leading-tight">
            {title}
          </h3>
          <p className="font-body-sm text-body-sm text-[#50665b] mb-6 line-clamp-3 leading-relaxed">
            {summary}
          </p>
        </div>
      </div>

      <div className="p-6 pt-0 text-left mt-auto">
        <div className="flex justify-between items-center pt-4 border-t border-[#e5e9e7]">
          <span className="text-[10px] font-bold text-[#71887e] font-label-uppercase text-label-uppercase">
            By {authorName}
          </span>
        </div>
      </div>
    </article>
  );
}

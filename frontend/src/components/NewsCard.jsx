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
  const { id, _id, title, category, publishedAt, publishedBy, summary, image, imageUrl } = newsItem;
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
  const cardImage = imageUrl || image || NEWS_DEFAULT_IMAGES[catLower] || NEWS_DEFAULT_IMAGES.default;

  const hasCustomImage = !!imageUrl;

  return (
    <article 
      className="atrium-card flex flex-col justify-between group h-full text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--atrium-gold)]" 
      id={`news-card-${targetId}`}
      onClick={onReadMore}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onReadMore();
        }
      }}
    >
      <div>
        <div className={`overflow-hidden relative ${hasCustomImage ? 'h-auto' : 'h-48'}`}>
          <img 
            className={`w-full transition-transform duration-700 group-hover:scale-[1.03] ${hasCustomImage ? 'h-auto block' : 'h-full object-cover'}`} 
            src={cardImage} 
            alt={`${title}`} 
          />
        </div>

        <div className="p-6 pb-0 text-left">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-[#71887e] font-mono">
              {formattedDate}
            </span>
            <span className="atrium-badge px-2.5 py-0.5 text-[9px] tracking-widest uppercase font-bold">
              {category || 'General'}
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

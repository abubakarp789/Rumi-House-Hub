import React from 'react';

export default function NewsCard({ newsItem, onReadMore }) {
  const { id, _id, title, category, publishedAt, publishedBy, summary } = newsItem;
  const targetId = _id || id;

  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recent Date';

  const authorName = publishedBy && typeof publishedBy === 'object' ? publishedBy.name : 'Editorial Board';

  return (
    <article 
      className="bg-white border border-outline-variant/60 p-6 flex flex-col justify-between bento-card-premium rounded-lg shadow-tight group h-full text-left" 
      id={`news-card-${targetId}`}
    >
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 font-label-uppercase text-[9px] tracking-widest rounded-sm uppercase font-bold shadow-sm">
            {category || 'General'}
          </span>
          <span className="text-[10px] font-bold text-on-surface-variant opacity-60 font-mono">
            {formattedDate}
          </span>
        </div>

        <h3 className="font-headline-sm text-headline-sm text-primary mb-3 font-bold group-hover:text-primary-container transition-colors leading-tight">
          {title}
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-6 line-clamp-3 leading-relaxed">
          {summary}
        </p>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-outline-variant/60 mt-auto">
        <span className="text-[10px] font-bold text-on-surface-variant font-label-uppercase text-label-uppercase">
          By {authorName}
        </span>
        <button 
          className="border border-outline text-primary px-4 py-2 hover:bg-primary hover:text-white hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all text-xs font-label-uppercase text-label-uppercase font-bold cursor-pointer rounded shadow-tight" 
          onClick={onReadMore}
        >
          Read Article
        </button>
      </div>
    </article>
  );
}

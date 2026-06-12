import React from 'react';

export default function LoadingState({ count = 3 }) {
  const loaders = Array.from({ length: count }, (_, idx) => idx);

  return (
    <>
      {loaders.map((item) => (
        <div key={item} className="card skeleton-card" aria-live="polite" aria-busy="true">
          <div className="skeleton-box skeleton-badge"></div>
          <div className="skeleton-box skeleton-title"></div>
          <div className="skeleton-box skeleton-copy"></div>
          <div className="skeleton-footer">
            <div className="skeleton-box skeleton-meta"></div>
            <div className="skeleton-box skeleton-button"></div>
          </div>
        </div>
      ))}
    </>
  );
}

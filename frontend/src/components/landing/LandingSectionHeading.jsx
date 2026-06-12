import React from 'react';

export default function LandingSectionHeading({ eyebrow, title, description, id }) {
  return (
    <div className="landing-section-heading">
      <span className="landing-eyebrow">{eyebrow}</span>
      <h2 id={id}>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

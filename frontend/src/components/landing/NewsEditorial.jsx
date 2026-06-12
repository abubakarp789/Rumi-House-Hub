import React from 'react';
import { Link } from 'react-router-dom';
import LandingSectionHeading from './LandingSectionHeading';
import { formatTimeAgo } from '../../utils/homeContent';

export default function NewsEditorial({ news }) {
  const [leadStory, ...briefs] = news;
  if (!leadStory) return null;

  return (
    <section className="landing-section news-editorial" aria-labelledby="news-title">
      <div className="landing-container">
        <div className="landing-section__topline">
          <LandingSectionHeading
            id="news-title"
            eyebrow="From The Hub"
            title="Ideas, milestones, and campus voices."
            description="The stories shaping student life, collected from across the Rumi House community."
          />
          <Link className="landing-text-link" to="/news">View All News <span aria-hidden="true">↗</span></Link>
        </div>

        <div className="news-editorial__layout">
          <article className="news-lead">
            <span className="news-editorial__index">01</span>
            <div>
              <span className="news-editorial__meta">{leadStory.category || 'Campus update'} · {formatTimeAgo(leadStory.publishedAt || leadStory.createdAt || leadStory.date)}</span>
              <h3>{leadStory.title}</h3>
              <p>{leadStory.summary || leadStory.description || leadStory.content}</p>
              <Link to="/news">Read the story <span aria-hidden="true">↗</span></Link>
            </div>
          </article>
          <div className="news-editorial__briefs">
            {briefs.map((story, index) => (
              <article className="news-brief" key={story._id || story.id || story.title}>
                <span className="news-editorial__index">{String(index + 2).padStart(2, '0')}</span>
                <div>
                  <span className="news-editorial__meta">{story.category || 'Rumi House'} · {formatTimeAgo(story.publishedAt || story.createdAt || story.date)}</span>
                  <h3>{story.title}</h3>
                  <Link aria-label={`Read ${story.title}`} to="/news">Read more <span aria-hidden="true">→</span></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { blogPosts } from '@/lib/blog-content';
import { ArticleCover } from './visual-art';
export function BlogIndex() {
  const [category, setCategory] = useState('All');
  const posts = blogPosts.filter((post) => category === 'All' || post.category === category);
  return (
    <>
      <div className="blog-filters" role="group" aria-label="Filter articles">
        {['All', 'General', 'Dental'].map((name) => (
          <button key={name} aria-pressed={name === category} onClick={() => setCategory(name)}>
            {name}
          </button>
        ))}
      </div>
      <p className="industry-note" role="status">
        {posts.length} {posts.length === 1 ? 'article' : 'articles'} ·{' '}
        {category === 'All' ? 'All topics' : category}
      </p>
      <div className="article-grid">
        {posts.map((post) => (
          <article className="article-card" key={post.slug}>
            <Link href={`/blogs/${post.slug}`} tabIndex={-1} aria-hidden="true">
              <ArticleCover slug={post.slug} />
            </Link>
            <span className="micro">
              {post.category} · {post.readTime}
            </span>
            <h2>
              <Link href={`/blogs/${post.slug}`}>{post.title}</Link>
            </h2>
            <p>{post.summary}</p>
            <Link className="text-link" href={`/blogs/${post.slug}`}>
              Read article ↗
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}

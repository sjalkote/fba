import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import BlogPost from '../models/BlogPost';

type BlogPost = {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState({ title: '', content: '', author: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  // Fetch blog posts
  useEffect(() => {
    fetch('/api?type=blog')
      .then((res) => res.json())
      .then((data) => setPosts(data.data))
      .catch(() => setError('Failed to load blog posts'));
  }, []);

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch('/api?type=blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setPosts([data.data, ...posts]);
      setForm({ title: '', content: '', author: '' });
    } else {
      setError(data.message || 'Failed to create post');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem' }}>
      <h1 style={{ fontSize: 40 }}>Blog Posts</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: '500px',
          margin: '40px auto',
          padding: '32px',
          background: '#fafbfc',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border 0.2s',
          }}
        />
        <textarea
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          required
          rows={5}
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border 0.2s',
          }}
        />
        <input
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          required
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border 0.2s',
          }}
        />
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'darkblue',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 0',
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'background 0.2s',
              flex: 1,
            }}
          >
            {loading ? 'Posting...' : 'Create Post'}
          </button>
          <button
            type="button"
            onClick={() => setShowPreview((prev) => !prev)}
            style={{
              background: '#e5e7eb',
              color: '#222',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 0',
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'background 0.2s',
              flex: 1,
            }}
          >
            {showPreview ? 'Hide Preview' : 'Preview'}
          </button>
        </div>
        {showPreview && (
          <div
            style={{
              background: '#f3f4f6',
              borderRadius: '8px',
              padding: '16px',
              marginTop: '8px',
              minHeight: '80px',
            }}
          >
            <h3 style={{ margin: '0 0 8px 0' }}>{form.title || 'Title Preview'}</h3>
            <ReactMarkdown>{form.content || 'Content Preview'}</ReactMarkdown>
            <div style={{ fontSize: 12, color: '#555', marginTop: 8 }}>{form.author ? `By ${form.author}` : 'Author Preview'}</div>
          </div>
        )}
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </form>
      <div>
        {posts.length === 0 && <p>No blog posts yet.</p>}
        {posts.map((post) => (
          <div key={post._id} className="blog-post-container">
            <h2 className="blog-post-title">{post.title}</h2>
            <div className="blog-post-content">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
            <div className="blog-post-meta" style={{ fontSize: 12, color: '#555' }}>
              By {post.author} on {new Date(post.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

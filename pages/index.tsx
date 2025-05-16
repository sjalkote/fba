import { useState, useEffect } from 'react';

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
      <h1>Blog Posts</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
        />
        <textarea
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          required
          rows={4}
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
        />
        <input
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
        />
        <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? 'Posting...' : 'Create Post'}
        </button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </form>
      <div>
        {posts.length === 0 && <p>No blog posts yet.</p>}
        {posts.map((post) => (
          <div key={post._id} style={{ border: '1px solid #ccc', padding: 16, marginBottom: 16 }}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <div style={{ fontSize: 12, color: '#555' }}>
              By {post.author} on {new Date(post.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

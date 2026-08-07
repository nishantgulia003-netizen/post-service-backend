import { useEffect, useRef, useState } from 'react';
import './index.css';

// Vite proxies these relative routes in development. Set VITE_API_URL when the API is deployed separately.
const API_URL = import.meta.env.VITE_API_URL ?? '';

const formatDate = (date) => {
  if (!date) return 'Just now';
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
};

function App() {
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/get-posts`);
      if (!response.ok) throw new Error('Could not load posts');
      const data = await response.json();
      setPosts([...data.posts].reverse());
    } catch {
      setMessage('Could not connect to the server. Start the backend on port 3000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPosts(); }, []);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const selectImage = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setMessage('Please choose an image file.');
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setMessage('');
  };

  const publishPost = async (event) => {
    event.preventDefault();
    if (!image) return setMessage('Add a photo before publishing your post.');
    setUploading(true);
    setMessage('');
    const formData = new FormData();
    formData.append('image', image);
    formData.append('caption', caption);
    try {
      const response = await fetch(`${API_URL}/create-post`, { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong');
      setPosts((current) => [data.post, ...current]);
      setCaption('');
      setImage(null);
      setPreview('');
      setMessage('Your post is live!');
    } catch (error) {
      setMessage(error.message || 'Unable to publish your post.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="app-shell">
      <nav className="topbar">
        <a className="brand" href="#top" aria-label="Postly home"><span className="brand-mark">P</span>postly</a>
        <div className="nav-links"><a href="#create">Create</a><a href="#feed">Explore</a></div>
        <button className="profile" aria-label="Your profile">NS</button>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">YOUR VISUAL NOTEBOOK</p>
          <h1>Share the moments<br /><em>that matter.</em></h1>
          <p className="intro">A quiet corner for your best pictures, small wins, campus memories, and everything in between.</p>
          <a className="primary-button" href="#create">Create a post <span>→</span></a>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="sun" /><div className="arch"><div className="arch-sun" /><div className="hills hill-one" /><div className="hills hill-two" /><div className="plant plant-one">✦</div><div className="plant plant-two">✦</div></div>
          <p>Small moments, big stories</p>
        </div>
      </section>

      <section className="composer-section" id="create">
        <div className="section-heading"><p className="eyebrow">MAKE IT YOURS</p><h2>Create something worth remembering.</h2></div>
        <form className="composer" onSubmit={publishPost}>
          <button type="button" className={`drop-zone ${preview ? 'has-image' : ''}`} onClick={() => inputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); selectImage(e.dataTransfer.files[0]); }}>
            {preview ? <img src={preview} alt="Selected upload preview" /> : <><span className="upload-icon">↑</span><strong>Add a photo</strong><small>JPG, PNG or WEBP</small></>}
          </button>
          <input ref={inputRef} className="visually-hidden" type="file" accept="image/*" onChange={(e) => selectImage(e.target.files[0])} />
          <label className="caption-field"><span>CAPTION <b>OPTIONAL</b></span><textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="What's on your mind?" maxLength="280" /><small>{caption.length}/280</small></label>
          <div className="publish-row"><p className={message.includes('live') ? 'success' : ''}>{message}</p><button className="publish-button" disabled={uploading}>{uploading ? 'Publishing...' : 'Publish post'} <span>↗</span></button></div>
        </form>
      </section>

      <section className="feed-section" id="feed">
        <div className="feed-header"><div><p className="eyebrow">FROM THE COMMUNITY</p><h2>Recent posts</h2></div><button className="refresh" onClick={loadPosts}>↻ Refresh</button></div>
        {loading ? <div className="empty-state">Loading the latest posts…</div> : posts.length ? <div className="post-grid">{posts.map((post) => <article className="post-card" key={post._id || post.imageUrl}><img src={post.imageUrl} alt={post.caption || 'Community post'} /><div className="post-details"><div className="author"><span>PS</span><div><strong>Postly creator</strong><small>{formatDate(post.createdAt)}</small></div></div>{post.caption && <p>{post.caption}</p>}<button className="heart" aria-label="Like post">♡</button></div></article>)}</div> : <div className="empty-state"><span>✦</span><h3>No posts yet</h3><p>Your first shared moment will appear here.</p></div>}
      </section>
      <footer>© 2026 POSTLY <span>Made for sharing the good stuff.</span></footer>
    </main>
  );
}

export default App;

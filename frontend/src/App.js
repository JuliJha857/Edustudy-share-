import logo from './logo.png';
import { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './supabase';

function LoginPage({ theme, setPage, setUser }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const handleLogin = () => {
    if (!email || !pass) { setMsg('❌ Email aur Password bharo!'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email.includes('@')) {
        localStorage.setItem('user', email);
        setUser(email);
        setMsg('✅ Login Success!');
        setTimeout(() => setPage('home'), 800);
      } else { setMsg('❌ Sahi email daalo'); }
    }, 800);
  };
  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', background: theme.cardBg, padding: '24px', borderRadius: '16px', border: `1px solid ${theme.border}` }}>
      <h2 style={{ color: theme.text }}>Welcome Back 👋</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: `1px solid ${theme.border}`, background: theme.bg, color: theme.text, boxSizing: 'border-box' }} />
      <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="Password" style={{ width: '100%', padding: '10px', marginBottom: '16px', borderRadius: '8px', border: `1px solid ${theme.border}`, background: theme.bg, color: theme.text, boxSizing: 'border-box' }} />
      {msg && <div style={{ padding: '8px', textAlign: 'center', fontSize: '13px', marginBottom: '10px', background: msg.includes('✅') ? '#DCFCE7' : '#FEE2E2', borderRadius: '6px' }}>{msg}</div>}
      <button onClick={handleLogin} style={{ width: '100%', background: '#2563EB', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>{loading ? 'Logging...' : 'Login'}</button>
    </div>
  );
}

function AboutPage({ theme }) {
  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'left' }}>
      <div style={{ background: theme.cardBg, padding: '30px', borderRadius: '16px', border: `1px solid ${theme.border}` }}>
        <h1 style={{ textAlign: 'center', color: theme.text }}>About EduStudy-Share 📚</h1>
        <p style={{ color: theme.subText, lineHeight: '1.7', fontSize: '15px' }}><b style={{ color: theme.text }}>EduStudy-Share</b> ek simple platform hai jahan students aur teachers apne notes, PYQ aur books share kar sakte hain.</p>
        <h3 style={{ color: theme.text, marginTop: '24px' }}>🎯 Our Mission</h3>
        <p style={{ color: theme.subText, lineHeight: '1.6' }}>Har student tak free me quality study material pahunchana.</p>
        <h3 style={{ color: theme.text, marginTop: '24px' }}>✨ Features</h3>
        <ul style={{ color: theme.subText, lineHeight: '1.8' }}>
          <li>📄 Notes - Subject wise notes</li>
          <li>📑 PYQ - Previous year question papers</li>
          <li>📚 Books - Reference books</li>
          <li>View & Download instantly</li>
          <li>💾 Save - Refresh pe bhi file rahegi</li>
          <li>🌙 Dark Mode Support</li>
        </ul>
        <div style={{ textAlign: 'center', marginTop: '30px', padding: '16px', background: theme.bg, borderRadius: '10px' }}>
          <p style={{ color: theme.text, fontWeight: '700', margin: 0 }}>© 2026 EduStudy-Share</p>
          <small style={{ color: theme.subText }}>Made with ❤️ for Students</small>
        </div>
      </div>
    </div>
  );
}

function AdminPage({ theme, data, setData, onView, reload }) {
  const [title, setTitle] = useState('');
  const [cat, setCat] = useState('notes');
  const [by, setBy] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!title || !by || !file) { alert('Title, By aur File teeno bharo!'); return; }
    setUploading(true);
    const fileName = Date.now() + "_" + file.name;
    const { error: upErr } = await supabase.storage.from("files").upload(fileName, file);
    if (upErr) { alert(upErr.message); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("files").getPublicUrl(fileName);
    const { error } = await supabase.from("files").insert([{ title, by, category: cat, fileName: file.name, file_url: urlData.publicUrl }]);
    if (error) { alert(error.message); setUploading(false); return; }
    setTitle(''); setBy(''); setFile(null);
    document.getElementById('fileInput').value = '';
    setUploading(false);
    alert(`✅ "${file.name}" Supabase me save ho gaya!`);
    reload();
  };

  const handleDelete = async (category, index) => {
    const item = data[category][index];
    await supabase.from("files").delete().eq("id", item.id);
    setData({ ...data, [category]: data[category].filter((_, i) => i !== index) });
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'left' }}>
      <h2 style={{ color: theme.text, textAlign: 'center' }}>🔧 Admin Panel</h2>
      <div style={{ background: theme.cardBg, padding: '20px', borderRadius: '12px', border: `1px solid ${theme.border}`, marginBottom: '24px' }}>
        <select value={cat} onChange={(e) => setCat(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: `1px solid ${theme.border}`, background: theme.bg, color: theme.text }}>
          <option value="notes">Notes</option>
          <option value="pyq">PYQ</option>
          <option value="books">Books</option>
        </select>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title e.g. DBMS Unit 1" style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: `1px solid ${theme.border}`, background: theme.bg, color: theme.text, boxSizing: 'border-box' }} />
        <input value={by} onChange={(e) => setBy(e.target.value)} placeholder="By e.g. Your Name" style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: `1px solid ${theme.border}`, background: theme.bg, color: theme.text, boxSizing: 'border-box' }} />
        <input id="fileInput" type="file" accept=".pdf,.doc,.docx,.ppt,.jpg,.png" onChange={(e) => setFile(e.target.files[0])} style={{ width: '100%', padding: '10px', marginBottom: '14px', borderRadius: '8px', border: `1px solid ${theme.border}`, background: theme.bg, color: theme.text, boxSizing: 'border-box' }} />
        <button onClick={handleUpload} style={{ width: '100%', background: '#16A34A', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>{uploading ? 'Uploading...' : '📤 Upload'}</button>
      </div>
      {['notes', 'pyq', 'books'].map(c => (
        <div key={c} style={{ marginBottom: '20px' }}>
          <h3 style={{ textTransform: 'uppercase', color: theme.text }}>{c} ({data[c].length})</h3>
          {data[c].map((item, i) => (
            <div key={item.id || i} style={{ background: theme.cardBg, padding: '12px 16px', borderRadius: '10px', border: `1px solid ${theme.border}`, marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '150px' }}>
                <b style={{ color: theme.text }}>{item.title}</b><br />
                <small style={{ color: theme.subText }}>By {item.by} • {item.fileName}</small>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => onView(item)} style={{ background: '#2563EB', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>View</button>
                <button onClick={() => handleDelete(c, i)} style={{ background: '#EF4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(() => localStorage.getItem('user') || '');
  const [viewItem, setViewItem] = useState(null);
  const [data, setData] = useState({ notes: [], pyq: [], books: [] });
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => { localStorage.setItem('darkMode', dark); }, [dark]);

  const loadFiles = async () => {
    const { data: allFiles, error } = await supabase.from("files").select("*").order("id", { ascending: false });
    if (error) { console.log(error); setLoaded(true); return; }
    const newData = { notes: [], pyq: [], books: [] };
    (allFiles || []).forEach(f => {
      const item = { id: f.id, title: f.title, by: f.by, fileName: f.fileName, fileData: f.file_url };
      if (newData[f.category]) newData[f.category].push(item);
    });
    setData(newData); setLoaded(true);
  };

  useEffect(() => { loadFiles(); }, []);

  const theme = {
    bg: dark ? '#0F172A' : '#F0F7FF',
    cardBg: dark ? '#1E293B' : 'white',
    text: dark ? '#F1F5F9' : '#0F172A',
    subText: dark ? '#94A3B8' : '#475569',
    nav: dark ? '#1E293B' : '#2563EB',
    border: dark ? '#334155' : '#E2E8F0',
    footerBg: dark ? '#0F172A' : '#E8F0FE',
    footerText: dark ? '#94A3B8' : '#64748B',
  };

  const downloadFile = (item) => {
    const a = document.createElement('a');
    a.href = item.fileData;
    a.download = item.fileName || item.title;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const allItems = [
    ...data.notes.map(i => ({ ...i, cat: 'notes' })),
    ...data.pyq.map(i => ({ ...i, cat: 'pyq' })),
    ...data.books.map(i => ({ ...i, cat: 'books' })),
  ];
  const searchResults = search.trim() ? allItems.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.by.toLowerCase().includes(search.toLowerCase()) ||
    item.fileName.toLowerCase().includes(search.toLowerCase()) ||
    item.cat.toLowerCase().includes(search.toLowerCase())
  ) : [];

  const homeCards = [
    { key: 'notes', title: 'Notes', desc: 'Study materials & handwritten notes', icon: '📄', bg: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', count: data.notes.length },
    { key: 'pyq', title: 'PYQ', desc: 'Previous year questions by exam', icon: '📑', bg: 'linear-gradient(135deg, #FB923C, #EA580C)', count: data.pyq.length },
    { key: 'books', title: 'Books', desc: 'Reference & textbooks collection', icon: '📚', bg: 'linear-gradient(135deg, #4ADE80, #16A34A)', count: data.books.length },
  ];

  if (!loaded) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading files...</div>;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: theme.bg, color: theme.text }}>
      <div className="watermark" style={{ opacity: dark ? 0.02 : 0.04, filter: dark ? 'invert(1)' : 'none' }}></div>
      <div style={{ background: theme.nav, padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', cursor: 'pointer' }} onClick={() => { setViewItem(null); setSearch(''); setPage('home'); }}>
          <img src={logo} alt="logo" style={{ height: '36px', width: '36px', borderRadius: '10px', background: 'white', padding: '4px' }} />
          <h2 style={{ margin: 0, fontSize: '18px' }}>EduStudy-Share</h2>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setDark(!dark)} style={{ border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>{dark ? '☀️' : '🌙'}</button>
          <button onClick={() => { setViewItem(null); setPage('home'); }} style={{ background: page === 'home' ? '#3B82F6' : 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Home</button>
          <button onClick={() => { setViewItem(null); setPage('about'); }} style={{ background: page === 'about' ? '#3B82F6' : 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>About</button>
          <button onClick={() => { setViewItem(null); setPage('admin'); }} style={{ background: page === 'admin' ? '#3B82F6' : 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Admin</button>
          {user ? (
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <div title={user} style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'white', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>{user.charAt(0).toUpperCase()}</div>
              <button onClick={() => { localStorage.removeItem('user'); setUser(''); setPage('home'); }} style={{ background: '#EF4444', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Logout</button>
            </div>
          ) : (
            <button onClick={() => setPage('login')} style={{ background: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Login</button>
          )}
        </div>
      </div>

      <div style={{ flex: 1, padding: '30px 16px', textAlign: 'center' }}>
        {page === 'home' && (
          <>
            <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '10px 0 6px 0' }}>Welcome to EduStudy-Share</h1>
            <p style={{ color: theme.subText, fontSize: '17px', margin: '0 0 24px 0' }}>View / Download / Save</p>
            <div style={{ maxWidth: '560px', margin: '0 auto 30px auto', display: 'flex', background: theme.cardBg, borderRadius: '50px', padding: '6px 6px 6px 18px', border: `1px solid ${theme.border}`, boxShadow: '0 8px 20px rgba(0,0,0,0.08)', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>🔍</span>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes, PYQ, books..." style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', color: theme.text, fontSize: '16px', padding: '10px 0' }} />
              {search && <button onClick={() => setSearch('')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px' }}>✕</button>}
              <button style={{ background: '#2563EB', color: 'white', border: 'none', padding: '11px 22px', borderRadius: '50px', fontWeight: '700', cursor: 'pointer', fontSize: '15px' }}>Search</button>
            </div>
            {search.trim() ? (
              <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'left' }}>
                <h3 style={{ color: theme.text }}>Search Results for "{search}" ({searchResults.length})</h3>
                {searchResults.length === 0 && <p style={{ color: theme.subText, textAlign: 'center' }}>Kuch nahi mila 😔 Dusra naam try karo.</p>}
                {searchResults.map((item, i) => (
                  <div key={item.id || i} style={{ background: theme.cardBg, padding: '14px 16px', borderRadius: '10px', border: `1px solid ${theme.border}`, marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '180px' }}>
                      <b style={{ color: theme.text }}>{item.title}</b> <span style={{ fontSize: '11px', background: '#EFF6FF', color: '#2563EB', padding: '2px 8px', borderRadius: '20px', fontWeight: '700', textTransform: 'uppercase' }}>{item.cat}</span><br />
                      <small style={{ color: theme.subText }}>By {item.by} • {item.fileName}</small>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setViewItem(item)} style={{ background: '#2563EB', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>View</button>
                      <button onClick={() => downloadFile(item)} style={{ background: '#16A34A', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Download</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', marginTop: '10px', flexWrap: 'wrap' }}>
                {homeCards.map(t => (
                  <div key={t.key} onClick={() => setPage(t.key)} className="card" style={{ background: theme.cardBg, padding: '28px 20px', borderRadius: '18px', width: '210px', border: `1px solid ${theme.border}`, cursor: 'pointer', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
                    <div style={{ fontSize: '34px', width: '72px', height: '72px', borderRadius: '16px', margin: '0 auto 14px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.bg }}>{t.icon}</div>
                    <h3 style={{ margin: '6px 0', color: theme.text, textTransform: 'uppercase', fontSize: '22px', fontWeight: '800' }}>{t.title}</h3>
                    <p style={{ color: theme.text, fontWeight: '600', margin: '6px 0', fontSize: '15px' }}>{t.count} files</p>
                    <small style={{ color: theme.subText, fontSize: '13px', lineHeight: '1.4', display: 'block' }}>{t.desc}</small>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {page === 'about' && <AboutPage theme={theme} />}
        {(page === 'notes' || page === 'pyq' || page === 'books') && (
          <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'left' }}>
            <button onClick={() => setPage('home')} style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', color: theme.text, marginBottom: '16px', fontWeight: '700' }}>← Back</button>
            <h2 style={{ textTransform: 'uppercase', color: theme.text }}>{page} ({data[page].length})</h2>
            {data[page].length === 0 && <p style={{ color: theme.subText, textAlign: 'center' }}>Koi file nahi hai. Admin me upload karo.</p>}
            {data[page].map((item, i) => (
              <div key={item.id || i} style={{ background: theme.cardBg, padding: '14px 16px', borderRadius: '10px', border: `1px solid ${theme.border}`, marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <b style={{ color: theme.text }}>{item.title}</b><br />
                  <small style={{ color: theme.subText }}>By {item.by} • {item.fileName}</small>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setViewItem(item)} style={{ background: '#2563EB', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>View</button>
                  <button onClick={() => downloadFile(item)} style={{ background: '#16A34A', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Download</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {page === 'admin' && <AdminPage theme={theme} data={data} setData={setData} onView={(item) => setViewItem(item)} reload={loadFiles} />}
        {page === 'login' && <LoginPage theme={theme} setPage={setPage} setUser={setUser} />}
      </div>
      <footer style={{ textAlign: 'center', padding: '14px', fontSize: '13px', background: theme.footerBg, color: theme.footerText, borderTop: `1px solid ${theme.border}` }}>© 2026 EduStudy-Share</footer>
      {viewItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#000', zIndex: 9999, display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: '#2563EB', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <b style={{ color: 'white', flex: 1, textAlign: 'left', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{viewItem.title}</b>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => downloadFile(viewItem)} style={{ background: '#16A34A', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>Download</button>
              <button onClick={() => setViewItem(null)} style={{ background: '#EF4444', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>✕ Close</button>
            </div>
          </div>
          <iframe src={viewItem.fileData} style={{ flex: 1, border: 'none', background: 'white', width: '100%', height: '100%' }} title="PDF Viewer"></iframe>
        </div>
      )}
    </div>
  );
}
export default App;
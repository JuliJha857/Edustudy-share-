import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);

  return (
    <div className="App">
      <nav style={{padding: '15px', background: '#4F46E5', color: 'white', display: 'flex', justifyContent: 'space-between'}}>
        <h2 style={{margin:0}}>EduStudy-Share 📚</h2>
        <div>
          <button onClick={()=>setPage('home')} style={btn}>Home</button>
          <button onClick={()=>setPage('resources')} style={btn}>Resources</button>
          <button onClick={()=>setPage('admin')} style={btn}>Admin</button>
          {!user ? <button onClick={()=>setPage('login')} style={btn}>Login</button> : <button onClick={()=>{setUser(null); setPage('home')}} style={btn}>Logout</button>}
        </div>
      </nav>

      <div style={{padding: '30px'}}>
        {page === 'home' && (
          <div style={{textAlign: 'center', marginTop: '50px'}}>
            <h1>Welcome to EduStudy-Share</h1>
            <p>A Platform for Students to Share Study Resources</p>
            <div style={{display:'flex', gap:'20px', justifyContent:'center', marginTop:'30px'}}>
              <div style={card}>📄<h3>Notes</h3><p>Share your notes</p></div>
              <div style={card}>📝<h3>PYQ</h3><p>Previous Year Questions</p></div>
              <div style={card}>📚<h3>Books</h3><p>Study Materials</p></div>
            </div>
            <p style={{marginTop:'40px', color:'green', fontWeight:'bold'}}>✅ Backend Running on Port 5000<br/>✅ Frontend Running on Port 3000</p>
          </div>
        )}

        {page === 'resources' && (
          <div>
            <h2>All Resources</h2>
            <div style={card}>Sample Resource 1 - DBMS Notes - Approved</div>
            <div style={card}>Sample Resource 2 - OS PYQ 2023 - Pending</div>
            <button style={{...btn, background:'#4F46E5', color:'white', marginTop:'20px'}}> + Upload Resource</button>
          </div>
        )}

        {page === 'login' && (
          <div style={{maxWidth:'350px', margin:'50px auto', ...card}}>
            <h2>Login</h2>
            <input placeholder="Email" style={input}/><br/>
            <input placeholder="Password" type="password" style={input}/><br/>
            <button onClick={()=>{setUser({name:'Demo User'}); setPage('home')}} style={{...btn, background:'#4F46E5', color:'white', width:'100%'}}>Login (Demo)</button>
          </div>
        )}

        {page === 'admin' && (
          <div>
            <h2>Admin Panel</h2>
            <p>Approve / Reject Resources</p>
            <div style={card}>Resource: CN Notes - <button style={smallBtn}>Approve</button> <button style={{...smallBtn, background:'#EF4444'}}>Reject</button></div>
            <div style={card}>Resource: DBMS PYQ - <button style={smallBtn}>Approve</button> <button style={{...smallBtn, background:'#EF4444'}}>Reject</button></div>
          </div>
        )}
      </div>
    </div>
  );
}

const btn = {margin:'0 5px', padding:'8px 15px', border:'none', borderRadius:'5px', cursor:'pointer', background:'white', color:'#4F46E5', fontWeight:'bold'};
const smallBtn = {padding:'5px 10px', background:'#22C55E', color:'white', border:'none', borderRadius:'4px', cursor:'pointer', margin:'0 3px'};
const card = {border:'1px solid #ddd', padding:'20px', borderRadius:'10px', margin:'10px 0', background:'white', boxShadow:'0 2px 5px rgba(0,0,0,0.1)'};
const input = {width:'90%', padding:'10px', margin:'8px 0', borderRadius:'5px', border:'1px solid #ccc'};

export default App;
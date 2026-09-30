import React, { useState } from 'react';
import { LockKeyhole, ShieldCheck } from 'lucide-react';

export function AuthGate({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('admin@trisetsolutions.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' }).then((response) => response.ok ? response.json() : null).then((result) => { setUser(result?.user || null); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const login = async (event) => {
    event.preventDefault(); setError('');
    const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ email, password }) });
    const result = await response.json();
    if (!response.ok) return setError(result.error || 'Login failed');
    setUser(result.user); setPassword('');
  };

  if (loading) return <div className="auth-loading"><ShieldCheck size={21} /> Checking secure session...</div>;
  if (user) return children;
  return <main className="auth-page"><section className="auth-panel"><img src="/logo_final.png" alt="TRISET" /><span className="eyebrow">Private workspace / secure sign in</span><h1>TRISET Documents</h1><p>Sign in to manage company records and generate business documents.</p><form onSubmit={login}><label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>{error && <div className="auth-error"><LockKeyhole size={15} />{error}</div>}<button className="primary-button" type="submit"><LockKeyhole size={16} /> Sign in</button></form><small><ShieldCheck size={14} /> Access is protected by your workspace account.</small></section></main>;
}

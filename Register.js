import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try { await register(form); nav('/'); }
    catch (err) { setError(err.message); }
  };

  return (
    <form className="card auth" onSubmit={submit}>
      <h1>Create account</h1>
      <label>Full name<input required value={form.name} onChange={set('name')} /></label>
      <label>Email<input type="email" required value={form.email} onChange={set('email')} /></label>
      <label>Phone<input value={form.phone} onChange={set('phone')} /></label>
      <label>Password<input type="password" minLength="6" required value={form.password} onChange={set('password')} /></label>
      {error && <p className="error">{error}</p>}
      <button className="btn">Sign up</button>
      <p className="muted">Already registered? <Link to="/login">Log in</Link></p>
    </form>
  );
}

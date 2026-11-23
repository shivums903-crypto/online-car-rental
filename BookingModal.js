import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, rupees } from '../api';
import { useAuth } from '../AuthContext';

const today = () => new Date().toISOString().slice(0, 10);

export default function BookingModal({ car, dates, onClose }) {
  const { user } = useAuth();
  const nav = useNavigate();
  const [start, setStart] = useState(dates.start || today());
  const [end, setEnd] = useState(dates.end || today());
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const days = Math.max(0, Math.round((new Date(end) - new Date(start)) / 86400000) + 1);
  const total = days * Number(car.price_per_day);

  const confirm = async () => {
    if (!user) return nav('/login');
    setBusy(true); setError('');
    try {
      await api('/bookings', { method: 'POST', body: { car_id: car.id, start_date: start, end_date: end } });
      nav('/bookings');
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Book car">
        <h2>Book {car.brand} {car.name}</h2>
        <div className="row">
          <label>Pick-up date
            <input type="date" min={today()} value={start} onChange={(e) => setStart(e.target.value)} />
          </label>
          <label>Return date
            <input type="date" min={start} value={end} onChange={(e) => setEnd(e.target.value)} />
          </label>
        </div>
        <p className="summary">
          {days} day{days !== 1 && 's'} × {rupees(car.price_per_day)} = <strong>{rupees(total)}</strong>
        </p>
        {error && <p className="error">{error}</p>}
        <div className="row end">
          <button className="btn ghost" onClick={onClose}>Close</button>
          <button className="btn" disabled={busy || days < 1} onClick={confirm}>
            {user ? 'Confirm booking' : 'Log in to book'}
          </button>
        </div>
      </div>
    </div>
  );
}

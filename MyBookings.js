import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, rupees, fmtDate } from '../api';

export default function MyBookings() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  const load = () => api('/bookings/mine').then(setRows).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try { await api(`/bookings/${id}/cancel`, { method: 'PUT' }); load(); }
    catch (e) { setError(e.message); }
  };

  return (
    <>
      <h1>My bookings</h1>
      {error && <p className="error">{error}</p>}
      {rows.length === 0 ? (
        <p className="muted">No bookings yet. <Link to="/">Find a car</Link></p>
      ) : (
        <div className="list">
          {rows.map((b) => (
            <div className="card booking" key={b.id}>
              <img src={b.image_url} alt="" />
              <div>
                <h3>{b.brand} {b.car_name}</h3>
                <p className="muted">{fmtDate(b.start_date)} to {fmtDate(b.end_date)}</p>
                <p><strong>{rupees(b.total_price)}</strong> <span className={`tag ${b.status}`}>{b.status}</span></p>
              </div>
              {b.status === 'confirmed' && (
                <button className="btn ghost danger" onClick={() => cancel(b.id)}>Cancel booking</button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

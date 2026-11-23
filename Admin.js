import React, { useEffect, useState } from 'react';
import { api, rupees, fmtDate } from '../api';

const empty = { name: '', brand: '', type: 'SUV', seats: 5, fuel: 'Petrol', transmission: 'Manual', price_per_day: '', image_url: '' };

export default function Admin() {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setCars(await api('/cars'));
      setBookings(await api('/bookings'));
    } catch (e) { setError(e.message); }
  };
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const addCar = async (e) => {
    e.preventDefault(); setError('');
    try { await api('/cars', { method: 'POST', body: form }); setForm(empty); load(); }
    catch (err) { setError(err.message); }
  };

  const removeCar = async (id) => {
    if (!window.confirm('Delete this car and its bookings?')) return;
    await api(`/cars/${id}`, { method: 'DELETE' }); load();
  };

  const setStatus = async (id, status) => {
    await api(`/bookings/${id}/status`, { method: 'PUT', body: { status } }); load();
  };

  return (
    <>
      <h1>Admin</h1>
      {error && <p className="error">{error}</p>}

      <h2>Add a car</h2>
      <form className="card admin-form" onSubmit={addCar}>
        <input placeholder="Brand" required value={form.brand} onChange={set('brand')} />
        <input placeholder="Model name" required value={form.name} onChange={set('name')} />
        <select value={form.type} onChange={set('type')}>{['Hatchback', 'Sedan', 'SUV', 'MPV'].map((t) => <option key={t}>{t}</option>)}</select>
        <input type="number" min="1" placeholder="Seats" required value={form.seats} onChange={set('seats')} />
        <select value={form.fuel} onChange={set('fuel')}>{['Petrol', 'Diesel', 'Electric'].map((t) => <option key={t}>{t}</option>)}</select>
        <select value={form.transmission} onChange={set('transmission')}>{['Manual', 'Automatic'].map((t) => <option key={t}>{t}</option>)}</select>
        <input type="number" min="1" placeholder="Price per day (₹)" required value={form.price_per_day} onChange={set('price_per_day')} />
        <input placeholder="Image URL" value={form.image_url} onChange={set('image_url')} />
        <button className="btn">Add car</button>
      </form>

      <h2>Cars ({cars.length})</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Car</th><th>Type</th><th>Fuel</th><th>Price/day</th><th></th></tr></thead>
          <tbody>
            {cars.map((c) => (
              <tr key={c.id}>
                <td>{c.brand} {c.name}</td><td>{c.type}</td><td>{c.fuel}</td><td>{rupees(c.price_per_day)}</td>
                <td><button className="btn ghost danger small" onClick={() => removeCar(c.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>All bookings ({bookings.length})</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Customer</th><th>Car</th><th>Dates</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.user_name}<br /><small className="muted">{b.email}</small></td>
                <td>{b.car_name}</td>
                <td>{fmtDate(b.start_date)} to {fmtDate(b.end_date)}</td>
                <td>{rupees(b.total_price)}</td>
                <td>
                  <select value={b.status} onChange={(e) => setStatus(b.id, e.target.value)}>
                    {['confirmed', 'completed', 'cancelled'].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

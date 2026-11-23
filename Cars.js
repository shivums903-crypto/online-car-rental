import React, { useEffect, useState, useCallback } from 'react';
import { api, rupees } from '../api';
import BookingModal from '../components/BookingModal';

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({ type: '', fuel: '', maxPrice: '', startDate: '', endDate: '' });
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    const qs = new URLSearchParams(Object.entries(filters).filter(([, v]) => v)).toString();
    try { setCars(await api('/cars' + (qs ? '?' + qs : ''))); }
    catch (e) { setError(e.message); }
    setLoading(false);
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const set = (k) => (e) => setFilters({ ...filters, [k]: e.target.value });

  return (
    <>
      <section className="hero">
        <h1>Pick a car. Pick your dates. Drive.</h1>
        <p>Pay per day, cancel anytime before pick-up.</p>
        <div className="filters">
          <label>From<input type="date" value={filters.startDate} onChange={set('startDate')} /></label>
          <label>To<input type="date" min={filters.startDate} value={filters.endDate} onChange={set('endDate')} /></label>
          <label>Type
            <select value={filters.type} onChange={set('type')}>
              <option value="">Any</option>
              {['Hatchback', 'Sedan', 'SUV', 'MPV'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label>Fuel
            <select value={filters.fuel} onChange={set('fuel')}>
              <option value="">Any</option>
              {['Petrol', 'Diesel', 'Electric'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label>Max price/day
            <input type="number" min="0" placeholder="₹" value={filters.maxPrice} onChange={set('maxPrice')} />
          </label>
        </div>
      </section>

      {error && <p className="error">{error}</p>}
      {loading ? <p className="muted">Loading cars…</p> :
        cars.length === 0 ? <p className="muted">No cars match these filters. Try different dates or clear a filter.</p> : (
        <div className="grid">
          {cars.map((c) => (
            <article className="car" key={c.id}>
              <img src={c.image_url || 'https://placehold.co/600x360?text=Car'} alt={`${c.brand} ${c.name}`} />
              <div className="car-body">
                <h3>{c.brand} {c.name}</h3>
                <p className="muted">{c.type} · {c.seats} seats · {c.fuel} · {c.transmission}</p>
                <div className="row between">
                  <span className="price">{rupees(c.price_per_day)}<small> /day</small></span>
                  <button className="btn" onClick={() => setSelected(c)}>Book</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {selected && (
        <BookingModal
          car={selected}
          dates={{ start: filters.startDate, end: filters.endDate }}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

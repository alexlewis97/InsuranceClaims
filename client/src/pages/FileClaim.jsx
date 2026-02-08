import { useState } from 'react';
import { fileClaim } from '../services/claims';
import { useNavigate } from 'react-router-dom';

export default function FileClaim() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ policyNumber: '', incidentDate: '', description: '', damageEstimate: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await fileClaim(form);
      navigate('/my-claims');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">הגשת תביעה חדשה</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="policyNumber" className="block text-sm font-medium mb-1">מספר פוליסה</label>
            <input id="policyNumber" name="policyNumber" type="text" value={form.policyNumber}
              onChange={handleChange} className="w-full border rounded-md px-3 py-2" required placeholder="POL-2024-001" />
          </div>
          <div>
            <label htmlFor="incidentDate" className="block text-sm font-medium mb-1">תאריך אירוע</label>
            <input id="incidentDate" name="incidentDate" type="date" value={form.incidentDate}
              onChange={handleChange} className="w-full border rounded-md px-3 py-2" required />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">תיאור האירוע</label>
            <textarea id="description" name="description" value={form.description}
              onChange={handleChange} className="w-full border rounded-md px-3 py-2 min-h-[100px]" required placeholder="תאר מה קרה..." />
          </div>
          <div>
            <label htmlFor="damageEstimate" className="block text-sm font-medium mb-1">הערכת נזק (₪)</label>
            <input id="damageEstimate" name="damageEstimate" type="number" step="0.01" min="0"
              value={form.damageEstimate} onChange={handleChange} className="w-full border rounded-md px-3 py-2" placeholder="אופציונלי" />
          </div>
          <button type="submit" disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'שולח...' : 'הגש תביעה'}
          </button>
        </form>
      </div>
    </div>
  );
}

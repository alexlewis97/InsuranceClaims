import { useEffect, useState } from 'react';
import { getAllClaims, updateClaimStatus } from '../services/claims';

const STATUS_OPTIONS = ['pending', 'under_review', 'approved', 'denied'];
const statusLabels = { pending: 'ממתין', under_review: 'בבדיקה', approved: 'אושר', denied: 'נדחה' };
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  denied: 'bg-red-100 text-red-800',
};

export default function AdminDashboard() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchClaims = () => {
    setLoading(true);
    getAllClaims(filter).then(setClaims).finally(() => setLoading(false));
  };

  useEffect(() => { fetchClaims(); }, [filter]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">לוח בקרה - מנהל</h2>
      <div className="mb-4 flex items-center gap-3">
        <label htmlFor="filter" className="font-medium">סינון:</label>
        <select id="filter" value={filter} onChange={e => setFilter(e.target.value)}
          className="border rounded-md px-3 py-1">
          <option value="all">הכל</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
        </select>
        <span className="text-gray-500 text-sm">{claims.length} תביעות</span>
      </div>
      {loading ? <p className="text-center">טוען...</p> : (
        <div className="space-y-3">
          {claims.map(claim => (
            <ClaimCard key={claim.id} claim={claim} onUpdate={fetchClaims} />
          ))}
          {claims.length === 0 && <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">אין תביעות.</div>}
        </div>
      )}
    </div>
  );
}

function ClaimCard({ claim, onUpdate }) {
  const [status, setStatus] = useState(claim.status);
  const [notes, setNotes] = useState(claim.admin_notes || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateClaimStatus(claim.id, status, notes);
      onUpdate();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold">{claim.profiles?.name || 'משתמש'}</p>
          <p className="text-sm"><span className="font-medium">פוליסה:</span> {claim.policy_number} · <span className="font-medium">תאריך:</span> {new Date(claim.incident_date).toLocaleDateString('he-IL')}</p>
          {claim.damage_estimate && <p className="text-sm"><span className="font-medium">הערכת נזק:</span> ₪{Number(claim.damage_estimate).toLocaleString()}</p>}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[claim.status]}`}>
          {statusLabels[claim.status]}
        </span>
      </div>
      <p className="text-sm mb-3">{claim.description}</p>
      <div className="flex gap-3 items-end flex-wrap">
        <div>
          <label htmlFor={`s-${claim.id}`} className="block text-xs font-medium mb-1">סטטוס</label>
          <select id={`s-${claim.id}`} value={status} onChange={e => setStatus(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm">
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor={`n-${claim.id}`} className="block text-xs font-medium mb-1">הערות</label>
          <input id={`n-${claim.id}`} type="text" value={notes} onChange={e => setNotes(e.target.value)}
            className="w-full border rounded-md px-2 py-1 text-sm" placeholder="הוסף הערה..." />
        </div>
        <button onClick={handleSave} disabled={saving}
          className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50">
          {saving ? '...' : 'עדכן'}
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2">הוגש {new Date(claim.created_at).toLocaleString('he-IL')}</p>
    </div>
  );
}

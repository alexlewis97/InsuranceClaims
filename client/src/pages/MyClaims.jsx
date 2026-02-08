import { useEffect, useState } from 'react';
import { getMyClaims } from '../services/claims';
import { Link } from 'react-router-dom';

const statusLabels = { pending: 'ממתין', under_review: 'בבדיקה', approved: 'אושר', denied: 'נדחה' };
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  denied: 'bg-red-100 text-red-800',
};

export default function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyClaims().then(setClaims).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4 text-center">טוען...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">התביעות שלי</h2>
        <Link to="/file-claim" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          תביעה חדשה
        </Link>
      </div>
      {claims.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
          עדיין לא הגשת תביעות.
        </div>
      ) : (
        <div className="space-y-3">
          {claims.map(claim => (
            <div key={claim.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p><span className="font-medium">פוליסה:</span> {claim.policy_number}</p>
                  <p><span className="font-medium">תאריך:</span> {new Date(claim.incident_date).toLocaleDateString('he-IL')}</p>
                  <p><span className="font-medium">תיאור:</span> {claim.description}</p>
                  {claim.damage_estimate && <p><span className="font-medium">הערכת נזק:</span> ₪{Number(claim.damage_estimate).toLocaleString()}</p>}
                  {claim.admin_notes && <p className="mt-2 text-sm text-gray-600"><span className="font-medium">הערות מנהל:</span> {claim.admin_notes}</p>}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[claim.status]}`}>
                  {statusLabels[claim.status]}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">הוגש {new Date(claim.created_at).toLocaleString('he-IL')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

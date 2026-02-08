import { useState } from 'react';
import { provisionAll } from '../provisioning/provision';
import { allSchemas } from '../provisioning/schemas';

export default function Provision() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleProvision = async () => {
    setError('');
    setResults([]);
    setLoading(true);
    setDone(false);
    try {
      const res = await provisionAll(allSchemas);
      setResults(res);
      setDone(true);
    } catch (err) {
      setError(err.message || 'שגיאה בהקמת טבלאות');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">הקמת מסד נתונים</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="mb-4 text-gray-600">
          לחץ על הכפתור כדי ליצור את הטבלאות הנדרשות במסד הנתונים.
          הפעולה בטוחה — טבלאות קיימות לא יידרסו (IF NOT EXISTS).
        </p>
        <div className="mb-4">
          <p className="font-medium mb-2">טבלאות שייווצרו:</p>
          <ul className="list-disc list-inside text-sm text-gray-600">
            {allSchemas.map(s => <li key={s.table}>{s.schema}.{s.table} ({s.columns.length} עמודות)</li>)}
          </ul>
        </div>
        <button onClick={handleProvision} disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50">
          {loading ? 'מקים טבלאות...' : 'הקם טבלאות'}
        </button>
        {error && <p className="text-red-600 mt-4">{error}</p>}
        {done && (
          <div className="mt-4 p-3 bg-green-50 rounded-md">
            <p className="text-green-700 font-medium">הטבלאות הוקמו בהצלחה!</p>
            {results.map((r, i) => (
              <p key={i} className="text-sm text-green-600">✓ {r.table}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

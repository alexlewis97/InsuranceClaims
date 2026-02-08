import { useState } from 'react';
import { signIn, signUp } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function Login({ onAuth }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, name);
        setSuccess('נרשמת בהצלחה! בדוק את המייל לאישור.');
      } else {
        await signIn(email, password);
        onAuth?.();
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? 'הרשמה' : 'כניסה'}
        </h2>
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-600 mb-4 text-center">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">שם מלא</label>
              <input id="name" type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full border rounded-md px-3 py-2" required />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">אימייל</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border rounded-md px-3 py-2" required />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">סיסמה</label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border rounded-md px-3 py-2" required minLength={6} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
            {loading ? '...' : isSignUp ? 'הרשמה' : 'כניסה'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          <button onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess(''); }}
            className="text-blue-600 hover:underline">
            {isSignUp ? 'יש לך חשבון? כניסה' : 'אין לך חשבון? הרשמה'}
          </button>
        </p>
      </div>
    </div>
  );
}

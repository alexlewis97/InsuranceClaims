import { Link } from 'react-router-dom';

export default function Navbar({ session, profile, onSignOut, skipAuth }) {
  const isAdmin = profile?.role === 'admin';

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 flex justify-between items-center">
      <Link to="/" className="font-bold text-lg">תביעות ביטוח רכב</Link>
      <div className="flex items-center gap-4 text-sm">
        {skipAuth ? (
          <span className="text-yellow-300">מצב בדיקה</span>
        ) : session ? (
          <>
            <span className="text-blue-300">{profile?.name || session.user.email}</span>
            {isAdmin ? (
              <>
                <Link to="/admin" className="hover:text-blue-300">לוח בקרה</Link>
              </>
            ) : (
              <>
                <Link to="/my-claims" className="hover:text-blue-300">התביעות שלי</Link>
                <Link to="/file-claim" className="hover:text-blue-300">תביעה חדשה</Link>
              </>
            )}
            <button onClick={onSignOut} className="border border-blue-300 text-blue-300 px-3 py-1 rounded hover:bg-blue-300 hover:text-gray-900">
              יציאה
            </button>
          </>
        ) : (
          <Link to="/login" className="hover:text-blue-300">כניסה</Link>
        )}
      </div>
    </nav>
  );
}

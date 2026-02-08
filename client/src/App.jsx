import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from './services/supabase';
import { getProfile, signOut } from './services/auth';
import SetupScreen from './components/SetupScreen';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import FileClaim from './pages/FileClaim';
import MyClaims from './pages/MyClaims';
import AdminDashboard from './pages/AdminDashboard';

const skipAuth = import.meta.env.VITE_SKIP_AUTH === 'true';

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  if (!isSupabaseConfigured) return <SetupScreen />;

  useEffect(() => {
    if (skipAuth) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s) getProfile().then(p => { setProfile(p); console.log('Profile loaded:', p); }).catch(e => console.error('Profile error:', e));
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s) getProfile().then(p => { setProfile(p); }).catch(e => console.error('Profile error:', e));
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setSession(null);
    setProfile(null);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">טוען...</div>;

  const isAuthenticated = skipAuth || session;
  const isAdmin = profile?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar session={session} profile={profile} onSignOut={handleSignOut} skipAuth={skipAuth} />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onAuth={() => {}} />} />
        <Route path="/file-claim" element={isAuthenticated ? <FileClaim /> : <Navigate to="/login" />} />
        <Route path="/my-claims" element={isAuthenticated ? <MyClaims /> : <Navigate to="/login" />} />
        <Route path="/admin" element={isAuthenticated? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/" element={
          !isAuthenticated ? <Navigate to="/login" /> :
          isAdmin ? <Navigate to="/admin" /> :
          <Navigate to="/my-claims" />
        } />
      </Routes>
    </div>
  );
}

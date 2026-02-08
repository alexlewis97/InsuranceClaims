export default function SetupScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-lg text-center">
        <h1 className="text-2xl font-bold mb-4">הגדרת Supabase</h1>
        <p className="text-gray-600 mb-4">
          האפליקציה דורשת חיבור ל-Supabase. צור קובץ <code className="bg-gray-100 px-1 rounded">.env</code> בתיקיית <code className="bg-gray-100 px-1 rounded">client/</code> עם הערכים הבאים:
        </p>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-md text-sm text-left dir-ltr mb-4" dir="ltr">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SKIP_AUTH=false`}
        </pre>
        <p className="text-gray-500 text-sm">לאחר ההגדרה, הפעל מחדש את שרת הפיתוח.</p>
      </div>
    </div>
  );
}

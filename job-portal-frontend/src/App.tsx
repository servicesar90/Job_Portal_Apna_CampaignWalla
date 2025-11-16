import { Suspense } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import './index.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Chatbot from './components/misc/Chatbot';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

function Layout() {
  const location = useLocation();

  
  const hideLayout =
    location.pathname.startsWith("/auth/login") ||
    location.pathname.startsWith("/auth/register");

  return (
    <div className="min-h-screen flex flex-col">

      {!hideLayout && <Navbar />}

      <main className="flex-1 bg-[#DFF3F9] p-10">
        <Suspense fallback={<div className="p-5">Loading...</div>}>
          <AppRoutes />
        </Suspense>
      </main>

      {!hideLayout && <Footer />}

      <Chatbot />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-center" />
          <Layout /> 
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

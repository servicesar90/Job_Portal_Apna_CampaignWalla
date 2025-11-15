import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/layout/Navbar';
import Chatbot from './components/misc/Chatbot';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useSocket } from './hooks/useSocket';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Suspense fallback={<div className="p-5">Loading...</div>}>
            <AppRoutes />
          </Suspense>
          <Chatbot />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

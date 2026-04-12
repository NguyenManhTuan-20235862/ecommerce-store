import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Toaster } from 'sonner';

// Layout & Pages
import RootLayout from './layouts/RootLayout';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

function App() {
  return (
    <BrowserRouter>
      {/* Cấu hình Toast Component (Sonner) */}
      <Toaster position="top-right" richColors />
      
      <Routes>
        {/* Auth Pages đi một mình (Không Header Footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Nhóm Pages chung Layout (Header, Footer) */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={
            <div className="min-h-[50vh] flex items-center justify-center">
              <h1 className="text-2xl pt-32">Customer Profile (Bản nháp)</h1>
            </div>
          } />
          <Route path="/admin" element={
            <div className="min-h-[50vh] flex items-center justify-center">
              <h1 className="text-2xl pt-32">Admin Dashboard (Bản nháp)</h1>
            </div>
          } />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

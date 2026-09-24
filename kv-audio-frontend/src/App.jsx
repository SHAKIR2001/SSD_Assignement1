import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPage from './pages/admin/adminPage';
import HomePage from './pages/home/homePage';
import Testing from './components/testing';
import LoginPage from './pages/login/login';
import toast, { Toaster } from 'react-hot-toast';
import RegisterPage from './pages/register/register';
import OAuthCallback from './pages/oauth/OAuthCallback';
import CompleteProfile from './pages/completeProfile/CompleteProfile';

function App() {


  return (
    <BrowserRouter>
      <Toaster position="top-right"/>
      <Routes path="/*">
        <Route path="/testing" element={<Testing/>}/> 
        <Route path="/admin/*" element={<AdminPage/>}/>
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/oauth/callback" element={<OAuthCallback/>} />
        <Route path="/complete-profile" element={<CompleteProfile/>} />
        <Route path="/*" element={<HomePage/>}/> 
        
        





       



      </Routes>
   </BrowserRouter>
  )
}

export default App

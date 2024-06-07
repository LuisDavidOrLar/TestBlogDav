import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import MyPosts from './pages/MyPosts';
import Home from './pages/Home';
import SidebarLayout from './components/SidebarLayout';
import MainLayout from './components/MainLayout';
import { AuthProvider } from './context/AuthContext'; 
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider> 
        <Routes>
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/dashboard" element={<SidebarLayout><Dashboard /></SidebarLayout>} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/my-posts" element={<SidebarLayout><MyPosts /></SidebarLayout>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;

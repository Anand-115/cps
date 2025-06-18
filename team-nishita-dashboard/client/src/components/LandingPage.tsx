import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import { signup, login } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext'
import Navbar from './Navbar'
import type { Credentials as Credentials } from '../api/api'

import {
  LogIn,
  UserPlus,
  LineChart,
  Share2,
  Bot,
  Sparkles,
  ClipboardCheck,
  Sun,
  Moon
} from 'lucide-react';


const LandingPage: React.FC = () => {
  const [modalType, setModalType] = useState<'login' | 'signup' | null>(null);
  const [credentials, setCredentials] = useState<Credentials>({
    username: '',
    password: '',
    role: 'user'
  })

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin, isAuthenticated, user } = useAuth();

  const closeModal = () => {
    setModalType(null);
    setCredentials({
      username: '',
      password: '',
      role: 'user'
    })
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response =
        modalType === 'login' ? await login(credentials) : await signup(credentials);
      const { access_token, user: userData } = response.data
      localStorage.setItem('token', access_token);
      authLogin(userData)
      closeModal();
      if (userData.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false)
    }
  };
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'admin' ? '/admin' : '/dashboard'
      navigate(redirectPath);
    }
  }, [isAuthenticated, user, navigate])

  useEffect(() => {
    const hero = document.querySelector('.hero') as HTMLElement;
    if (hero) {
      hero.style.background = darkMode
        ? 'linear-gradient(135deg, #000000, #1a0033, #3b0000, #660033, #802900)'
        : 'linear-gradient(135deg, #7dd3fc, #bbf7d0, #fef08a, #5eead4)';
      hero.style.transition = 'background 0.6s ease';
    }
    document.body.classList.toggle('dark-theme', darkMode);
  }, [darkMode]);

  return (
    <div
      style={{
        border: '6px solid black',
        minHeight: '100vh',
        boxSizing: 'border-box',
        backgroundColor: darkMode ? '#0c0c0c' : '#e0fff8',
        color: darkMode ? '#f5f5f5' : '#022c22',
        transition: 'background-color 0.6s ease, color 0.6s ease',
        position: 'relative'
      }}
    >
      <Navbar
        onLoginClick={() => setModalType('login')}
        onSignUpClick={() => setModalType('signup')}
      />

      <motion.section
        className="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1.2 } }}
      >
        <motion.h1 className="hero-title" initial={{ y: -20 }} animate={{ y: 0 }}>
          Visualize Your Learning Journey
        </motion.h1>
        <motion.p className="hero-subtitle" initial={{ y: 20 }} animate={{ y: 0 }}>
          PathPilot helps you understand where you are, what to study next, and how close you are to your goals.
        </motion.p>

        <div className="features">
          {[
            {
              icon: <LineChart size={32} />,
              title: "Progress Tracking",
              desc: "Track your learning goals and monitor real-time progress with intuitive charts."
            },
            {
              icon: <Share2 size={32} />,
              title: "Knowledge Graph",
              desc: "Visualize concepts you've learned and identify knowledge gaps clearly."
            },
            {
              icon: <Bot size={32} />,
              title: "AI Chat Assistant",
              desc: "Ask questions anytime and get smart explanations powered by AI."
            },
            {
              icon: <Sparkles size={32} />,
              title: "Recommendations",
              desc: "Receive personalized learning path suggestions based on your progress."
            },
            {
              icon: <ClipboardCheck size={32} />,
              title: "Assessments",
              desc: "Take quick quizzes to reinforce concepts and track understanding."
            }
          ].map((feat, idx) => (
            <motion.div
              key={idx}
              className="feature"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2 * idx } }}
              style={{
                background: darkMode ? '#1f1f1f' : 'rgba(255, 255, 255, 0.95)',
                color: darkMode ? '#ffffff' : '#022c22',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                padding: '1.5rem',
                margin: '1rem',
                boxShadow: darkMode
                  ? '0 4px 20px rgba(255, 255, 255, 0.05)'
                  : '0 6px 24px rgba(0, 150, 136, 0.3)',
                border: '2px solid rgba(0, 200, 160, 0.3)'
              }}
            >
              <div className="feature-icon">{feat.icon}</div>
              <strong>{feat.title}</strong>
              <p>{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* {modalType && ( */}
      {/*   <div className="modal" onClick={closeModal}> */}
      {/*     <motion.div */}
      {/*       className="modal-content" */}
      {/*       onClick={(e) => e.stopPropagation()} */}
      {/*       initial={{ scale: 0.9, opacity: 0 }} */}
      {/*       animate={{ scale: 1, opacity: 1 }} */}
      {/*       style={{ */}
      {/*         background: darkMode ? '#1a1a1a' : '#ffffff', */}
      {/*         color: darkMode ? '#f5f5f5' : '#022c22', */}
      {/*         borderRadius: '12px', */}
      {/*         padding: '2rem', */}
      {/*         boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)', */}
      {/*         backdropFilter: 'blur(10px)' */}
      {/*       }} */}
      {/*     > */}
      {/*       <span className="close" onClick={closeModal}> */}
      {/*         &times; */}
      {/*       </span> */}
      {/*       <div className="form-container"> */}
      {/*         <h2>{modalType === 'login' ? 'Login' : 'Sign Up'}</h2> */}
      {/*         {error && <p style={{ color: 'red' }}>{error}</p>} */}
      {/*         <form onSubmit={handleSubmit}> */}
      {/*           <input */}
      {/*             type="text" */}
      {/*             placeholder="Username" */}
      {/*             value={credentials.username} */}
      {/*             onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} */}
      {/*             required */}
      {/*           /> */}
      {/*           <input */}
      {/*             type="password" */}
      {/*             placeholder="Password" */}
      {/*             value={credentials.password} */}
      {/*             onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} */}
      {/*             required */}
      {/*           /> */}
      {/*           <select */}
      {/*             value={credentials.role} */}
      {/*             onChange={(e) => { setCredentials({ ...credentials, role: e.target.value as 'user' | 'admin' }) }} */}
      {/*           > <option value="user">User</option> */}
      {/*             <option value="admin">Admin</option> */}
      {/*           </select> */}
      {/*           <button */}
      {/*             type="submit" */}
      {/*             style={{ */}
      {/*               backgroundColor: '#014d4d', */}
      {/*               color: '#ffffff', */}
      {/*               padding: '0.5rem 1rem', */}
      {/*               border: 'none', */}
      {/*               borderRadius: '6px', */}
      {/*               marginTop: '1rem', */}
      {/*               display: 'flex', */}
      {/*               alignItems: 'center', */}
      {/*               gap: '6px' */}
      {/*             }} */}
      {/*           > */}
      {/*             {modalType === 'login' ? <LogIn size={16} /> : <UserPlus size={16} />} */}
      {/*             {modalType === 'login' ? 'Login' : 'Sign Up'} */}
      {/*           </button> */}
      {/*         </form> */}
      {/*       </div> */}
      {/*     </motion.div> */}
      {/*   </div> */}
      {modalType && (
        <div className="modal" onClick={closeModal}>
          <motion.div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <div className="form-container">
              <h2>{modalType === 'login' ? 'Login' : 'Sign Up'}</h2>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  required
                  disabled={loading}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                  disabled={loading}
                />
                <select
                  value={credentials.role}
                  onChange={(e) => setCredentials({ ...credentials, role: e.target.value as 'user' | 'admin' })}
                  disabled={loading}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button type="submit" disabled={loading}>
                  {loading ? 'Loading...' : (
                    <>
                      {modalType === 'login' ? <LogIn size={16} /> : <UserPlus size={16} />}
                      {modalType === 'login' ? 'Login' : 'Sign Up'}
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      <button
        onClick={() => setDarkMode(prev => !prev)}
        style={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          backgroundColor: darkMode ? '#eeeeee' : '#014d4d',
          color: darkMode ? '#000000' : '#ffffff',
          border: '2px solid black',
          borderRadius: '50%',
          padding: '0.6rem',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          transition: 'background-color 0.3s ease, color 0.3s ease'
        }}
        title="Toggle Theme"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  );
};

export default LandingPage;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react'
import ServerClient from './apis/server';
import Navbar from './components/Navbar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Logout from './pages/auth/Logout';
import Home from './pages/home/Home';

const App = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const checkIfAuthenticated = async () => {
    try {
      const resp = await ServerClient.get('/user/authenticated', { withCredentials: true });
      if (resp.status === 200) setAuthenticated(true);
      else setAuthenticated(false);
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    checkIfAuthenticated();
  }, []);

  return (
    <Router>
      <Navbar authenticated={authenticated} />
      <Routes>
        <Route path="/login" element={<Login authenticated={authenticated} setAuthenticated={setAuthenticated} />} />
        <Route path="/register" element={<Register authenticated={authenticated} setAuthenticated={setAuthenticated} />} />
        <Route path="/logout" element={<Logout setAuthenticated={setAuthenticated} />} />
        <Route path="/" element={<Home authenticated={authenticated} />} />
      </Routes>
    </Router>
  )
}

export default App;
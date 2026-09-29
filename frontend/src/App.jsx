import { useState } from 'react';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  const [screen, setScreen] = useState('home');
  const [user, setUser] = useState(null); // holds { token, fullName, email } after login

  const handleLoginSuccess = (data) => {
    setUser(data);
    setScreen('dashboard');
  };

  return (
      <div>
        {screen === 'home' && (
          <Home
            onNavigate={(target) => setScreen(target)}
            onInvestToday={() => setScreen('login')}
          />
        )}

        {screen === 'register' && (
            <Register
              onSuccess={() => setScreen('login')}
              onNavigate={(target) => setScreen(target)}
            />
        )}

        {screen === 'login' && (
            <Login
              onSuccess={handleLoginSuccess}
              onNavigate={(target) => setScreen(target)}
            />
        )}

        {screen === 'dashboard' && user && <Dashboard user={user} />}
      </div>
  );
}

export default App;
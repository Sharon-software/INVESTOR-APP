import { useState } from 'react';
import Landing from './Landing';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  const [screen, setScreen] = useState('landing');
  const [user, setUser] = useState(null); // holds { token, fullName, email } after login

  const handleLoginSuccess = (data) => {
    setUser(data);
    setScreen('dashboard');
  };

  return (
      <div>
        {screen === 'landing' && <Landing onFinish={() => setScreen('home')} />}

        {screen === 'home' && <Home onNavigate={(target) => setScreen(target)} />}

        {screen === 'register' && (
            <Register onSuccess={() => setScreen('login')} />
        )}

        {screen === 'login' && (
            <Login onSuccess={handleLoginSuccess} />
        )}

        {screen === 'dashboard' && user && <Dashboard user={user} />
        }
      </div>
  );
}

export default App;
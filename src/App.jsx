import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Login from './views/Login';
import HomeDirector from './views/Director/home';
import appFirebase from './Data/credentials'

const auth = getAuth(appFirebase);

function App() {
  const [usuario, setUsuario] = useState(null);

  onAuthStateChanged(auth, (usuarioFirebase) => {
    if (usuarioFirebase) {
      setUsuario(usuarioFirebase);
    } else {
      setUsuario(null);
    }
  });

  useEffect(() => {
    console.log('Usuario:', usuario);
  }, [usuario]);

  return (
    <div>
      {usuario ? (
        <HomeDirector/>
      ) : (
        <Login/>
      )}
    </div>
  );
}

export default App;
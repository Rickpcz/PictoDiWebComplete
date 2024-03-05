import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Login from './views/Login';
import HomeDirector from './views/Director/home';
import HomeAdmin from './views/Admin/home'; // Asegúrate de importar el componente correcto para HomeAdmin
import appFirebase from './Data/credentials';

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

function App() {
  const [usuario, setUsuario] = useState(null);
  const [permiso, setPermiso] = useState(null);

  onAuthStateChanged(auth, async (usuarioFirebase) => {
    if (usuarioFirebase) {
      setUsuario(usuarioFirebase);
      console.log("Usuario:", usuarioFirebase);
  
      let userDocRef;
      let colecciónUsuario;
  
      colecciónUsuario = 'directores';  
  
      if (!colecciónUsuario) {
        console.error("Tipo de usuario no reconocido");
        return;
      }
  
      userDocRef = doc(db, colecciónUsuario, usuarioFirebase.uid);
      console.log("Tipo de usuario reconocido:", colecciónUsuario);
  
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (userDocSnapshot.exists()) {
        const userPermiso = userDocSnapshot.data().permiso;
        setPermiso(userPermiso);
      } else {
        console.error("El documento de usuario no existe");
      }
    } else {
      setUsuario(null);
      setPermiso(null);
    }
  });

  useEffect(() => {
    console.log('Usuario:', usuario);
    console.log('Permiso:', permiso);
  }, [usuario, permiso]);

  return (
    <div>
      {usuario ? (
       
        permiso === 'director' ? <HomeDirector /> : <HomeAdmin />
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;

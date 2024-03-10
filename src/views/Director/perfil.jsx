import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import db from '../../Data/db';
import Home from './homeDirect';

const Perfil = () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    const [correo, setCorreo] = useState('');
    const [nombre, setNombre] = useState('');
    const [instituto, setInstituto] = useState('');
    const [redirect, setRedirect] = useState(false); // Nuevo estado para controlar la redirección

    useEffect(() => {
        const obtenerDatosUsuario = async () => {
            if (currentUser) {
                const usuarioDoc = doc(db, 'directores', currentUser.uid);

                try {
                    const snapshot = await getDoc(usuarioDoc);
                    if (snapshot.exists()) {
                        const datos = snapshot.data();
                        setCorreo(datos.correo || '');
                        setNombre(datos.nombre || '');
                        setInstituto(datos.instituto || '');
                    }
                } catch (error) {
                    console.error('Error al obtener datos del usuario:', error);
                }
            }
        };

        obtenerDatosUsuario();
    }, [currentUser]);

    const actualizarDatosUsuario = async () => {
        if (currentUser) {
            const usuarioDoc = doc(db, 'usuarios', currentUser.uid);

            try {
                await updateDoc(usuarioDoc, {
                    correo,
                    nombre,
                    // No actualizamos el instituto
                });
                console.log('Datos actualizados correctamente');
            } catch (error) {
                console.error('Error al actualizar datos del usuario:', error);
            }
        }
    };

    const cancelar = () => {
        setRedirect(true); // Establecer el estado para redirigir al usuario al componente Home
    };

    // Si redirect es verdadero, renderizar el componente Home
    if (redirect) {
        return <Home />;
    }

    return (
        <div className="flex mx-5 items-center justify-center h-[90vh]">
            <div className="w-[40%]">
                <img src="src\assets\perfil.png" alt="Foto de perfil" className="rounded-full w-[70%]" />
            </div>

            <div className="flex flex-col w-[40%]">
                <form action="" className="mb-4">
                    <div className="mb-4">
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-600">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="mt-1 p-2 border rounded-md w-full bg-gray-100"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="correo" className="block text-sm font-medium text-gray-600">Correo</label>
                        <input
                            type="email"
                            id="correo"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            className="mt-1 p-2 border rounded-md w-full bg-gray-100"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="instituto" className="block text-sm font-medium text-gray-600">Instituto</label>
                        <input
                            type="text"
                            id="instituto"
                            value={instituto}
                            readOnly
                            className="mt-1 p-2 border rounded-md w-full bg-gray-100"
                        />
                    </div>
                </form>

                <div className="flex gap-4">
                    <button
                        onClick={actualizarDatosUsuario}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Guardar
                    </button>
                    <button
                        onClick={cancelar}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Perfil;

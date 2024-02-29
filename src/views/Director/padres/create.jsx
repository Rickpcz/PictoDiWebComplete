/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { collection, doc, setDoc, getDocs, query, where } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import db from "../../../Data/db";
import Swal from 'sweetalert2';

const CreatePadre = ({ isVisible, onClose, instituto }) => {
  const [correo, setCorreo] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [alumnos, setAlumnos] = useState([]);
  const [selectedAlumnos, setSelectedAlumnos] = useState([]); 
  const padreCollection = collection(db, "padres");
  const auth = getAuth();

  const fetchAlumnos = async () => {
    try {
      const alumnosQuery = query(
        collection(db, "niños"),
        where("instituto", "==", instituto)
      );
      const alumnosSnapshot = await getDocs(alumnosQuery);
      const alumnosData = alumnosSnapshot.docs.map((alumnoDoc) => ({
        id: alumnoDoc.id,
        ...alumnoDoc.data(),
      }));
      setAlumnos(alumnosData);
    } catch (error) {
      console.error("Error fetching alumnos:", error);
    }
  };

  useEffect(() => {
    fetchAlumnos(); // Llamar a la función al montar el componente
  }, []); // El segundo parámetro [] indica que se ejecutará solo una vez al montar el componente

  const create = async (e) => {
    e.preventDefault();
    try {
      if (!correo || !nombre || !password || selectedAlumnos.length === 0) {
        setError("Todos los campos son obligatorios");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, correo, password);

      await setDoc(doc(padreCollection, userCredential.user.uid), {
        id: userCredential.user.uid,
        correo: correo,
        nombre: nombre,
        password: password,
        permiso: "padre",
        instituto: instituto,
        alumnos: selectedAlumnos, // Guardar los alumnos seleccionados en la base de datos
      });

      Swal.fire({
        icon: 'success',
        title: 'Cuenta creada con éxito',
        text: '¡La cuenta ha sido creada exitosamente!',
      }).then(() => {
        onClose();
      });

    } catch (error) {
      console.error("Error al crear usuario:", error.message);
      setError("Hubo un problema al crear el usuario. Por favor, intenta de nuevo.");
      Swal.fire({
        icon: 'error',
        title: 'Error al crear la cuenta',
        text: 'Hubo un problema al crear la cuenta. Por favor, intenta de nuevo.',
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div className="w-[600px] flex flex-col">
        <button
          className="text-white text-xl place-self-end"
          id="wrapper"
          onClick={() => onClose()}
        >
          x
        </button>
        <div className="bg-white p-2 rounded m-30">
          <h2 className="text-2xl font-bold mb-4 text-center">Crear Profesor</h2>

          <form action="" className="grid grid-cols-2 m-10" onSubmit={create}>
            {/* right */}
            <div className="mx-5">
              <div className="mb-4">
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="correo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Correo
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
            </div>

            {/* left */}
            <div className="">
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>

              {/* Lista de Alumnos */}
              <div className="mt-4">
                <h3 className="text-lg font-bold mb-2">Selecciona Alumno(s):</h3>
                <select
                  multiple={true} // Permitir selección múltiple
                  value={selectedAlumnos} // Valor seleccionado
                  onChange={(e) => setSelectedAlumnos(Array.from(e.target.selectedOptions, option => option.value))}
                  className="mt-1 p-2 w-full border rounded-md"
                >
                  {alumnos.map((alumno) => (
                    <option key={alumno.id} value={alumno.id}>{alumno.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-10 items-center">
                <button
                  type="submit"
                  className="bg-blue-400 text-white px-4 py-2 rounded-md"
                >
                  Guardar
                </button>

                <button
                  onClick={() => onClose()}
                  className="bg-rose-500 text-white px-4 py-2 rounded-md"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePadre;

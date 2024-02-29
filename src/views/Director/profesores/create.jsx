/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import db from "../../../Data/db";
import Swal from 'sweetalert2';

const CreateProfesor = ({ isVisible, onClose, instituto }) => {
  const [correo, setCorreo] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [grado, setGrado] = useState("");
  const [grupo, setGrupo] = useState("");
  const [asignaturas, setAsignaturas] = useState([]);
  const [selectedAsignaturas, setSelectedAsignaturas] = useState([]);
  const [error, setError] = useState("");

  const ProfesorCollections = collection(db, "profesores");
  const auth = getAuth();

  
  useEffect(() => {
    const fetchAsignaturas = async () => {
      try {
        // Obtén la referencia a la colección 'profesores'
        const profesoresQuery = collection(db, "profesores");
        const profesoresSnapshot = await getDocs(profesoresQuery);

        // Inicializa una lista para almacenar todas las asignaturas
        const listaAsignaturas = [];

        // Itera sobre cada documento de 'profesores'
        profesoresSnapshot.forEach((profesorDoc) => {
          // Verifica si el documento existe
          if (profesorDoc.exists()) {
            // Accede al campo que es un array, por ejemplo, 'asignaturas'
            const asignaturasArray = profesorDoc.data().asignaturas;

            // Agrega las asignaturas a la lista general
            listaAsignaturas.push(...asignaturasArray);
          }
        });

        // Elimina duplicados de la lista de asignaturas (si es necesario)
        const asignaturasUnicas = [...new Set(listaAsignaturas)];

        // Haz algo con la lista final de asignaturas únicas
        console.log('Lista de asignaturas:', asignaturasUnicas);
        setAsignaturas(asignaturasUnicas);
      } catch (error) {
        console.error('Error al obtener la lista de asignaturas:', error);
      }
    };

    fetchAsignaturas();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      if (!correo || !nombre || !grado || !grupo || selectedAsignaturas.length === 0) {
        setError("Todos los campos son obligatorios");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, correo, password);

      await setDoc(doc(ProfesorCollections, userCredential.user.uid), {
        id: userCredential.user.uid,
        correo: correo,
        nombre: nombre,
        password: password,
        grado: grado,
        grupo: grupo,
        asignaturas: selectedAsignaturas,
        permiso: "profesor",
        instituto: instituto,
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

              <div className="mb-4">
                <label
                  htmlFor="grado"
                  className="block text-sm font-medium text-gray-700"
                >
                  Grado
                </label>
                <input
                  type="number"
                  id="grado"
                  name="grado"
                  value={grado}
                  onChange={(e) => setGrado(e.target.value)}
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

              <div className="mb-4">
                <label
                  htmlFor="grupo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Grupo
                </label>
                <input
                  type="text"
                  id="grupo"
                  name="grupo"
                  value={grupo}
                  onChange={(e) => setGrupo(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>


              <div className="mb-4">
                <label
                  htmlFor="asignaturas"
                  className="block text-sm font-medium text-gray-700"
                >
                  Asignaturas
                </label>
                <select
                  id="asignaturas"
                  name="asignaturas"
                  multiple 
                  value={selectedAsignaturas}
                  onChange={(e) => setSelectedAsignaturas(Array.from(e.target.selectedOptions, option => option.value))}
                  className="mt-1 p-2 w-full border rounded-md"
                >
                  {/* Mapea sobre las asignaturas disponibles y crea opciones */}
                  {asignaturas.map((asignatura) => (
                    <option key={asignatura} value={asignatura}>
                      {asignatura}
                    </option>
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

export default CreateProfesor;

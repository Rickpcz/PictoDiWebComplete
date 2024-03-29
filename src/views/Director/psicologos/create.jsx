/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import db from "../../../Data/db";
import Swal from 'sweetalert2';
import axios from 'axios';


const CreatePsicologo = ({ isVisible, onClose, instituto , updateData }) => {
  const [correo, setCorreo] = useState("");
  const [nombre, setNombre] = useState("");
  const [grado, setGrado] = useState("");
  const [grupo, setGrupo] = useState("");
  const [password, setPassword] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [error, setError] = useState("");
  const [psicologos, setPsicologos] = useState([]);

  const psicologoCollections = collection(db, "psicologos");
  const auth = getAuth();
  const apiURL = 'http://localhost:3000'


  

  const create = async (e) => {
    e.preventDefault();
  
    try {
      if (!correo || !nombre || !password || !especialidad || !grado || !grupo) {
        setError("Todos los campos son obligatorios");
        return;
      }
  
      const response = await axios.post(`${apiURL}/api/psicologo/create`, {
        nombre,
        correo,
        especialidad,
        instituto,
        grado,
        grupo,
        password,
      });
  
      const newPsicologo = response.data;
  
      setError('');
  
      Swal.fire({
        icon: 'success',
        title: 'Cuenta creada con éxito',
        text: '¡La cuenta ha sido creada exitosamente!',
      }).then(() => {
        onClose();
        updateData();
        console.log("Lógica adicional después de obtener la lista de psicólogos");
      });
      
      
      // Puedes realizar acciones adicionales si es necesario con newPsicologo
    } catch (error) {
      console.error("Error al crear usuario:", error.message);
      setError(
        "Hubo un problema al crear el usuario. Por favor, intenta de nuevo."
      );
  
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
          <h2 className="text-2xl font-bold mb-4 text-center">Crear Psicólogo</h2>

          <form action="" className="grid grid-cols-2 m-10" onSubmit={create}>
            {/* rigt */}
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
                  htmlFor="especialidad"
                  className="block text-sm font-medium text-gray-700"
                >
                  Especialidad
                </label>
                <input
                  type="text"
                  id="especialidad"
                  name="especialidad"
                  value={especialidad}
                  onChange={(e) => setEspecialidad(e.target.value)}
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
}

export default CreatePsicologo;

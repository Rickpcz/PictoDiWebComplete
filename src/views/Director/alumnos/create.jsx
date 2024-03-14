/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import db from "../../../Data/db";
import Swal from 'sweetalert2';
import axios from "axios";

const CreateAlumno = ({ isVisible, onClose, instituto, updateData}) => {
  const [correo, setCorreo] = useState("");
  const [nombre, setNombre] = useState("");
  const [fecha_nacimiento, setFecha_Nacimiento] = useState("");
  const [password, setPassword] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [gravedad, setGravedad] = useState("");
  const [grado, setGrado] = useState("");
  const [grupo, setGrupo] = useState("");
  const [error, setError] = useState("");

  const alumnoCollections = collection(db, "niños");
  const auth = getAuth();
  const apiURL = 'http://localhost:3000'

  const create = async (e) => {
    e.preventDefault();
    try {
      if (
        !correo ||
        !nombre ||
        !fecha_nacimiento ||
        !password ||
        !diagnostico ||
        !gravedad ||
        !grado ||
        !grupo
      ) {
        setError("Todos los campos son obligatorios");
        return;
      }

      const response = await axios.post(`${apiURL}/api/alumno/create`,{
        correo,
        nombre,
        fecha_nacimiento,
        password,
        diagnostico,
        gravedad,
        grado,
        grupo,
        instituto
      })

      const newAlumno = response.data;
      setError('');

      Swal.fire({
        icon: 'success',
        title: 'Cuenta creada con éxito',
        text: '¡La cuenta ha sido creada exitosamente!',
      }).then(() => {
        onClose();
        updateData();
      });

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
          <h2 className="text-2xl font-bold mb-4 text-center">Crear Alumno</h2>

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
                  htmlFor="diagnostico"
                  className="block text-sm font-medium text-gray-700"
                >
                  Diagnóstico
                </label>
                <input
                  type="text"
                  id="diagnostico"
                  name="diagnostico"
                  value={diagnostico}
                  onChange={(e) => setDiagnostico(e.target.value)}
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
                  htmlFor="fecha_nacimiento"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  value={fecha_nacimiento}
                  onChange={(e) => setFecha_Nacimiento(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>

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
                  htmlFor="gravedad"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gravedad
                </label>
                <input
                  type="text"
                  id="gravedad"
                  name="gravedad"
                  value={gravedad}
                  onChange={(e) => setGravedad(e.target.value)}
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
};

export default CreateAlumno;

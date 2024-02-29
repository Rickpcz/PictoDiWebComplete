/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDoc, updateDoc, doc, collection, getDocs } from 'firebase/firestore';
import db from '../../../Data/db';
import Swal from 'sweetalert2';

const EditPadre = ({ isVisible, onClose, id }) => {
  const [correo, setCorreo] = useState("");
  const [nombre, setNombre] = useState("");
  const [alumnos, setAlumnos] = useState([]);
  const [selectedAlumnos, setSelectedAlumnos] = useState([]); 

  const update = async (e) => {
    e.preventDefault();
    try {
      if (!id) {
        console.error('ID no válido');
        return;
      }

      const padreRef = doc(db, "padres", id);
      const data = {
        correo: correo,
        nombre: nombre,
        alumnos: selectedAlumnos,
      };

      await updateDoc(padreRef, data);

      Swal.fire({
        icon: 'success',
        title: 'Profesor Actualizado',
        text: 'La información del profesor se ha actualizado correctamente.',
      });

      onClose();
    } catch (error) {
      console.error('Error al actualizar el profesor:', error.message);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al actualizar el profesor. Por favor, intenta de nuevo.',
      });
    }
  };

  const getPadreById = async (id) => {
    if (!id) {
      console.error('ID no válido');
      return;
    }

    const padreRef = doc(db, "padres", id);
    const padreSnap = await getDoc(padreRef);

    if (padreSnap.exists()) {
      const data = padreSnap.data();

      // Verificar que los valores no sean undefined antes de establecer el estado
      if (data.correo !== undefined) {
        setCorreo(data.correo);
      }

      if (data.nombre !== undefined) {
        setNombre(data.nombre);
      }

      // Obtener la lista de todos los alumnos para el select
      const alumnosQuerySnapshot = await getDocs(collection(padreRef, "alumnos"));
      const alumnosData = alumnosQuerySnapshot.docs.map((alumnoDoc) => ({
        id: alumnoDoc.id,
        ...alumnoDoc.data(),
      }));
      setAlumnos(alumnosData);

      // Establecer la selección actual de alumnos
      setSelectedAlumnos(data.alumnos || []);
    }
  };

  useEffect(() => {
    getPadreById(id);
  }, [id]);

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
          <h2 className="text-2xl font-bold mb-4 text-center">Editar Profesor</h2>

          <form action="" className="grid grid-cols-2 m-10" onSubmit={update}>
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

export default EditPadre;

/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDoc, updateDoc, doc, collection, getDocs } from 'firebase/firestore';
import db from '../../../Data/db';
import Swal from 'sweetalert2';

const EditPsicologo = ({ isVisible, onClose, id }) => {
    const [correo, setCorreo] = useState("");
  const [nombre, setNombre] = useState("");
  const [grado, setGrado] = useState("");
  const [grupo, setGrupo] = useState("");
  const [especialidad, setEspecialidad] = useState("");

  const update = async (e) => {
    e.preventDefault();
    try {
      if (!id) {
        console.error('ID no válido');
        return;
      }
      const psicologoCollection = doc(db, "psicologos", id);
      const data = {
        correo:correo,
        nombre: nombre,
        grado: grado,
        grupo: grupo,
        especialidad:especialidad
      };

      await updateDoc(psicologoCollection, data);
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

  const getPsicologoById = async (id) => {
    if (!id) {
      console.error('ID no válido');
      return;
    }

    const psicologoRef = doc(db,"psicologos", id);
    const psicologoSnap = await getDoc(psicologoRef);

    if (psicologoSnap.exists()) {
      setNombre(psicologoSnap.data().nombre);
      setGrado(psicologoSnap.data().grado);
      setGrupo(psicologoSnap.data().grupo);
      setEspecialidad(psicologoSnap.data().especialidad)
    }
  };

  useEffect(() => {
    getPsicologoById(id);
  }, [id]);
    return(
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
            <h2 className="text-2xl font-bold mb-4 text-center">Editar Psicólogo</h2>
  
            <form action="" className="grid grid-cols-2 m-10" onSubmit={update}>
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

export default EditPsicologo;
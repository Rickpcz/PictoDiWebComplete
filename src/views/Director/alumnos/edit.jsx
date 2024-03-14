/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {useEffect, useState} from 'react'
import {  useParams } from 'react-router-dom'
import { getDoc, updateDoc, doc } from 'firebase/firestore'
import db from "../../../Data/db";
import Swal from 'sweetalert2';


const EditAlumno = ({isVisible, onClose, id, updateData}) => {
    const [correo, setCorreo] = useState("");
    const [nombre, setNombre] = useState("");
    const [fecha_nacimiento, setFecha_Nacimiento] = useState("");
    const [diagnostico, setDiagnostico] = useState("");
    const [gravedad, setGravedad] = useState("");
    const [grado, setGrado] = useState("");
    const [grupo, setGrupo] = useState("");



    const update = async (e) => {
        e.preventDefault();
        try {
            if (!id) {
                // Si id no está presente, muestra un mensaje o realiza alguna acción
                console.error("ID no válido");
                return;
            }

            const alumnoCollections = doc(db, "niños", id);
            const data = {
                nombre: nombre,
                fecha_nacimiento: fecha_nacimiento,
                diagnostico: diagnostico,
                gravedad: gravedad,
                grado: grado,
                grupo: grupo,
            };
    
            await updateDoc(alumnoCollections, data);
    
            // Mostrar SweetAlert de éxito
            Swal.fire({
                icon: 'success',
                title: 'Alumno Actualizado',
                text: 'La información del alumno se ha actualizado correctamente.',
            }).then(() => {
              onClose();
              updateData();
            });
        } catch (error) {
            console.error("Error al actualizar el alumno:", error.message);
    
            // Mostrar SweetAlert de error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al actualizar el alumno. Por favor, intenta de nuevo.',
            });
        }
    };

    const getAlumnoById = async (id) => {
        if (!id) {
            console.error("ID no válido");
            return;
        }
        const alumnoRef = doc(db, "niños", id);
        const alumnoSnap = await getDoc(alumnoRef);
    
        if (alumnoSnap.exists()) {
            setCorreo(alumnoSnap.data().correo);
            setNombre(alumnoSnap.data().nombre);
            setFecha_Nacimiento(alumnoSnap.data().fecha_nacimiento);
            setDiagnostico(alumnoSnap.data().diagnostico);
            setGravedad(alumnoSnap.data().gravedad);
            setGrado(alumnoSnap.data().grado);
            setGrupo(alumnoSnap.data().grupo);
        }
    };

    useEffect(() => {
        getAlumnoById(id);
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
          <h2 className="text-2xl font-bold mb-4 text-center">Crear Alumno</h2>

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
}

export default EditAlumno;
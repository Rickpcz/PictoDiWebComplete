/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import db from "../../../Data/db";
import { AiOutlineSearch } from 'react-icons/ai';
import Swal from 'sweetalert2';
import CreateDirector from "./Create";
import EditDirector from "./Edit";

const ShowDirectores = () => {
  const [director, setDirector] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const directorCollection = collection(db, "directores");

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDirectorId, setSelectedDirectorId] = useState(null);

  const getDirectores = async () => {
    try {
      const data = await getDocs(directorCollection);
      setDirector(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error fetching directors:", error);
    }
  };

  useEffect(() => {
    getDirectores();
  }, []);


  const filteredDirectores = director.filter((director) =>
    director.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const eliminarDirector = async (directorId) => {
    try {
      const confirmacion = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esto",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (confirmacion.isConfirmed) {
        await deleteDoc(doc(db, "directores", directorId));
        setDirector((prevDirectores) => prevDirectores.filter((director) => director.id !== directorId));
        Swal.fire("Eliminado", "El director ha sido eliminado correctamente", "success");
      }
    } catch (error) {
      console.error("Error deleting director:", error);
      Swal.fire("Error", "Ha ocurrido un error al eliminar el director", "error");
    }
  };

  // Función para actualizar los datos de los directores después de agregar uno nuevo
  const updateDataDirector = () => {
    getDirectores(); // Esta es la misma función que se utiliza para obtener los directores, por lo que simplemente volvemos a llamarla aquí
  };

  const openEditModal = (directorId) => {
    setSelectedDirectorId(directorId);
    setShowEditModal(true);
  };

  return (
    <div className="container mx-auto px-4" style={{ overflowY: "auto", maxHeight: "calc(100vh - 100px)" }}>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold my-4">Directores</h1>
        
        <div className="flex w-[30%] items-center">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded-md w-[100%]"
          />
          <AiOutlineSearch className="ml-3 text-gray-700" />
        </div>


        <li className="list-none">
          <button
          onClick={() => setShowModal(true)}
          className="bg-red-500 text-white rounded-2xl px-6 py-2">Agregar</button>
          {showModal && <CreateDirector isVisible={showModal} onClose={()=>{setShowModal(false)}} updateData={updateDataDirector}/>}
        </li>
      </div>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Nombre</th>
            <th className="py-2 px-4 border-b">Correo</th>
            <th className="py-2 px-4 border-b">Instituto</th>
            <th className="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredDirectores.map((director) => (
            <tr key={director.id}>
              <td className="py-2 px-4 border-b">{director.nombre}</td>
              <td className="py-2 px-4 border-b">{director.correo}</td>
              <td className="py-2 px-4 border-b">{director.instituto}</td>
              <td className="py-2 px-4 border-b flex gap-2">
                <button 
                
                className="bg-blue-400 text-white py-1 px-2 rounded"
                onClick={()=> openEditModal(director.id)}
                >
                    Editar
                </button>
                {showEditModal && (<EditDirector
                isVisible={showEditModal}
                onClose={()=>setShowEditModal(false)}
                id={selectedDirectorId}
                updateData={updateDataDirector}
                />)}
                <button className="bg-red-500 text-white py-1 px-2 rounded" onClick={() => eliminarDirector(director.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowDirectores;

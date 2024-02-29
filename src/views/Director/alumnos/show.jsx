import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import Swal from "sweetalert2";
import CreateAlumno from "./create";
import EditAlumno from "./edit";
import db from "../../../Data/db";

const ShowAlumnos = () => {
  const [children, setChildren] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [directorDoc, setDirectorDoc] = useState(null); // Define directorDoc state
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const fetchData = async (userId) => {
    try {
      if (userId) {
        const directorQuery = query(
          collection(db, "directores"),
          where("id", "==", userId)
        );
        const directorSnapshot = await getDocs(directorQuery);

        if (directorSnapshot.docs.length > 0) {
          const directorDoc = directorSnapshot.docs[0];
          setDirectorDoc(directorDoc); // Set directorDoc state
          const childrenQuery = query(
            collection(db, "niños"),
            where("instituto", "==", directorDoc.data().instituto)
          );
          const childrenSnapshot = await getDocs(childrenQuery);
          const childrenData = childrenSnapshot.docs.map((childDoc) => ({
            id: childDoc.id,
            ...childDoc.data(),
          }));
          setChildren(childrenData);
        } else {
          console.warn(
            "No se encontró un director con el ID de usuario actual."
          );
          setChildren([]);
        }
      } else {
        console.warn("No hay usuario autenticado.");
        setChildren([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteItem = async (collectionName, id, itemName) => {
    const result = await Swal.fire({
      title: `¿Estás seguro de eliminar a ${itemName}?`,
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const itemDocRef = doc(db, collectionName, id);
        await deleteDoc(itemDocRef);
        fetchData(currentUser?.uid);
        Swal.fire(
          "Eliminado",
          `${itemName} ha sido eliminado correctamente.`,
          "success"
        );
      } catch (error) {
        Swal.fire(
          "Error",
          `Hubo un problema al eliminar ${itemName}.`,
          "error"
        );
        console.error(`Error deleting ${collectionName}:`, error);
      }
    }
  };

  const openEditModal = (childId) => {
    setSelectedChildId(childId);
    setShowEditModal(true);
  };

  useEffect(() => {
    fetchData(currentUser?.uid);
  }, [currentUser]);

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold my-4">Niños</h1>
        <li className="list-none">
          <button
            className="bg-red-500 text-white rounded-2xl px-6 py-2"
            onClick={() => setShowModal(true)}
          >
            Agregar
          </button>
        </li>
        {showModal && <CreateAlumno isVisible={showModal} onClose = {()=>{setShowModal(false)}} instituto={directorDoc.data().instituto}/>}
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Nombre</th>
            <th className="py-2 px-4 border-b">Instituto</th>
            <th className="py-2 px-4 border-b">Fecha de Nacimiento</th>
            <th className="py-2 px-4 border-b">Diagnóstico</th>
            <th className="py-2 px-4 border-b">Gravedad</th>
            <th className="py-2 px-4 border-b">Grado</th>
            <th className="py-2 px-4 border-b">Grupo</th>
            <th className="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {children.map((child) => (
            <tr key={child.id}>
              <td className="py-2 px-4 border-b">{child.nombre}</td>
              <td className="py-2 px-4 border-b">{child.instituto}</td>
              <td className="py-2 px-4 border-b">{child.fecha_nacimiento}</td>
              <td className="py-2 px-4 border-b">{child.diagnostico}</td>
              <td className="py-2 px-4 border-b">{child.gravedad}</td>
              <td className="py-2 px-4 border-b">{child.grado}</td>
              <td className="py-2 px-4 border-b">{child.grupo}</td>
              <td className="py-2 border-b flex gap-2">
              <button
                  className="bg-blue-400 text-white py-1 px-2 rounded"
                  onClick={() => openEditModal(child.id)}
                >
                  Editar
                </button>
                {showEditModal && (
                  <EditAlumno
                    isVisible={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    id={selectedChildId}
                  />
                )}
                
                <button
                  className="bg-red-500 text-white py-1 px-2 rounded"
                  onClick={() => deleteItem("niños", child.id, child.nombre)}
                >
                  Eliminar
                </button>

                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowAlumnos;

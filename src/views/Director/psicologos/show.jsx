import  { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where, doc, deleteDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import db from '../../../Data/db';

const ShowPsicologos = () => {
  const [psychologists, setPsychologists] = useState([]);
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

          const psychologistsQuery = query(
            collection(db, "psicologos"),
            where("instituto", "==", directorDoc.data().instituto)
          );
          const psychologistsSnapshot = await getDocs(psychologistsQuery);
          const psychologistsData = psychologistsSnapshot.docs.map((psychologistDoc) => ({
            id: psychologistDoc.id,
            ...psychologistDoc.data(),
          }));
          setPsychologists(psychologistsData);
        } else {
          console.warn("No se encontró un director con el ID de usuario actual.");
          setPsychologists([]);
        }
      } else {
        console.warn("No hay usuario autenticado.");
        setPsychologists([]);
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
        fetchData(currentUser?.uid); // Actualizar datos después de eliminar
        Swal.fire("Eliminado", `${itemName} ha sido eliminado correctamente.`, "success");
      } catch (error) {
        Swal.fire("Error", `Hubo un problema al eliminar ${itemName}.`, "error");
        console.error(`Error deleting ${collectionName}:`, error);
      }
    }
  };

  useEffect(() => {
    fetchData(currentUser?.uid);
  }, [currentUser]);

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold my-4">Psicólogos</h1>
        <li className="list-none">
          <button className="bg-red-500 text-white rounded-2xl px-6 py-2">
            Agregar
          </button>
        </li>
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Nombre</th>
            <th className="py-2 px-4 border-b">Especialidad</th>
            <th className="py-2 px-4 border-b">Grado</th>
            <th className="py-2 px-4 border-b">Grupo</th>
            <th className="py-2 px-4 border-b">Instituto</th>
            <th className="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {psychologists.map((psychologist) => (
            <tr key={psychologist.id}>
              <td className="py-2 px-4 border-b">{psychologist.nombre}</td>
              <td className="py-2 px-4 border-b">{psychologist.especialidad}</td>
              <td className="py-2 px-4 border-b">{psychologist.grado}</td>
              <td className="py-2 px-4 border-b">{psychologist.grupo}</td>
              <td className="py-2 px-4 border-b">{psychologist.instituto}</td>
              <td className="py-2 px-4 border-b">
                <button
                  className="bg-red-500 text-white py-1 px-2 rounded"
                  onClick={() => deleteItem("psicologos", psychologist.id, psychologist.nombre)}
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

export default ShowPsicologos;

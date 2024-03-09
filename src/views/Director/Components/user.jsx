/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { FaUserMd } from "react-icons/fa";
import { FaChalkboardTeacher, FaImages } from "react-icons/fa";
import { FaUserGraduate } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { collection, getDocs, where, query } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import db from "../../../Data/db";

const UserCards = () => {
  const [userCounts, setUserCounts] = useState({
    niños: 0,
    profesores: 0,
    padres: 0,
    psicologos: 0,
  });
  const [directorDoc, setDirectorDoc] = useState(null);
  const [pictogramsData, setPictogramsData] = useState([]);
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
          setDirectorDoc(directorDoc);
          const userInstituto = directorDoc.data().instituto;

          const niñosQuery = query(
            collection(db, "niños"),
            where("instituto", "==", userInstituto)
          );
          const niñosSnapshot = await getDocs(niñosQuery);
          const niñosCount = niñosSnapshot.size;

          const profesoresQuery = query(
            collection(db, "profesores"),
            where("instituto", "==", userInstituto)
          );
          const profesoresSnapshot = await getDocs(profesoresQuery);
          const profesoresCount = profesoresSnapshot.size;

          const padresQuery = query(
            collection(db, "padres"),
            where("instituto", "==", userInstituto)
          );
          const padresSnapshot = await getDocs(padresQuery);
          const padresCount = padresSnapshot.size;

          const psicologosQuery = query(
            collection(db, "psicologos"),
            where("instituto", "==", userInstituto)
          );
          const psicologosSnapshot = await getDocs(psicologosQuery);
          const psicologosCount = psicologosSnapshot.size;

          setUserCounts({
            niños: niñosCount,
            profesores: profesoresCount,
            padres: padresCount,
            psicologos: psicologosCount,
          });
        }
      }
      try {
        const pictogramsCollection = collection(db, 'pictograms'); // Reemplaza 'pictograms' con tu colección real
        const pictogramsSnapshot = await getDocs(pictogramsCollection);
        const data = pictogramsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPictogramsData(data);
      } catch (error) {
        console.error('Error fetching pictograms:', error);
      }
    } catch (error) {
      console.warn("Error:", error);
    }
  };

  // Llamada inicial para obtener datos al cargar el componente
  useEffect(() => {
    fetchData(currentUser?.uid);
  }, [currentUser]);

  return (
    <main
    className="main-container grid-area-main overflow-y-auto px-10 py-2 text-white"
    style={{ color: "rgba(255, 255, 255, 0.95)" }}
  >
    <div className="main-title flex justify-between">
      <h3 className="text-gray-400 font-bold text-2xl py-6">Dashboard</h3>
    </div>
  
    <div className="main-cards grid grid-cols-5 my-15">
  
      <div className="card bg-blue-500 flex flex-col items-center rounded-xl w-56">
        <div className="w-full flex gap-4 justify-center h-[60%] items-center">
          <h3 className="text-xl font-bold">Niños</h3>
          <FaUserGraduate className="card_icon text-4xl" />
        </div>
        <h1 className="text-3xl text-right pr-4">{userCounts.niños}</h1>
      </div>
  
      <div className="card bg-orange-500 w-56 h-36 flex flex-col items-center rounded-xl">
        <div className="w-full flex gap-4 justify-center h-[60%] items-center">
          <h3 className="text-xl font-bold">Profesores</h3>
          <FaChalkboardTeacher className="card_icon text-4xl" />
        </div>
        <h1 className="text-3xl text-right pr-4">{userCounts.profesores}</h1>
      </div>
  
      <div className="card bg-green-500 w-56 h-36 flex flex-col items-center rounded-xl">
        <div className="w-full flex gap-4 justify-center h-[60%] items-center">
          <h3 className="text-xl font-bold">Padres</h3>
          <FaUserTie className="card_icon text-4xl" />
        </div>
        <h1 className="text-3xl text-right pr-4">{userCounts.padres}</h1>
      </div>
  
      <div className="card bg-red-500 w-56 h-36 flex flex-col items-center rounded-xl">
        <div className="w-full flex gap-4 justify-center h-[60%] items-center">
          <h3 className="text-xl font-bold">Psicólogos</h3>
          <FaUserMd className="card_icon text-4xl" />
        </div>
        <h1 className="text-3xl text-right pr-4">{userCounts.psicologos}</h1>
      </div>

      <div className="card bg-purple-500 w-56 h-36 flex flex-col items-center text-white rounded-xl">
      <div className="w-full flex gap-4 justify-center h-[60%] items-center">
        <h3 className="text-xl font-bold text-white">Pictogramas</h3>
        <FaImages className="card_icon text-4xl" />
      </div>
      <h1 className="text-3xl text-right pr-4 text-white">{pictogramsData.length}</h1>
    </div>
    </div>
  </main>
  
  );
};

export default UserCards;

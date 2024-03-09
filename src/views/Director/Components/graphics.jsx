/* eslint-disable no-unused-vars */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from 'react';

import { collection, getDocs, where, query } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import db from '../../../Data/db';

const Graphics = () => {

  const [userCounts, setUserCounts] = useState({
    niños: 0,
    profesores: 0,
    padres: 0,
    psicologos: 0,
  });
  const [directorDoc, setDirectorDoc] = useState(null);
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
    } catch (error) {
      console.warn("Error:", error);
    }
  };

  useEffect(() => {
    fetchData(currentUser?.uid);
  }, [currentUser]);

  const data = [
    { name: 'Niños', Cantidad: userCounts.niños },
    { name: 'Profesores',Cantidad : userCounts.profesores },
    { name: 'Padres', Cantidad: userCounts.padres },
    { name: 'Psicólogos', Cantidad: userCounts.psicologos },
  ];

  return (
    <div className="w-[40%] py-2">
      <h2 className='text-center text-gray-500 text-xl'>Usuarios</h2>
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Cantidad" fill="#f97188" />
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
}

export default Graphics;

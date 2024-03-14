import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import db from '../../../Data/db';

const PictogramsChart = () => {
  const [pictogramsData, setPictogramsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pictogramsCollection = collection(db, 'pictograms');
        const pictogramsSnapshot = await getDocs(pictogramsCollection);
        const pictograms = pictogramsSnapshot.docs.map(doc => doc.data());
        setPictogramsData(pictograms);
      } catch (error) {
        console.error('Error fetching pictograms:', error);
      }
    };

    fetchData();
  }, []);

  // Función para contar la cantidad de pictogramas por categoría
  const countPictogramsByCategory = () => {
    const counts = {};

    for (const pictogram of pictogramsData) {
      const category = pictogram.category;

      if (category in counts) {
        counts[category]++;
      } else {
        counts[category] = 1;
      }
    }

    return counts;
  };

  const pictogramCounts = countPictogramsByCategory();

  const data = Object.keys(pictogramCounts).map(category => ({
    name: category,
    Cantidad: pictogramCounts[category],
  }));

  return (
    <div className="w-[50%] py-2">
      <h2 className='text-center text-gray-500 text-xl'>Pictogramas por Categoría</h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Cantidad" fill="#60a5fa" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PictogramsChart;

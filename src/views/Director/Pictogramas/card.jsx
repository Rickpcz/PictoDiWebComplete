import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import db from '../../../Data/db';
import { AiOutlineSearch } from 'react-icons/ai';
import AddPictogramModal from './add';

const Card = () => {
  const [pictogramas, setPictogramas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchPictogramas = async () => {
      try {
        const pictogramasCollection = collection(db, 'pictograms');
        const pictogramasSnapshot = await getDocs(pictogramasCollection);
        const pictogramasData = pictogramasSnapshot.docs.map((pictogramaDoc) => ({
          id: pictogramaDoc.id,
          ...pictogramaDoc.data(),
        }));
        setPictogramas(pictogramasData);
      } catch (error) {
        console.error('Error fetching pictogramas:', error);
      }
    };

    fetchPictogramas();
  }, []);
  const handleDelete = async (id) => {
    try {
      console.log('db:', db);
      const pictogramaRef = doc(db, 'pictograms', id);
      console.log('pictogramaRef:', pictogramaRef);
      await deleteDoc(pictogramaRef);
      // ... rest of the code
    } catch (error) {
      console.error('Error deleting pictograma:', error);
    }
  };
  

  const handleAddPictogram = (newPictogram) => {
    setPictogramas((prevPictogramas) => [...prevPictogramas, newPictogram]);
  };

  const filteredPictogramas = pictogramas
    .filter((pictograma) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        pictograma.title.toLowerCase().includes(searchTermLower) ||
        pictograma.category.toLowerCase().includes(searchTermLower)
      );
    })
    .filter((pictograma) =>
      selectedCategory ? pictograma.category === selectedCategory : true
    );

  const categories = Array.from(new Set(pictogramas.map((pictograma) => pictograma.category)));

  return (
    <div>
      <div className="mb-4 flex items-center w-full">
        <div className="flex w-full items-center">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded-md w-[30%]"
          />
          <AiOutlineSearch className="ml-3 text-gray-700" />
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-rose-500 text-white px-4 py-2 rounded-md mr-10"
        >
          Agregar
        </button>
      </div>
      <div className="mb-4 flex items-center w-full">
        <p className="mr-3">Filtrar por Categoría:</p>
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
          className="p-2 border rounded-md"
        >
          <option value="">Todas</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPictogramas.map((pictograma) => (
          <div key={pictograma.id} className="bg-white p-4 rounded-md shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-center">{pictograma.title}</h3>
            <img src={pictograma.imageUrl} alt={pictograma.title} className="object-cover rounded-md mb-2" />
            <div className="flex items-center flex-col">
              <p className="text-gray-600 mb-2">Autor: {pictograma.author}</p>
              <p className="text-gray-600 mb-2">Categoría: {pictograma.category}</p>
              <p className="text-gray-600 mb-2">Descripción: {pictograma.description}</p>
              <button
                onClick={() => handleDelete(pictograma.id)}
                className="mt-2 p-2 bg-red-500 text-white rounded-md"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAddModalOpen && (
        <AddPictogramModal
          onClose={() => setIsAddModalOpen(false)}
          onPictogramAdded={handleAddPictogram}
        />
      )}
    </div>
  );
};

export default Card;

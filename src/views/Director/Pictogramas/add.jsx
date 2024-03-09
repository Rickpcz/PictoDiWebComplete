/* eslint-disable react/prop-types */
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import db from '../../../Data/db';
import Swal from 'sweetalert2';

const AddPictogramModal = ({ onClose, onPictogramAdded }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const pictogramaRef = await addDoc(collection(db, 'pictograms'), {
        title,
        author,
        category,
        description,
        imageUrl,
      });

      onPictogramAdded({
        id: pictogramaRef.id,
        title,
        author,
        category,
        description,
        imageUrl,
      });

      onClose();

      // Mostrar el mensaje de éxito con SweetAlert2
      Swal.fire({
        icon: 'success',
        title: 'Pictograma Agregado',
        text: 'El pictograma se agregó correctamente.',
      });
    } catch (error) {
      console.error('Error adding pictograma:', error);
      // Mostrar el mensaje de error con SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al agregar el pictograma. Por favor, intenta de nuevo.',
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div className="w-[400px] bg-white p-4 rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-4">Agregar Pictograma</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="author" className="block text-sm font-medium text-gray-700">
              Autor
            </label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Categoría
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
              URL de la imagen
            </label>
            <input
              type="text"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-400 text-white px-4 py-2 rounded-md"
            >
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPictogramModal;

/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
const CreateDirector = ({ isVisible, onClose, updateData }) => {
  const [correo, setCorreo] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [instituto, setInsituto] = useState("");
  const [error, setError] = useState("");

  const apiURL = "http://localhost:3000";

  const Create = async (e) => {
    e.preventDefault();

    try {
      if (!correo || !nombre || !instituto || !password) {
        setError("Todos los campos son obligatorios");
        return;
      }

      const response = await axios.post(`${apiURL}/api/director/create`, {
        correo,
        nombre,
        instituto,
        password,
      });

      const newDirector = response.data;
      setError("");

      Swal.fire({
        icon: "success",
        title: "Cuenta creada con éxito",
        text: "¡La cuenta ha sido creada exitosamente!",
      }).then(() => {
        onClose();
        updateData();
      });
    } catch (error) {
      console.error("Error al crear usuario:", error.message);
      setError(
        "Hubo un problema al crear el usuario. Por favor, intenta de nuevo."
      );
      Swal.fire({
        icon: "error",
        title: "Error al crear la cuenta",
        text: "Hubo un problema al crear la cuenta. Por favor, intenta de nuevo.",
      });
    }
  };

  return (
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
          <h2 className="text-2xl font-bold mb-4 text-center">
            Crear Director
          </h2>

          <form action="" className="grid grid-cols-2 m-10" onSubmit={Create}>
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
                  htmlFor="correo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Correo
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
            </div>

            {/* left */}
            <div className="">
              <div className="mb-4">
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-700"
                >
                  Instituto
                </label>
                <input
                  type="text"
                  id="instituo"
                  name="instituto"
                  value={instituto}
                  onChange={(e) => setInsituto(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
};

export default CreateDirector;

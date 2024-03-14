/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import db from "../../../Data/db";

const EditDirector = ({isVisible, onClose, id, updateData}) => {
    const [correo, setCorreo] = useState("");
    const [nombre, setNombre] = useState("");
    const [instituto, setInstituto] = useState("");

    useEffect(() => {
        const getDirectorById = async (id) => {
            if (!id) return;

            try {
                const directorRef = doc(db, 'directores', id);
                const directorSnap = await getDoc(directorRef);

                if (directorSnap.exists()) {
                    const data = directorSnap.data();
                    setCorreo(data.correo);
                    setNombre(data.nombre);
                    setInstituto(data.instituto);
                }
            } catch (error) {
                console.error("Error al obtener el director:", error.message);
            }
        };

        getDirectorById(id);
    }, [id]);

    const Update = async (e) => {
        e.preventDefault();

        try {
            if (!id) {
                console.error("ID no válido");
                return;
            }

            const directorCollection = doc(db, "directores", id);
            const data = {
                correo: correo,
                nombre: nombre,
                instituto: instituto
            };

            await updateDoc(directorCollection, data);
            updateData();
            onClose();
        } catch (error) {
            console.error("Error al actualizar el director:", error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
            <div className="w-[600px] flex flex-col">
                <button
                    className="text-white text-xl place-self-end"
                    id="wrapper"
                    onClick={onClose}
                >
                    x
                </button>
                <div className="bg-white p-2 rounded m-30">
                    <h2 className="text-2xl font-bold mb-4 text-center">
                        Editar Director
                    </h2>

                    <form action="" className="grid grid-cols-2 m-10" onSubmit={Update}>
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
                                    htmlFor="instituto"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Instituto
                                </label>
                                <input
                                    type="text"
                                    id="instituto"
                                    name="instituto"
                                    value={instituto}
                                    onChange={(e) => setInstituto(e.target.value)}
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
                                    onClick={onClose}
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

export default EditDirector;

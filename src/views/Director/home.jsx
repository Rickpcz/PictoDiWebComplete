import { getAuth, signOut } from 'firebase/auth';
import { FaHome } from "react-icons/fa";
import { FaChildren } from "react-icons/fa6";
import { FaChalkboardTeacher } from "react-icons/fa";
import { MdFamilyRestroom } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { IoLogOutSharp } from "react-icons/io5";
import { MdOutlineImageSearch } from "react-icons/md";
import {
  RiMenu2Line,
  RiAccountCircleFill,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiNotification3Line,
  RiUser3Line
} from "react-icons/ri";
import { useState } from "react";
import appFirebase from '../../Data/credentials';
import ShowAlumnos from "./alumnos/show";
import ShowPadres from "./padres/show";
import ShowProfesores from "./profesores/show";
import ShowPsicologos from "./psicologos/show";

const auth = getAuth(appFirebase);

function HomeDirector() {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [cuentasOpen, setCuentasOpen] = useState(true);
  const [perfilOpen, setPerfilOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleSideBar = () => {
    setSideBarOpen(!sideBarOpen);
  };

  const toggleCuentas = () => {
    setCuentasOpen(!cuentasOpen);
  };

  const togglePerfil = () => {
    setPerfilOpen(!perfilOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
    }
  };

  const selectOption = (option) => {
    setSelectedOption(option);
  };

  const renderSelectedOption = () => {
    switch (selectedOption) {
      case "niños":
        return <ShowAlumnos />;
      case "padres":
        return <ShowPadres />;
      case "profesores":
        return <ShowProfesores />;
      case "psicologos":
        return <ShowPsicologos />;
      default:
        return null;
    }
  };

  return (
    <div className="main-h-screen grid grid-col-1 grid-cols-6">
      {/* sidebar */}
      <div
        className={`h-screen border-r fixed lg:static top-0 w-[80%] lg:w-full ${
          sideBarOpen ? "left-0" : "-left-full"
        } w-full lg:w-64 overflow-y-scroll lg:overflow-hidden p-8 transition-all duration-700 bg-gray-100`}
      >
        <div className="text-center p-8 ">
          <h1 className="uppercase font-bold tracking-[2px] text-blue-400 text-xl">
            Picto<span className="text-rose-400">Di</span>
          </h1>
        </div>
        <div className="h-full flex flex-col justify-between">
          <nav>
            <ul>
              <li>
                <button
                  onClick={() => selectOption("home")}
                  className="flex items-center gap-4 p-4 hover:text-white rounded-lg hover:bg-rose-500  transition-colors text-gray-400 font-semibold"
                >
                  <FaHome />
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={toggleCuentas}
                  className="flex items-center justify-between w-full p-4 hover:text-white rounded-lg hover:bg-rose-500  transition-colors text-gray-400 font-semibold"
                >
                  <div className="flex items-center gap-4">
                    <RiAccountCircleFill />
                    Cuentas
                  </div>
                  {cuentasOpen ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                </button>
                {cuentasOpen && (
                  <ul className="pl-6">
                    <li>
                      <button
                        onClick={() => selectOption("padres")}
                        className="flex items-center gap-4 p-4 hover:text-white rounded-lg hover:bg-rose-500  transition-colors text-gray-400 font-semibold"
                      >
                        <MdFamilyRestroom />
                        Padres
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => selectOption("niños")}
                        className="flex items-center gap-4 p-4 hover:text-white rounded-lg hover:bg-rose-500  transition-colors text-gray-400 font-semibold"
                      >
                        <FaChildren />
                        Niños
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => selectOption("profesores")}
                        className="flex items-center gap-4 p-4 hover:text-white rounded-lg hover:bg-rose-500  transition-colors text-gray-400 font-semibold"
                      >
                        <FaChalkboardTeacher />
                        Profesores
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => selectOption("psicologos")}
                        className="flex items-center gap-4 p-4 hover:text-white rounded-lg hover:bg-rose-500  transition-colors text-gray-400 font-semibold"
                      >
                        <FaUserDoctor />
                        Psicólogos
                      </button>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <button
                  onClick={() => selectOption("pictogramas")}
                  className="flex items-center gap-4 p-4 hover:text-white rounded-lg hover:bg-rose-500  transition-colors text-gray-400 font-semibold"
                >
                  <MdOutlineImageSearch />
                  Pictogramas
                </button>
              </li>
            </ul>
          </nav>
          <div className="log-out lg:absolute bottom-10 left-10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 p-4 text-white rounded-lg bg-rose-500 font-semibold justify-center"
            >
              Cerrar Sesión <IoLogOutSharp />
            </button>
          </div>
        </div>
      </div>

      {/* btn-movil */}
      <button
        className="lg:hidden block absolute top-3 left-4 p-2 text-2xl z-20"
        onClick={toggleSideBar}
      >
        <RiMenu2Line />
      </button>

      {/* content */}
      <div className="col-span-5 h-screen">
        <header className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 w-full">
          <nav className="w-full md:w-[60%] lg:w-[70%] flex justify-center md:justify-end z-50">
            <ul className="flex items-center gap-5">
              <li>
                <button className="text-xl">
                  <RiNotification3Line />
                </button>
              </li>
              <li className="relative">
                <button onClick={togglePerfil} className="focus:outline-none">
                  <div className="flex items-center gap-4">
                    Director
                    {perfilOpen ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                  </div>
                </button>
                {perfilOpen && (
                  <ul className="absolute top-full left-0 mt-2">
                    <li>
                      <button
                        className="flex items-center gap-4 p-4 hover:text-white rounded-lg hover:bg-rose-500  transition-colors text-gray-400 font-semibold"
                      >
                        <RiUser3Line />
                        Perfil
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </nav>
        </header>
        <main>
          {renderSelectedOption()}
        </main>
      </div>
    </div>
  );
}

export default HomeDirector;

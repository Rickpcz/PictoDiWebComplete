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


import { useState, useEffect } from "react";
import appFirebase from '../../Data/credentials';
import ShowAlumnos from "./alumnos/show";
import ShowPadres from "./padres/show";
import ShowProfesores from "./profesores/show";
import ShowPsicologos from "./psicologos/show";
import Card from './Pictogramas/card';
import Home from './homeDirect';
import Perfil from './perfil';
import { doc, getDoc } from 'firebase/firestore';
import db from '../../Data/db';

const auth = getAuth(appFirebase);

function HomeDirector() {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [cuentasOpen, setCuentasOpen] = useState(true);
  const [perfilOpen, setPerfilOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userName, setUserName] = useState("");
  

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
      case "pictogramas":
      return <Card/>;
      case 'home':
        return <Home/>;
      case 'perfil':
        return <Perfil/>
      default:
        return null;
    }
  };

  const buttonStyles = {
    base: 'flex items-center gap-4 p-4 transition-colors text-gray-400 font-semibold ',
    selected: 'bg-rose-500 text-white rounded-lg',
    hover: 'hover:text-white hover:bg-rose-500 rounded-lg',
  };
  

  useEffect(() => {

    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // Assuming you have a 'uid' property in your user data
          const adminDocRef = doc(db, "directores", user.uid);
          const adminDocSnapshot = await getDoc(adminDocRef);
    
          if (adminDocSnapshot.exists()) {
            const adminData = adminDocSnapshot.data();
            setUserName(adminData.nombre || "Usuario");
          } else {
            console.error("Admin data not found");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };
    const verificarAutenticacion = () => {
      const usuarioActual = auth.currentUser;
      if (usuarioActual) {
        
        setSelectedOption('home');
      }
    };

    verificarAutenticacion();
    fetchUserData();
  }, []);

  return (
    <div className="main-h-screen grid grid-col-1 grid-cols-6 relative">
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
              <li className='py-1'>
                <button
                  onClick={() => selectOption("home")}
                  className={`${buttonStyles.base} ${selectedOption === 'home' ? buttonStyles.selected : buttonStyles.hover}`}
                >
                  <FaHome />
                  Home
                </button>
              </li>
              <li className='py-1'>
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
                    <li className='py-1'>
                      <button
                        onClick={() => selectOption("padres")}
                        className={`${buttonStyles.base} ${selectedOption === 'padres' ? buttonStyles.selected : buttonStyles.hover}`}
                      >
                        <MdFamilyRestroom />
                        Padres
                      </button>
                    </li>
                    <li className='py-1'>
                      <button
                        onClick={() => selectOption("niños")}
                        className={`${buttonStyles.base} ${selectedOption === 'niños' ? buttonStyles.selected : buttonStyles.hover}`}
                      >
                        <FaChildren />
                        Niños
                      </button>
                    </li>
                    <li className='py-1'>
                      <button
                        onClick={() => selectOption("profesores")}
                        className={`${buttonStyles.base} ${selectedOption === 'profesores' ? buttonStyles.selected : buttonStyles.hover}`}
                      >
                        <FaChalkboardTeacher />
                        Profesores
                      </button>
                    </li>
                    <li className='py-1'>
                      <button
                        onClick={() => selectOption("psicologos")}
                        className={`${buttonStyles.base} ${selectedOption === 'psicologos' ? buttonStyles.selected : buttonStyles.hover}`}
                      >
                        <FaUserDoctor />
                        Psicólogos
                      </button>
                    </li>
                  </ul>
                )}
              </li>
              <li className='py-1'>
                <button
                  onClick={() => selectOption("pictogramas")}
                  className={`${buttonStyles.base} ${selectedOption === 'pictogramas' ? buttonStyles.selected : buttonStyles.hover}`}
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
                    {userName}
                    {perfilOpen ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                  </div>
                </button>
                {perfilOpen && (
                  <ul className="absolute top-full left-0 mt-2">
                    <li>
                      <button
                      onClick={() => {
                        selectOption("perfil")
                        setPerfilOpen(false)
                      }}
                      
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
        {selectedOption ? renderSelectedOption() : null}
        </main>
      </div>
    </div>
  );
}

export default HomeDirector;

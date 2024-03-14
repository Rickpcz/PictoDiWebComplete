/* eslint-disable no-unused-vars */
import { getAuth, signOut } from "firebase/auth";
import { RiAccountCircleFill, RiArrowDownSLine, RiArrowUpSLine, RiMenu2Line, RiNotification3Line, RiUser3Line } from "react-icons/ri";
import { IoLogOutSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import appFirebase from "../../Data/credentials";
import ShowDirectores from "./components/Show";
import { doc, getDoc } from "firebase/firestore";

import db from "../../Data/db";


const auth = getAuth(appFirebase);

function HomeAdmin() {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [perfilOpen, setPerfilOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userName, setUserName] = useState("");
 


  const toggleSideBar = () => {
    setSideBarOpen(!sideBarOpen);
  };

  const togglePerfil = () => {
    setPerfilOpen(!perfilOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  const renderSelectedOption = () => {
    switch (selectedOption) {
      case "directores":
        return <ShowDirectores />;

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
          const adminDocRef = doc(db, "admin", user.uid);
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
        
        setSelectedOption('directores');
      }
    };

    verificarAutenticacion();

    fetchUserData();
  }, []);

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
                  onClick={() => setSelectedOption("directores")}
                  className={`${buttonStyles.base} ${selectedOption === 'directores' ? buttonStyles.selected : buttonStyles.hover}`}
                >
                  <RiAccountCircleFill />
                  Directores
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
                    {userName} {/* Display user name */}
                    
                  </div>
                </button>
                
              </li>
            </ul>
          </nav>
        </header>
        <main>{selectedOption ? renderSelectedOption() : null}</main>
      </div>
    </div>
  );
}

export default HomeAdmin;

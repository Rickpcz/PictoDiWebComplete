/* eslint-disable no-unused-vars */
import { FaFacebook, FaLinkedin, FaGoogle, FaEnvelope } from "react-icons/fa";
import { MdLock } from "react-icons/md";
import { useState } from "react";
import imgLogin from "../assets/login-ros2.svg";
import appFirebase from "../Data/credentials";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail
} from "firebase/auth";
import Swal from 'sweetalert2';


const auth = getAuth(appFirebase);

const Login = () => {
  const [registrando, setRegistrando] = useState(false);
  const [error, setError] = useState(null);
  const [resetPasswordSent, setResetPasswordSent] = useState(false);

  const autenticacion = async (e) => {
    e.preventDefault();

    const correoInput = e.target.email;
    const passwordInput = e.target.password;

    if (correoInput && passwordInput) {
      const correo = correoInput.value;
      const password = passwordInput.value;

      try {
        if (registrando) {
          await createUserWithEmailAndPassword(auth, correo, password);
        } else {
          await signInWithEmailAndPassword(auth, correo, password);
        }
        setError(null);
      } catch (error) {
        console.log(error);
        setError("Datos incorrectos. Revise su correo y su contraseña");
      }
    } else {
      setError("Campos de correo y/o contraseña no encontrados");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
  
    const correoInput = document.querySelector('input[name="email"]');
    
    if (!correoInput || !correoInput.value.trim()) {
      console.error("Dirección de correo electrónico no válida");
      setError("Ingrese una dirección de correo electrónico válida");
      return;
    }
  
    const correo = correoInput.value.trim();
  
    try {
      
      const signInMethods = await fetchSignInMethodsForEmail(auth, correo);
  
      if (signInMethods.length === 0) {
        setError("El correo electrónico no está registrado. Regístrese primero.");
        Swal.fire({
          icon: 'error',
          title: 'Correo no registrado',
          text: 'El correo electrónico no está registrado.',
        });
  
        return;
      }
  
      await sendPasswordResetEmail(auth, correo);
      setError(null);
      setResetPasswordSent(true);
  
      Swal.fire({
        icon: 'success',
        title: 'Correo enviado',
        text: 'Se ha enviado un correo para restablecer tu contraseña.',
      });
  
    } catch (error) {
      console.log(error);
      setError(
        "Error al enviar el correo de restablecimiento de contraseña. Verifique la dirección de correo proporcionada."
      );
  
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al enviar el correo. Por favor, inténtalo de nuevo.',
      });
    }
  };
  
  
  
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <main className="flex flex-col items-center justify-center w-full flex-l px-20 text-center">
        <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
          <form onSubmit={autenticacion} className="w-3/5 p-5">
            <div className="text-left font-bold">
              <span className="text-rose-500">Picto</span>
              <span className="text-blue-400">Di</span>
            </div>
            <div className="py-10">
              <h2 className="text-3xl font-bold text-rose-500 mb-2">
                Iniciar Sesión
              </h2>
              <div className="border-2 w-10 border-rose-500 inline-block mb-2"></div>
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                  <FaEnvelope className="text-gray-400 m-2" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Correo"
                    className="bg-gray-100 outline-none text-sm flex-l"
                  />
                </div>
                <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                  <MdLock className="text-gray-400 m-2" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    className="bg-gray-100 outline-none text-sm flex-l"
                  />
                </div>
                <div className="flex justify-between w-64 mb-10 mt-10">
                  <label htmlFor="" className="flex items-center text-xs">
                    <input type="checkbox" name="remember" className="mr-1" />
                    Recuerdame
                  </label>
                  <a href="#" onClick={handleForgotPassword} className="text-xs">
                ¿Olvidaste tu contraseña?
              </a>
                </div>
                <button
                  type="submit"
                  className="border-2 border-rose-500 rounded-full px-12 py-2 inline-block font-semibold hover:bg-rose-500 hover:text-white"
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>
          </form>
          <div className="w-2/5 rounded-tr-2xl rounded-br-2xl py-36 px-12 bg-rose-400">
            <img src={imgLogin} alt="Login" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;

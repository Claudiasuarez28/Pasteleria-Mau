import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import CarritoPage from "./pages/CarritoPage";
import Admin from "./pages/Admin";
import AdminPanel from "./components/AdminPanel";
import AdminCategorias from "./components/AdminCategorias";
import Login from "./pages/Login";

function App() {
  const location = useLocation();

  const [carrito, setCarrito] = useState([]);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    if (location.pathname === "/") {
      localStorage.removeItem("usuarioMaue");
      setUsuario(null);
    } else {
      const usuarioGuardado = localStorage.getItem("usuarioMaue");

      if (usuarioGuardado) {
        try {
          setUsuario(JSON.parse(usuarioGuardado));
        } catch {
          localStorage.removeItem("usuarioMaue");
          setUsuario(null);
        }
      }
    }
  }, []);

  useEffect(() => {
    const manejarCierreSesion = () => {
      localStorage.removeItem("usuarioMaue");
      setUsuario(null);
    };

    window.addEventListener(
      "maue-cerrar-sesion",
      manejarCierreSesion
    );

    return () => {
      window.removeEventListener(
        "maue-cerrar-sesion",
        manejarCierreSesion
      );
    };
  }, []);

  const iniciarSesion = (usuarioNuevo) => {
    localStorage.setItem(
      "usuarioMaue",
      JSON.stringify(usuarioNuevo)
    );

    setUsuario(usuarioNuevo);
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuarioMaue");
    setUsuario(null);
  };

  const agregarAlCarrito = (producto) => {
    setCarrito((carritoActual) => {
      const productoExistente = carritoActual.find(
        (item) => item.id === producto.id
      );

      if (productoExistente) {
        return carritoActual.map((item) =>
          item.id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + 1,
              }
            : item
        );
      }

      return [...carritoActual, { ...producto, cantidad: 1 }];
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((carritoActual) =>
      carritoActual.filter((item) => item.id !== id)
    );
  };

  const cambiarCantidad = (id, cantidad) => {
    if (cantidad <= 0) {
      eliminarDelCarrito(id);
      return;
    }

    setCarrito((carritoActual) =>
      carritoActual.map((item) =>
        item.id === id
          ? { ...item, cantidad }
          : item
      )
    );
  };

  const cantidadCarrito = carrito.reduce(
    (total, producto) => total + producto.cantidad,
    0
  );

  const esAdmin = usuario?.rol === "administrador";
  const estaEnAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {!estaEnAdmin && (
        <Navbar
          cantidadCarrito={cantidadCarrito}
          usuario={usuario}
          cerrarSesion={cerrarSesion}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={<Inicio />}
        />

        <Route
          path="/productos"
          element={
            <Productos
              agregarAlCarrito={agregarAlCarrito}
            />
          }
        />

        <Route
          path="/carrito"
          element={
            <CarritoPage
              carrito={carrito}
              cambiarCantidad={cambiarCantidad}
              eliminarDelCarrito={eliminarDelCarrito}
            />
          }
        />

        <Route
          path="/login"
          element={
            esAdmin ? (
              <Navigate to="/admin" replace />
            ) : (
              <Login onLogin={iniciarSesion} />
            )
          }
        />

        <Route
          path="/admin"
          element={
            esAdmin ? (
              <Admin />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/admin/productos"
          element={
            esAdmin ? (
              <AdminPanel />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/admin/categorias"
          element={
            esAdmin ? (
              <AdminCategorias />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </>
  );
}

export default App;
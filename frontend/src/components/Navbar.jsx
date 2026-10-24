import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar({ cantidadCarrito, usuario, cerrarSesion }) {
    const navigate = useNavigate();
    const location = useLocation();

    const esActivo = (ruta) => location.pathname === ruta;

    const manejarCierreSesion = () => {
        localStorage.removeItem("usuarioMaue");
        cerrarSesion();
        navigate("/", { replace: true });
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                MAUÉ
            </Link>

            <div className="navbar-links">
                <Link
                    to="/"
                    className={esActivo("/") ? "activo" : ""}
                >
                    Inicio
                </Link>

                <Link
                    to="/productos"
                    className={esActivo("/productos") ? "activo" : ""}
                >
                    Colección
                </Link>

                <a href="/#bienvenida">
                    Nuestra historia
                </a>

                <a href="/#pedidos-especiales">
                    Pedidos especiales
                </a>

                {usuario?.rol === "administrador" && (
                    <Link
                        to="/admin"
                        className={`navbar-admin ${
                            esActivo("/admin") ? "activo" : ""
                        }`}
                    >
                        Administración
                    </Link>
                )}
            </div>

            <div className="navbar-acciones">
                <Link
                    to="/carrito"
                    className="navbar-carrito"
                    aria-label={`Carrito de compras, ${cantidadCarrito} productos`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>

                    {cantidadCarrito > 0 && (
                        <span className="navbar-carrito-cantidad">
                            {cantidadCarrito}
                        </span>
                    )}
                </Link>

                {usuario ? (
                    <button
                        type="button"
                        className="navbar-login"
                        onClick={manejarCierreSesion}
                    >
                        Cerrar sesión
                    </button>
                ) : (
                    <Link
                        to="/login"
                        className="navbar-login"
                    >
                        Iniciar sesión
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
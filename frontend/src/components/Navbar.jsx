import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar({ cantidadCarrito }) {
    const navigate = useNavigate();
    const location = useLocation();

    const usuario = JSON.parse(
        localStorage.getItem("usuarioMaue") || "null"
    );

    const cerrarSesion = () => {
        localStorage.removeItem("usuarioMaue");
        navigate("/login");
    };

    const esActivo = (ruta) => location.pathname === ruta;

    return (
        <header className="navbar-maue">
            <nav className="navbar-contenido">
                {/* LOGOTIPO ESCRITO */}
                <Link
                    to="/"
                    className="navbar-logo"
                    aria-label="Ir al inicio de MAUÉ"
                >
                    MAUÉ
                </Link>

                {/* ENLACES DE NAVEGACIÓN */}
                <div className="navbar-menu">
                    <Link
                        to="/"
                        className={`navbar-enlace ${
                            esActivo("/") ? "activo" : ""
                        }`}
                    >
                        Inicio
                    </Link>

                    <Link
                        to="/productos"
                        className={`navbar-enlace ${
                            esActivo("/productos") ? "activo" : ""
                        }`}
                    >
                        Colección
                    </Link>

                    <Link
                        to="/#bienvenida"
                        className="navbar-enlace"
                        onClick={(evento) => {
                            if (location.pathname === "/") {
                                evento.preventDefault();

                                document
                                    .getElementById("bienvenida")
                                    ?.scrollIntoView({
                                        behavior: "smooth",
                                    });
                            }
                        }}
                    >
                        Nuestra historia
                    </Link>

                    <Link
                        to="/#pedidos-especiales"
                        className="navbar-enlace"
                        onClick={(evento) => {
                            if (location.pathname === "/") {
                                evento.preventDefault();

                                document
                                    .getElementById("pedidos-especiales")
                                    ?.scrollIntoView({
                                        behavior: "smooth",
                                    });
                            }
                        }}
                    >
                        Pedidos especiales
                    </Link>
                </div>

                {/* ACCIONES */}
                <div className="navbar-acciones">
                    {usuario?.rol === "administrador" && (
                        <Link
                            to="/admin"
                            className="navbar-admin"
                            aria-label="Administración"
                            title="Administración"
                        >
                            Admin
                        </Link>
                    )}

                    {/* CARRITO */}
                    <Link
                        to="/carrito"
                        className="navbar-carrito"
                        aria-label={`Abrir carrito. ${
                            cantidadCarrito || 0
                        } productos`}
                        title="Ver carrito"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M3 3h2l2.4 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H6" />
                            <circle cx="10" cy="20" r="1" />
                            <circle cx="18" cy="20" r="1" />
                        </svg>

                        {cantidadCarrito > 0 && (
                            <span className="navbar-contador">
                                {cantidadCarrito}
                            </span>
                        )}
                    </Link>

                    {/* SESIÓN */}
                    {usuario ? (
                        <button
                            type="button"
                            onClick={cerrarSesion}
                            className="navbar-sesion"
                        >
                            Cerrar sesión
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="navbar-sesion"
                        >
                            Iniciar sesión
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Navbar;

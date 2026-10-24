
import { Link, useNavigate } from "react-router-dom";
import "../styles/Admin.css";

function Admin() {
    const navigate = useNavigate();

    const cerrarSesion = () => {
        window.dispatchEvent(new Event("maue-cerrar-sesion"));
        navigate("/", { replace: true });
    };

    return (
        <main className="pagina-admin">
            <header className="admin-barra">
                <Link to="/admin" className="admin-logo">
                    MAUÉ
                </Link>

                <span className="admin-etiqueta">
                    PANEL ADMINISTRATIVO
                </span>

                <nav className="admin-navegacion">
                    <Link
                        to="/admin"
                        className="admin-enlace activo"
                    >
                        Inicio
                    </Link>

                    <Link
                        to="/admin/productos"
                        className="admin-enlace"
                    >
                        Productos
                    </Link>

                    <Link
                        to="/admin/categorias"
                        className="admin-enlace"
                    >
                        Categorías
                    </Link>

                    <Link to="/" className="admin-enlace">
                        Ver tienda
                    </Link>

                    <button
                        type="button"
                        className="admin-cerrar-sesion"
                        onClick={cerrarSesion}
                    >
                        Cerrar sesión
                    </button>
                </nav>
            </header>

            <div className="admin-contenido">
                <section className="admin-bienvenida">
                    <p className="admin-subtitulo">
                        ESPACIO DE ADMINISTRACIÓN
                    </p>

                    <h1>Bienvenida a MAUÉ</h1>

                    <p className="admin-descripcion">
                        Gestiona tu pastelería desde un solo lugar.
                        Administra tus productos y categorías para
                        mantener tu catálogo actualizado.
                    </p>
                </section>

                <section className="admin-banner">
                    <img
                        src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1800&q=85"
                        alt="Torta de chocolate de MAUÉ"
                    />

                    <div className="admin-banner-contenido">
                        <p>TU TIENDA</p>

                        <h2>
                            Todo listo para crear algo dulce.
                        </h2>

                        <span>
                            Accede a las herramientas de administración.
                        </span>

                        <Link
                            to="/admin/productos"
                            className="admin-boton-banner"
                        >
                            Gestionar productos
                        </Link>
                    </div>
                </section>

                <section className="admin-accesos">
                    <div className="admin-accesos-encabezado">
                        <p className="admin-subtitulo">
                            ORGANIZA TU PASTELERÍA
                        </p>

                        <h2>¿Qué deseas gestionar?</h2>
                    </div>

                    <div className="admin-tarjetas">
                        <Link
                            to="/admin/productos"
                            className="admin-tarjeta"
                        >
                            <span className="admin-tarjeta-icono">
                                P
                            </span>

                            <h3>Productos</h3>

                            <p>
                                Crear, editar y eliminar tortas y postres.
                            </p>

                            <span className="admin-tarjeta-enlace">
                                Gestionar productos →
                            </span>
                        </Link>

                        <Link
                            to="/admin/categorias"
                            className="admin-tarjeta"
                        >
                            <span className="admin-tarjeta-icono">
                                C
                            </span>

                            <h3>Categorías</h3>

                            <p>
                                Organizar las opciones de tu catálogo.
                            </p>

                            <span className="admin-tarjeta-enlace">
                                Gestionar categorías →
                            </span>
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Admin;


import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { obtenerProductos } from "../services/productoService";
import "../styles/Inicio.css";

// Imágenes locales de los tres productos destacados
import imagenChocolateCupcake from "../assets/cupcakes/chocolate.jpg";
import imagenChocolate from "../assets/tortas/chocolate.jpg";
import pieLimon from "../assets/postres/pielimon.jpg";

function obtenerImagenLocal(producto) {
    const nombre = (
        producto?.nombre ||
        producto?.nombreProducto ||
        producto?.nombre_producto ||
        ""
    )
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

    if (nombre.includes("cupcake") && nombre.includes("chocolate")) {
        return imagenChocolateCupcake;
    }

    if (nombre.includes("torta") && nombre.includes("chocolate")) {
        return imagenChocolate;
    }

    if (
        nombre.includes("pie de limon") ||
        nombre.includes("pie limon")
    ) {
        return pieLimon;
    }

    return "";
}

function Inicio() {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const respuesta = await obtenerProductos();

                const lista = Array.isArray(respuesta)
                    ? respuesta
                    : Array.isArray(respuesta?.productos)
                      ? respuesta.productos
                      : [];

                setProductos(lista.slice(0, 3));
            } catch (error) {
                console.error("Error al cargar los productos:", error);
                setProductos([]);
            } finally {
                setCargando(false);
            }
        };

        cargarProductos();
    }, []);

    const irASeccion = (id) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
        });
    };

    const formatoPrecio = (precio) => {
        if (precio === null || precio === undefined || precio === "") {
            return "Consultar precio";
        }

        const valor = Number(precio);

        if (Number.isNaN(valor)) {
            return precio;
        }

        return valor.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
        });
    };

    return (
        <main className="inicio">
            {/* PORTADA PRINCIPAL */}
            <section className="hero" id="inicio">
                <div className="hero-fondo" />

                <div className="hero-contenido">
                    <h1>
                        Momentos dulces,
                        <br />
                        <span>bellamente creados.</span>
                    </h1>

                    <p className="hero-descripcion">
                        Pequeñas obras de arte para celebrar las historias
                        que más importan y convertir cada ocasión en un
                        recuerdo especial.
                    </p>

                    <div className="hero-botones">
                        <Link to="/productos" className="boton-principal">
                            Descubrir la colección
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>

                <button
                    type="button"
                    className="hero-desplazamiento"
                    onClick={() => irASeccion("bienvenida")}
                    aria-label="Desplazarse hacia abajo"
                >
                    <span />
                </button>
            </section>

            {/* BIENVENIDA */}
            <section className="bienvenida" id="bienvenida">
                <span className="seccion-etiqueta">
                    BIENVENIDOS A MAUÉ
                </span>

                <h2>
                    Donde cada detalle
                    <br />
                    cuenta una <span>historia.</span>
                </h2>

                <p className="bienvenida-descripcion">
                    Pastelería fina para celebrar lo extraordinario de cada
                    día. Descubre sabores delicados, presentaciones cuidadas
                    y pequeños detalles hechos para compartir.
                </p>
            </section>

            {/* PRODUCTOS DESTACADOS */}
            <section className="productos-destacados" id="coleccion">
                <div className="productos-encabezado">
                    <div>
                        <span className="seccion-etiqueta">
                            NUESTROS FAVORITOS
                        </span>

                        <h2>
                            Una selección para <span>enamorarse.</span>
                        </h2>
                    </div>

                    <Link to="/productos" className="enlace-elegante">
                        Ver colección completa
                        <span aria-hidden="true"> →</span>
                    </Link>
                </div>

                {cargando ? (
                    <p className="productos-mensaje">
                        Estamos preparando nuestra colección para ti...
                    </p>
                ) : productos.length > 0 ? (
                    <div className="productos-grid">
                        {productos.map((producto, indice) => {
                            const imagen = obtenerImagenLocal(producto);

                            return (
                                <article
                                    className="producto-tarjeta"
                                    key={
                                        producto.id ??
                                        producto._id ??
                                        producto.nombre ??
                                        indice
                                    }
                                >
                                    <Link
                                        to="/productos"
                                        className="producto-imagen"
                                        aria-label={`Ver ${
                                            producto.nombre || "producto"
                                        }`}
                                    >
                                        {imagen && (
                                            <img
                                                src={imagen}
                                                alt={
                                                    producto.nombre ||
                                                    "Producto de MAUÉ"
                                                }
                                                loading="lazy"
                                            />
                                        )}
                                    </Link>

                                    <div className="producto-informacion">
                                        <span className="producto-categoria">
                                            {producto.categoria?.nombre ||
                                                producto.categoria ||
                                                "Pastelería artesanal"}
                                        </span>

                                        <h3>{producto.nombre}</h3>

                                        <div className="producto-pie">
                                            <span className="producto-precio">
                                                {formatoPrecio(
                                                    producto.precio
                                                )}
                                            </span>

                                            <Link
                                                to="/productos"
                                                className="producto-agregar"
                                                aria-label={`Ver catálogo para elegir ${
                                                    producto.nombre ||
                                                    "un producto"
                                                }`}
                                                title="Ver producto"
                                            >
                                                +
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="productos-vacios">
                        <p>
                            No hay productos disponibles para mostrar en este
                            momento.
                        </p>

                        <Link
                            to="/productos"
                            className="boton-principal boton-oscuro"
                        >
                            Explorar productos
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                )}

                <div className="productos-boton-movil">
                    <Link
                        to="/productos"
                        className="boton-principal boton-oscuro"
                    >
                        Ver toda la colección
                        <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </section>

            {/* PEDIDOS ESPECIALES */}
            <section className="banner-maue" id="pedidos-especiales">
                <div className="banner-maue-fondo" />

                <div className="banner-maue-contenido">
                    <span className="seccion-etiqueta">
                        CREADO PARA TI
                    </span>

                    <h2>
                        ¿Tienes una ocasión
                        <br />
                        <span>muy especial?</span>
                    </h2>

                    <p>
                        Encuentra el detalle dulce perfecto para celebrar,
                        sorprender y compartir tus mejores momentos.
                    </p>

                    <Link to="/productos" className="boton-principal">
                        Descubrir productos
                        <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </section>

            {/* PIE DE PÁGINA */}
            <footer className="footer-maue">
                <div className="footer-contenido">
                    <div className="footer-marca">
                        <Link to="/" className="footer-logo">
                            MAUÉ
                        </Link>

                        <span className="footer-subtitulo">
                            PASTELERÍA DE AUTOR
                        </span>

                        <p>
                            Pastelería fina para celebrar lo extraordinario
                            de cada día.
                        </p>
                    </div>

                    <div className="footer-enlaces">
                        <Link to="/">Inicio</Link>
                        <Link to="/productos">Colección</Link>
                        <Link to="/#bienvenida">Nuestra historia</Link>
                        <Link to="/#pedidos-especiales">
                            Pedidos especiales
                        </Link>
                    </div>
                </div>

                <div className="footer-inferior">
                    <span>
                        © {new Date().getFullYear()} MAUÉ. Hecho con delicadeza.
                    </span>

                    <Link to="/login">Acceso administrativo</Link>
                </div>
            </footer>
        </main>
    );
}

export default Inicio;

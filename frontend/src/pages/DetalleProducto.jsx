
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { obtenerProductos } from "../services/productoService";
import "../styles/DetalleProducto.css";

function DetalleProducto({ agregarAlCarrito }) {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [producto, setProducto] = useState(
        location.state?.producto || null
    );

    const [cargando, setCargando] = useState(
        !location.state?.producto
    );

    const [error, setError] = useState("");

    useEffect(() => {
        const cargarProducto = async () => {
            try {
                const respuesta = await obtenerProductos();

                const lista = Array.isArray(respuesta)
                    ? respuesta
                    : respuesta?.productos || [];

                const encontrado = lista.find(
                    (item) => String(item.id) === String(id)
                );

                if (encontrado) {
                    setProducto((actual) => ({
                        ...encontrado,
                        ...actual,
                    }));
                } else if (!location.state?.producto) {
                    setError("No encontramos este producto.");
                }
            } catch (err) {
                console.error(
                    "Error al consultar el producto:",
                    err
                );

                if (!location.state?.producto) {
                    setError(
                        "No pudimos cargar el producto. Intenta nuevamente."
                    );
                }
            } finally {
                setCargando(false);
            }
        };

        cargarProducto();
    }, [id]);

    const formatoPrecio = (precio) =>
        `$${Number(precio || 0).toLocaleString("es-CO")}`;

    const nombreCategoria =
        typeof producto?.categoria === "object"
            ? producto.categoria?.nombre
            : producto?.categoria || producto?.nombreCategoria;

    if (cargando) {
        return (
            <main className="pagina-detalle-producto">
                <p className="detalle-mensaje">
                    Cargando producto...
                </p>
            </main>
        );
    }

    if (error || !producto) {
        return (
            <main className="pagina-detalle-producto">
                <section className="detalle-error">
                    <h1>Producto no encontrado</h1>

                    <p>
                        {error ||
                            "Este producto no está disponible."}
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/productos")}
                    >
                        Volver a los productos
                    </button>
                </section>
            </main>
        );
    }

    const disponible = Boolean(producto.disponibilidad);

    return (
        <main className="pagina-detalle-producto">
            <button
                type="button"
                className="detalle-volver"
                onClick={() => navigate("/productos")}
            >
                Volver a los productos
            </button>

            <section className="detalle-contenido">
                <div className="detalle-fotografia">
                    {producto.imagen ? (
                        <img
                            src={producto.imagen}
                            alt={producto.nombre}
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <div className="detalle-placeholder">
                            <span>MAUÉ</span>
                            <small>Una creación especial</small>
                        </div>
                    )}
                </div>

                <div className="detalle-informacion">
                    <p className="detalle-etiqueta">
                        {nombreCategoria || "Nuestra colección"}
                    </p>

                    <h1>{producto.nombre}</h1>

                    <div className="detalle-precio-disponibilidad">
                        <p className="detalle-precio">
                            {formatoPrecio(producto.precio)}
                        </p>

                        <p
                            className={
                                disponible
                                    ? "detalle-disponibilidad disponible"
                                    : "detalle-disponibilidad agotado"
                            }
                        >
                            <span />
                            {disponible
                                ? "Disponible"
                                : "No disponible"}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="detalle-boton-carrito"
                        disabled={!disponible}
                        onClick={() => agregarAlCarrito(producto)}
                    >
                        {disponible
                            ? "Agregar al carrito"
                            : "Producto no disponible"}
                    </button>
                </div>
            </section>
        </main>
    );
}

export default DetalleProducto;

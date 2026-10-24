
import { useNavigate } from "react-router-dom";

function ProductoCard({ producto, agregarAlCarrito }) {
    const navigate = useNavigate();

    const formatoPrecio = (precio) =>
        `$${Number(precio || 0).toLocaleString("es-CO")}`;

    const rutaImagen = producto.imagen || null;

    const abrirDetalle = () => {
        navigate(`/productos/${producto.id}`, {
            state: { producto },
        });
    };

    return (
        <article
            className="tarjeta-producto"
            onClick={abrirDetalle}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    abrirDetalle();
                }
            }}
            role="link"
            tabIndex={0}
            aria-label={`Ver detalles de ${producto.nombre}`}
            style={{ cursor: "pointer" }}
        >
            <div className="producto-fotografia">
                {rutaImagen ? (
                    <img
                        src={rutaImagen}
                        alt={producto.nombre || "Producto de MAUÉ"}
                        onError={(e) => {
                            e.currentTarget.style.display = "none";

                            const placeholder =
                                e.currentTarget.nextElementSibling;

                            if (placeholder) {
                                placeholder.style.display = "flex";
                            }
                        }}
                    />
                ) : null}

                <div
                    className="producto-imagen-placeholder"
                    style={{
                        display: rutaImagen ? "none" : "flex",
                    }}
                >
                    <span>MAUÉ</span>
                    <small>Una creación especial</small>
                </div>

                <span className="producto-etiqueta">
                    {typeof producto.categoria === "object"
                        ? producto.categoria?.nombre || "Especial"
                        : producto.categoria ||
                          producto.nombreCategoria ||
                          "Especial"}
                </span>
            </div>

            <div className="producto-informacion">
                <div className="producto-textos">
                    <h2>{producto.nombre}</h2>

                    <p className="producto-precio">
                        {formatoPrecio(producto.precio)}
                    </p>
                </div>

                <button
                    type="button"
                    className="boton-agregar-producto"
                    disabled={!producto.disponibilidad}
                    onClick={(e) => {
                        e.stopPropagation();
                        agregarAlCarrito(producto);
                    }}
                >
                    {producto.disponibilidad
                        ? "Agregar +"
                        : "No disponible"}
                </button>
            </div>
        </article>
    );
}

export default ProductoCard;

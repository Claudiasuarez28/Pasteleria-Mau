import { Link } from "react-router-dom";
import "../styles/Carrito.css";

function Carrito({
    carrito,
    cambiarCantidad,
    eliminarDelCarrito,
}) {
    const total = carrito.reduce(
        (suma, producto) =>
            suma +
            Number(producto.precio || 0) *
                Number(producto.cantidad || 0),
        0
    );

    const formatoPrecio = (precio) =>
        `COP $${Number(precio || 0).toLocaleString("es-CO")}`;

    const obtenerImagen = (producto) => {
        const imagen = producto?.imagen;

        if (!imagen || typeof imagen !== "string") {
            return "";
        }

        if (
            imagen.startsWith("data:") ||
            imagen.startsWith("blob:") ||
            imagen.startsWith("http://") ||
            imagen.startsWith("https://") ||
            imagen.startsWith("/")
        ) {
            return imagen;
        }

        return `https://maue-backend.onrender.com/images/${imagen}`;
    };

    return (
        <section className="carrito">
            <header className="carrito-encabezado">
                <span>TU SELECCIÓN</span>
                <h1>Carrito de compras</h1>
            </header>

            {carrito.length === 0 ? (
                <div className="carrito-vacio">
                    <div className="carrito-vacio-icono">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M5 8h14l1 13H4L5 8Z" />
                            <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                        </svg>
                    </div>

                    <h2>Tu carrito espera algo dulce</h2>

                    <p>
                        Explora nuestra colección y elige tu próxima
                        creación favorita.
                    </p>

                    <Link
                        to="/productos"
                        className="boton-ver-productos"
                    >
                        VER PRODUCTOS
                    </Link>
                </div>
            ) : (
                <div className="carrito-contenido">
                    <div className="carrito-lista">
                        {carrito.map((producto) => {
                            const imagen = obtenerImagen(producto);
                            const idProducto = producto.id ?? producto._id;

                            return (
                                <article
                                    className="item-carrito"
                                    key={idProducto}
                                >
                                    <div className="item-carrito-imagen">
                                        {imagen && (
                                            <img
                                                src={imagen}
                                                alt={
                                                    producto.nombre ||
                                                    "Producto de MAUÉ"
                                                }
                                                onError={(evento) => {
                                                    evento.currentTarget.style.display =
                                                        "none";

                                                    const respaldo =
                                                        evento.currentTarget
                                                            .nextElementSibling;

                                                    if (respaldo) {
                                                        respaldo.style.display =
                                                            "flex";
                                                    }
                                                }}
                                            />
                                        )}

                                        <div
                                            className="imagen-sin-producto"
                                            style={{
                                                display: imagen
                                                    ? "none"
                                                    : "flex",
                                            }}
                                        >
                                            MAUÉ
                                        </div>
                                    </div>

                                    <div className="item-carrito-detalles">
                                        <span className="item-carrito-categoria">
                                            {typeof producto.categoria ===
                                            "object"
                                                ? producto.categoria?.nombre ||
                                                  "Especiales"
                                                : producto.categoria ||
                                                  producto.nombreCategoria ||
                                                  "Especiales"}
                                        </span>

                                        <h2>{producto.nombre}</h2>

                                        {producto.relleno1 && (
                                            <p>
                                                Relleno 1:{" "}
                                                {producto.relleno1}
                                            </p>
                                        )}

                                        {producto.relleno2 && (
                                            <p>
                                                Relleno 2:{" "}
                                                {producto.relleno2}
                                            </p>
                                        )}

                                        <p>
                                            Precio individual:{" "}
                                            {formatoPrecio(producto.precio)}
                                        </p>

                                        <div className="item-carrito-acciones">
                                            <div
                                                className="cantidad"
                                                aria-label="Cambiar cantidad"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        cambiarCantidad(
                                                            idProducto,
                                                            Number(
                                                                producto.cantidad
                                                            ) - 1
                                                        )
                                                    }
                                                    disabled={
                                                        Number(
                                                            producto.cantidad
                                                        ) <= 1
                                                    }
                                                    aria-label="Disminuir cantidad"
                                                >
                                                    −
                                                </button>

                                                <span>
                                                    {producto.cantidad}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        cambiarCantidad(
                                                            idProducto,
                                                            Number(
                                                                producto.cantidad
                                                            ) + 1
                                                        )
                                                    }
                                                    aria-label="Aumentar cantidad"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                type="button"
                                                className="boton-eliminar"
                                                onClick={() =>
                                                    eliminarDelCarrito(
                                                        idProducto
                                                    )
                                                }
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>

                                    <strong className="item-carrito-subtotal">
                                        {formatoPrecio(
                                            Number(producto.precio || 0) *
                                                Number(producto.cantidad || 0)
                                        )}
                                    </strong>
                                </article>
                            );
                        })}

                        <Link
                            to="/productos"
                            className="seguir-comprando"
                        >
                            ← Seguir comprando
                        </Link>
                    </div>

                    <aside className="resumen-pedido">
                        <h2>RESUMEN DEL PEDIDO</h2>

                        <div className="resumen-linea">
                            <span>Subtotal</span>
                            <strong>{formatoPrecio(total)}</strong>
                        </div>

                        <p className="resumen-entrega">
                            Los detalles de entrega se coordinarán
                            directamente por WhatsApp.
                        </p>

                        <div className="resumen-total">
                            <span>Total general</span>
                            <strong>{formatoPrecio(total)}</strong>
                        </div>

                        <button
                            type="button"
                            className="boton-continuar-pago"
                            onClick={() => {
                                window.alert(
                                    "El proceso de pago debe conectarse con el medio de pago de MAUÉ."
                                );
                            }}
                        >
                            <span>Continuar al pago</span>
                            <span className="flecha-pago" aria-hidden="true">
                                →
                            </span>
                        </button>

                        <p className="resumen-nota">
                            Podrás revisar el medio de pago antes de enviar.
                        </p>
                    </aside>
                </div>
            )}
        </section>
    );
}

export default Carrito;

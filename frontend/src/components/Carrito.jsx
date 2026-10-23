
import { Link } from "react-router-dom";
import "../styles/Carrito.css";

function Carrito({
    carrito,
    cambiarCantidad,
    eliminarDelCarrito
}) {
    const total = carrito.reduce(
        (suma, producto) =>
            suma + producto.precio * producto.cantidad,
        0
    );

    const formatoPrecio = (precio) =>
        `COP $${precio.toLocaleString("es-CO")}`;

    return (
        <section className="carrito">
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
                        {carrito.map((producto) => (
                            <article
                                className="item-carrito"
                                key={producto.id}
                            >
                                <div className="item-carrito-imagen">
                                    {producto.imagen ? (
                                        <img
                                            src={
                                                producto.imagen.startsWith("http")
                                                    ? producto.imagen
                                                : `https://maue-backend.onrender.com/images/${producto.imagen}`
                                            }
                                            alt={producto.nombre}
                                        />
                                    ) : (
                                        <div className="imagen-sin-producto">
                                            MAUÉ
                                        </div>
                                    )}
                                </div>

                                <div className="item-carrito-detalles">
                                    <span className="item-carrito-categoria">
                                        Especiales
                                    </span>

                                    <h2>{producto.nombre}</h2>

                                    {producto.relleno1 && (
                                        <p>
                                            Relleno 1: {producto.relleno1}
                                        </p>
                                    )}

                                    {producto.relleno2 && (
                                        <p>
                                            Relleno 2: {producto.relleno2}
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
                                                        producto.id,
                                                        producto.cantidad - 1
                                                    )
                                                }
                                                disabled={producto.cantidad <= 1}
                                                aria-label="Disminuir cantidad"
                                            >
                                                −
                                            </button>

                                            <span>{producto.cantidad}</span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    cambiarCantidad(
                                                        producto.id,
                                                        producto.cantidad + 1
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
                                                eliminarDelCarrito(producto.id)
                                            }
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>

                                <strong className="item-carrito-subtotal">
                                    {formatoPrecio(
                                        producto.precio * producto.cantidad
                                    )}
                                </strong>
                            </article>
                        ))}

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
                            Continuar al pago
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

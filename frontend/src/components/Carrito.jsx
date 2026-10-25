
import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Carrito.css";

const MEDIOS_PAGO = [
    {
        id: "nequi",
        nombre: "Nequi",
        descripcion: "Pago simulado con billetera digital",
    },
    {
        id: "transferencia",
        nombre: "Transferencia bancaria",
        descripcion: "Transferencia simulada",
    },
    {
        id: "efectivo",
        nombre: "Efectivo",
        descripcion: "Pago en efectivo",
    },
    {
        id: "tarjeta",
        nombre: "Tarjeta débito o crédito",
        descripcion: "Pago con tarjeta simulado",
    },
];

function Carrito({ carrito, cambiarCantidad, eliminarDelCarrito }) {
    const [paso, setPaso] = useState("carrito");
    const [medioPago, setMedioPago] = useState("");
    const [pedidoConfirmado, setPedidoConfirmado] = useState(null);
    const [error, setError] = useState("");

    const total = carrito.reduce(
        (suma, producto) =>
            suma +
            Number(producto.precio || 0) *
                Number(producto.cantidad || 0),
        0
    );

    const formatoPrecio = (precio) =>
        `COP $${Number(precio || 0).toLocaleString("es-CO")}`;

    const obtenerId = (producto) => producto.id ?? producto._id;

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

    const confirmarPedido = () => {
        if (!medioPago) {
            setError("Selecciona un medio de pago para continuar.");
            return;
        }

        if (carrito.length === 0) {
            setError("Tu carrito está vacío.");
            setPaso("carrito");
            return;
        }

        const numeroPedido = `MAU-${Date.now()
            .toString()
            .slice(-8)}`;

        setPedidoConfirmado({
            numero: numeroPedido,
            medio: MEDIOS_PAGO.find(
                (medio) => medio.id === medioPago
            )?.nombre,
            total,
            productos: carrito.map((producto) => ({
                nombre: producto.nombre,
                cantidad: Number(producto.cantidad || 0),
                precio: Number(producto.precio || 0),
            })),
        });

        carrito.forEach((producto) => {
            eliminarDelCarrito(obtenerId(producto));
        });

        setError("");
        setPaso("confirmado");
    };

    if (paso === "confirmado" && pedidoConfirmado) {
        return (
            <section className="carrito">
                <div className="pago-confirmacion">
                    <div className="pago-confirmacion-marca">MAUÉ</div>

                    <div className="pago-confirmacion-icono" aria-hidden="true">
                        ✓
                    </div>

                    <p className="pago-confirmacion-etiqueta">
                        PEDIDO CONFIRMADO
                    </p>

                    <h2>¡Pago realizado exitosamente!</h2>

                    <p className="pago-confirmacion-descripcion">
                        Tu pedido se ha confirmado en esta demostración.
                        Gracias por elegir Pastelería MAUÉ.
                    </p>

                    <div className="pago-confirmacion-resumen">
                        <div>
                            <span>Número de pedido</span>
                            <strong>{pedidoConfirmado.numero}</strong>
                        </div>

                        <div>
                            <span>Medio seleccionado</span>
                            <strong>{pedidoConfirmado.medio}</strong>
                        </div>

                        <div>
                            <span>Total del pedido</span>
                            <strong>
                                {formatoPrecio(pedidoConfirmado.total)}
                            </strong>
                        </div>
                    </div>

                    <div className="pago-confirmacion-productos">
                        <h3>RESUMEN DE TU COMPRA</h3>

                        {pedidoConfirmado.productos.map((producto, indice) => (
                            <div
                                className="pago-confirmacion-producto"
                                key={`${producto.nombre}-${indice}`}
                            >
                                <span>
                                    {producto.nombre} × {producto.cantidad}
                                </span>

                                <strong>
                                    {formatoPrecio(
                                        producto.precio * producto.cantidad
                                    )}
                                </strong>
                            </div>
                        ))}
                    </div>

                    <p className="pago-simulacion-aviso">
                        Confirmación simulada con fines académicos.
                        No se realizó ningún cobro ni transacción bancaria.
                    </p>

                    <Link
                        to="/productos"
                        className="boton-continuar-pago pago-volver"
                        onClick={() => {
                            setPaso("carrito");
                            setMedioPago("");
                            setPedidoConfirmado(null);
                        }}
                    >
                        Volver a la colección
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="carrito">
            <header className="carrito-encabezado">
                <span>
                    {paso === "pago" ? "ÚLTIMO PASO" : "TU SELECCIÓN"}
                </span>

                <h1>
                    {paso === "pago"
                        ? "Medio de pago"
                        : "Carrito de compras"}
                </h1>
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
                        {paso === "carrito" ? (
                            <>
                                {carrito.map((producto) => {
                                    const imagen = obtenerImagen(producto);
                                    const idProducto = obtenerId(producto);

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
                                                        ? producto.categoria
                                                              ?.nombre ||
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
                                                    {formatoPrecio(
                                                        producto.precio
                                                    )}
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
                                                        Number(
                                                            producto.cantidad || 0
                                                        )
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
                            </>
                        ) : (
                            <div className="seleccion-pago">
                                <p className="seleccion-pago-descripcion">
                                    Elige cómo deseas pagar tu pedido.
                                </p>

                                <div className="opciones-pago">
                                    {MEDIOS_PAGO.map((medio) => (
                                        <label
                                            className={`opcion-pago ${
                                                medioPago === medio.id
                                                    ? "opcion-pago-activa"
                                                    : ""
                                            }`}
                                            key={medio.id}
                                        >
                                            <input
                                                type="radio"
                                                name="medioPago"
                                                value={medio.id}
                                                checked={
                                                    medioPago === medio.id
                                                }
                                                onChange={() => {
                                                    setMedioPago(medio.id);
                                                    setError("");
                                                }}
                                            />

                                            <span className="opcion-pago-textos">
                                                <strong>{medio.nombre}</strong>
                                                <small>
                                                    {medio.descripcion}
                                                </small>
                                            </span>

                                            <span
                                                className="opcion-pago-selector"
                                                aria-hidden="true"
                                            />
                                        </label>
                                    ))}
                                </div>

                                <p className="pago-simulacion-aviso">
                                    Todos los medios de pago son demostrativos.
                                    No se solicitarán credenciales ni se
                                    realizará ningún cobro.
                                </p>

                                {error && (
                                    <p
                                        className="pago-error"
                                        role="alert"
                                    >
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="button"
                                    className="seguir-comprando boton-volver-carrito"
                                    onClick={() => {
                                        setPaso("carrito");
                                        setError("");
                                    }}
                                >
                                    ← Volver al carrito
                                </button>
                            </div>
                        )}
                    </div>

                    <aside className="resumen-pedido">
                        <h2>RESUMEN DEL PEDIDO</h2>

                        <div className="resumen-linea">
                            <span>Productos</span>
                            <strong>
                                {carrito.reduce(
                                    (suma, producto) =>
                                        suma +
                                        Number(producto.cantidad || 0),
                                    0
                                )}
                            </strong>
                        </div>

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

                        {paso === "carrito" ? (
                            <button
                                type="button"
                                className="boton-continuar-pago"
                                onClick={() => {
                                    setPaso("pago");
                                    setError("");
                                }}
                            >
                                <span>Continuar al pago</span>
                                <span
                                    className="flecha-pago"
                                    aria-hidden="true"
                                >
                                    →
                                </span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="boton-continuar-pago"
                                onClick={confirmarPedido}
                            >
                                <span>Confirmar pedido</span>
                                <span
                                    className="flecha-pago"
                                    aria-hidden="true"
                                >
                                    →
                                </span>
                            </button>
                        )}

                        {error && paso === "pago" && (
                            <p className="pago-error" role="alert">
                                {error}
                            </p>
                        )}

                        <p className="resumen-nota">
                            {paso === "pago"
                                ? "Pedido de demostración. Sin cobros reales."
                                : "Podrás elegir tu medio de pago en el siguiente paso."}
                        </p>
                    </aside>
                </div>
            )}
        </section>
    );
}

export default Carrito;
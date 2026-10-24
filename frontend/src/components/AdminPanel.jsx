
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
} from "../services/productoService";

function AdminPanel() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);

    const [nombreProducto, setNombreProducto] = useState("");
    const [precioProducto, setPrecioProducto] = useState("");
    const [categoriaProducto, setCategoriaProducto] = useState("");
    const [disponibilidad, setDisponibilidad] = useState(true);
    const [productoEditando, setProductoEditando] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            setCargando(true);
            setError("");

            const data = await obtenerProductos();
            setProductos(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error al obtener productos:", err);
            setError("No fue posible cargar los productos. Intenta nuevamente.");
        } finally {
            setCargando(false);
        }
    };

    const guardarProducto = async (e) => {
        e.preventDefault();
        setError("");

        if (!nombreProducto.trim()) {
            setError("Escribe el nombre del producto.");
            return;
        }

        if (precioProducto === "" || Number(precioProducto) < 0) {
            setError("Ingresa un precio válido.");
            return;
        }

        if (!categoriaProducto.trim()) {
            setError("Escribe la categoría del producto.");
            return;
        }

        const producto = {
            nombre: nombreProducto.trim(),
            precio: Number(precioProducto),
            categoria: categoriaProducto.trim(),
            disponibilidad,
        };

        try {
            if (productoEditando !== null) {
                await actualizarProducto(productoEditando, producto);
            } else {
                await crearProducto(producto);
            }

            cancelarEdicion();
            await cargarProductos();
        } catch (err) {
            console.error("Error al guardar producto:", err);
            setError("No fue posible guardar el producto. Verifica los datos e inténtalo nuevamente.");
        }
    };

    const editarProducto = (producto) => {
        setProductoEditando(producto.id);
        setNombreProducto(producto.nombre ?? "");
        setPrecioProducto(String(producto.precio ?? ""));
        setCategoriaProducto(
            typeof producto.categoria === "string"
                ? producto.categoria
                : producto.categoria?.nombre ?? ""
        );
        setDisponibilidad(producto.disponibilidad ?? true);

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const cancelarEdicion = () => {
        setProductoEditando(null);
        setNombreProducto("");
        setPrecioProducto("");
        setCategoriaProducto("");
        setDisponibilidad(true);
    };

    const borrarProducto = async (id) => {
        const confirmar = window.confirm(
            "¿Estás segura de que deseas eliminar este producto?"
        );

        if (!confirmar) return;

        setError("");

        try {
            await eliminarProducto(id);
            await cargarProductos();
        } catch (err) {
            console.error("Error al eliminar producto:", err);
            setError("No fue posible eliminar el producto.");
        }
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
                    <Link to="/admin" className="admin-enlace">
                        Inicio
                    </Link>
                    <Link
                        to="/admin/productos"
                        className="admin-enlace activo"
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
                </nav>
            </header>

            <div className="admin-contenido">
                <section className="admin-bienvenida">
                    <Link to="/admin" className="admin-volver">
                        ← Volver al panel principal
                    </Link>

                    <p className="admin-subtitulo">
                        GESTIÓN DEL CATÁLOGO
                    </p>

                    <h1>Nuestros productos</h1>

                    <p className="admin-descripcion">
                        Administra las tortas y los postres de MAUÉ.
                        Crea nuevos productos, actualiza sus precios
                        y mantén tu catálogo al día.
                    </p>
                </section>

                <section className="admin-banner admin-banner-productos">
                    <img
                        src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1800&q=85"
                        alt="Torta de chocolate"
                    />

                    <div className="admin-banner-contenido">
                        <p>CATÁLOGO MAUÉ</p>
                        <h2>Cada detalle hace algo dulce.</h2>
                        <span>
                            Gestiona los productos que tus clientes
                            pueden encontrar en la tienda.
                        </span>
                    </div>
                </section>

                <section className="admin-panel admin-panel-productos">
                    <div className="admin-productos-encabezado">
                        <div>
                            <p className="admin-subtitulo">
                                TU CATÁLOGO
                            </p>
                            <h2>Gestión de productos</h2>
                            <p>
                                Crea, edita y administra los productos
                                de tu pastelería.
                            </p>
                        </div>

                        <span className="admin-conteo">
                            {productos.length} productos
                        </span>
                    </div>

                    {error && (
                        <p className="admin-mensaje-error" role="alert">
                            {error}
                        </p>
                    )}

                    <form
                        className="admin-formulario-producto"
                        onSubmit={guardarProducto}
                    >
                        <h3>
                            {productoEditando !== null
                                ? "Editar producto"
                                : "Agregar un producto"}
                        </h3>

                        <label>
                            Nombre del producto
                            <input
                                type="text"
                                placeholder="Ej. Torta de chocolate"
                                value={nombreProducto}
                                onChange={(e) =>
                                    setNombreProducto(e.target.value)
                                }
                                required
                            />
                        </label>

                        <label>
                            Precio
                            <input
                                type="number"
                                min="0"
                                step="any"
                                placeholder="Ej. 45000"
                                value={precioProducto}
                                onChange={(e) =>
                                    setPrecioProducto(e.target.value)
                                }
                                required
                            />
                        </label>

                        <label>
                            Categoría
                            <input
                                type="text"
                                placeholder="Ej. Tortas"
                                value={categoriaProducto}
                                onChange={(e) =>
                                    setCategoriaProducto(e.target.value)
                                }
                                required
                            />
                        </label>

                        <label className="disponibilidad">
                            <input
                                type="checkbox"
                                checked={disponibilidad}
                                onChange={(e) =>
                                    setDisponibilidad(e.target.checked)
                                }
                            />
                            Disponible para la venta
                        </label>

                        <div className="admin-formulario-acciones">
                            <button type="submit">
                                {productoEditando !== null
                                    ? "Guardar cambios"
                                    : "Crear producto"}
                            </button>

                            {productoEditando !== null && (
                                <button
                                    type="button"
                                    className="admin-boton-cancelar"
                                    onClick={cancelarEdicion}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="admin-listado-encabezado">
                        <h3>Productos registrados</h3>
                        <button
                            type="button"
                            className="admin-boton-recargar"
                            onClick={cargarProductos}
                        >
                            Actualizar lista
                        </button>
                    </div>

                    {cargando ? (
                        <p className="admin-estado-lista">
                            Cargando productos...
                        </p>
                    ) : productos.length === 0 ? (
                        <p className="admin-estado-lista">
                            Todavía no hay productos registrados.
                        </p>
                    ) : (
                        <div className="lista-productos-admin">
                            {productos.map((producto) => (
                                <article
                                    className="producto-admin"
                                    key={producto.id}
                                >
                                    <div>
                                        <strong>{producto.nombre}</strong>

                                        <p>
                                            $
                                            {Number(
                                                producto.precio ?? 0
                                            ).toLocaleString("es-CO")}
                                        </p>

                                        <p>
                                            Categoría:{" "}
                                            {typeof producto.categoria ===
                                            "string"
                                                ? producto.categoria
                                                : producto.categoria?.nombre ??
                                                  "Sin categoría"}
                                        </p>

                                        <p
                                            className={
                                                producto.disponibilidad
                                                    ? "estado-disponible"
                                                    : "estado-no-disponible"
                                            }
                                        >
                                            {producto.disponibilidad
                                                ? "Disponible"
                                                : "No disponible"}
                                        </p>
                                    </div>

                                    <div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                editarProducto(producto)
                                            }
                                        >
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                borrarProducto(producto.id)
                                            }
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

export default AdminPanel;

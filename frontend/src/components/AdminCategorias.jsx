
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    obtenerCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
} from "../services/categoriaService";

function AdminCategorias() {
    const [categorias, setCategorias] = useState([]);
    const [nombreCategoria, setNombreCategoria] = useState("");
    const [descripcionCategoria, setDescripcionCategoria] = useState("");
    const [categoriaEditando, setCategoriaEditando] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        cargarCategorias();
    }, []);

    const cargarCategorias = async () => {
        try {
            setCargando(true);
            setError("");

            const data = await obtenerCategorias();
            setCategorias(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error al obtener categorías:", err);
            setError("No fue posible cargar las categorías. Intenta nuevamente.");
        } finally {
            setCargando(false);
        }
    };

    const guardarCategoria = async (e) => {
        e.preventDefault();
        setError("");

        if (!nombreCategoria.trim()) {
            setError("Escribe el nombre de la categoría.");
            return;
        }

        const categoria = {
            nombre: nombreCategoria.trim(),
            descripcion: descripcionCategoria.trim(),
        };

        try {
            if (categoriaEditando !== null) {
                await actualizarCategoria(categoriaEditando, categoria);
            } else {
                await crearCategoria(categoria);
            }

            cancelarEdicion();
            await cargarCategorias();
        } catch (err) {
            console.error("Error al guardar categoría:", err);
            setError("No fue posible guardar la categoría. Verifica los datos e inténtalo nuevamente.");
        }
    };

    const editarCategoria = (categoria) => {
        setCategoriaEditando(categoria.id);
        setNombreCategoria(categoria.nombre ?? "");
        setDescripcionCategoria(categoria.descripcion ?? "");

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const cancelarEdicion = () => {
        setCategoriaEditando(null);
        setNombreCategoria("");
        setDescripcionCategoria("");
    };

    const borrarCategoria = async (id) => {
        const confirmar = window.confirm(
            "¿Estás segura de que deseas eliminar esta categoría?"
        );

        if (!confirmar) return;

        setError("");

        try {
            await eliminarCategoria(id);
            await cargarCategorias();
        } catch (err) {
            console.error("Error al eliminar categoría:", err);
            setError(
                "No fue posible eliminar la categoría. Comprueba si hay productos asociados."
            );
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
                        className="admin-enlace"
                    >
                        Productos
                    </Link>

                    <Link
                        to="/admin/categorias"
                        className="admin-enlace activo"
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
                        ORGANIZACIÓN DEL CATÁLOGO
                    </p>

                    <h1>Nuestras categorías</h1>

                    <p className="admin-descripcion">
                        Organiza las opciones de tu pastelería y mantén
                        agrupados los productos para que tu catálogo
                        sea fácil de administrar.
                    </p>
                </section>

                <section className="admin-banner admin-banner-productos">
                    <img
                        src="https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1800&q=85"
                        alt="Postres y preparaciones de pastelería"
                    />

                    <div className="admin-banner-contenido">
                        <p>ORGANIZA TU VITRINA</p>

                        <h2>Cada creación tiene su lugar.</h2>

                        <span>
                            Clasifica tus productos y mantén ordenada
                            la oferta de MAUÉ.
                        </span>
                    </div>
                </section>

                <section className="admin-panel admin-panel-productos">
                    <div className="admin-productos-encabezado">
                        <div>
                            <p className="admin-subtitulo">
                                TU CATÁLOGO
                            </p>

                            <h2>Gestión de categorías</h2>

                            <p>
                                Crea y administra las categorías de tu
                                pastelería.
                            </p>
                        </div>

                        <span className="admin-conteo">
                            {categorias.length} categorías
                        </span>
                    </div>

                    {error && (
                        <p className="admin-mensaje-error" role="alert">
                            {error}
                        </p>
                    )}

                    <form
                        className="admin-formulario-producto"
                        onSubmit={guardarCategoria}
                    >
                        <h3>
                            {categoriaEditando !== null
                                ? "Editar categoría"
                                : "Agregar una categoría"}
                        </h3>

                        <label>
                            Nombre de la categoría

                            <input
                                type="text"
                                placeholder="Ej. Tortas"
                                value={nombreCategoria}
                                onChange={(e) =>
                                    setNombreCategoria(e.target.value)
                                }
                                required
                            />
                        </label>

                        <label>
                            Descripción

                            <input
                                type="text"
                                placeholder="Describe esta categoría"
                                value={descripcionCategoria}
                                onChange={(e) =>
                                    setDescripcionCategoria(e.target.value)
                                }
                            />
                        </label>

                        <div className="admin-formulario-acciones">
                            <button type="submit">
                                {categoriaEditando !== null
                                    ? "Guardar cambios"
                                    : "Crear categoría"}
                            </button>

                            {categoriaEditando !== null && (
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
                        <h3>Categorías registradas</h3>

                        <button
                            type="button"
                            className="admin-boton-recargar"
                            onClick={cargarCategorias}
                        >
                            Actualizar lista
                        </button>
                    </div>

                    {cargando ? (
                        <p className="admin-estado-lista">
                            Cargando categorías...
                        </p>
                    ) : categorias.length === 0 ? (
                        <p className="admin-estado-lista">
                            Todavía no hay categorías registradas.
                        </p>
                    ) : (
                        <div className="lista-categorias">
                            {categorias.map((categoria) => (
                                <article
                                    className="categoria-admin"
                                    key={categoria.id}
                                >
                                    <div>
                                        <strong>{categoria.nombre}</strong>

                                        <p>
                                            {categoria.descripcion ||
                                                "Sin descripción"}
                                        </p>
                                    </div>

                                    <div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                editarCategoria(categoria)
                                            }
                                        >
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                borrarCategoria(categoria.id)
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

export default AdminCategorias;

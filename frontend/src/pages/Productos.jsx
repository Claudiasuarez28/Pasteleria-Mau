
import { useEffect, useState } from "react";
import { obtenerProductos } from "../services/productoService";
import { obtenerCategorias } from "../services/categoriaService";
import ProductoCard from "../components/ProductoCard";
import "../styles/Productos.css";

function Productos({ agregarAlCarrito }) {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriaActiva, setCategoriaActiva] = useState("Todos");
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarCatalogo();
    }, []);

    const cargarCatalogo = async () => {
        setCargando(true);

        try {
            const [datosProductos, datosCategorias] = await Promise.all([
                obtenerProductos(),
                obtenerCategorias(),
            ]);

            setProductos(Array.isArray(datosProductos) ? datosProductos : []);

            const listaCategorias = Array.isArray(datosCategorias)
                ? datosCategorias
                : Array.isArray(datosCategorias?.categorias)
                    ? datosCategorias.categorias
                    : [];

            setCategorias(listaCategorias);
        } catch (error) {
            console.error("Error al cargar el catálogo:", error);
        } finally {
            setCargando(false);
        }
    };

    const normalizar = (texto) =>
        (texto || "")
            .toString()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();

    const nombreCategoria = (categoria) =>
        typeof categoria === "string"
            ? categoria
            : categoria?.nombre || categoria?.nombreCategoria || "";

    const nombreCategoriaProducto = (producto) =>
        typeof producto?.categoria === "object"
            ? nombreCategoria(producto.categoria)
            : producto?.categoria || producto?.nombreCategoria || "";

    const categoriasActivas = categorias.filter(
        (categoria) =>
            nombreCategoria(categoria).trim() &&
            categoria?.activo !== false
    );

    const productosFiltrados =
        categoriaActiva === "Todos"
            ? productos
            : productos.filter(
                (producto) =>
                    normalizar(nombreCategoriaProducto(producto)) ===
                    normalizar(categoriaActiva)
            );

    return (
        <main className="pagina-productos">
            <section className="encabezado-productos">
                <p className="etiqueta-productos">
                    NUESTRA COLECCIÓN
                </p>

                <h1>
                    Dulces para cada <em>ocasión</em>
                </h1>

                <p className="descripcion-productos">
                    Creaciones hechas a mano, listas para
                    personalizar y compartir.
                </p>
            </section>

            <section className="catalogo-productos">
                <nav className="filtros-productos">
                    <button
                        type="button"
                        className={
                            categoriaActiva === "Todos"
                                ? "filtro-producto activo"
                                : "filtro-producto"
                        }
                        onClick={() => setCategoriaActiva("Todos")}
                    >
                        Todos
                    </button>

                    {categoriasActivas.map((categoria) => {
                        const nombre = nombreCategoria(categoria);

                        return (
                            <button
                                key={categoria.id ?? nombre}
                                type="button"
                                className={
                                    normalizar(categoriaActiva) === normalizar(nombre)
                                        ? "filtro-producto activo"
                                        : "filtro-producto"
                                }
                                onClick={() => setCategoriaActiva(nombre)}
                            >
                                {nombre}
                            </button>
                        );
                    })}
                </nav>

                {cargando ? (
                    <div className="productos-sin-resultados">
                        <p>Cargando nuestras creaciones...</p>
                    </div>
                ) : productosFiltrados.length > 0 ? (
                    <div className="rejilla-productos">
                        {productosFiltrados.map((producto) => (
                            <ProductoCard
                                key={producto.id}
                                producto={producto}
                                agregarAlCarrito={agregarAlCarrito}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="productos-sin-resultados">
                        <h2>
                            {categoriaActiva === "Todos"
                                ? "Próximamente algo delicioso"
                                : "Próximamente algo delicioso"}
                        </h2>
                        <p>
                            Estamos preparando nuevas creaciones
                            para esta categoría.
                        </p>
                    </div>
                )}
            </section>
        </main>
    );
}

export default Productos;

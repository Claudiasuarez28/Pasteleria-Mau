
import { useEffect, useState } from "react";
import { obtenerProductos } from "../services/productoService";
import ProductoCard from "../components/ProductoCard";
import "../styles/Productos.css";

function Productos({ agregarAlCarrito }) {
    const [productos, setProductos] = useState([]);
    const [categoriaActiva, setCategoriaActiva] = useState("Todos");

    const categorias = [
        "Todos",
        "Tortas",
        "Cupcakes",
        "Postres",
        "Galletas",
        "Especiales"
    ];

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            const data = await obtenerProductos();
            setProductos(data);
        } catch (error) {
            console.error("Error al obtener los productos:", error);
        }
    };

    const normalizar = (texto) =>
        (texto || "")
            .toString()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();

    const productosFiltrados =
        categoriaActiva === "Todos"
            ? productos
            : productos.filter(
                (producto) =>
                    normalizar(producto.categoria) ===
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
                    {categorias.map((categoria) => (
                        <button
                            key={categoria}
                            type="button"
                            className={
                                categoriaActiva === categoria
                                    ? "filtro-producto activo"
                                    : "filtro-producto"
                            }
                            onClick={() =>
                                setCategoriaActiva(categoria)
                            }
                        >
                            {categoria}
                        </button>
                    ))}
                </nav>

                {productosFiltrados.length > 0 ? (
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
                        <h2>Próximamente algo delicioso</h2>
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

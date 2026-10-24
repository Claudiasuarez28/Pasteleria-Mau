import { useEffect, useState } from "react";

import { obtenerProductos } from "../services/productoService";
import { obtenerCategorias } from "../services/categoriaService";
import ProductoCard from "../components/ProductoCard";

import "../styles/Productos.css";

// Imágenes de tortas
import imagenChocolate from "../assets/tortas/chocolate.jpg";
import imagenNube from "../assets/tortas/nube.jpg";
import imagenRedVelvetTorta from "../assets/tortas/redvelvet.jpg";
import imagenZanahoria from "../assets/tortas/zanahoria.jpg";
import imagenFresas from "../assets/tortas/fresas.jpg";

// Imágenes de postres
import imagenBrownie from "../assets/postres/brownie.jpg";
import imagenCheesecake from "../assets/postres/cheesecake.jpg";
import imagenTiramisu from "../assets/postres/tiramisu.jpg";
import imagenMousse from "../assets/postres/mousse.jpg";
import pieLimon from "../assets/postres/pielimon.jpg";

// Imágenes de cupcakes
import imagenVainilla from "../assets/cupcakes/vainilla.jpg";
import imagenRedVelvetCupcake from "../assets/cupcakes/redvelvet.jpg";
import imagenArequipe from "../assets/cupcakes/arequipe.jpg";
import imagenFresa from "../assets/cupcakes/fresa.jpg";
import imagenChocolateCupcake from "../assets/cupcakes/chocolate.jpg";

// Imágenes de galletas
import imagenChocoChips from "../assets/galletas/chocochips.jpg";
import imagenAvena from "../assets/galletas/avena.jpg";
import imagenRedVelvetGalleta from "../assets/galletas/gredvelvet.jpg";
import imagenDobleChocolate from "../assets/galletas/doblechocolate.jpg";
import imagenMantequilla from "../assets/galletas/mantequilla.jpg";

// Imágenes especiales
import imagenMerida from "../assets/especiales/merida.jpg";
import imagenBlancanieves from "../assets/especiales/blancanieves.jpg";
import imagenTiana from "../assets/especiales/tiana.jpg";
import imagenBarbie from "../assets/especiales/barbie.jpg";

// Relación entre los nombres de los productos y sus imágenes locales
const imagenesProductos = {
    // Tortas
    "torta de chocolate": imagenChocolate,
    "nube de tres leches": imagenNube,
    "red velvet": imagenRedVelvetTorta,
    "dulce de zanahoria": imagenZanahoria,
    "jardin de fresas": imagenFresas,

    // Postres
    "brownie tentacion": imagenBrownie,
    "brownie": imagenBrownie,
    "cheesecake de fresa": imagenCheesecake,
    "cheesecake": imagenCheesecake,
    "tiramisu clasico": imagenTiramisu,
    "tiramisu": imagenTiramisu,
    "mousse de chocolate": imagenMousse,
    "mousse": imagenMousse,
    "pie de limon": pieLimon,
    "pie limon": pieLimon,
    "pielimon": pieLimon,
    "tarta de limon": pieLimon,
    "pay de limon": pieLimon,

    // Cupcakes
    "nube de vainilla": imagenVainilla,
    "red velvet love": imagenRedVelvetCupcake,
    "dulce de arequipe": imagenArequipe,
    "fresa encantada": imagenFresa,
    "cupcake de chocolate": imagenChocolateCupcake,

    // Galletas
    "choco chips": imagenChocoChips,
    "chocochips": imagenChocoChips,
    "avena dorada": imagenAvena,
    "red velvet cookies": imagenRedVelvetGalleta,
    "red velvet galleta": imagenRedVelvetGalleta,
    "galleta red velvet": imagenRedVelvetGalleta,
    "galletas red velvet": imagenRedVelvetGalleta,
    "gredvelvet": imagenRedVelvetGalleta,
    "doble tentacion": imagenDobleChocolate,
    "doble chocolate": imagenDobleChocolate,
    "besos de mantequilla": imagenMantequilla,

    // Especiales: Mérida
    "merida": imagenMerida,
    "tarta de merida": imagenMerida,
    "tarta merida": imagenMerida,

    // Especiales: Blancanieves
    "blancanieves": imagenBlancanieves,
    "tarta de blancanieves": imagenBlancanieves,
    "tarta de manzana": imagenBlancanieves,

    // Especiales: Tiana
    "tiana": imagenTiana,
    "beignets de tiana": imagenTiana,
    "beignets tiana": imagenTiana,

    // Especiales: Barbie
    "barbie": imagenBarbie,
    "pastel de ensueno barbie": imagenBarbie,
    "pastel de barbie": imagenBarbie,
};

// Normaliza los nombres para comparar sin tildes ni diferencias de mayúsculas
function normalizar(texto) {
    return (texto || "")
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

// Obtiene el nombre de la categoría de un producto
function obtenerNombreCategoria(producto) {
    const categoria = producto?.categoria;

    if (typeof categoria === "object" && categoria !== null) {
        return (
            categoria.nombre ||
            categoria.nombreCategoria ||
            categoria.nombre_categoria ||
            ""
        );
    }

    return (
        categoria ||
        producto?.nombreCategoria ||
        producto?.nombre_categoria ||
        ""
    );
}

// Obtiene la imagen local correspondiente a cada producto
function obtenerImagenProducto(producto) {
    const nombre = normalizar(
        producto?.nombre ||
        producto?.nombreProducto ||
        producto?.nombre_producto
    );

    const categoria = normalizar(obtenerNombreCategoria(producto));

    // Primero identifica la galleta Red Velvet.
    // Así evita que tome por coincidencia la imagen de la torta.
    const esGalletaRedVelvet =
        (categoria.includes("galleta") ||
            nombre.includes("galleta") ||
            nombre.includes("cookies")) &&
        (nombre.includes("red velvet") ||
            nombre.includes("redvelvet") ||
            nombre.includes("gredvelvet"));

    if (esGalletaRedVelvet) {
        return imagenRedVelvetGalleta;
    }

    // Identifica la torta Red Velvet por su categoría o nombre.
    const esTortaRedVelvet =
        nombre.includes("red velvet") &&
        (categoria.includes("torta") ||
            nombre.includes("torta"));

    if (esTortaRedVelvet) {
        return imagenRedVelvetTorta;
    }

    // Busca coincidencias exactas.
    if (imagenesProductos[nombre]) {
        return imagenesProductos[nombre];
    }

    // Busca coincidencias parciales.
    // Excluye Red Velvet para evitar asociar imágenes equivocadas.
    if (nombre) {
        const coincidencias = Object.keys(imagenesProductos).filter(
            (nombreImagen) =>
                nombreImagen.length > 3 &&
                (nombre.includes(nombreImagen) ||
                    nombreImagen.includes(nombre))
        );

        const coincidencia = coincidencias.find(
            (nombreImagen) =>
                !nombreImagen.includes("red velvet") &&
                !nombreImagen.includes("gredvelvet")
        );

        if (coincidencia) {
            return imagenesProductos[coincidencia];
        }
    }

    // Si no encuentra una imagen local, conserva la del backend.
    return (
        producto?.imagen ||
        producto?.imagenUrl ||
        producto?.imagen_url ||
        ""
    );
}

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

            const listaProductos = Array.isArray(datosProductos)
                ? datosProductos
                : Array.isArray(datosProductos?.productos)
                    ? datosProductos.productos
                    : [];

            setProductos(listaProductos);

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

    const nombreCategoria = (categoria) =>
        typeof categoria === "string"
            ? categoria
            : categoria?.nombre ||
              categoria?.nombreCategoria ||
              categoria?.nombre_categoria ||
              "";

    const nombreCategoriaProducto = (producto) =>
        obtenerNombreCategoria(producto);

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

    const productosConImagen = productosFiltrados.map((producto) => ({
        ...producto,
        imagen: obtenerImagenProducto(producto),
    }));

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
                                key={categoria.id ?? categoria._id ?? nombre}
                                type="button"
                                className={
                                    normalizar(categoriaActiva) ===
                                    normalizar(nombre)
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
                ) : productosConImagen.length > 0 ? (
                    <div className="rejilla-productos">
                        {productosConImagen.map((producto) => (
                            <ProductoCard
                                key={producto.id ?? producto._id}
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


function ProductoCard({ producto, agregarAlCarrito }) {
    const formatoPrecio = (precio) =>
        `$${Number(precio || 0).toLocaleString("es-CO")}`;

    const rutaImagen = producto.imagen
        ? producto.imagen.startsWith("http")
            ? producto.imagen
            : producto.imagen.startsWith("/")
                ? producto.imagen
                : `/images/${producto.imagen}`
        : null;

    return (
        <article className="tarjeta-producto">

            <div className="producto-fotografia">

                {rutaImagen ? (
                    <img
                        src={rutaImagen}
                        alt={producto.nombre}
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextSibling.style.display = "flex";
                        }}
                    />
                ) : null}

                <div
                    className="producto-imagen-placeholder"
                    style={{
                        display: rutaImagen ? "none" : "flex"
                    }}
                >
                    <span>MAUÉ</span>
                    <small>Una creación especial</small>
                </div>

                <span className="producto-etiqueta">
                    {producto.categoria || "Especial"}
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
                    onClick={() => agregarAlCarrito(producto)}
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

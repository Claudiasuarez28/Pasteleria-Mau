
import Carrito from "../components/Carrito";
import "../styles/CarritoPage.css";

function CarritoPage({
    carrito,
    cambiarCantidad,
    eliminarDelCarrito
}) {
    return (
        <>
            <main className="pagina-carrito">
                <section className="titulo-pagina">
                    <p>TU SELECCIÓN</p>
                    <h1>Carrito de compras</h1>
                </section>

                <Carrito
                    carrito={carrito}
                    cambiarCantidad={cambiarCantidad}
                    eliminarDelCarrito={eliminarDelCarrito}
                />
            </main>

            <footer className="footer-maue">
                <div className="footer-maue-contenido">
                    <div className="footer-maue-marca">
                        <h2>MAUÉ</h2>
                        <p>PASTELERÍA DE AUTOR</p>
                    </div>

                    <p className="footer-maue-descripcion">
                        Pastelería fina para celebrar lo extraordinario
                        de cada día.
                    </p>

                    <nav className="footer-maue-enlaces">
                        <a href="/productos">Colección</a>
                        <a href="/nosotros">Nuestra historia</a>
                        <a href="/pedidos-especiales">
                            Pedidos especiales
                        </a>
                    </nav>

                    <div className="footer-maue-inferior">
                        <p>© 2025 MAUÉ. Hecho con delicadeza.</p>

                        <a
                            href="https://app-e36k57cqq3zmzyndtnegeetdbddxksbye3rnhkt7q6obysoeusla.makeproxy-c.figma.site/admin"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Acceso administrativo
                        </a>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default CarritoPage;

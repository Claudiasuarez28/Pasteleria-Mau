import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
const [correo, setCorreo] = useState("");
const [contrasena, setContrasena] = useState("");
const [error, setError] = useState("");
const [mostrarContrasena, setMostrarContrasena] = useState(false);
const [cargando, setCargando] = useState(false);

const navigate = useNavigate();

const iniciarSesion = (e) => {
    e.preventDefault();
    setError("");

    const correoNormalizado = correo.trim().toLowerCase();

    // Acceso administrativo de demostración.
    // En producción, valida las credenciales en el backend.
    if (
        correoNormalizado === "admin@maue.com" &&
        contrasena === "admin123"
    ) {
        localStorage.setItem(
            "usuarioMaue",
            JSON.stringify({
                correo: correoNormalizado,
                rol: "administrador"
            })
        );

        navigate("/admin");
        return;
    }

    setError(
        "Correo o contraseña incorrectos. Este acceso es exclusivo para el administrador."
    );
};

return (
    <main className="pagina-login">
        {/* Marca única de MAUÉ */}
        <header className="login-barra-superior">
            <Link to="/" className="login-marca">
                MAUÉ
                <span>PASTELERÍA DE AUTOR</span>
            </Link>

            <Link to="/" className="login-enlace-inicio">
                ← Volver al inicio
            </Link>
        </header>

        {/* Tarjeta de acceso */}
        <section className="login-contenedor">
            <Link to="/" className="login-volver">
                <span aria-hidden="true">←</span>
                Regresar a la tienda
            </Link>

            <div className="login-encabezado">
                <p className="login-etiqueta">
                    ESPACIO PRIVADO
                </p>

                <h1>Bienvenida de nuevo</h1>

                <p className="login-descripcion">
                    Ingresa a tu espacio de administración
                    para gestionar las creaciones de MAUÉ.
                </p>
            </div>

            <div className="login-separador" aria-hidden="true">
                <span></span>
                <span className="login-separador-diamante">✧</span>
                <span></span>
            </div>

            <form
                className="login-formulario"
                onSubmit={iniciarSesion}
            >
                <label htmlFor="correo">
                    Correo electrónico
                </label>

                <input
                    id="correo"
                    type="email"
                    name="correo"
                    placeholder="admin@maue.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    autoComplete="username"
                    required
                />

                <label htmlFor="contrasena">
                    Contraseña
                </label>

                <div className="login-campo-contrasena">
                    <input
                        id="contrasena"
                        type={mostrarContrasena ? "text" : "password"}
                        name="contrasena"
                        placeholder="Ingresa tu contraseña"
                        value={contrasena}
                        onChange={(e) =>
                            setContrasena(e.target.value)
                        }
                        autoComplete="current-password"
                        required
                    />

                    <button
                        type="button"
                        className="login-mostrar-contrasena"
                        onClick={() =>
                            setMostrarContrasena(!mostrarContrasena)
                        }
                        aria-label={
                            mostrarContrasena
                                ? "Ocultar contraseña"
                                : "Mostrar contraseña"
                        }
                    >
                        {mostrarContrasena ? "Ocultar" : "Mostrar"}
                    </button>
                </div>

                {error && (
                    <div
                        className="login-mensaje-error"
                        role="alert"
                    >
                        <span aria-hidden="true">!</span>
                        <p>{error}</p>
                    </div>
                )}

                <button
                    type="submit"
                    className="login-boton"
                    disabled={cargando}
                >
                    <span>
                        {cargando
                            ? "Verificando..."
                            : "Iniciar sesión"}
                    </span>

                    <span className="login-flecha" aria-hidden="true">
                        →
                    </span>
                </button>
            </form>

            <div className="login-pie">
                <span className="login-pie-icono" aria-hidden="true">
                    ✧
                </span>

                <p>Hecho con delicadeza, pensado para ti.</p>
            </div>
        </section>

        <footer className="login-copyright">
            <span>© 2026 MAUÉ. Hecho con delicadeza.</span>
            <span>Pastelería de autor</span>
        </footer>
    </main>
);


}

export default Login;
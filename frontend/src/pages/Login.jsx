
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login({ onLogin }) {
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState("");
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [cargando, setCargando] = useState(false);

    const navigate = useNavigate();

    const iniciarSesion = (e) => {
        e.preventDefault();
        setError("");
        setCargando(true);

        const correoNormalizado = correo.trim().toLowerCase();

        if (
            correoNormalizado === "admin@maue.com" &&
            contrasena === "admin123"
        ) {
            const usuarioNuevo = {
                correo: correoNormalizado,
                rol: "administrador",
            };

            localStorage.setItem(
                "usuarioMaue",
                JSON.stringify(usuarioNuevo)
            );

            if (onLogin) {
                onLogin(usuarioNuevo);
            }

            navigate("/admin");
            setCargando(false);
            return;
        }

        setError(
            "Correo o contraseña incorrectos. Este acceso es exclusivo para el administrador."
        );

        setCargando(false);
    };

    return (
            <main className="pagina-login">            <section className="login-contenedor">
                <Link to="/" className="login-logo">
                    MAUÉ
                </Link>

                <p className="login-etiqueta">
                    BIENVENIDO A MAUÉ
                </p>

                <h1>Iniciar sesión</h1>

                <p className="login-descripcion">
                    Ingresa tus datos para continuar.
                </p>

                <form onSubmit={iniciarSesion}>
                    <div className="login-campo">
                        <label htmlFor="correo">
                            Correo electrónico
                        </label>

                        <input
                            id="correo"
                            type="email"
                            value={correo}
                            onChange={(e) =>
                                setCorreo(e.target.value)
                            }
                            placeholder="tu@correo.com"
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div className="login-campo">
                        <label htmlFor="contrasena">
                            Contraseña
                        </label>

                        <div className="login-contrasena">
                            <input
                                id="contrasena"
                                type={
                                    mostrarContrasena
                                        ? "text"
                                        : "password"
                                }
                                value={contrasena}
                                onChange={(e) =>
                                    setContrasena(e.target.value)
                                }
                                placeholder="Ingresa tu contraseña"
                                autoComplete="current-password"
                                required
                            />

                            <button
                                type="button"
                                className="login-mostrar"
                                onClick={() =>
                                    setMostrarContrasena(
                                        !mostrarContrasena
                                    )
                                }
                            >
                                {mostrarContrasena
                                    ? "Ocultar"
                                    : "Mostrar"}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="login-error" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="login-boton"
                        disabled={cargando}
                    >
                        {cargando
                            ? "Ingresando..."
                            : "Ingresar"}
                    </button>
                </form>

                <p className="login-volver">
                    <Link to="/">
                        Volver al inicio
                    </Link>
                </p>
            </section>
        </main>
    );
}

export default Login;

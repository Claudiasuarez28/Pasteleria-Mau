
package com.example.demo.config;

import com.example.demo.service.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;
import java.util.Base64;

@Component
public class SeguridadInterceptor implements HandlerInterceptor {

    private final TokenService tokenService;

    public SeguridadInterceptor(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler) throws IOException {

        String ruta = request.getRequestURI();
        String metodo = request.getMethod();

        boolean operacionAdministrativa =
                ruta.startsWith("/api/usuarios")
                || ((ruta.startsWith("/api/productos")
                || ruta.startsWith("/api/categorias"))
                && !metodo.equals("GET"));

        if (!operacionAdministrativa) {
            return true;
        }

        String encabezado = request.getHeader("Authorization");

        if (encabezado == null || !encabezado.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write(
                    "{\"mensaje\":\"Debes iniciar sesión.\"}"
            );
            return false;
        }

        String token = encabezado.substring(7);

        if (!tokenService.validarToken(token)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write(
                    "{\"mensaje\":\"La sesión no es válida o ha expirado.\"}"
            );
            return false;
        }

        try {
            String contenido = token.split("\\.")[0];
            String datos = new String(
                    Base64.getUrlDecoder().decode(contenido),
                    java.nio.charset.StandardCharsets.UTF_8
            );

            String[] campos = datos.split("\\|", -1);

            if (campos.length != 3
                    || !"administrador".equalsIgnoreCase(campos[1])) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json");
                response.getWriter().write(
                        "{\"mensaje\":\"No tienes permisos de administrador.\"}"
                );
                return false;
            }

            return true;

        } catch (RuntimeException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write(
                    "{\"mensaje\":\"El token no es válido.\"}"
            );
            return false;
        }
    }
}

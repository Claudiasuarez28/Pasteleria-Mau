package com.example.demo.config;

import com.example.demo.service.TokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;

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

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String ruta = request.getRequestURI();
        String metodo = request.getMethod();

        // Solo se permite el registro público en esta ruta exacta.
        // Las demás operaciones sobre usuarios siguen protegidas.
        boolean registroPublico =
                "/api/usuarios".equals(ruta)
                && "POST".equalsIgnoreCase(metodo);

        if (registroPublico) {
            return true;
        }

        boolean operacionAdministrativa =
                ruta.startsWith("/api/usuarios")
                || ((ruta.startsWith("/api/productos")
                || ruta.startsWith("/api/categorias"))
                && !"GET".equalsIgnoreCase(metodo));

        if (!operacionAdministrativa) {
            return true;
        }

        String token = obtenerToken(request);

        if (token == null || !tokenService.validarToken(token)) {
            responderError(
                    response,
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "La sesión no es válida o ha expirado."
            );
            return false;
        }

        try {
            String rol = tokenService.obtenerRol(token);

            if (!"administrador".equalsIgnoreCase(rol)
                    && !"admin".equalsIgnoreCase(rol)) {
                responderError(
                        response,
                        HttpServletResponse.SC_FORBIDDEN,
                        "No tienes permisos de administrador."
                );
                return false;
            }

            return true;

        } catch (RuntimeException e) {
            responderError(
                    response,
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "El token no es válido."
            );
            return false;
        }
    }

    private void responderError(
            HttpServletResponse response,
            int estado,
            String mensaje) throws IOException {

        response.setStatus(estado);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(
                "{\"mensaje\":\"" + mensaje + "\"}"
        );
    }

    private String obtenerToken(HttpServletRequest request) {

        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("token".equals(cookie.getName())
                        && cookie.getValue() != null
                        && !cookie.getValue().isBlank()) {
                    return cookie.getValue();
                }
            }
        }

        // Compatibilidad con el frontend que utiliza Bearer.
        String encabezado = request.getHeader("Authorization");

        if (encabezado != null && encabezado.startsWith("Bearer ")) {
            String token = encabezado.substring(7).trim();
            return token.isEmpty() ? null : token;
        }

        return null;
    }
}

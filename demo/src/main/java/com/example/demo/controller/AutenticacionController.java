package com.example.demo.controller;

import com.example.demo.model.Usuario;
import com.example.demo.service.AutenticacionService;
import com.example.demo.service.TokenService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://pasteleria-mau.vercel.app",
    "https://pasteleria-mau-git-main-clau-c83a.vercel.app"
})
public class AutenticacionController {

    private final AutenticacionService autenticacionService;
    private final TokenService tokenService;

    public AutenticacionController(
            AutenticacionService autenticacionService,
            TokenService tokenService) {
        this.autenticacionService = autenticacionService;
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> iniciarSesion(
            @RequestBody SolicitudLogin solicitud) {

        if (solicitud == null
                || solicitud.correo() == null
                || solicitud.password() == null
                || solicitud.correo().isBlank()
                || solicitud.password().isBlank()) {
            return ResponseEntity.badRequest().body(
                    Map.of("mensaje", "Debes ingresar correo y contraseña.")
            );
        }

        Optional<Usuario> resultado =
                autenticacionService.iniciarSesion(
                        solicitud.correo(),
                        solicitud.password()
                );

        if (resultado.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    Map.of("mensaje", "Correo o contraseña incorrectos.")
            );
        }

        Usuario usuario = resultado.get();

        String correo = usuario.getCorreo() == null
                ? ""
                : usuario.getCorreo().trim().toLowerCase(Locale.ROOT);

        String rolOriginal = usuario.getRol() == null
                ? "usuario"
                : usuario.getRol().trim().toLowerCase(Locale.ROOT);

        String rol = rolOriginal.equals("admin")
                || rolOriginal.equals("administrador")
                ? "administrador"
                : "usuario";

        String token = tokenService.generarToken(correo, rol);

        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/")
                .maxAge(15 * 60)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of(
                        "id", usuario.getId() == null ? "" : usuario.getId(),
                        "nombre", usuario.getNombre() == null
                                ? "" : usuario.getNombre(),
                        "correo", correo,
                        "rol", rol
                ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> cerrarSesion() {

        ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("mensaje", "Sesión cerrada correctamente."));
    }

    public record SolicitudLogin(String correo, String password) {
    }
}

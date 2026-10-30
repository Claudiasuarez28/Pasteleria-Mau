
package com.example.demo.service;

import com.example.demo.model.Usuario;
import com.example.demo.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AutenticacionService {

    private static final int MAX_INTENTOS = 5;
    private static final Duration TIEMPO_BLOQUEO =
            Duration.ofMinutes(15);

    private final UsuarioRepository usuarioRepository;
    private final PasswordService passwordService;

    private final ConcurrentHashMap<String, EstadoIntentos> intentos =
            new ConcurrentHashMap<>();

    public AutenticacionService(
            UsuarioRepository usuarioRepository,
            PasswordService passwordService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordService = passwordService;
    }

    public Optional<Usuario> iniciarSesion(
            String correo, String contrasena) {

        if (correo == null || contrasena == null
                || correo.isBlank() || contrasena.isBlank()) {
            return Optional.empty();
        }

        String correoNormalizado =
                correo.trim().toLowerCase(Locale.ROOT);

        EstadoIntentos estado = intentos.computeIfAbsent(
                correoNormalizado,
                clave -> new EstadoIntentos()
        );

        synchronized (estado) {
            Instant ahora = Instant.now();

            if (estado.bloqueadoHasta != null) {
                if (ahora.isBefore(estado.bloqueadoHasta)) {
                    return Optional.empty();
                }

                estado.intentosFallidos = 0;
                estado.bloqueadoHasta = null;
            }

            List<Usuario> usuarios = usuarioRepository.findAll();

            Optional<Usuario> resultado = usuarios.stream()
                    .filter(usuario -> usuario.getCorreo() != null)
                    .filter(usuario -> usuario.getCorreo()
                            .trim()
                            .equalsIgnoreCase(correoNormalizado))
                    .findFirst();

            if (resultado.isEmpty()) {
                registrarFallo(estado, ahora);
                return Optional.empty();
            }

            Usuario usuario = resultado.get();
            String passwordGuardado = usuario.getPassword();

            if (passwordGuardado == null
                    || passwordGuardado.isBlank()) {
                registrarFallo(estado, ahora);
                return Optional.empty();
            }

            boolean coincide = passwordService.verificar(
                    contrasena, passwordGuardado
            );

            // Migración temporal de contraseñas antiguas en texto plano.
            if (!coincide && contrasena.equals(passwordGuardado)) {
                usuario.setPassword(
                        passwordService.codificar(contrasena)
                );
                coincide = true;
            }

            if (!coincide) {
                registrarFallo(estado, ahora);
                return Optional.empty();
            }

            estado.intentosFallidos = 0;
            estado.bloqueadoHasta = null;

            usuario.setCorreo(correoNormalizado);

            if (usuario.getRol() != null) {
                usuario.setRol(
                        usuario.getRol().trim().toLowerCase(Locale.ROOT)
                );
            }

            usuarioRepository.save(usuario);

            return Optional.of(usuario);
        }
    }

    private void registrarFallo(
            EstadoIntentos estado, Instant ahora) {

        estado.intentosFallidos++;

        if (estado.intentosFallidos >= MAX_INTENTOS) {
            estado.bloqueadoHasta = ahora.plus(TIEMPO_BLOQUEO);
        }
    }

    private static class EstadoIntentos {
        private int intentosFallidos;
        private Instant bloqueadoHasta;
    }
}

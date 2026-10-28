package com.example.demo.service;

import com.example.demo.model.Usuario;
import com.example.demo.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class AutenticacionService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordService passwordService;

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

        List<Usuario> usuarios = usuarioRepository.findAll();

        Optional<Usuario> resultado = usuarios.stream()
                .filter(usuario -> usuario.getCorreo() != null)
                .filter(usuario -> usuario.getCorreo()
                        .trim()
                        .toLowerCase(Locale.ROOT)
                        .equals(correoNormalizado))
                .findFirst();

        if (resultado.isEmpty()) {
            return Optional.empty();
        }

        Usuario usuario = resultado.get();

        String passwordGuardado = usuario.getPassword();

        if (passwordGuardado == null || passwordGuardado.isBlank()) {
            return Optional.empty();
        }

        boolean coincide = passwordService.verificar(
                contrasena, passwordGuardado
        );

        // Compatibilidad temporal con contraseñas antiguas.
        if (!coincide && contrasena.equals(passwordGuardado)) {
            usuario.setPassword(
                    passwordService.codificar(contrasena)
            );
            coincide = true;
        }

        if (!coincide) {
            return Optional.empty();
        }

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

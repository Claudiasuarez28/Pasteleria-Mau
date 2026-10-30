package com.example.demo.controller;

import com.example.demo.model.Usuario;
import com.example.demo.repository.UsuarioRepository;
import com.example.demo.service.PasswordService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://pasteleria-mau.vercel.app",
    "https://pasteleria-mau-git-main-clau-c83a.vercel.app"
})
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordService passwordService;

    public UsuarioController(
            UsuarioRepository usuarioRepository,
            PasswordService passwordService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordService = passwordService;
    }

    @GetMapping
    public ResponseEntity<?> obtenerUsuarios() {
        return ResponseEntity.ok(usuarioRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> crearUsuario(
            @RequestBody Usuario solicitud) {

        if (solicitud == null
                || solicitud.getNombre() == null
                || solicitud.getCorreo() == null
                || solicitud.getPassword() == null
                || solicitud.getNombre().isBlank()
                || solicitud.getCorreo().isBlank()
                || solicitud.getPassword().isBlank()) {

            return ResponseEntity.badRequest().body(
                Map.of("mensaje",
                    "Debes ingresar nombre, correo y contraseña.")
            );
        }

        String nombre = solicitud.getNombre().trim();
        String correo = solicitud.getCorreo()
                .trim()
                .toLowerCase(Locale.ROOT);
        String password = solicitud.getPassword();

        if (nombre.length() > 100
                || correo.length() > 254
                || password.length() < 8
                || password.length() > 72
                || !correo.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {

            return ResponseEntity.badRequest().body(
                Map.of("mensaje",
                    "Verifica el nombre, el correo y la contraseña. "
                    + "La contraseña debe tener entre 8 y 72 caracteres.")
            );
        }

        if (usuarioRepository.findByCorreo(correo).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                Map.of("mensaje",
                    "Ya existe una cuenta con ese correo.")
            );
        }

        Usuario nuevoUsuario = new Usuario(
                nombre,
                correo,
                passwordService.codificar(password),
                "usuario"
        );

        Usuario guardado = usuarioRepository.save(nuevoUsuario);

        return ResponseEntity.status(HttpStatus.CREATED).body(
            Map.of(
                "id", guardado.getId() == null ? "" : guardado.getId(),
                "nombre", guardado.getNombre(),
                "correo", guardado.getCorreo(),
                "rol", guardado.getRol(),
                "mensaje", "Usuario registrado correctamente."
            )
        );
    }
}

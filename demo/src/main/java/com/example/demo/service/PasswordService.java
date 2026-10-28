
package com.example.demo.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordService {

    private final BCryptPasswordEncoder codificador =
            new BCryptPasswordEncoder();

    public String codificar(String contrasena) {
        return codificador.encode(contrasena);
    }

    public boolean verificar(String contrasena, String hash) {
        if (contrasena == null || hash == null || hash.isBlank()) {
            return false;
        }

        return codificador.matches(contrasena, hash);
    }
}

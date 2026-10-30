
package com.example.demo.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class TokenService {

    private static final long DURACION_MS = 15 * 60 * 1000L;

    private final SecretKey clave;

    public TokenService() {
        String secreto = System.getenv("MAUE_JWT_SECRET");

        if (secreto == null || secreto.length() < 32
                || secreto.equals("PEGA_AQUI_TU_NUEVA_CLAVE_PRIVADA")) {
            throw new IllegalStateException(
                    "La variable MAUE_JWT_SECRET no está configurada correctamente."
            );
        }

        this.clave = Keys.hmacShaKeyFor(
                secreto.getBytes(StandardCharsets.UTF_8)
        );
    }

    public String generarToken(String correo, String rol) {
        Date ahora = new Date();
        Date expiracion = new Date(ahora.getTime() + DURACION_MS);

        return Jwts.builder()
                .subject(correo)
                .claim("rol", rol)
                .issuedAt(ahora)
                .expiration(expiracion)
                .signWith(clave)
                .compact();
    }

    public boolean validarToken(String token) {
        try {
            obtenerClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String obtenerCorreo(String token) {
        return obtenerClaims(token).getSubject();
    }

    public String obtenerRol(String token) {
        return obtenerClaims(token).get("rol", String.class);
    }

    private Claims obtenerClaims(String token) {
        return Jwts.parser()
                .verifyWith(clave)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}


package com.example.demo.service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.springframework.stereotype.Service;

@Service
public class TokenService {

    private static final long DURACION_MS = 8 * 60 * 60 * 1000L;
    private static final String ALGORITMO = "HmacSHA256";

    private final byte[] clave;

    public TokenService() {
        String secreto = System.getenv("MAUE_JWT_SECRET");

        if (secreto == null || secreto.length() < 32
                || secreto.equals("PEGA_AQUI_TU_NUEVA_CLAVE_PRIVADA")) {
            throw new IllegalStateException(
                    "La variable MAUE_JWT_SECRET no está configurada correctamente."
            );
        }

        this.clave = secreto.getBytes(StandardCharsets.UTF_8);
    }

    public String generarToken(String correo, String rol) {
        long expiracion = System.currentTimeMillis() + DURACION_MS;

        String datos = correo + "|" + rol + "|" + expiracion;
        String contenido = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(datos.getBytes(StandardCharsets.UTF_8));

        return contenido + "." + firmar(contenido);
    }

    public boolean validarToken(String token) {
        try {
            if (token == null || token.isBlank()) {
                return false;
            }

            String[] partes = token.split("\\.", -1);

            if (partes.length != 2) {
                return false;
            }

            String firmaEsperada = firmar(partes[0]);

            if (!java.security.MessageDigest.isEqual(
                    firmaEsperada.getBytes(StandardCharsets.UTF_8),
                    partes[1].getBytes(StandardCharsets.UTF_8))) {
                return false;
            }

            String datos = new String(
                    Base64.getUrlDecoder().decode(partes[0]),
                    StandardCharsets.UTF_8
            );

            String[] campos = datos.split("\\|", -1);

            if (campos.length != 3) {
                return false;
            }

            long expiracion = Long.parseLong(campos[2]);

            return !campos[0].isBlank()
                    && expiracion > System.currentTimeMillis();

        } catch (Exception e) {
            return false;
        }
    }

    private String firmar(String contenido) {
        try {
            Mac mac = Mac.getInstance(ALGORITMO);
            mac.init(new SecretKeySpec(clave, ALGORITMO));

            byte[] firma = mac.doFinal(
                    contenido.getBytes(StandardCharsets.UTF_8)
            );

            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(firma);

        } catch (Exception e) {
            throw new IllegalStateException(
                    "No fue posible firmar el token.", e
            );
        }
    }
}

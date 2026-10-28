
package com.example.demo;

import com.example.demo.config.SeguridadInterceptor;
import com.example.demo.service.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class DemoApplicationTests {

    @Autowired
    private SeguridadInterceptor seguridadInterceptor;

    @Autowired
    private TokenService tokenService;

    private MockHttpServletRequest request;
    private MockHttpServletResponse response;

    @BeforeEach
    void preparar() {
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();

        request.setRequestURI("/api/categorias");
        request.setMethod("POST");
    }

    @Test
    void rechazaPeticionSinToken() throws Exception {
        boolean permitido = seguridadInterceptor.preHandle(
                request, response, new Object()
        );

        assertFalse(permitido);
        assertEquals(401, response.getStatus());
    }

    @Test
    void rechazaTokenInvalido() throws Exception {
        request.addHeader("Authorization", "Bearer token-invalido");

        boolean permitido = seguridadInterceptor.preHandle(
                request, response, new Object()
        );

        assertFalse(permitido);
        assertEquals(401, response.getStatus());
    }

    @Test
    void rechazaUsuarioNormal() throws Exception {
        String token = tokenService.generarToken(
                "karen@maue.com", "usuario"
        );

        request.addHeader("Authorization", "Bearer " + token);

        boolean permitido = seguridadInterceptor.preHandle(
                request, response, new Object()
        );

        assertFalse(permitido);
        assertEquals(403, response.getStatus());
    }

    @Test
    void permiteAdministradorConTokenValido() throws Exception {
        String token = tokenService.generarToken(
                "admin@maue.com", "administrador"
        );

        request.addHeader("Authorization", "Bearer " + token);

        boolean permitido = seguridadInterceptor.preHandle(
                request, response, new Object()
        );

        assertTrue(permitido);
    }

    @Test
    void permiteOpcionesSinToken() throws Exception {
        request.setMethod("OPTIONS");

        boolean permitido = seguridadInterceptor.preHandle(
                request, response, new Object()
        );

        assertTrue(permitido);
    }
}

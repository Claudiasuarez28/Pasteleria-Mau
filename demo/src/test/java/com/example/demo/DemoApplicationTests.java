package com.example.demo;

import com.example.demo.config.SeguridadInterceptor;
import com.example.demo.model.Usuario;
import com.example.demo.repository.UsuarioRepository;
import com.example.demo.service.AutenticacionService;
import com.example.demo.service.PasswordService;
import com.example.demo.service.TokenService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class DemoApplicationTests {

    @Autowired
    private SeguridadInterceptor seguridadInterceptor;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private PasswordService passwordService;

    private MockHttpServletRequest request;
    private MockHttpServletResponse response;

    private UsuarioRepository usuarioRepository;
    private AutenticacionService autenticacionService;

    @BeforeEach
    void preparar() {
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();

        request.setRequestURI("/api/categorias");
        request.setMethod("POST");

        usuarioRepository = Mockito.mock(UsuarioRepository.class);

        autenticacionService = new AutenticacionService(
                usuarioRepository,
                passwordService
        );
    }

    @Test
    void rechazaPeticionSinToken() throws Exception {
        assertFalse(seguridadInterceptor.preHandle(
                request, response, new Object()
        ));
        assertEquals(401, response.getStatus());
    }

    @Test
    void rechazaTokenInvalido() throws Exception {
        request.addHeader("Authorization", "Bearer token-invalido");

        assertFalse(seguridadInterceptor.preHandle(
                request, response, new Object()
        ));
        assertEquals(401, response.getStatus());
    }

    @Test
    void rechazaUsuarioNormal() throws Exception {
        String token = tokenService.generarToken(
                "karen@maue.com", "usuario"
        );

        request.addHeader("Authorization", "Bearer " + token);

        assertFalse(seguridadInterceptor.preHandle(
                request, response, new Object()
        ));
        assertEquals(403, response.getStatus());
    }

    @Test
    void permiteAdministradorConTokenValido() throws Exception {
        String token = tokenService.generarToken(
                "admin@maue.com", "administrador"
        );

        request.addHeader("Authorization", "Bearer " + token);

        assertTrue(seguridadInterceptor.preHandle(
                request, response, new Object()
        ));
    }

    @Test
    void permiteOpcionesSinToken() throws Exception {
        request.setMethod("OPTIONS");

        assertTrue(seguridadInterceptor.preHandle(
                request, response, new Object()
        ));
    }

    @Test
    void contrasenaSeGuardaComoHashYSePuedeVerificar() {
        String contrasena = "ClaveSegura123";
        String hash = passwordService.codificar(contrasena);

        assertNotEquals(contrasena, hash);
        assertTrue(passwordService.verificar(contrasena, hash));
        assertFalse(passwordService.verificar(
                "ClaveIncorrecta", hash
        ));
    }

    @Test
    void bloqueaLoginDespuesDeCincoIntentosFallidos() {
        Usuario usuario = new Usuario(
                "Usuario Prueba",
                "prueba@maue.com",
                passwordService.codificar("ClaveSegura123"),
                "usuario"
        );

        when(usuarioRepository.findAll())
                .thenReturn(List.of(usuario));

        for (int i = 0; i < 5; i++) {
            assertTrue(autenticacionService.iniciarSesion(
                    "prueba@maue.com", "ClaveIncorrecta"
            ).isEmpty());
        }

        assertTrue(autenticacionService.iniciarSesion(
                "prueba@maue.com", "ClaveSegura123"
        ).isEmpty());

        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    void permiteLoginCorrectoAntesDeAlcanzarElLimite() {
        Usuario usuario = new Usuario(
                "Usuario Prueba",
                "correcto@maue.com",
                passwordService.codificar("ClaveSegura123"),
                "usuario"
        );

        when(usuarioRepository.findAll())
                .thenReturn(List.of(usuario));

        for (int i = 0; i < 3; i++) {
            assertTrue(autenticacionService.iniciarSesion(
                    "correcto@maue.com", "Incorrecta"
            ).isEmpty());
        }

        assertTrue(autenticacionService.iniciarSesion(
                "correcto@maue.com", "ClaveSegura123"
        ).isPresent());

        verify(usuarioRepository).save(usuario);
    }
}

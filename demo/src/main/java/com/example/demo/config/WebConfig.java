
package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final SeguridadInterceptor seguridadInterceptor;

    public WebConfig(SeguridadInterceptor seguridadInterceptor) {
        this.seguridadInterceptor = seguridadInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(seguridadInterceptor)
                .addPathPatterns(
                        "/api/usuarios/**",
                        "/api/productos/**",
                        "/api/categorias/**"
                );
    }
}


package com.example.demo.controller;

import com.example.demo.model.Producto;
import com.example.demo.repository.ProductoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://pasteleria-mau.vercel.app",
    "https://pasteleria-mau-git-main-clau-c83a.vercel.app"
})
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoRepository productoRepository;

    public ProductoController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @GetMapping
    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    @PostMapping
    public Producto crearProducto(@RequestBody Producto producto) {
        return productoRepository.save(producto);
    }

    @PutMapping("/{id}")
    public Producto actualizarProducto(
            @PathVariable String id,
            @RequestBody Producto producto) {
        producto.setId(id);
        return productoRepository.save(producto);
    }

    @DeleteMapping("/{id}")
    public void eliminarProducto(@PathVariable String id) {
        productoRepository.deleteById(id);
    }
}

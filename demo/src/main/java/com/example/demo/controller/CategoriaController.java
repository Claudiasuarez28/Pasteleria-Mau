
package com.example.demo.controller;

import com.example.demo.model.Categoria;
import com.example.demo.repository.CategoriaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://pasteleria-mau.vercel.app",
    "https://pasteleria-mau-git-main-clau-c83a.vercel.app"
})
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaRepository categoriaRepository;

    public CategoriaController(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @GetMapping
    public List<Categoria> listarCategorias() {
        return categoriaRepository.findAll();
    }

    @PostMapping
    public Categoria crearCategoria(@RequestBody Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    @PutMapping("/{id}")
    public Categoria actualizarCategoria(
            @PathVariable String id,
            @RequestBody Categoria categoria) {
        categoria.setId(id);
        return categoriaRepository.save(categoria);
    }

    @DeleteMapping("/{id}")
    public void eliminarCategoria(@PathVariable String id) {
        categoriaRepository.deleteById(id);
    }
}

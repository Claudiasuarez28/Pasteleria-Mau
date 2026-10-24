
import axios from "axios";

const API_URL = "https://maue-backend.onrender.com/api/productos";

// Obtener todos los productos
export const obtenerProductos = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Crear un producto
export const crearProducto = async (producto) => {
    const response = await axios.post(API_URL, producto);
    return response.data;
};

// Actualizar un producto
export const actualizarProducto = async (id, producto) => {
    const response = await axios.put(`${API_URL}/${id}`, producto);
    return response.data;
};

// Eliminar un producto
export const eliminarProducto = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};

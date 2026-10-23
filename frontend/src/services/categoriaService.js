
import axios from "axios";

const API_URL = "https://maue-backend.onrender.com/api/categorias";

export const obtenerCategorias = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const crearCategoria = async (categoria) => {
    const response = await axios.post(API_URL, categoria);
    return response.data;
};

export const actualizarCategoria = async (id, categoria) => {
    const response = await axios.put(`${API_URL}/${id}`, categoria);
    return response.data;
};

export const eliminarCategoria = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};

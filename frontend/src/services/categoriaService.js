
import axios from "axios";

const API_URL = "https://maue-backend.onrender.com/api/categorias";

const obtenerEncabezadosAutenticacion = () => {
    const token = localStorage.getItem("tokenMaue");

    if (!token) {
        throw new Error("Debes iniciar sesión para realizar esta operación.");
    }

    return {
        Authorization: `Bearer ${token}`,
    };
};

export const obtenerCategorias = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const crearCategoria = async (categoria) => {
    const response = await axios.post(API_URL, categoria, {
        headers: obtenerEncabezadosAutenticacion(),
    });

    return response.data;
};

export const actualizarCategoria = async (id, categoria) => {
    const response = await axios.put(
        `${API_URL}/${id}`,
        categoria,
        {
            headers: obtenerEncabezadosAutenticacion(),
        }
    );

    return response.data;
};

export const eliminarCategoria = async (id) => {
    await axios.delete(`${API_URL}/${id}`, {
        headers: obtenerEncabezadosAutenticacion(),
    });
};

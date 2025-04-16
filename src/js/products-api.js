import axios from "axios";

export const getCategoriesItem = async () => {
  const { data } = await axios.get("https://dummyjson.com/products/category-list");
  const updatedCategories = ['All', ...data];
  return updatedCategories;
};

export const getAllProducts = async (page = 1) => {
  const skip = (page - 1) * 12;
  const { data } = await axios.get(`https://dummyjson.com/products?limit=12&skip=${skip}`);
  return data;
};

export const getProductsByCategory = async (category) => {
  const { data } = await axios.get(`https://dummyjson.com/products/category/${category}`);
  return data.products;
};

// Функція отримання товарів
export const getProductsByForm = async (value) => {
  try {
    const { data } = await axios.get(`https://dummyjson.com/products/search?q=${value.trim()}`);
    return data.products;
  } catch (error) {
    console.error('Помилка при пошуку продуктів:', error);
    return [];
  }
};



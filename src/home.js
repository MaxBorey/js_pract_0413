import {
  getAllProducts,
  getCategoriesItem,
  getProductsByCategory,
  getProductsByForm
} from "./js/products-api";

import { refs } from "./js/refs";
import {
  renderCategories,
  renderProducts,
  showLoadMoreButton,
  hideLoadMoreButton,
  scrollToNewContent
} from "./js/render-function";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import * as basicLightbox from "basiclightbox";
import 'basiclightbox/dist/basicLightbox.min.css';

// ============================
// 🔁 Змінні стану
// ============================
let currentPage = 1;
let currentCategory = 'All';

// ============================
// 📂 Завантаження категорій і початкових товарів
// ============================
const loadPage = async () => {
  try {
    const categories = await getCategoriesItem();
    const markup = renderCategories(categories);
    refs.categoriesList.innerHTML = markup;
    refs.categoriesList.addEventListener('click', handleCategoryClick);

    const { products } = await getAllProducts(currentPage);
    renderProducts(products);
    showLoadMoreButton();
  } catch (error) {
    console.error('Помилка при завантаженні:', error);
  }
};

// ============================
// 🔘 Обробка кліку по категоріях
// ============================
const handleCategoryClick = async (e) => {
  if (e.target.nodeName !== 'BUTTON') return;

  refs.productsList.innerHTML = "";
  const category = e.target.dataset.category;
  currentPage = 1;
  currentCategory = category;

  try {
    if (category === 'All') {
      const { products } = await getAllProducts(currentPage);
      renderProducts(products);
      showLoadMoreButton();
    } else {
      const products = await getProductsByCategory(category);
      renderProducts(products);
      hideLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      title: "No results",
      message: "No images found for your query.",
      position: "topRight",
    });
    console.error('Помилка при фільтрації товарів:', error);
  }
};

// ============================
// ⬇️ Обробка кнопки Load More
// ============================
refs.loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;

  try {
    const { products } = await getAllProducts(currentPage);

    const markup = products.map(product => `
      <li class="products__item" data-id="${product.id}">
        <img class="products__image" src="${product.thumbnail}" alt="${product.title}" />
        <p class="products__title">${product.title}</p>
        <p class="products__brand"><span class="products__brand--bold">Brand:</span> ${product.brand}</p>
        <p class="products__category">Category: ${product.category}</p>
        <p class="products__price">Price: $${product.price}</p>
      </li>
    `).join('');

    refs.productsList.insertAdjacentHTML('beforeend', markup);
    scrollToNewContent();

    if (products.length < 12) {
      hideLoadMoreButton(); // якщо менше 12 — це остання сторінка
    }
  } catch (error) {
    console.error('Помилка при завантаженні наступної сторінки:', error);
    hideLoadMoreButton();
  }
});

// ============================
// 🧲 Делегування кліку по товару
// ============================
refs.productsList.addEventListener('click', onProductClick);

async function onProductClick(event) {
  const productItem = event.target.closest('li.products__item');
  if (!productItem) return;

  const productId = productItem.dataset.id;
  if (!productId) return;

  try {
    const response = await fetch(`https://dummyjson.com/products/${productId}`);
    const product = await response.json();

    renderProductModal(product);
  } catch (error) {
    console.error('Помилка завантаження товару:', error);
  }
}

// ============================
// 🪄 Модалка через basicLightbox
// ============================
function renderProductModal(product) {
  const instance = basicLightbox.create(`
    <div class="modal-product">
      <img class="modal-product__img" src="${product.thumbnail}" alt="${product.title}" />
      <div class="modal-product__content">
        <p class="modal-product__title">${product.title}</p>
        <ul class="modal-product__tags">
          <li>${product.brand}</li>
          <li>${product.category}</li>
        </ul>
        <p class="modal-product__description">${product.description}</p>
        <p class="modal-product__shipping-information">Shipping: Standard delivery within 5-7 business days.</p>
        <p class="modal-product__return-policy">Return Policy: Free 30-day return.</p>
        <p class="modal-product__price">Price: $${product.price}</p>
        <button class="modal-product__buy-btn" type="button">Buy</button>
      </div>
    </div>
  `);

  instance.show();
}

// ============================
// ⬆️ Scroll to top button
// ============================
const scrollToTopBtn = document.querySelector(".scroll-to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    scrollToTopBtn.classList.add("show");
  } else {
    scrollToTopBtn.classList.remove("show");
  }
});

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// ============================
// 🚀 Запуск
// ============================
document.addEventListener('DOMContentLoaded', loadPage);


// Рендер результатів
const renderFormProducts = (products) => {
  const list = document.getElementById('product-list');
  list.innerHTML = '';

  if (products.length === 0) {
    list.innerHTML = '<li>Товарів не знайдено</li>';
    return;
  }

  products.forEach(({ title, price, thumbnail }) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${thumbnail}" alt="${title}" width="100">
      <div>
        <p><strong>${title}</strong></p>
        <p>Ціна: $${price}</p>
      </div>
    `;
    list.appendChild(li);
  });
};

// Після завантаження DOM — прив'язуємо подію
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('search-form');

  if (!form) {
    console.error('Форма з id="search-form" не знайдена!');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = e.target.elements.query.value;
    const products = await getProductsByForm(query);
    renderProducts(products);
  });
});
import {
  getCategoriesItem,
  getProductsByForm
 } from './products-api';
import { refs } from './refs';


export const renderProducts = (products) => {
  const markup = products
    .map(product => `
      <li class="products__item" data-id="${product.id}">
        <img class="products__image" src="${product.thumbnail}" alt="${product.title}" />
        <p class="products__title">${product.title}</p>
        <p class="products__brand"><span class="products__brand--bold">Brand:</span> ${product.brand}</p>
        <p class="products__category">Category: ${product.category}</p>
        <p class="products__price">Price: $${product.price}</p>
      </li>
    `)
    .join('');

  refs.productsList.innerHTML = markup;
};

export const renderCategories = (categories) => {
  

    return categories
      .map(category => `
        <li class="categories__item">
          <button class="categories__btn" type="button" data-category="${category}">
            ${category}
          </button>
        </li>
      `)
      .join('');

   
  
};

export function scrollToNewContent() {
  const firstCard = document.querySelector(".products__item");
  if (firstCard) {
    const cardHeight = firstCard.getBoundingClientRect().height;
    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
  }
}

export function clearGallery() {
  refs.productsList.innerHTML = "";
}

export function showLoader() {
  refs.loader.style.display = "flex";
}

export function hideLoadMoreButton() {
  const loadMoreBtn = document.querySelector(".load-more");
  if (loadMoreBtn) {
    loadMoreBtn.classList.remove("is-visible");
  }
}

export function showLoadMoreButton() {
  const loadMoreBtn = document.querySelector(".load-more");
  if (loadMoreBtn) {
    loadMoreBtn.classList.add("is-visible");
  }
}

export function searchForm() { 
  const input = form
}


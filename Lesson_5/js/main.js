"use strict";

const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({
  el: '#app',
  data: {
    products: [],
    isFilterOn: false,
    filteredProducts: [],
    showCart: false,
    productsInCart: [],
    imgCatalog: 'https://placehold.it/200x150',
    searchString: ''
  },
  methods: {
    request(url) {
      return fetch(`${API}/${url}`)
        .then(result => result.json())
        .catch(error => {
          console.log(error)
        });
    },

    addToCart(product) {
      const object = this.findProductInCart(product.id_product);
      if (object) {
        object.quantity++;
      } else {
        let newProduct = Object.assign({quantity: 1}, product);
        this.productsInCart.push(newProduct);
      }
    },


    findProductInCart(productId) {
      const index = this.productsInCart.findIndex(product => product.id_product === productId);
      if (index !== -1) {
        return this.productsInCart[index];
      } else {
        return false;
      }
    },
    filterProduct(string){
      this.isFilterOn = true;
      const regexp = new RegExp(string, 'i');
      this.filteredProducts = this.products.filter(good => regexp.test(good.product_name));
    },

    isFounded(product) {
      const index = this.filteredProducts.findIndex(prod => {
        return product.id_product === prod.id_product;
      });
      return (index !== -1);
    }
  },

  computed: {
    calculateCartQuantity() {
      let sum = 0;
      if (this.productsInCart.length !== 0) {
        return this.productsInCart.reduce((accumulator, value = 0) => {
          return accumulator + value.quantity;
        }, sum);
      }
    },

    calculateCartSum() {
      let sum = 0;
      if (this.productsInCart.length !== 0) {
        return this.productsInCart.reduce((accumulator, value = 0) => {
          return accumulator + value.quantity * value.price;
        }, sum);
      }
    },

  },
  mounted() {
    this.request('catalogData.json')
      .then(data => {
        for (let el of data) {
          this.products.push(el);
        }
      });
    this.request('getBasket.json')
      .then(data => {
        for (let el of data['contents']) {
          this.productsInCart.push(el);
        }
      });
  }
});

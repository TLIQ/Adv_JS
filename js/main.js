Vue.component('search', { 
  data() {
    return {
      query: ''
    }
  },
  template: `
<div class="container">
    <form class="mb-5 form-inline" @submit.prevent="$parent.$refs.products.filter(query)" >
        <i class="fas fa-search" aria-hidden="true"></i>
        <input class="form-control form-control-sm ml-3 w-75" v-model="query" type="text" placeholder="Search" aria-label="Search">
    </form>
</div>
  `
});

Vue.component('cart', {
  data: function () {
    return {
      products: [],
    }
  },
  methods: {
    add(item) {
      let existed = this.products.find(el => el.id_product === item.id_product);
      if (existed) {
        this.$parent.fetch(`cart/${existed.id_product}`, data => {
          if (data.result === 1) {
            existed.quantity++;
            existed.price += item.price;
          }
        }, 'put', {quantity: 1});
      } else {
        let product = Object.assign({quantity: 1}, item);
        this.$parent.fetch('cart', data => {
          if (data.result === 1) {
            this.products.push(product);
          }
        }, 'post', product);
      }
    },
    remove(item) {
      this.$parent.fetch(`cart/${item.id_product}`, data => {
        if (data.result === 1) {
          if (item.quantity > 1) {
            item.quantity--;
          } else {
            this.products.splice(this.products.indexOf(item), 1);
          }
        }
      }, 'delete');
    },
    total() {
      return this.products.reduce((acc, item) => acc + item.price, 0);
    },
  },
  created() {
    this.$parent.fetch('cart', data => {
      this.products = data.contents;
    });
  },
  template: `
<li class="nav-item dropdown">
  <a class="nav-link" href="#" role="button" data-toggle="dropdown">
    <i class="fas fa-shopping-basket text-warning"></i>&nbsp;Корзина<span class="caret"></span>
  </a>
  <ul class="cart dropdown-menu">
    <span class="cart-item dropdown-item" href="#" v-for="product in products" :product="product" :key="product.id_product">
      {{ product.product_name }}&nbsp;
      <span class="badge badge-warning">{{ product.price }}</span>&nbsp;руб.&nbsp;
      <span>{{ product.quantity }}</span>&nbsp;шт.&nbsp;
      <button class="remove btn btn-danger btn-sm" @click="remove(product)">x</button>
    </span>
    <span class="dropdown-item" v-if="products.length">Всего&nbsp;на:&nbsp;<span class="badge badge-info">{{ total() }}</span>&nbsp;руб.</span>
    <span class="dropdown-item" v-else>Корзина пуста</span>
  </ul>
</li>
  `
});

Vue.component('products', {
  data: function () {
    return {
      products: [],
      filtered: []
    }
  },
  methods: {
    filter(query) {
      this.filtered = this.products.filter(item => {
        return query ? item.product_name.toLowerCase().includes(query) : true;
      });
    },
  },
  created() {
    this.$parent.fetch('products', data => {
      this.products = this.filtered = data;
    });
  },
  template: `
<div class="container">
  <div class="products row">
    <div class="col-lg-4 col-md-6 mb-4" v-for="product in filtered" :product="product" :key="product.id_product">
      <div class="card h-100">
        <a class="img-wrap" href="#"><img class="card-img-top" src="https://placehold.it/200x150"></a>
        <div class="card-body">
          <h5 class="card-title"><a class="text-info" href="#">{{ product.product_name }}</a></h5>
          <h5>{{ product.price }}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary" @click="$parent.$refs.cart.add(product)"><i class="fa fa-plus"></i>&nbsp;Добавить</button>
        </div>
      </div>
    </div>
  </div>
</div>
`
});

Vue.component('errors', {
  data: function () {
    return {
      messages: [],
    }
  },
  template: `
<div class="container">
  <div class="row" v-for="message in messages">
    <div class="alert alert-primary alert-dismissible fade show" role="alert">{{ message }}<button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button></div>
  </div>
</div>
`
});

new Vue({
  el: '#app',
  methods: {
    fetch(url, func, method = 'get', obj = {}) {
      let body = method !== 'get' ? {body: JSON.stringify(obj)} : {};
      return fetch(url, {
        method: method.toUpperCase(),
        headers: {"Content-Type": "application/json"}, ...body
      }).then(result => result.json())
        .then(data => func(data))
        .catch(error => this.$refs.errors.messages.push(error.toString()));
    },
  },
});

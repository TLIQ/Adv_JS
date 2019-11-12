Vue.component('searchform', {
  data(){
    return{
      userSearch:""
    }
  },
  template:`
    <div class="catalogFilter">
      <form action="#" method="post" class="search-form" @submit.prevent="$root.$refs.products.filter(userSearch)">
        <input type="text" class="search-field" v-model="userSearch">
        <input class="btn-search" type="submit" value="search">
      </form>
    </div>
  `
});

<script setup lang="ts">
import SiteHeader from '@/components/Header.vue'
import SiteFooter from '@/components/Footer.vue'
import {onMounted } from 'vue'
import {RouterLink, RouterView } from 'vue-router'
import HelloWorld from '@/components/HelloWorld.vue'
// import "bootstrap/dist/css/bootstrap.min.css"
// import "bootstrap"
import "@/assets/scss/modelelectronics.scss";
import {CustomerModel} from './types/models';
import {useAuthStore} from './stores/auth-store';
import { computed } from '@vue/reactivity'


const store = useAuthStore();
const customerNumber = computed(() => store.customerNumber);
const email = computed(() => store.email);
const customerName = computed(() => store.name);

onMounted(() => {
  //store.authenticate('109541', 'retail', true);
});



</script>

<template>
  <SiteHeader></SiteHeader>
  <div id="mainBody"> 
    <div class="container-xxl">
      <div class="row">
        <div class="col-md-12">
          <RouterView />
        </div>
      </div>    
    </div>
  </div>
  <SiteFooter></SiteFooter>
  <vue-progress-bar></vue-progress-bar>
</template>

<style>
/* @import '@/assets/base.css'; */

#mainBody {
  max-width: 1440px;
  margin: 0 auto;
  /* padding: 0 2rem 2rem 2rem; */
  font-weight: normal;
}

main {
  margin: 0 auto;
}

.header {
  line-height: 1.5;
  max-height: 100vh;  
}

.logo {
  display: block;
  margin: 0 2rem 0 0;
}

a {
  text-decoration: none;  
  transition: 0.4s;
}

#userProfileBlock {
  margin-bottom: 1.5rem;
  text-align: left;
}

@media (hover: hover) {
  /* a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);    
  } */
}

nav {
  width: 100%;
  font-size: 13px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  body {
    /* display: flex;
    place-items: center; */
  }

  #mainBody {
    /* display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 2rem 0 2rem; */
    min-height: 50vh;
  }

  .header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
    margin-bottom: 3rem;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>

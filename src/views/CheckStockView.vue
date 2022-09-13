<script setup lang="ts">

import { reactive, watch, ref } from 'vue'
import { useToast } from "vue-toastification";
import { useAuthStore } from '@/stores/auth-store';

const toast = useToast();
const store = useAuthStore();

const item = reactive({
  partNumber: '',
  description: '',
  price: ''
});

async function checkStock() {
  console.log('checking stock...');
}

</script>

<template>
  <main>
    <h1>Check Stock</h1>
    <div class="container">
      <div>
        <slot name="header"></slot>
        
        <br />
        <p>
        <form>          
          <div class="mb-3">
            <label for="partNumber" class="form-label">Part Number</label>
            <input type="text" class="form-control" id="partNumber" aria-describedby="partNumberHelp" v-model="item.partNumber" />
            <div id="partNumberHelp" class="form-text">Enter a part number</div>
          </div>
          <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <input type="text" class="form-control" id="description" v-model="item.description" />
          </div>
          <div class="mb-3">
            <label for="age" class="form-label">Advanced Exchange Price</label>
            <input type="number" class="form-control" id="age" v-model.number="item.price">
          </div>                 
          <div class="row justify-content-evenly">
            <button type="button" class="btn btn-primary col-4" @click="checkStock">Check Stock</button>            
          </div>
        </form>
        </p>
      </div>
    </div>
  </main>
</template>

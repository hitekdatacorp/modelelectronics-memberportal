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
      <main class="adv-exchange">
        <RouterView />
      </main>
    </template>
    
    
    <style lang="scss">
    main.adv-exchange {
      // max-width: 900px;
    }
    </style>
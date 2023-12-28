<script setup lang="ts">

    import { reactive, watch, ref, onMounted } from 'vue'
    import { useToast } from "vue-toastification";
    import { useAuthStore } from '@/stores/auth-store';
    import IconCloseXBlack from '../components/icons/IconCloseXBlack.vue';
    
    const toast = useToast();
    const store = useAuthStore();    
    const item = reactive({
      partNumber: '',
      description: '',
      price: ''
    });
    
    let showLoginMessage = ref(false);

    onMounted(() => {
      if(store.getShowLoginMessage) {
        showLoginMessage.value = true;
        store.setShowLoginMessage(false); // only show this message once.
      }
    });

    async function checkStock() {
      console.log('checking stock...');
    }
    
    </script>
    
    <template>
      <main class="adv-exchange">
        <RouterView /> 


        <vue-final-modal v-model="showLoginMessage" classes="modal-container" content-class="modal-content" >
          <button class="modal__close" @click="showLoginMessage = false">
            <IconCloseXBlack />
          </button>

          <span class="modal__title">***** ATTENTION DEALERS *****</span>
          <div class="modal__content">
            <p class="purchase-box">
            <div>
              <label>GM Order Change Effective January 1, 2024</label>
            </div>          
            </p>
            <p style="margin-top: 2em; text-align: center;">
              Per GM bulletin GCUS-9-15478, "Dealers will now
              order and pay for electronic exchange parts upfront
              and receive their approved parts markup based on the
              list prices that will be published in GM's Electronic
              Parts Catalog upon submission of a claim."
            <div style="width: fit-content; margin: 0 auto;">            
            </div>
            </p>
          </div>
        </vue-final-modal>
      </main>
    </template>
    
    
    <style lang="scss">
    main.adv-exchange {
      // max-width: 900px;
    }
    </style>

<style lang="scss" scoped>
:deep(.modal-container) {
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 1;
}

:deep(.modal-content) {
  max-width: 800px;
  // min-height: 400px;
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: #FFFFFF 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 10px #00000029;
}

p.purchase-box {
  background-color: #F0F4FA;
  margin: 0 auto;
  width: fit-content;
  padding: 1.5em 3em;
  background: #F0F4FA 0% 0% no-repeat padding-box;
  opacity: 1;

  label {
    text-align: left;
    font: normal normal bold 0.8rem/1.1rem Inter-Bold;
    letter-spacing: 0px;
    color: #000000;
    text-transform: uppercase;
    opacity: 0.54;
  }

  .price {
    text-align: center;
    font-family: Inter-Bold;
    font-size: 2em;
  }
}

.modal__title {
  text-align: center;
  font: normal normal bold 24px/33px Inter-Bold;
  letter-spacing: 0px;
  opacity: 1;
  margin: 2em 2rem 2rem 0;

}

.modal__close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import LoadingComponent from '@/components/LoadingComponent.vue';
import type { IBackOrderedPart } from '@/types/models';
import { getNissanBackOrderedParts } from '@/services/inventory-service';

const toast = useToast();
const store = useAuthStore();

let backOrderedParts = ref<Array<IBackOrderedPart>>([]);
let loaded = ref(false);
let isLoading = ref(false);

onMounted(async () => {
  if (store.salesRep) {
    try{
      isLoading.value = true;
      backOrderedParts.value = await getNissanBackOrderedParts(store.salesRep!);
      loaded.value = true;
    } catch(e) {
      toast.error('An error occurred while loading back ordered parts. Please contact the systme administrator.');
    } finally {
      isLoading.value = false;
    }    
  }
  
});
</script>


<template> 

  <main class="history-main">
    <div class="row">
     
      <div class="col history-form-main">
        <div class="top-space">

          <h4 v-if="loaded && !backOrderedParts.length">There are no parts on back order at this time.</h4>
          
        </div>
   
        <div class="bottom-space" v-if="loaded && backOrderedParts.length">
          <table class="table table-striped invoice-table">
            <thead>
              <tr>
                <th scope="col">Record</th>
                <th>Part Number</th>
                <th>Qty on Back Order</th>
                <th>Supplier Ship Date to {{ store.salesRep }}</th>               
              </tr>
            </thead>
            <tbody>
              <tr v-for="(part, index) in backOrderedParts" :key="part.partNumber">
                <th scope="row">{{ index+1 }}</th>
                <td>{{ part.friendlyPartNumber }}</td>                
                <td>{{ part.qtyOnBackOrder }}</td>
                <td>{{ part.expectedDeliveryDate ?? '' }}</td>              
              </tr>
            </tbody>
          </table>
        </div>

        <LoadingComponent v-if="isLoading" view-box="0 0 700 500"></LoadingComponent>
      </div>
    </div>
  </main>

</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';


.invoice-table {
  thead {
    tr {
      th {
        height: 60px;
        /* UI Properties */
        background: #002050 0% 0% no-repeat padding-box;
        opacity: 1;
        color: white;
        vertical-align: middle;
        font-family: Inter-Bold;
        font-weight: bold;
      }
    }
  }
}






.history-main {
  min-height: 50vh;
  //max-width: 700px;
  margin: 0 auto;

}


.history-form-main {
  background-color: $secondary-background;
  padding: 1rem 4rem 1rem 2rem;

  .top-space {
    padding: 1rem 0;
    display: flex;

    h4 {
      flex-grow: 1;
    }
  }

  .form-section {
    padding: 1.8rem;
    margin-bottom: 1em;
    background: #FFFFFF 0% 0% no-repeat padding-box;
    box-shadow: 0px 0px 10px #00000029;
    opacity: 1;

    .form-section-header {
      .over-score {
        width: 70px;
        border-top: 4px solid $primary;
      }
    }
  }
}



</style>

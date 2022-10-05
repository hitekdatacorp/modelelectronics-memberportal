<script setup lang="ts">

import { toNumber } from 'lodash';
import { reactive, watch, ref, computed } from 'vue'
import router from '@/router';
import { useToast } from "vue-toastification";
import { useAuthStore } from '@/stores/auth-store';
import type { ItemAvailabilityResult } from '@/types/models';
import InStockIcon from '../components/InStock.vue';
import { toCurrencyString } from '@/helpers/formatters';
import { getItemAvailability, getItemAvailabilityForPurchase } from '@/services/inventory-service';
import NotificationCard from '../components/NotificationCard.vue';
import OutOfStockIcon from '../components/OutOfStock.vue';
import LoadingComponent from '../components/LoadingComponent.vue';
import PartCard from '../components/PartCard.vue';

const toast = useToast();
const store = useAuthStore();

let showSearchResult = ref(false);
const partNumberSearchText = ref('');

let searchResult = ref<ItemAvailabilityResult | null>(null);

const isLoading = ref(false);
const isLoadingAlternates = ref(false);
const alternatesSearchResults = ref<Array<ItemAvailabilityResult>>([]);

async function checkStock(e: Event) {
  e.preventDefault();
  console.log('checking stock...');
  isLoading.value = true;
  try {
    let itemResult = await getItemAvailability(partNumberSearchText.value);

    showSearchResult.value = true;
    searchResult.value = itemResult;

    isLoading.value = false;

    if(!searchResult.value?.exchangeAvailability?.isInStock && searchResult.value?.alternateItems?.length){
      // perform a 'getItemAvailability' lookup for each alternate item
      isLoadingAlternates.value = true;
      for(const partNumber of searchResult.value.alternateItems){
        let altResult = await getItemAvailability(partNumber);
        alternatesSearchResults.value.push(altResult);
      }
      isLoadingAlternates.value = false;
    } else {
      alternatesSearchResults.value = [];
    }
  } catch (err) {

  } finally {
    isLoading.value = false;
    isLoadingAlternates.value = false;
  }
}

</script>

<template>
  <main class="checkstock-form">
    <h4>Check Part Availability and Price</h4>
    <div class="container">

      <div class="row">
        <form @submit.prevent="checkStock">
          <div class="input-group mb-3">
            <!-- <label for="partNumber" class="form-label">Part Number</label> -->
            <input type="text" class="form-control" id="partNumber" aria-describedby="partNumberHelp"
              aria-label="Enter a part number" v-model="partNumberSearchText" placeholder="Enter a part number" />
            <input type="submit" class="btn btn-primary input-group-text" value="Search" />
          </div>
        </form>
      </div>

      <div class="row pb-2 pt-2" v-if="showSearchResult">
        <div class="col-12 search-results">
          <h5 v-if="!searchResult?.itemExists">We couldn't find <b>part # {{partNumberSearchText}}</b>            
          </h5>
          <h5 v-if="searchResult?.itemExists">We found 1 matching part</h5>          
        </div>
      </div>

      <div class="row ">
        <LoadingComponent v-if="isLoading" view-box="0 0 300 500"></LoadingComponent>
        <PartCard v-bind:item-avail="searchResult" :showPurchaseAndExchangeButtons="true"></PartCard>       
      </div>

      <div class="row pt-4" v-if="showSearchResult">
        <div class="col-12 search-results">         
          <h5 v-if="searchResult?.itemExists && searchResult.alternateItems?.length">The top item is out of stock. You may order any of the alternate parts listed below as well.</h5>
        </div>
      </div>
      
      
      <LoadingComponent v-if="isLoadingAlternates" view-box="0 0 300 500"></LoadingComponent>
      <div class="row pt-4" v-for="itemAvail in alternatesSearchResults">
        
        <PartCard  :key="itemAvail.item?.itemNumber" v-bind:item-avail="itemAvail"></PartCard>
      </div>

    </div>
  </main>
</template>


<style lang="scss">
main.checkstock-form {

  max-width: 700px;
  padding-top: 2rem;

  .input-group {
    justify-content: center;
  }

  #partNumber {
    max-width: 600px;
  }

  >h4 {
    text-align: center;
  }
}

h4,
h5 {
  text-align: center;
}
</style>
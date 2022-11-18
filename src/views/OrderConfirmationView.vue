<script setup lang="ts">

import PartCardMini from '@/components/PartCardMini.vue';
import { getItemAvailability } from '@/services/inventory-service';
import { useAuthStore } from '@/stores/auth-store';
import type { OrderType } from '@/types/enumtypes';
import type { ItemAvailabilityResult } from '@/types/models';
import { onMounted, ref } from 'vue';

const props = defineProps<{
    partNumber: string,
    orderType: OrderType,
    orderId: number
}>();



// const store = useAuthStore();
// let searchResult = ref<ItemAvailabilityResult | null>(null);

// onMounted( async () => {
//     let itemResult = await getItemAvailability(props.partNumber);
//     searchResult.value = itemResult;  
// });


</script>

<template>
  <main class="order-confirmation">
    <h3>Your order has been placed</h3>
    <div style="width: 100%; text-align: center;">
      
    </div>
    <div style="width: 100%; text-align: center;">
      <br/>
      Your order confirmation number is: <span style="font-weight: bold">{{props.orderId}}</span>
      <br/><br/>
      You should receive a confirmation email shortly.
    </div>
 
  </main>
</template>


<style lang="scss" scoped>
@import '@/assets/scss/variables';

.order-confirmation {
  min-height: 50vh;
  padding-top: 2rem;

  &>div,
  &>h3 {
    width: 100%;
    // text-align: center;
  }

  h3 {
    width: 100%;
    text-align: center;
  }


}

</style>

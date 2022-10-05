<script setup lang="ts">
import { toCurrencyString } from '@/helpers/formatters';
import type { ItemAvailabilityResult } from '@/types/models';
import { computed, ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth-store';
import router from '@/router';
import NotificationCard from '../components/NotificationCard.vue';
import OutOfStockIcon from '../components/OutOfStock.vue';
import InStockIcon from '../components/InStock.vue';

type Props = {
    itemAvail: ItemAvailabilityResult | null,
    showPurchaseAndExchangeButtons?: boolean
}

const props = defineProps<Props>();
let itemAvail = ref(props.itemAvail);
const store = useAuthStore();

watch(props, (newProps, oldProps) => {    
    itemAvail.value = newProps.itemAvail;
});

let availMessage = computed(() => {
    if (itemAvail.value && itemAvail.value?.exchangeAvailability?.isInStock) {
        return "Is In Stock";
    } else if (itemAvail.value?.showOnBackorderMessage()) {
        return "Available on Backorder";
    }
    return "";
});
let partImageSrc = computed(() => {
    if (itemAvail.value?.item?.itemNumber) {
        return `http://localhost/modelimages/${itemAvail.value?.item.itemNumber}.jpg`;
    }
    return '';
});
let exchangePartPriceText = computed(() => {
    if (itemAvail.value?.exchangeAvailability?.partPriceMessage) {
        return itemAvail.value?.exchangeAvailability.partPriceMessage;
    } else if (itemAvail.value?.item?.price) {
        return toCurrencyString(itemAvail.value?.item.price || 0);
    }
    return '';
});
let purchasePartPriceText = computed(() => {
    if ( itemAvail.value?.purchaseAvailability?.partPriceMessage) {
        return itemAvail.value?.purchaseAvailability?.partPriceMessage;
    } else if (itemAvail.value?.item?.retailPrice) {
        return toCurrencyString(itemAvail.value?.item.retailPrice || 0);
    }
    return '';
});



async function exchangePart() {
  console.log('transitioning to exchange order form.');

  router.push({ name: 'order', params: { partNumber: itemAvail.value?.item?.itemNumber } });
}

async function purchasePart() {
  console.log('transitioning to purchase order form.');
}


</script>


<template>
    <div class="part-card" v-if="itemAvail && itemAvail.item">
        <div class="part-card-header">
            <h4>Part # {{itemAvail.item.itemNumber}}</h4>
            <hr />
        </div>
        <div class="part-card-body">
            <div class="row pb-4">
                <div class="col">
                    <div class="row pb-4" v-show="itemAvail.exchangeAvailability?.isInStock">
                        <div class="col-12">
                            <InStockIcon :in-stock-message="availMessage" />
                        </div>
                    </div>
                    <div class="row pb-4" v-show="!itemAvail.exchangeAvailability?.isInStock">
                        <div class="col-12">
                            <OutOfStockIcon />
                        </div>
                    </div>
                    <div class="row pb-4">
                        <label>Description</label>
                        <div>{{itemAvail.item.itemDescription1}}</div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <label>Manufacturer</label>
                            <div>{{store.profile?.customer?.dealerManufacturer}}</div>
                        </div>
                        <div class="col">
                            <label>Year Range</label>
                            <div>{{itemAvail.yearRange}}</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-5">
                    <img class="part-image" width="250" height="" :src="partImageSrc" />
                </div>
            </div>
            <div class="row pb-4" v-if="itemAvail?.mileageToBeSetAtDealership">
                <div class="col-12">
                    <NotificationCard>
                        <span>Mileage is to be set at the dealership. If you need us to set the Odometer, please request
                            this in
                            the comments section on the order page.</span>
                    </NotificationCard>
                </div>
            </div>
            <div class="row pb-4"
                v-if="itemAvail?.isOnBackorder && store.profile?.customer?.dealerManufacturer == 'GM'">
                <div class="col-12">
                    <NotificationCard>
                        <span>
                            <b>This item is on backorder with GM.</b>
                            <span v-if="itemAvail?.estimatedDeliveryDate">GM's estimated release date is:
                                {{itemAvail.estimatedDeliveryDate}}</span>
                            <span v-else> No ETA has been provided.</span>
                        </span>
                    </NotificationCard>
                </div>
            </div>

            <div class="row justify-content-start">
                <div class="col-6 col-md-4">
                    <label>EXCHANGE PRICE</label>
                    <div class="price">{{exchangePartPriceText}}</div>
                    <div v-if="showPurchaseAndExchangeButtons"><button type="button" class="btn btn-primary" @click="exchangePart()"
                            v-show="itemAvail.exchangeAvailability?.partPriceMessage === null || itemAvail.exchangeAvailability?.partPriceMessage === ''">Exchange</button>
                    </div>
                </div>
                <div class="col-6 col-md-4">
                    <label>PURCHASE PRICE</label>
                    <div class="price">{{purchasePartPriceText}}</div>
                    <div v-if="showPurchaseAndExchangeButtons"><button type="button" class="btn btn-secondary" @click="purchasePart()"
                            v-show="itemAvail.purchaseAvailability?.partPriceMessage === null || itemAvail.purchaseAvailability?.partPriceMessage === ''">Purchase</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
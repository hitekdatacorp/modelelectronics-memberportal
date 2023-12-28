<script setup lang="ts">
import { toCurrencyString } from '@/helpers/formatters';
import type { ItemAvailabilityResult } from '@/types/models';
import { computed, ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth-store';
import NotificationCard from '../components/NotificationCard.vue';
import OutOfStockIcon from '../components/OutOfStock.vue';
import InStockIcon from '../components/InStock.vue';
import { OrderType } from '@/types/enumtypes';
import { useRouter } from 'vue-router';

type Props = {
    itemAvail: ItemAvailabilityResult | null,
    showPurchaseAndExchangeButtons?: boolean,
    isWarrantyExchange?: boolean | null
}

const props = defineProps<Props>();
const store = useAuthStore();
const router = useRouter();
const IMAGES_REPOSITORY_URL: string = import.meta.env.VITE_IMAGE_REPOSITORY_URL;

let itemAvail = ref(props.itemAvail);

watch(props, (newProps, oldProps) => {
    itemAvail.value = newProps.itemAvail;
    thereWasAnImageError.value = false;
});

let availMessage = computed(() => {
    if (itemAvail.value && (itemAvail.value?.exchangeAvailability?.isInStock || itemAvail.value?.purchaseAvailability?.isInStock)) {
        return "Is In Stock";
    } else if (itemAvail.value?.showOnBackorderMessage()) {
        return "Available on Backorder";
    }
    return "";
});


let thereWasAnImageError = ref(false);
let isFirstLoading = ref(true);

let partImageSrc = computed(() => {

    if(thereWasAnImageError.value){
        return '/member/src/assets/images/no-image.png';
    }

    if (itemAvail.value?.item?.itemNumber) {
        return `${IMAGES_REPOSITORY_URL}${itemAvail.value?.item.itemNumber}.jpg`;
    }
    return '';
});

// this function runs when there was an error loading the part Image from the image repository. if there was an error, we replace the image with a 'no image' image.
let replaceWithNoImageImg = function(){
    thereWasAnImageError.value = true;
    isFirstLoading.value = false;
}

let exchangePartPriceText = computed(() => {

    if(props.isWarrantyExchange === true){
        if (itemAvail.value?.exchangeAvailability?.serviceChargePriceMessage) {
            return itemAvail.value?.exchangeAvailability.serviceChargePriceMessage;
        } else if (itemAvail.value?.item?.servicePrice) {
            return toCurrencyString(itemAvail.value?.item.servicePrice || 0);
        }
    } else if(props.isWarrantyExchange === false){
        if (itemAvail.value?.exchangeAvailability?.partChargePriceMessage) {
            return itemAvail.value?.exchangeAvailability.partChargePriceMessage;
        } else if (itemAvail.value?.item?.partsPrice) {
            return toCurrencyString(itemAvail.value?.item.partsPrice || 0);
        }
    }

    return '';
});

let showExchangeButton = computed(() => {
    if(props.isWarrantyExchange === true){
        if (itemAvail.value?.exchangeAvailability?.serviceChargePriceMessage) {
            return false;
        } else if (itemAvail.value?.item?.servicePrice) {
            return true;
        }
    } else if(props.isWarrantyExchange === false){
        if (itemAvail.value?.exchangeAvailability?.partChargePriceMessage) {
            return false;
        } else if (itemAvail.value?.item?.partsPrice) {
            return true;
        }
    }

    return true;
});

let purchasePartPriceText = computed(() => {   
    if (itemAvail.value?.purchaseAvailability?.retailChargePriceMessage) {
        return itemAvail.value?.purchaseAvailability?.retailChargePriceMessage;
    } else if (itemAvail.value?.item?.retailPrice) {
        return toCurrencyString(itemAvail.value?.item.retailPrice || 0);
    }
    return '';
});

let showPurchaseButton = computed(() => {
    if (itemAvail.value?.purchaseAvailability?.retailChargePriceMessage) {
        return false;
    } else if (itemAvail.value?.item?.retailPrice) {
        return true;
    }

    return true;
});

let showRestrictedMessage = function () {
    let s = itemAvail.value?.item.itemStatus;
    return s === "1" || s === "2" || s === "5" || s === "6" || s === "7" || s === "B" || s === "R";
}

async function exchangePart() {
    console.log('transitioning to exchange order form.');

    //router.push({ name: 'orderex', params: { partNumber: itemAvail.value?.item?.itemNumber, orderType: OrderType.Exchange } });

    let url = `/advexchange/order/${OrderType.Exchange}/${itemAvail.value?.item?.itemNumber}?isWarrantyExchange=${props.isWarrantyExchange}`;
    router.push(url);
}

async function purchasePart() {

    console.log('transitioning to purchase order form.');

    //router.push({ name: 'orderpurch', params: { partNumber: itemAvail.value?.item?.itemNumber, orderType: OrderType.Purchase } });

    let url = '';
    if(store.isNissanDealer){
        url = `/speedometer/order/${OrderType.Nissan}/${itemAvail.value?.item?.itemNumber}`;
    } else if(store.isInternationalDealer){

    } else {
        url = `/outrightpurchase/order/${OrderType.Purchase}/${itemAvail.value?.item?.itemNumber}`;
    }

    
    router.push(url);
}

</script>


<template>
    <div class="card part-card" v-if="itemAvail && itemAvail.item">
        <div class="part-card-header">
            <h4>Part # {{ itemAvail.item.itemNumber }}</h4>
            <hr />
        </div>
        <div class="part-card-body">
            <div class="row pb-4">
                <div class="col">
                    <div class="row pb-4" v-show="(!store.isNissanDealer && itemAvail.exchangeAvailability?.isInStock) || (store.isNissanDealer && itemAvail.purchaseAvailability?.isInStock)">
                        <div class="col-12">
                            <InStockIcon :in-stock-message="availMessage" />
                        </div>
                    </div>
                    <div class="row pb-4" v-show="(!store.isNissanDealer && !itemAvail.exchangeAvailability?.isInStock) || (store.isNissanDealer && !itemAvail.purchaseAvailability?.isInStock)">
                        <div class="col-12">
                            <OutOfStockIcon />
                        </div>
                    </div>
                    <div class="row pb-4">
                        <label>Description</label>
                        <div>{{ itemAvail.item.itemDescription1 }}</div>                        
                    </div>
                    <div class="row">
                        <div class="col">
                            <label>Manufacturer</label>
                            <div>{{ store.profile?.customer?.dealerManufacturer }}</div>
                        </div>
                        <div class="col">
                            <label>Year Range</label>
                            <div>{{ itemAvail.yearRange }}</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-5">                    
                    <img id="partImage" v-if="thereWasAnImageError === true" class="part-image" width="250" height="" src="@/assets/images/no-image.png"  />
                    <img id="partImage" v-if="isFirstLoading || thereWasAnImageError === false" class="part-image" width="250" height="" :src="partImageSrc" @error="replaceWithNoImageImg()" />
                </div>
            </div>
            <div class="row pb-4" v-if="showRestrictedMessage()">
                <div class="col-12">
                    <NotificationCard>
                        <span>{{itemAvail.item.itemStatusDescription}}</span>
                    </NotificationCard>
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
                                {{ itemAvail.estimatedDeliveryDate }}</span>
                            <span v-else> No ETA has been provided.</span>
                        </span>
                    </NotificationCard>
                </div>
            </div>

            <div class="row justify-content-start">
                <div class="col-6 col-md-4" v-if="!store.isNissanDealer">
                    <label>EXCHANGE PRICE</label>
                    <div class="price">{{ exchangePartPriceText }}</div>
                    <div v-if="showPurchaseAndExchangeButtons"><button type="button" class="btn btn-primary"
                            @click="exchangePart()"
                            v-show="showExchangeButton">Exchange</button>
                    </div>
                </div>
                <!-- We removed the ability to purchase at Model Electronics Request 2023-09-07 . Only Nissan dealers can purchase-->
                <div class="col-6 col-md-4" v-if="store.isNissanDealer">
                    <!-- PA - we removed showing the purchase price for Nissan dealers at their own request -->
                    <!-- <label>PURCHASE PRICE</label>                     -->
                    <!-- <div class="price">{{ purchasePartPriceText }}</div> -->
                    <div v-if="showPurchaseAndExchangeButtons">
                        <button type="button" class="btn btn-secondary"
                            @click="purchasePart()"
                            v-show="showPurchaseButton">Purchase</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
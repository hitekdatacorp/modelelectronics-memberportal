<script setup lang="ts">import { ref } from 'vue';
import IconFilter from '../components/icons/IconFilter.vue';
import Datepicker from '@vuepic/vue-datepicker';
import * as orderService from '@/services/order-service';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { OrderType } from '@/types/enumtypes';
import LoadingComponent from '@/components/LoadingComponent.vue';
import type { IInvoiceHistoryModel } from '@/types/models';
import { dateTimeToShortDateString } from '@/helpers/formatters';
import IconDocumentViewRed from '../components/icons/IconDocumentViewRed.vue';

const toast = useToast();
const store = useAuthStore();
const router = useRouter();

let orderType = ref(OrderType.Exchange);
if (store.isNissanDealer) {
  orderType.value = OrderType.Nissan;
} else if (store.isInternationalDealer) {
  orderType.value = OrderType.International;
}


let orderDateFrom = ref<Date | null>(null);
let orderDateTo = ref<Date | null>(null);
let orderNumber = ref(null);
let poNumber = ref(null);
let customerName = ref(null);
let isLoading = ref(false);
let showSearch = ref(true);
let orderSearchResults = ref<Array<IInvoiceHistoryModel> | null>(null);
let gridViewType = store.isGMOrOtherDealer ? ref("1") : ref("2");

const IMAGES_REPOSITORY_URL: string = import.meta.env.VITE_IMAGE_REPOSITORY_URL;

let partImageSrc = (partNumber: string, orderNumber: string) => {

  if (imageErrors.value[orderNumber] === true) {
    return '/member/src/assets/images/no-image.png';
  }

  if (partNumber) {
    return `${IMAGES_REPOSITORY_URL}${partNumber}.jpg`;
  }
  return '';
};

let arr: any = {};
let imageErrors = ref(arr);

let arrNotFirstLoading: any = {};
let isNotFirstLoadingArr = ref(arrNotFirstLoading);

// this function runs when there was an error loading the part Image from the image repository. if there was an error, we replace the image with a 'no image' image.
let replaceWithNoImageImg = function (orderNumber: string) {
  imageErrors.value[orderNumber] = true;
  isNotFirstLoadingArr.value[orderNumber] = true;
}

let currentSelectedOrderType = ref('');

async function downloadInvoice(orderNumber: number, orderType: OrderType) {
  try {
    isLoading.value = true;
    let result = await orderService.getOrderInvoiceUrlForDownload(orderNumber, orderType);

    if (result) {

      const anchor = document.createElement("a");
      anchor.href = result.pdfUrl;
      anchor.download = `invoice-${orderNumber}.pdf`;

      document.body.appendChild(anchor);
      anchor.target = '_blank';
      anchor.click();
      document.body.removeChild(anchor);

      //window.open(result.pdfUrl, '_blank');
    } else {
      toast.error('Error downloading invoice.');
    }

    console.debug(result);
  } catch (err) {
    toast.error('Error downloading invoice.');
  } finally {
    isLoading.value = false;
  }
}

async function onSubmit() {
  console.debug('On Submit called...')

  let dateFrom: Date | null = null;
  let dateTo: Date | null = null;
  if (orderDateFrom.value) {
    dateFrom = new Date(orderDateFrom.value);
  }
  if (orderDateTo.value) {
    dateTo = new Date(orderDateTo.value);
  }

  try {
    isLoading.value = true;
    let results = await orderService.getOrderHistory(orderType.value, store.customerNumber!, dateFrom, dateTo, orderNumber.value, poNumber.value, customerName.value);
    //let results = await orderService.getOrderHistory(OrderType.Nissan, store.customerNumber!, dateFrom, dateTo, orderNumber.value, poNumber.value, customerName.value);
    console.debug('Order results...');
    console.debug(results);

    orderSearchResults.value = results;

    if (orderType.value === OrderType.Exchange) {
      currentSelectedOrderType.value = 'exchange';
    } else if (orderType.value === OrderType.Purchase) {
      currentSelectedOrderType.value = 'sales';
    }

  } finally {
    isLoading.value = false;
  }

  // hide the filter and show the results
  showSearch.value = false;
}

</script>


<template>

  <main v-if="showSearch" class="history-search">

    <h3 v-if="store.isGMOrOtherDealer">Select an Order Type</h3>
    <div class="container">
      <div class="row" v-if="store.isGMOrOtherDealer">
        <div class="col order-type" style="display: flex; justify-content: center;">
          <div class="form-check form-check-inline form-radio-button">
            <input type="radio" class="form-check-input" name="orderType" id="rdoExchanges" autocomplete="off" value="2"
              v-model="orderType" />
            <label class="form-check-label" for="rdoExchanges">Exchanges</label>
          </div>
          <div class="form-check form-check-inline form-radio-button">
            <input type="radio" class="form-check-input" name="orderType" id="rdoSales" autocomplete="off" value="1"
              v-model="orderType" />
            <label class="form-check-label" for="rdoSales">Sales</label>
          </div>
        </div>
      </div>

      <div class="row mt-3 mb-3 justify-content-center">
        <div class="card">
          <div class="filter-card-header">
            <div style="width: fit-content;">
              <IconFilter></IconFilter>
              <h4>Filter</h4>
            </div>
          </div>
          <hr />
          <div class="card-body">
            <form @submit.prevent="onSubmit">
              <div class="row mb-3">
                <div class="col-12">
                  <label for="orderDate" class="form-label">Order Date</label>
                  <div class="row">
                    <div class="col-6">
                      <Datepicker id="orderDateFrom" name="orderDateFrom" v-model="orderDateFrom" utc
                        :format="dateTimeToShortDateString" autoApply placeholder="From (DD/MM/YY)" />
                    </div>
                    <div class="col-6">
                      <Datepicker id="orderDateTo" name="orderDateTo" v-model="orderDateTo" utc
                        :format="dateTimeToShortDateString" autoApply placeholder="To (DD/MM/YY)" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-6">
                  <label for="orderNumber" class="form-label">Order Number</label>
                  <input type="text" class="form-control" id="orderNumber" name="orderNumber" v-model="orderNumber" />
                </div>
                <div class="col-6">
                  <label for="poNumber" class="form-label">PO Number</label>
                  <input type="text" class="form-control" id="poNumber" name="poNumber" v-model="poNumber" />
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-12">
                  <label for="customerName" class="form-label">Customer Name</label>
                  <input type="text" class="form-control" id="customerName" name="customerName"
                    v-model="customerName" />
                </div>
              </div>
              <div class="row">
                <input type="submit" class="btn btn-primary" value="Search" />
              </div>
            </form>
          </div>
          <LoadingComponent v-if="isLoading" view-box="0 0 700 500"></LoadingComponent>
        </div>
      </div>
    </div>
  </main>

  <main v-if="!showSearch" class="history-main">
    <div class="row">
      <div class="col-md-2 history-sidebar justify-content-center">
        <div class="container">

          <div class="row mt-3 mb-3 justify-content-center">
            <div class="">
              <div class="filter-card-header">
                <div style="width: fit-content;">
                  <IconFilter></IconFilter>
                  <h4>Filter</h4>
                </div>
              </div>
              <hr />
              <div class="row" v-if="store.isGMOrOtherDealer">
                <div class="col order-type" style="display: flex; justify-content: center;">
                  <div class="form-check form-check-inline form-radio-button">
                    <input type="radio" class="form-check-input" name="orderType" id="rdoExchanges" autocomplete="off"
                      value="2" v-model="orderType" />
                    <label class="form-check-label" for="rdoExchanges">Exchanges</label>
                  </div>
                  <div class="form-check form-check-inline form-radio-button">
                    <input type="radio" class="form-check-input" name="orderType" id="rdoSales" autocomplete="off"
                      value="1" v-model="orderType" />
                    <label class="form-check-label" for="rdoSales">Sales</label>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <form @submit.prevent="onSubmit">
                  <div class="row mb-3">
                    <div class="col-12">
                      <label for="orderDate" class="form-label">Order Date</label>
                      <div class="row">
                        <div class="col-12">
                          <Datepicker id="orderDateFrom" name="orderDateFrom" v-model="orderDateFrom" utc
                            :format="dateTimeToShortDateString" autoApply placeholder="From (DD/MM/YY)" />
                        </div>
                        <div class="col-12">
                          <Datepicker id="orderDateTo" name="orderDateTo" v-model="orderDateTo" utc
                            :format="dateTimeToShortDateString" autoApply placeholder="To (DD/MM/YY)" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row mb-3 gy-3">
                    <div class="col-12">
                      <label for="orderNumber" class="form-label">Order Number</label>
                      <input type="text" class="form-control" id="orderNumber" name="orderNumber"
                        v-model="orderNumber" />
                    </div>
                    <div class="col-12">
                      <label for="poNumber" class="form-label">PO Number</label>
                      <input type="text" class="form-control" id="poNumber" name="poNumber" v-model="poNumber" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <div class="col-12">
                      <label for="customerName" class="form-label">Customer Name</label>
                      <input type="text" class="form-control" id="customerName" name="customerName"
                        v-model="customerName" />
                    </div>
                  </div>
                  <div class="row">
                    <input type="submit" class="btn btn-primary" value="Search" />
                  </div>
                </form>
              </div>
              <LoadingComponent v-if="isLoading" view-box="0 0 700 500"></LoadingComponent>
            </div>
          </div>
        </div>
      </div>
      <div class="col history-form-main">
        <div class="top-space">
          <h4>{{ orderSearchResults?.length }} {{ currentSelectedOrderType }} invoices found</h4>
          <div>
            <div class="form-check form-check-inline form-radio-button">
              <input type="radio" class="form-check-input" name="historyViewType" id="rdoGridView" autocomplete="off"
                value="1" v-model="gridViewType" />
              <label class="form-check-label btn-gridview" for="rdoGridView">GRID VIEW</label>
            </div>
            <div class="form-check form-check-inline form-radio-button">
              <input type="radio" class="form-check-input" name="historyViewType" id="rdoListView" autocomplete="off"
                value="2" v-model="gridViewType" />
              <label class="form-check-label btn-listview" for="rdoListView">LIST VIEW</label>
            </div>
          </div>
        </div>

        <div class="grid-view bottom-space" v-if="gridViewType === '1' && !isLoading">

          <div class="invoice-grid-box" v-for="order of orderSearchResults" :key="order.orderNumber">
            <div class="invoice-header">
              <div>
                <label>ORDER DATE &nbsp;</label>
                <span>{{ dateTimeToShortDateString(order.orderDate) }}</span>
              </div>
              <div>
                <label>ORDER # &nbsp;</label>
                <span>{{ order.orderNumber }}</span>
              </div>
            </div>
            <div class="invoice-body row">
              <div class="col-xxl-3 d-flex justify-content-center">

                <img id="partImage" v-if="imageErrors[order.orderNumber] === true" class="part-image" height=""
                  src="@/assets/images/no-image.png" />
                <img id="partImage"
                  v-if="!isNotFirstLoadingArr[order.orderNumber] || imageErrors[order.orderNumber] === false"
                  class="part-image" height="" :src="partImageSrc(order.itemNumber, order.orderNumber.toString())"
                  @error="replaceWithNoImageImg(order.orderNumber.toString())" />

                <!-- <img class="part-image" height="" :src="partImageSrc(order.itemNumber, order.orderNumber.toString())" @error="replaceWithNoImageImg(order.orderNumber.toString())"
                v-if="currentSelectedOrderType === 'exchange'" /> -->
              </div>
              <div class="col-xxl-6">
                <div class="row pb-3">
                  <span class="part-title">{{ order.partDescription }}</span>
                </div>
                <div class="row pb-3">
                  <div class="col-5">
                    <label>Customer Name</label>
                    <div>{{ order.customerName }}</div>
                  </div>
                  <div class="col">
                    <label>RO#</label>
                    <div>{{ order.roNumber ? order.roNumber : 'N/A' }}</div>
                  </div>
                  <div class="col">
                    <label>PO#</label>
                    <div>{{ order.poNumber ? order.poNumber : 'N/A' }}</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-3">
                    <label>Ship Date</label>
                    <div>{{ order.shipDate && dateTimeToShortDateString(order.shipDate) || 'N/A' }}</div>
                  </div>                 
                  <div class="col">
                    <label>Tracking Number</label>
                    <div><a :href="orderService.getOrderTrackingUrl(order.trackingNumber)"
                        target="_blank">{{ order.trackingNumber }}</a></div>
                  </div>
                  <div class="col-3" v-if="currentSelectedOrderType === 'exchange'">
                    <label>Core Status</label>
                    <div>{{ order.coreReturnedDate !== null ? 'Returned' : 'Pending'}}</div>
                  </div>                  
                </div>

              </div>
              <div class="col-xxl-3 d-flex justify-content-xl-right justify-content-center align-items-start" v-if="!store.isNissanDealer && order?.shipDate">
                <!-- <a :href="orderService.getOrderInvoiceUrl(order?.orderNumber, orderType)"
                  class="btn btn-primary btn-invoice" target="_blank">View Invoice</a> -->
                  <button @click="downloadInvoice(order?.orderNumber, orderType)"
                  class="btn btn-primary btn-invoice">View Invoice</button>
              </div>
            </div>
          </div>
        </div>

        <div class="bottom-space" v-if="gridViewType === '2' && !isLoading">
          <table class="table table-striped invoice-table">
            <thead>
              <tr>
                <th scope="col">Order Date</th>
                <th>Order #</th>
                <th>Part Ordered</th>
                <th>RO#</th>
                <th>PO#</th>
                <th>Customer Name</th>
                <th>Ship Date</th>
                <th v-if="currentSelectedOrderType === 'exchange'">Core Status</th>
                <th>Tracking #</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order of orderSearchResults" :key="order.orderNumber">
                <th scope="row">{{ dateTimeToShortDateString(order.orderDate) }}</th>
                <td v-if="store.isGMOrOtherDealer && order.shipDate">
                  <a href="" @click.prevent="downloadInvoice(order.orderNumber, orderType)">{{ order.orderNumber }}</a>                   
                </td>
                <td v-else>{{ order.orderNumber }}</td>
                <td>{{ order.itemNumber }}</td>
                <td>{{ order.roNumber }}</td>
                <td>{{ order.poNumber }}</td>
                <td>{{ order.customerName }}</td>
                <td>{{ order.shipDate && dateTimeToShortDateString(order.shipDate) || 'N/A' }}</td>
                <td v-if="currentSelectedOrderType === 'exchange'">{{ order.coreReturnedDate !== null ? 'Returned' :
                    'Pending'
                }}</td>
                <td><a :href="orderService.getOrderTrackingUrl(order.trackingNumber)"
                    target="_blank">{{ order.trackingNumber }}</a></td>
                <td><button @click="downloadInvoice(order.orderNumber, orderType)" v-if="!store.isNissanDealer && order.shipDate"
                  style="background-color: transparent; border:none">
                    <IconDocumentViewRed></IconDocumentViewRed>
                </button></td>
              </tr>
            </tbody>
          </table>
        </div>

        <LoadingComponent v-if="isLoading" view-box="0 0 700 500"></LoadingComponent>
      </div>
    </div>
  </main>

</template>

<style lang="scss">
@import '@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss';
</style>

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

.btn-invoice {
  &:before {
    background-image: url('@/assets/icons/icon-document-white.png');
    content: "";
    display: inline-block;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    width: 30px;
    height: 25px;
    position: relative;
    right: 5px;
    top: 6px;
  }
}

.btn-gridview {
  &:before {
    background-image: url('@/assets/icons/icon-grid-gray.png');
    content: "";
    display: inline-block;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    width: 15px;
    height: 15px;
    position: relative;
    right: 5px;
    // top: 6px;
  }
}

.btn-listview {
  &:before {
    background-image: url('@/assets/icons/icon-list-bullet-gray.png');
    content: "";
    display: inline-block;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    width: 15px;
    height: 15px;
    position: relative;
    right: 5px;
    //top: 6px;
  }
}

.invoice-grid-box {
  background: #FFFFFF 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 10px #00000029;
  opacity: 1;
  margin-bottom: 2rem;

  .invoice-header {
    width: 100%;
    background: #002050 0% 0% no-repeat padding-box;
    opacity: 1;
    display: flex;
    padding: 1.75rem;

    font: normal normal bold 15px/18px Inter-Bold;
    letter-spacing: 0px;
    color: #FFFFFF;
    text-transform: uppercase;
    opacity: 1;

    >div {
      width: 50%;
    }

    div:first-child {
      text-align: left;

      >span {
        font-weight: normal;
        font-family: Inter-Regular;
      }
    }

    div:nth-child(2) {
      text-align: right;

      >span {
        font-weight: normal;
        font-family: Inter-Regular;
      }
    }

  }

  .invoice-body {
    min-height: 200px;
    //display: flex;
    padding: 1.5rem;
    //flex-wrap: wrap;

    a {
      text-decoration: underline;
    }

    .part-image {
      width: 250px;
    }

    @media screen and (max-width: 950px){
      .part-image {
        width: 250px;
      }
    }

    @media screen and (min-width: 951px) and (max-width: 1399px) {
      .part-image {
        width: 350px;
      }

    }

    >div:first-child {
      min-width: 250px;
    }

    >div:nth-child(2) {
      // width: 100%;
      padding: 1rem;
    }

    label {
      text-align: left;
      font: normal normal bold .8rem/1.1rem Inter-Regular;
      letter-spacing: 0px;
      color: #000000;
      text-transform: uppercase;
      opacity: 0.54;
    }
  }

  .part-title {
    text-align: left;
    font: normal normal bold 1.5rem/1.2rem Inter-Bold;
    letter-spacing: 0px;
    color: #000000;
    opacity: 1;
  }
}

.history-main {
  min-height: 50vh;
  //max-width: 700px;
  margin: 0 auto;

}

.history-sidebar {
  @media (min-width: 768px) {
    min-width: 250px !important;
  }
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

.filter-card-header {
  h4 {
    display: inline-block;
    vertical-align: middle;
    padding-bottom: 0;
    margin-bottom: 0;
    padding-left: 5px;
  }
}


.history-search {
  min-height: 50vh;
  padding-top: 2rem;
  //max-width: 700px;
  margin: 0 auto;

  >h3 {
    width: 100%;
    text-align: center;
    padding: 2rem 0;
  }

  .order-type {
    label {
      font-size: 1.0rem;
      padding: 0.75em 1.5em;
      width: 10rem;
    }
  }

  .card {
    min-height: 400px;
    max-width: 560px;
    padding-bottom: 0;

    h4 {
      display: inline-block;
      vertical-align: middle;
      padding-bottom: 0;
      margin-bottom: 0;
      padding-left: 5px;
    }

    .filter-card-header {
      display: flex;
      justify-content: center;
    }
  }

  input[type=submit] {
    margin: 0 auto;
    width: 150px;
  }
}
</style>

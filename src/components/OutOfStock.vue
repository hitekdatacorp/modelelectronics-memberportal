<script setup lang="ts">
import IconRedXCircle from '@/components/icons/IconRedXCircle.vue'

const props = defineProps<{outOfStockMessage?: string}>();

</script>



<template>
    <IconRedXCircle />
    <span class="out-of-stock">{{props.outOfStockMessage ?? 'Out of Stock'}}</span>
</template>

<style lang="scss">
    @import '@/assets/scss/variables';
    
    .out-of-stock {
        text-align: left;
        font: normal normal bold 24px/23px Inter;
        letter-spacing: 0px;
        color: $primary;
        opacity: 1;
        margin-left: 5px;        
    }
</style>
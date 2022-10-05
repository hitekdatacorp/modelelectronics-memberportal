<script setup lang="ts">
import IconCheckGreen from '@/components/icons/IconCheckGreen.vue'

const props = defineProps<{inStockMessage: string}>();

</script>



<template>
    <IconCheckGreen></IconCheckGreen>
    <span class="in-stock">{{props.inStockMessage}}</span>
</template>

<style lang="scss">
    .in-stock {
        text-align: left;
        font: normal normal bold 24px/23px Inter;
        letter-spacing: 0px;
        color: #589800;
        opacity: 1;
        margin-left: 5px;        
    }
</style>
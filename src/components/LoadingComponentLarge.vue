<script setup lang="ts">
import { ContentLoader } from 'vue-content-loader';

const props = defineProps<{ viewBox?: string }>();

const speed: number = 1;
</script>

<template>
    <ContentLoader :viewBox="props.viewBox" secondaryColor="#ccc" :speed="speed">
        <rect x="0" y="0" rx="3" ry="3" width="650" height="20" />
        <rect x="40" y="40" rx="3" ry="3" width="520" height="20" />
        <rect x="40" y="80" rx="3" ry="3" width="470" height="20" />
        <rect x="20" y="120" rx="3" ry="3" width="650" height="20" />
        <rect x="40" y="160" rx="3" ry="3" width="400" height="20" />
        <rect x="40" y="200" rx="3" ry="3" width="180" height="20" />

        <rect x="0" y="240" rx="3" ry="3" width="650" height="20" />
        <rect x="40" y="280" rx="3" ry="3" width="520" height="20" />
        <rect x="40" y="320" rx="3" ry="3" width="470" height="20" />
        <rect x="20" y="360" rx="3" ry="3" width="650" height="20" />
        <rect x="40" y="400" rx="3" ry="3" width="400" height="20" />
        <rect x="40" y="440" rx="3" ry="3" width="180" height="20" />

        <rect x="0" y="0" rx="3" ry="3" width="650" height="20" />
        <rect x="40" y="40" rx="3" ry="3" width="520" height="20" />
        <rect x="40" y="80" rx="3" ry="3" width="470" height="20" />
        <rect x="20" y="120" rx="3" ry="3" width="650" height="20" />
        <rect x="40" y="160" rx="3" ry="3" width="400" height="20" />
        <rect x="40" y="200" rx="3" ry="3" width="180" height="20" />

        <rect x="0" y="0" rx="3" ry="3" width="650" height="20" />
        <rect x="40" y="40" rx="3" ry="3" width="520" height="20" />
        <rect x="40" y="80" rx="3" ry="3" width="470" height="20" />
        <rect x="20" y="120" rx="3" ry="3" width="650" height="20" />
        <rect x="40" y="160" rx="3" ry="3" width="400" height="20" />
        <rect x="40" y="200" rx="3" ry="3" width="180" height="20" />

        <rect x="0" y="0" rx="3" ry="3" width="650" height="20" />
        <rect x="40" y="40" rx="3" ry="3" width="520" height="20" />
        <rect x="40" y="80" rx="3" ry="3" width="470" height="20" />
        <rect x="20" y="120" rx="3" ry="3" width="650" height="20" />
        <rect x="40" y="160" rx="3" ry="3" width="400" height="20" />
        <rect x="40" y="200" rx="3" ry="3" width="180" height="20" />
        
    </ContentLoader>
</template>
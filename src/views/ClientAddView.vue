<script setup lang="ts">

import { reactive, watch, ref } from 'vue'
import { Client as Client, Gender } from '../types/models'
import { useRoute, onBeforeRouteUpdate, useRouter } from 'vue-router';
import ClientForm from '@/components/ClientForm.vue'

const router = useRouter();
const props = defineProps({  
  id: {required: true, type: String }
});

const client = ref(new Client());
client.value.id = props.id as string;

onBeforeRouteUpdate((to, from) => {
  console.log('inside ClientAddView onBeforeRouteUpdate. to object is: ' );
  console.log(to);
  client.value = new Client();
  client.value.id = to.params.id as string;  
})

const emit = defineEmits(['onSaveParent'])
function saveClient(client: Client){
  console.log('inside ClientAddView saveClient')
  // emit the call to the parent
  emit('onSaveParent', client, true)

  // go back to the clients list view
  router.push({name: 'clients'})
}

</script>


<template>
  <ClientForm :client="client" @on-save="saveClient">
    <header>
      Adding New Client
    </header>
  </ClientForm>
</template>

<style>
</style>


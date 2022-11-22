<script setup lang="ts">

import { reactive, watch, ref } from 'vue'
import { Client as Client, type Gender } from '../types/models'
import { useRouter, onBeforeRouteUpdate } from 'vue-router'
import {cloneDeep, extend} from 'lodash'
import ClientForm from '@/components/forms/ClientForm.vue'
import * as clientService from '@/services/client-service';

const router = useRouter();
const props = defineProps({  
  id: {required: true, type: String }
});


let client = ref<Client>(new Client());

clientService.getClient(props.id).then(res => client.value = res);

// This gets called right before the view is updated/refreshed (usually by clicking on a router link). view's get refreshed when they're already been 
// rendered once and then the user tries to re-render it by editing another user. here all we have to do to update the view is swap out the client reference.
onBeforeRouteUpdate((to, from) => {
  console.debug('ClientEditView onBeforeRouteUpdate fired.');
  clientService.getClient(to.params.id as string).then(res => client.value = res);  
});

const emit = defineEmits(['onSaveParent'])

function saveClient(client: Client){
  console.log('inside ClientEditView saveClient')
  // emit the call to the parent
  emit('onSaveParent', client, false)

  // go back to the clients list view
  router.push({name: 'clients'})
}


</script>


<template>  
  <ClientForm :client="client" @on-save="saveClient">
    <header>
      Editing Client: {{client.name}}
    </header>
  </ClientForm>
  
</template>

<style>
</style>


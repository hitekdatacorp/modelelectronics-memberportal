<script setup lang="ts">
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import {reactive, ref} from 'vue';
import type {Ref} from 'vue';
import type {Client as Client, Gender} from '../types/models'
import * as clientService from '@/services/client-service';
import {cloneDeep, extend, findIndex } from 'lodash'

const router = useRouter();

//const clients = reactive(getClients());

//let clients = ref<Client[]>(new Array<Client>());
let clients: Ref<Client[]> = ref(new Array<Client>());

reloadClients();

//const clients = reactive(await getClients());

function addNewClient(){
  let newGuid = crypto.randomUUID();
  router.push({name: 'clientadd', params: {id: newGuid}});
}

function saveClient(client: Client, isNew: Boolean){
  // perform validation
  console.log('inside parent saveClient')
  
  if(isNew) { // new client being added    
//    clients.value.push(client);
    clientService.createClient(client).then(res => {
      //clients.value.push(res);
      reloadClients();
    });
  } else { // editing an existing client
    // get value out of list and copy over the properties which will reactively update the object in the client array.
    // let c = clients.value.find((c: Client) => c.id === client.id)
    // extend(c, client);
    clientService.updateClient(client).then(res => {
      reloadClients();
    });
  }    
}

function deleteClient(id: string){
  console.debug('incoming id to delete: ' + id);

  clientService.deleteClient(id).then(res => {
    console.debug('deleteClient res: ' + res);
    // remove the client from the list
    if(res === 200){
      let index = findIndex(clients.value, (c: Client) => c.id === id);
      clients.value.splice(index, 1);
    }    
  }).catch(res => {
    console.error('There was an issue deleting the client: ' + res);
  });
  // let idxRemove = findIndex<Client>(clients.value, (c) => {
  //   return c.id === id;
  // });  
  // clients.value.splice(idxRemove, 1);
}

function reloadClients(){
  clientService.getClients().then(res => {
    clients.value = res;
  });
}

</script>
 

<template>
  <div class="clients">    
    <div>
      <h1 style="text-align:center;">Your Clients:</h1> <button class="btn btn-primary" @click="addNewClient">Add New</button>
      <br/>      
      <p>
        <table>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Email</th>
            <th>Phone</th>          
            <th>Is Active</th>
            <th>&nbsp;</th>
          </tr>
          <tr v-for="client of clients" :key="client.id">
            <td><RouterLink :to="{name: 'clientedit', params: {id: client.id}}" >{{client.name}}</RouterLink></td>
            <td>{{client.age}}</td>
            <td>{{client.gender}}</td>
            <td>{{client.email}}</td>
            <td>{{client.phone}}</td>
            <td><input type="checkbox" readonly :checked="client.isActive" /></td>
            <td><font-awesome-icon icon="fa-solid fa-trash-can" @click="deleteClient(client.id)" /></td>
          </tr>
        </table>
      </p>
    </div>
    <RouterView @on-save-parent="saveClient" />
  </div>
  
  
</template>

<style>
@media (min-width: 1024px) {
  .clients {
    min-height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
  .clients table td, .clients table th {
    padding: 1rem;
  }
}

.fa-trash-can {
  cursor: pointer;
}
</style>


<script setup lang="ts">

import { reactive, watch, ref, inject, type Ref } from 'vue'
import { Client as Client, Gender, UserProfile } from '@/types/models'
import { useRouter, onBeforeRouteUpdate } from 'vue-router'
import {cloneDeep, extend} from 'lodash'
import { UserProfileInjectionKey } from '@/data/keys';
import {useAuthStore} from '@/stores/auth-store';
import { computed } from '@vue/reactivity'

console.debug('ClientForm component initialized.')

const store = useAuthStore();
const router = useRouter();
const genderArr = Object.keys(Gender);
const props = defineProps<{client: Client}>();

//const emit = defineEmits(['onSave']);
const emit = defineEmits<{
    (e: 'onSave', client: Client): void
}>();

//let client = ref(cloneDeep(props.client));

console.debug(props.client);
//let client = ref(props.client);
let client = ref(props.client);

watch(props, (newProps, oldProps) => {
    console.debug('watch called');
    console.debug(newProps);
    client.value = oldProps.client //cloneDeep(newClient.client);
});

onBeforeRouteUpdate((to, from) => {
  console.debug('ClientForm onBeforeRouteUpdate fired.');
  console.debug(to);
  //client.value = getCopyOfClient(to.params.id as string);
});

function saveClient(){
  
  // emit the call to the parent
  //emit('onSave', client)
  emit('onSave', client.value)

  // go back to the clients list view
  router.push({name: 'clients'})
}


</script>

<template>
  <div class="container">
    <div>
        <slot name="header"></slot>
      <!-- <h1 style="text-align:center;">Editing Client: {{ client.name }}</h1> -->
      <br />
      <p>
      <form>
        <div class="mb-3">
          <label for="inputClientId" class="form-label">Id</label>
          <input type="text" readonly class="form-control" id="inputClientId" :value="client.id" />
        </div>
        <div class="mb-3">
          <label for="clientName" class="form-label">Name</label>
          <input type="text" class="form-control" id="clientName" aria-describedby="nameHelp" v-model="client.name" />
          <div id="nameHelp" class="form-text">Please enter the client's first and last name</div>
        </div>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Email address</label>
          <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="client.email" />
          <div id="emailHelp" class="form-text">Please enter a valid email address</div>
        </div>
        <div class="mb-3">
          <label for="age" class="form-label" >Age</label>
          <input type="number" class="form-control" id="age" v-model.number="client.age">
        </div>
        <div class="mb-3">
          <label for="gender" class="form-label" >Gender</label>
          <select class="form-select" aria-label="Gender selection" v-model="client.gender">
            <option v-for="gender in genderArr" :value="gender">
              {{gender}}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label for="phone" class="form-label" >Phone</label>
          <input type="phone" class="form-control" id="phone" v-model="client.phone">
        </div>
        <div class="mb-3 form-check">
          <input type="checkbox" class="form-check-input" id="chkIsActive" v-model="client.isActive">
          <label class="form-check-label" for="chkIsActive">Is Active</label>
        </div>
        <div class="row justify-content-evenly">
          <button type="button" class="btn btn-primary col-4" @click="saveClient">Submit</button>
          <button type="button" class="btn btn-secondary col-4" @click="router.push({name: 'clients'})">Cancel</button>
        </div>
        
      </form>
      </p>
    </div>
  </div>

</template>
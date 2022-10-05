
<script setup lang="ts">
import { stringLiteral } from '@babel/types';


export interface LoginProps {
    customerNumber: string,
    password: string,
    showRegister?: boolean,
    showSocialIcons?: boolean
}

const props = withDefaults(defineProps<LoginProps>(), {
    showRegister: true,
    showSocialIcons: true
});

const emit = defineEmits<{
    (e: 'onSubmit'): void,
    (e: 'update:customerNumber'): void
    (e: 'update:password'): void
}>();

</script>

<template>
    <form>
        <!-- Email input -->
        <div class="form-outline mb-4">
            <input type="text" id="form2Example1" class="form-control" :value="customerNumber"
                @input="$emit('update:customerNumber', ($event.target as HTMLInputElement).value)"
                autocomplete="username" />
            <label class="form-label" for="form2Example1">Customer Number</label>
        </div>

        <!-- Password input -->
        <div class="form-outline mb-4">
            <input type="password" id="form2Example2" class="form-control" :value="password"
                @input="$emit('update:password', ($event.target as HTMLInputElement).value)"
                autocomplete="current-password" />
            <label class="form-label" for="form2Example2">Password</label>
        </div>

        <!-- 2 column grid layout for inline styling -->
        <div class="row mb-4">
            <div class="col d-flex justify-content-center">
                <!-- Checkbox -->
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="form2Example31" checked />
                    <label class="form-check-label" for="form2Example31"> Remember me </label>
                </div>
            </div>

            <div class="col">
                <!-- Simple link -->
                <a href="#!">Forgot password?</a>
            </div>
        </div>

        <!-- Submit button -->
        <button type="button" class="btn btn-primary col-12 mb-4" @click="emit('onSubmit')">Sign in</button>

        <!-- Register buttons -->
        <div class="text-center">
            <p v-if="showRegister">Not a member? <a href="#!">Register</a></p>
            <div v-if="showSocialIcons">
                <p>or sign up with:</p>
                <button type="button" class="btn btn-link btn-floating mx-1">
                    <font-awesome-icon icon="fab fa-facebook" />
                </button>

                <button type="button" class="btn btn-link btn-floating mx-1">
                    <font-awesome-icon icon="fab fa-google" />
                </button>

                <button type="button" class="btn btn-link btn-floating mx-1">
                    <font-awesome-icon icon="fab fa-twitter" />
                </button>

                <button type="button" class="btn btn-link btn-floating mx-1">
                    <font-awesome-icon icon="fab fa-github" />
                </button>
            </div>
        </div>
    </form>
</template>
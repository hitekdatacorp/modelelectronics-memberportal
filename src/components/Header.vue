<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth-store';
import { IS_NJ_URL, IS_TX_URL } from '@/helpers/axiosconfig';
import {useRoute} from 'vue-router';
import { watch, ref } from 'vue';
import 'bootstrap'

const store = useAuthStore();
const route = useRoute();
let pageHeader = ref('');

watch(() => route.meta.title, () => {
    document.title = route.meta.title as string;
    pageHeader.value = route.meta.title as string;

});


let logoSrc = IS_TX_URL() ? 'logo-model-electronics-texas.svg' : 'logo-model-electronics.svg';

</script>


<template>
    <header id="header" class="container-fluid p-0">
        <div id="header-top-bar" class="container-fluid">
            <div class="container p-0 top-bar-contents d-flex justify-content-between m-auto">
                <div class="header-tagline p-0">The Premier Automotive Service Center for OEM in the USA</div>
                <div class="header-hours-contact d-flex p-0">
                    <div class="header-hours"><span class="icon-model-clock me-2"></span>8AM - 8PM EST</div>
                    <div class="header-phone ms-sm-3 ms-md-4"><a class="text-white text-decoration-none"
                            href="tel:+(800)-433-9657"><span class="icon-model-phone me-2"></span>(800)-433-9657</a>
                    </div>
                </div>
            </div>
        </div>
        <div id="header-logo-and-nav" class="container-fluid">
            <div class="container p-0 header-logo-and-nav-contents m-auto">
                <nav class="navbar navbar-expand-lg d-flex justify-content-between align-items-center p-0">
                    <div class="d-flex align-items-center">
                        <button class="navbar-toggler collapsed me-2 p-0" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false"
                            aria-label="Toggle navigation"></button>
                        <!-- <a :href="PUBLIC_SITE_URL"> -->
                            <a href="/">
                            <!-- Logo -->                            
                            <img id="site-identity" v-if="IS_TX_URL()" src="@/assets/images/logo-model-electronics-texas.svg" width="226"
                                height="63" alt="Model Electronics Logo">

                            <img id="site-identity" v-if="!IS_TX_URL()" src="@/assets/images/logo-model-electronics.svg" width="226"
                                height="63" alt="Model Electronics Logo">
                        </a>
                    </div>
                    <a id="dealer-login-btn-mobile"
                        class="btn btn-primary btn-with-caret text-uppercase text-white d-lg-none" href="/member">Dealer
                        Login</a>
                    <div class="collapse navbar-collapse" id="navbarToggler" v-if="!store.isAuthenticated()">
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <a class="nav-link" href="/services"><span>Services</span></a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href='/about'><span>About Us</span></a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href='/contact-us'><span>Contact Us</span></a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="https://www.modelelectronicsaes.com/" target="_blank"
                                    rel="nofollow"><span>Aftermarket Products</span></a>
                            </li>
                            <li class="nav-item ms-2 d-none d-lg-block">
                                <RouterLink to="/" id="dealer-login-btn-mobile"
                                    class="btn btn-primary btn-with-caret text-uppercase text-white">Dealer Login
                                </RouterLink>
                            </li>
                        </ul>
                    </div>
                    <div class="collapse navbar-collapse" id="navbarToggler" style="justify-content: center; width: 100%;" v-if="store.isAuthenticated() && !store.isNissanDealer">
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <RouterLink class="nav-link" to="/advexchange"><span>Advanced Exchange</span>
                                </RouterLink>
                            </li>
                            <li class="nav-item" v-if="IS_NJ_URL()">
                                <RouterLink class="nav-link" to="/outrightpurchase"><span>Outright Purchase</span>
                                </RouterLink>
                            </li>
                            <li class="nav-item">
                                <RouterLink class="nav-link" to="/invoicehist"><span>Invoice History</span></RouterLink>
                            </li>
                            <li class="nav-item" v-if="IS_NJ_URL()">
                                <RouterLink class="nav-link" to="/repairform"><span>Repair Form</span></RouterLink>
                            </li>
                            <li class="nav-item" v-if="IS_NJ_URL()">
                                <RouterLink class="nav-link" to="/radiosurvey"><span>Radio Survey</span></RouterLink>
                            </li>
                            <li class="nav-item" v-if="IS_NJ_URL()">
                                <RouterLink class="nav-link" to="/clustersurvey"><span>Cluster Survey</span>
                                </RouterLink>
                            </li>
                        </ul>
                    </div>
                    <div class="collapse navbar-collapse" id="navbarToggler" v-if="store.isAuthenticated() && store.isNissanDealer">
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <RouterLink class="nav-link" to="/speedometer"><span>Speedometer</span></RouterLink>
                            </li>                           
                            <li class="nav-item">
                                <RouterLink class="nav-link" to="/invoicehist"><span>Invoice History</span></RouterLink>
                            </li>
                            <li class="nav-item">
                                <RouterLink class="nav-link" to="/nissandownloads"><span>Downloads</span></RouterLink>
                            </li>                          
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
        <div class="container-fluid hero-image">
            <div class="container p-0 pt-4 d-flex justify-content-between">
                <div class="account-info" v-show="store.isAuthenticated()">
                    <span>Welcome, {{ store.name }}</span><br />
                    <span>Account # {{ store.customerNumber }}</span>
                </div>
                <div>
                    &nbsp;
                </div>
                <div class="logout-wrapper">
                    <a href="" v-show="store.isAuthenticated()" @click="store.logout()" class="">Logout</a>
                </div>
            </div>
            <div>
                &nbsp;
            </div>
            <div class="banner-page-title">
                <div style="border-top: 4px solid #c40000;">&nbsp;</div>
                <h1>{{pageHeader}}</h1>
            </div>
        </div>
    </header>
</template>
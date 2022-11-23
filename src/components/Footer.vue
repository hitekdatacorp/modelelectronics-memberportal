<script setup lang="ts">

import { IS_NJ_URL, IS_TX_URL } from '@/helpers/axiosconfig';


</script>

<template>
  <footer>
    <div id="footer-contents" class="container-fluid">
      <div class="container p-0 d-flex justify-content-between m-auto">
        <div class="footer-business-info">
          <div class="business-info-container">
            <div class="icon-model-location"></div>
            <div class="business-info-copy">
              Model Electronics <br />
              615 East Crescent Ave. <br />
              Ramsey, NJ 07446 <br />
            </div>
          </div>
          <div class="business-info-container">
            <div class="icon-model-phone"></div>
            <div class="business-info-copy">(800)-433-9657<br>(201)-961-6200</div>
          </div>
          <div class="business-info-container">
            <div class="icon-model-clock"></div>
            <div class="business-info-copy">8AM - 8PM EST</div>
          </div>
        </div>
        <div class="footer-logo-nav">
          <!-- Logo -->
          <img id="footer-site-identity" v-if="IS_TX_URL()" src="@/assets/images/logo-model-electronics-texas.svg"
            width="181" height="51" alt="Model Electronics Logo">

          <img id="footer-site-identity" v-if="!IS_TX_URL()" src="@/assets/images/logo-model-electronics.svg"
            width="181" height="51" alt="Model Electronics Logo">

          <nav class="pt-3 pb-3">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" href="/services">Services</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/about">About Us</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/contact-us">Contact Us</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="http://www.modelelectronicsaes.com/" target="_blank"
                  rel="nofollow">Aftermarket Products</a>
              </li>
            </ul>
          </nav>
          <a class="btn btn-dark btn-with-caret text-uppercase border-white shadow-none" href="#">Dealer Login</a>
        </div>
        <div class="footer-awards">
          <!-- Top Places Badge -->
          <img src="@/assets/images/top-workplaces-badge.png" width="81" height="178" alt="Top placs to work 2019">
        </div>
      </div>
    </div>
  </footer>
</template>





<template>
  <main class="repair">
    <h3>Downloads</h3>
    <div class="instructions pt-3 pb-5">
      Click on links below to open or right-click to download (Save Link As...)      
    </div>
    <div class="pb-5">
      <a href="/member/public/downloads/ITB11_053.pdf" target="_blank" class="btn btn-primary btn-download" >Download ITB11_053 form</a>
    </div>   

    <div class="pb-5">
      <a href="/member/public/downloads/Odometer_Ordering_Process.pdf" target="_blank" class="btn btn-primary btn-download" >Download Odometer Ordering Process form</a>
    </div>   
  </main>
</template>

<style lang="scss" scoped>
.repair {
  min-height: 50vh;
  padding-top: 2rem;
  max-width: 700px;

  &>div,
  &>h3 {
    width: 100%;
    text-align: center;
  }

  h3 {
    width: 100%;
    text-align: center;
  }

  .instructions, .addr {       
    font: normal normal normal 21px/30px Inter-Regular;
    letter-spacing: 0px;
    color: #000000;
    opacity: 1;
  }

  >div:nth-child(3){    
    width: 100%;
    text-align: center;
    a.btn-primary {
      margin: 0 auto;
    }
  }
}

.btn-download {
  &:before {
    background-image: url('@/assets/icons/icon-document-white.png');
    content: "";
    display: inline-block;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    width: 30px;
    height: 25px;
    position: relative;
    right: 5px;
    top: 6px;
  }
}
</style>

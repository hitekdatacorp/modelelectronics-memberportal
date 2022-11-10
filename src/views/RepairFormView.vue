




<template>
  <main class="repair">
    <h3>Submit a repair request</h3>
    <div class="instructions pt-3 pb-5">
      To submit a repair request please download and fill out the repair form below. Include the form in the box when
      you send your product back.
    </div>
    <div class="pb-5">
      <a href="https://localhost:44368/media/itwfmyxk/repair-form.pdf" target="_blank" class="btn btn-primary btn-download" >Download The Repair Form</a>
    </div>
    <div class="addr pb-5">
      <b>Ship repairs to</b>
      <br/>
      <span>Model Electronics, Inc.</span>
      <br/>
      <span>615 E. Crescent Ave. Ramsey,</span>
      <br/>
      <span>NJ 07446</span>
      <br/>
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

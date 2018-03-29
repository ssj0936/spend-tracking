<template>
  <div id="app">
    <div class="navTop">
      <NavbarTop/>
    </div>
    <div class="mainPageContainer">
      <mainPage/>
    </div>
  </div>
</template>

<script>
  import NavbarTop from './components/NavbarTop'
  import mainPage from './components/mainPage'

  export default {
    name: 'App',
    data() {
      return{
      style_navtop: "0 0 auto",
      style_mainPage: "1 1 auto",
      }
    },
    components: {
      NavbarTop,
      mainPage,
    }
  }

</script>

<style>
  #app {
    font-family:   "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,Microsoft JhengHei, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* text-align: center; */
    color: #2c3e50;
    /* margin-top: 60px; */
    display: flex;
    flex-direction: column;
    height: -webkit-fill-available;
  }

  .navTop {
    flex: 0 0 auto;
  }

  .mainPageContainer {
    flex: 1 1 auto;
  }

</style>

<template lang="pug">
<!--nav.navbar.navbar-expand-md.navbar-light.bg-light-->
    nav.navbar.navbar-expand.navbar-dark.flex-column.flex-md-row
        a.navbar-brand(href="#") {{title}}
        button.navbar-toggler(type="button",data-toggle="collapse",data-target="#navbarNavAltMarkup",aria-controls="navbarNavAltMarkup",aria-expanded="false",aria-label="Toggle navigation")
            span.navbar-toggler-icon
        .collapse.navbar-collapse#navbarNavAltMarkup
            .navbar-nav
                template(v-for="(value,index) in navbarItem")
                    a.nav-item.nav-link(v-bind:href="value") {{value}}
</template>
<script>
export default {
  name:"NavbarTop",
  data:function(){
      return{
          title:"Spending Tracking",
          navbarItem:['overall','chart','analyse']
      }
  }
};
</script>
<style lang="scss" scoped>
    @import "~bootstrap/scss/bootstrap-grid.scss";


    nav{
        background-color: #58B09C;
    }
   a.navbar-brand {
    @include media-breakpoint-down(sm) { 
        margin-right: 0;
    }
}

</style>



<template lang="pug">
.hello
  h1 {{ msg }}
  button.btn.btn-success(data-toggle="modal", data-target="#exampleModal") Demo
  #exampleModal.modal.fade
    .modal-dialog(role="document")
      .modal-content
        .modal-header
          h5.modal-title Modal Title
          button.close(data-dismiss="modal")
            span &times;
        .modal-body
          p hello!hello!
        .modal-footer
          button.btn.btn-success save
          button.btn.bth-secondary(data-dismiss="modal") cancle
</template>
<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: 'Pug / Scss / BootStrap / jQuery',
    };
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$vue-color: #42b983;
h1 {
  color: $vue-color;
}
</style>

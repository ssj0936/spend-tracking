<template lang="pug">
.recordsContainer
    .recordsTimeSwitchContainer.fa-2x
    .switchBtnContainer(@click="recordSwitchMonth('minus')")
        i.fas.fa-angle-left
    .recordsTimeSwitchShowText {{this.currentRecordDate.year+"-"+this.currentRecordDate.month}}
    .switchBtnContainer(@click="recordSwitchMonth('add')")
        i.fas.fa-angle-right  
</template>
<script>
export default {
  
}
</script>
<style lang="scss" scoped>

</style>



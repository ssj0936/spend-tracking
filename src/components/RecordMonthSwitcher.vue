<template lang="pug">
div.recordsTimeSwitchContainer.fa-2x
    .switchBtnContainer(@click="actionCurrentDisplayMonthDecrease")
        i.fas.fa-angle-left
    .recordsTimeSwitchShowText {{getCurrentDisplayYear+"-"+getCurrentDisplayMonth}}
    .switchBtnContainer(@click="actionCurrentDisplayMonthIncrease")
        i.fas.fa-angle-right  
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import fontawesome from '@fortawesome/fontawesome'
import '@fortawesome/fontawesome-free-solid'

export default {
    computed:{
        ...mapGetters([
            'getCurrentDisplayYear',
            'getCurrentDisplayMonth'
        ])
    },
    methods:{
        ...mapActions([
            'actionCurrentDisplayMonthIncrease',
            'actionCurrentDisplayMonthDecrease',
        ])
    }
}
</script>
<style lang="scss" scoped>
.recordsTimeSwitchContainer{
    display:flex;
    align-items: center;
    justify-content: center;
    text-align:center;

    .switchBtnContainer {
        cursor: pointer;
        width:40px;
        text-align:center;
        display: inline-block;
        transition:all .3s;

        &:hover{
        opacity: .5;
        }
    }

    .recordsTimeSwitchShowText{
        display: inline-block;
        text-align:center;
        font-size:large;
    }
}
</style>



<template lang="pug">
.container
    div.emptyBlock(v-if="isDataEmpty")
      h2 {{strings.emptyText}}
    div.mainPage.row(v-else)
      .spendingTable.col-md
        .newRecordContainer
          .recordInputDatePickerContainter
            .recordDateIconContainer
              i.recordInputIcon.fa-lg.fas.fa-calendar-alt
            datepicker(id="datepicker",v-model="newRecordDate",format="yyyy-MM-dd",:placeholder="strings.placeholder_newRecordDate")
          .recordInputContainer
            .recordInputNameContainer
              .recordTypeIconContainer
                i.recordTypeIcon.recordInputIcon.fa-lg.fas.fa-pencil-alt
              input.newRecordNameInput(v-model="newRecordName",:placeholder="getNewRecordPlaceholder")
            .recordInputCostContainer
              i.recordInputIcon.fas.fa-dollar-sign.fa-lg
              input.newRecordCostInput(v-model="newRecordPrice",type="number",onkeydown="javascript: return event.keyCode == 69 ? false : true" ,:placeholder="strings.placeholder_newRecordItemPrice")
          .recordTypeContainer
            .recordTypeRow(v-for="i in getDisplayRowCount")
              .recordTypeButtonContainer.fa-2x(v-for="(type,key,index) in getSubArrayBelongToThisItem(i)",@click="changeCurrentRecordType(type.typename)")
                span.fa-layers.fa-fw.iconContainer
                  i.fas.fa-square.newRecordIconBackGround
                  i(:class="type.iconClassname+' fa-inverse newRecordIcon'",data-fa-transform="shrink-6")
                div.iconTag(:data-key="type.typename") {{type.typename}}
          .recordSubmitContainer
            button.newRecordSubmit(@click="newrecordSubmit") {{strings.text_newRecoedSubmit}}
        .recordsContainer
          recordMonthSwitcher
          transition-group(name="wholeMonthRecord")
            div.recordContainer(v-for="recordPerDay in getRecordsInPeriod",:key="recordPerDay.date")
              div.recordDateContainer
                .recordDateTitle 
                  .dateMonthDay.dateBlock
                    .month {{getDateMonth(recordPerDay.date)}}
                    .day {{getDateDay(recordPerDay.date)}}
                .recordDateSum {{getDaySum(recordPerDay)}}
              transition-group(:css="false",@leave="leaveAnimation",@enter="enterAnimation")
                div.recordDataContainer(:id="recordPerDay.date +'-'+record.id",v-for="record in recordPerDay.record",:key="recordPerDay.date +'-'+record.id",@mouseenter="recordDataEditMouseEnter",@mouseleave="recordDataEditMouseLeave")
                  .recordDataInnerContainer
                    div.recordDataItem.recordDataIcon
                      i(v-bind:class="getIconClassName(record)")
                    div.recordDataItem.recordDataName {{record.item}}
                    div.recordDataItem.recordDataNumber {{record.number}}
                    div.recordDataItem.recordDataEdit.hide
                      span
                        i.recordDataEditIcon.far.fa-edit
                      span(v-on:click="deleteRecord({date:recordPerDay.date,id:record.id})")
                        i.recordDataEditIcon.far.fa-trash-alt
      <!--.spendingChart.col-md-->
        <!--p CHART-->
</template>
<script>
  import Datepicker from 'vuejs-datepicker';

  import fontawesome from '@fortawesome/fontawesome'
  import '@fortawesome/fontawesome-free-solid'
  import '@fortawesome/fontawesome-free-regular'

  import { mapGetters, mapActions } from 'vuex'
  import recordMonthSwitcher from './RecordMonthSwitcher'
  import * as fakeData from '../assets/fakeData.js';
  import * as mutationType from '../store/mutations_type.js'

  // https://coolors.co/474747-f17e29-ffffff-58b09c-caf7e2
  export default {
    name: "mainPage",
    components:{
        Datepicker,recordMonthSwitcher
    },
    data() {
      return {
        itemsPerRow: 5,
      }
    },
    watch: {
      getNewRecordType: {
        handler: function (val, oldVal) {
          //change input icon programmatically
          let newIcon = this.spendingTypeList.filter((obj) => {
            return obj.typename == this.newRecord.newRecordType;
          })

          if(newIcon.length > 0)
            document.querySelector(".recordTypeIcon").setAttribute("data-icon", newIcon[0].dataicon);
          else
            document.querySelector(".recordTypeIcon").setAttribute("data-icon", "pencil-alt");

        },
      }
    },
    created() {},
    computed: {
      //for v-model binding states in vuex
      newRecordName:{
        get () {
          return this.$store.state.newRecord.newRecordName
        },
        set (value) {
          this.$store.commit(mutationType.V_MODEL_NEWRECORD_NAME, value);
        }
      },
      newRecordPrice:{
        get () {
          return this.$store.state.newRecord.newRecordPrice
        },
        set (value) {
          this.$store.commit(mutationType.V_MODEL_NEWRECORD_PRICE, value);
        }
      },
      newRecordDate:{
        get () {
          return this.$store.state.newRecord.newRecordDate
        },
        set (value) {
          this.$store.commit(mutationType.V_MODEL_NEWRECORD_DATE, value);
        }
      },

      ...mapGetters([
          'getCurrentDisplayYear',
          'getCurrentDisplayMonth',
          'records',
          'spendingTypeList',
          'isDataEmpty',
          'strings',
          'newRecord',
      ]),

      currentRecordDate(){
        return{
          year:this.getCurrentDisplayYear,
          month:this.getCurrentDisplayMonth,
        }
      },

      getDisplayRowCount() {
        return Math.ceil(this.spendingTypeList.length / this.itemsPerRow);
      },

      getNewRecordPlaceholder(){
        if(this.newRecord.newRecordType == null)
          return this.strings.placeholder_newRecordItemName;
        else{
          return this.newRecord.newRecordType;
        }
      },

      //used for 'watch'
      //dont want to watch every property in object
      getNewRecordType() {
        return this.newRecord.newRecordType;
      },

      getRecordsInPeriod(){
        let currentY = this.currentRecordDate.year,
            currentM = this.currentRecordDate.month;

        let tmp = this.records.filter((obj)=>{
          let date = obj.date.split('-'),
              year = date[0],
              month = date[1];
          return (currentY == year) && (currentM == month);
        }).sort((a,b)=>{
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        return tmp;
      }
    },
    methods: {
      ...mapActions([
        'actionCurrentDisplayMonthIncrease',
        'actionCurrentDisplayMonthDecrease',
        'deleteRecord',
        'newrecordSubmit',
      ]),

      getSubArrayBelongToThisItem(index) {
        return this.spendingTypeList.slice((index - 1) * this.itemsPerRow, index * this.itemsPerRow)
      },

      getDaySum(dayRecord) {
        var sum = 0;
        for (let r of dayRecord.record) {
          if (r.spendingType == "in")
            sum += r.number;
          else
            sum -= r.number;
        }
        if (sum < 0) return (sum * -1).toString();
        else return sum == 0 ? "0" : `+${sum.toString()}`;
      },

      getIconClassName(record) {
        let find = this.spendingTypeList.filter((obj) => {
          return obj.typename == record.type
        });
        return find[0].iconClassname;
      },

      getDateMonth(date) {
        let month = new Date(date).getMonth() + 1;
        return (month<10) ? '0'+month : ''+month;
      },

      getDateDay(date) {
        let day = parseInt(new Date(date).getDate());
        return (day<10) ? '0'+day : ''+day;
      },

      changeCurrentRecordType(typename) {
        this.$store.commit(mutationType.V_MODEL_NEWRECORD_TYPE, typename);
      },

      //for mouse event listener
      recordDataEditMouseEnter(e) {
        let targetEditBlock = e.target.querySelector('.recordDataEdit');
        targetEditBlock.classList.remove("hide");
      },
      recordDataEditMouseLeave(e) {
        let targetEditBlock = e.target.querySelector('.recordDataEdit');
        targetEditBlock.classList.add("hide");
      },
      
      //record adding animation
      enterAnimation: function (el, done) {
        var delay = el.dataset.index * 150
        setTimeout(function () {
            $(el).velocity("stop").velocity("transition.slideDownBigIn",{ complete: done })
            }, delay)
      },

      //record deleting animation
      leaveAnimation: function (el, done) {
        var delay = el.dataset.index * 150
        setTimeout(function () {
            $(el).velocity("stop").velocity({
              opacity: 0,
              height: 0,
              'margin-bottom': 0
            },{ complete: done })
            }, delay)
      },

      // //whold day record adding animation
      // enterWholeAnimation: function (el, done) {
      //   var delay = el.dataset.index * 150;
      //   setTimeout(function(){
      //     $(el).velocity("stop").velocity("transition.slideDownIn",{complete: done });
      //   },delay);
          
      // },

      // //whold day record deleting animation
      // leaveWholeAnimation: function (el, done) {
      //   var delay = el.dataset.index * 150;
      //   setTimeout(function(){
      //     $(el).velocity("stop").velocity("transition.slideDownOut",{complete: done });
      //   },delay);
      // },
    }
  }

</script>
<style lang="scss">
  input#datepicker{
    opacity: .4;
    font-size: large;
    height: 2rem;
    // width: 80px;
    border: 0px;
    background: transparent;
    outline: none !important;

      // padding: .75em .5em;
      // font-size: 100%;
      // border: 1px solid #ccc;
      // width: 100%
  }
</style>

<style lang="scss" scoped>
  @import "~bootstrap/scss/bootstrap-grid.scss";
  $recordContainerPadding: 1rem;
  $app-color:#CAF7E2;
  $light-icon-color:#6c757d;
  $text-color:#1F2D3D;
  $recordTypeContainerBGC:#EEE;
  $vividColor:#F17E29;
  $lightGray:#6c757d8a;
  $button-text-color:rgb(50, 73, 99);

  .wholeMonthRecord{
    &-move {
      transition: all 600ms ease-in-out 50ms 
    }
    &-enter-active {
      transition: all 300ms ease-out
    }

    &-leave-active {
      transition: all 200ms ease-in;
      position: absolute;
      z-index: 0;
    }

    &-enter,
    &-leave-to {
      opacity: 0
    }
    
    &-enter {
      transform: scale(0.9)
    }
  }
  .mainPage {
    padding-top: 3rem;
  }

  .emptyBlock {
    display: flex;
    flex-direction: columns;
    flex: 1;
    justify-content: center;
    margin: $recordContainerPadding;
    border: 5px solid rgba(44, 62, 80, .1);
    padding: $recordContainerPadding;
    background: rgba(44, 62, 80, .1);
    align-items: center;
    border-style: dashed;
  }

  .recordsContainer{
    position: relative;
  }

  .recordContainer {
    width: -webkit-fill-available;
    // position: absolute;
    margin-bottom: 3rem;
    flex-direction: column;
    overflow: hidden;
  }

  .recordDateContainer {
    padding-left: $recordContainerPadding;
    padding-right: $recordContainerPadding;
    margin-bottom: $recordContainerPadding;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    opacity: .5;
  }

  .dateBlock {
    font-size: 0.8em;
    display: inline-block;
  }

  .dateYear.dateBlock {
    font-size: 1.8em;
  }

  .dateBlock .month {
    position: relative;
    width: 35px;
    text-align: left;
    line-height: 1;
  }

  .dateBlock .day {
    width: 35px;
    text-align: right;
    line-height: 1;
  }

  .dateBlock .month::after {
    content: '\FF0F';
    font-size: 220%;
    font-weight: 100;
    position: absolute;
    top: -4px;
    right: 3px;
  }

  .recordDateContainer .recordDateTitle {
    align-items: center;
    display: flex;
  }

  .recordDateContainer .recordDateSum {
    text-align: right;
    font-weight: bold;
  }


  .recordDataContainer {
    margin-bottom: .2rem;
    height: 3rem;
    overflow: hidden;
  }

  .recordDataInnerContainer {
    display: flex;
    background: $app-color;
    color: $text-color;
    flex-direction: row;
    padding: 1rem;
    align-items: center;
    height: -webkit-fill-available;
  }

  .recordDataItem.recordDataIcon {
    flex: 0 30px;
    text-align: center;
  }


  .recordDataItem.recordDataName {
    padding-left: 1rem;
    flex: 1;
  }

  .recordDataItem.recordDataNumber {
    font-weight: 500;
    flex: 0;
  }

  .recordDataItem.recordDataEdit.hide {
    width: 0px;
  }

  .recordDataItem.recordDataEdit {
    display: flex;
    width: 3.5rem;
    justify-content: flex-end;
    transition: all .3s;
    overflow: hidden;
  }

  .recordDataEditIcon {
    width: 20px;
    margin-left: 5px;
  }

  .fa-edit,
  .fa-trash-alt {
    color: $light-icon-color;
  }

  .recordTypeButtonContainer {
    width: 100%;
    margin: .3rem .5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;

    &:hover{
      cursor: pointer;
      color:$vividColor;

      .iconContainer{
        .newRecordIconBackGround {
          color: $vividColor;
          opacity: .7;
        }
        .newRecordIcon {
          color: white;
        }
      }
    }

    .iconTag{
      font-size: medium;
      font-weight: 300;
      width: max-content;
    }
  }

  .newRecordContainer {
    padding: 1rem;
    background: $app-color;
    margin-bottom: 3rem;
  }

  .iconContainer {
    cursor: pointer;

    .newRecordIconBackGround {
      transition: all .3s;
    }

    .newRecordIcon {
      transition: all .3s;
    }
  }

  .recordTypeRow {
    display: inline-flex;
    flex-direction: column;
    flex:1;
    // justify-content: center;
    align-items: flex-start;
    max-width: 200px;
  }

  input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::-webkit-input-placeholder {
    opacity: .4;
  }

  .recordTypeContainer {
    display: flex;
    justify-content: center;
    padding: .5rem; // margin-bottom: 2rem;
    background: $recordTypeContainerBGC;
    margin-left: -$recordContainerPadding;
    margin-right: -$recordContainerPadding; // margin-bottom: -$recordContainerPadding;
  }

  .recordSubmitContainer {
    margin-top: $recordContainerPadding;
    display: flex;
    justify-content: flex-end;

    button {
      font-size: large;
      background: transparent;
      border: 2px solid $button-text-color;
      color: $button-text-color;
      transition: all .3s;
      cursor: pointer;

      &:hover {
        background: $button-text-color;
        border: 2px solid $button-text-color;
        color: white;
      }
    }
  }

  .recordInputDatePickerContainter{
    display: flex;
    align-items: center;
    flex: 1;
    margin-bottom: .3rem;

    .recordDateIconContainer {
      text-align: center;
      width:35px;
    }

    .recordInputIcon {
      margin-right: 8px;
    }
  }


  .recordInputContainer {
    display: flex;
    align-items: center;
    margin-bottom: .3rem;

    .recordInputNameContainer {
      display: flex;
      align-items: center;
      flex: 1;

      input {
        width: auto;
      }

      .recordTypeIconContainer {
        text-align: center;
        width:35px;
      }
    }

    .recordInputCostContainer {
      width: fit-content;
      display: flex;
      align-items: center;
      flex: 0;
    }

    input {
      font-size: large;
      height: 2rem;
      width: 80px;
      border: 0px;
      background: transparent;
    }

    input:focus {
      outline: none !important;
    }

    .recordInputIcon {
      margin-right: 8px;
    }
  }
</style>

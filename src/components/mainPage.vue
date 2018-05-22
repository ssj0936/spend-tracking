<template lang="pug">
.container
  .functionBtnContainer
    button.funcBtn.btn.btn-outline-success(data-toggle="modal",data-target="#recordAddingDialog") {{$store.state.strings.buttonTextAdd}}
    button.funcBtn.btn.btn-outline-success {{$store.state.strings.buttonTextEdit}}
    button.funcBtn.btn.btn-outline-success {{$store.state.strings.buttonTextDelete}}
    #recordAddingDialog.modal.fade(role="dialog")
      .modal-dialog.modal-dialog-centered(role="document")
        .modal-content
          .modal-header
            h5 {{$store.state.strings.buttonTextAdd}}
            button.close(type="button",data-dismiss="modal")
              span &times;
          .modal-body
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
          .modal-footer
            button.funcBtn.btn.btn-outline-success(type="button",@click="submit(currentModalMode)") {{strings.text_newRecoedSubmit}}
  div.emptyBlock(v-if="isDataEmpty")
    h2 {{strings.emptyText}}
  div.mainPage.row(v-else)
    .spendingTable.col-md
      .recordsContainer
        recordMonthSwitcher
        .totalSumThisMonthContainer
          .sumThisMonthTitle {{$store.state.strings.sumThisMonthTitle + ":" }}
          .sumThisMonthNumber(:style="getTotalSumThisMonthColor") {{getTotalSumThisMonth}}
        transition-group(name="wholeMonthRecord")
          div.recordContainer(v-for="recordPerDay in getRecordsInPeriod",:key="recordPerDay.date")
            div.recordDateContainer
              .recordDateTitle 
                .dateMonthDay.dateBlock
                  .month {{getDateMonth(recordPerDay.date)}}
                  .day {{getDateDay(recordPerDay.date)}}
              .recordDateSum {{getDaySum(recordPerDay)}}
            transition-group(:css="false",@leave="leaveAnimation",@enter="enterAnimation")
              div.recordDataContainer(:class="{'isEditing':(recordPerDay.date +'@'+record.id) == currentEditRecordId}",:id="recordPerDay.date +'@'+record.id",v-for="record in recordPerDay.record",:key="recordPerDay.date +'@'+record.id",@mouseenter="recordDataEditMouseEnter",@mouseleave="recordDataEditMouseLeave")
                .recordDataInnerContainer
                  div.recordEdit(:class="{'d-none':(recordPerDay.date +'@'+record.id) != currentEditRecordId}")
                    div.recordDataEditItem.recordDataEditName.recordDataBlockEdit
                      div.recordDataItem.recordDataIcon
                        i(v-bind:class="getIconClassName(record)")
                      input(v-model="currentEdit.currentEditRecordName",:placeholder="getNewRecordPlaceholder")
                    div.recordDataEditItem.recordDataEditNumber.recordDataBlockEdit
                      div.recordDataItem.recordDataIcon
                        i.fas.fa-dollar-sign.fa-lg
                      input(v-model="currentEdit.currentEditRecordCost",type="number",onkeydown="javascript: return event.keyCode == 69 ? false : true" ,:placeholder="strings.placeholder_newRecordItemPrice")
                    div.recordDataEditItem.recordDataEditSubmit
                      span(v-on:click="()=>{currentEditRecordId=null}")
                        i.recordDataEditIcon.far.fa-times-circle
                      span(v-on:click="editSubmit()")
                        i.recordDataEditIcon.far.fa-check-circle
                  div.recordDisplay(:class="{'d-none':(recordPerDay.date +'@'+record.id) == currentEditRecordId}")
                    div.recordDataItem.recordDataIcon
                      i(v-bind:class="getIconClassName(record)")
                    div.recordDataItem.recordDataName 
                      div.recordDataBlockDisplay {{record.item}}
                    div.recordDataItem.recordDataNumber 
                      div.recordDataBlockDisplay {{record.number}}
                    div.recordDataItem.recordDataEdit.hide
                      span(v-on:click="initEditBlock(recordPerDay.date,record)")
                        i.recordDataEditIcon.far.fa-edit
                      span(v-on:click="deleteRecord({date:recordPerDay.date,id:record.id})")
                        i.recordDataEditIcon.far.fa-trash-alt
                  

    .spendingChart.col-md
      p CHART
</template>
<script>
  // toastr
  import * as toastr from 'toastr';
  import 'toastr/build/toastr.css';
  toastr.options.positionClass = "toast-bottom-center";

  //datepicker
  import Datepicker from 'vuejs-datepicker';

  //font-awesome
  import fontawesome from '@fortawesome/fontawesome'
  import '@fortawesome/fontawesome-free-solid'
  import '@fortawesome/fontawesome-free-regular'

  //vuex
  import {
    mapGetters,
    mapActions
  } from 'vuex'
  import recordMonthSwitcher from './RecordMonthSwitcher'
  import * as fakeData from '../assets/fakeData.js';
  import * as mutationType from '../store/mutations_type.js'

  // https://coolors.co/474747-f17e29-ffffff-58b09c-caf7e2
  export default {
    name: "mainPage",
    components: {
      Datepicker,
      recordMonthSwitcher
    },
    data() {
      return {
        itemsPerRow: 5,
        negtiveNumberColor:'#F25429',
        modalMode:{
          MODAL_MODE_ADD:'MODAL_MODE_ADD',
          MODAL_MODE_EDIT:'MODAL_MODE_EDIT',
        },
        currentModalMode:null,

        currentEdit:{
          currentEditRecordDate:'',
          currentEditRecordId:0,
          currentEditRecordType:'',
          currentEditRecordName:'',
          currentEditRecordCost:0
        },
        currentEditRecordId:null,
      }
    },
    watch: {
      getNewRecordType: {
        handler: function (val, oldVal) {
          //change input icon programmatically
          let newIcon = this.spendingTypeList.filter((obj) => {
            return obj.typename == this.newRecord.newRecordType;
          })

          if (newIcon.length > 0)
            document.querySelector(".recordTypeIcon").setAttribute("data-icon", newIcon[0].dataicon);
          else
            document.querySelector(".recordTypeIcon").setAttribute("data-icon", "pencil-alt");

        },
      }
    },
    created() {},
    computed: {
      //for v-model binding states in vuex
      newRecordName: {
        get() {
          return this.$store.state.newRecord.newRecordName
        },
        set(value) {
          this.$store.commit(mutationType.V_MODEL_NEWRECORD_NAME, value);
        }
      },
      newRecordPrice: {
        get() {
          return this.$store.state.newRecord.newRecordPrice
        },
        set(value) {
          this.$store.commit(mutationType.V_MODEL_NEWRECORD_PRICE, value);
        }
      },
      newRecordDate: {
        get() {
          return this.$store.state.newRecord.newRecordDate
        },
        set(value) {
          this.$store.commit(mutationType.V_MODEL_NEWRECORD_DATE, value);
        }
      },

      ...mapGetters([
        'getCurrentDisplayYear',
        'getCurrentDisplayMonth',
        'spendingTypeList',
        'records',
        'isDataEmpty',
        'strings',
        'newRecord',
      ]),

      currentRecordDate() {
        return {
          year: this.getCurrentDisplayYear,
          month: this.getCurrentDisplayMonth,
        }
      },

      getDisplayRowCount() {
        return Math.ceil(this.spendingTypeList.length / this.itemsPerRow);
      },

      getNewRecordPlaceholder() {
        if (this.newRecord.newRecordType == null)
          return this.strings.placeholder_newRecordItemName;
        else {
          return this.newRecord.newRecordType;
        }
      },

      //used for 'watch'
      //dont want to watch every property in object
      getNewRecordType() {
        return this.newRecord.newRecordType;
      },

      getRecordsInPeriod() {
        let currentY = this.currentRecordDate.year,
          currentM = this.currentRecordDate.month;

        let tmp = this.records.filter((obj) => {
          let date = obj.date.split('-'),
            year = date[0],
            month = date[1];
          return (currentY == year) && (currentM == month);
        }).sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        return tmp;
      },

      getTotalSumThisMonth() {
        let recordsThisMonth = this.getRecordsInPeriod;
        // console.log(recordsThisMonth);

        let sum = 0;
        for (let dr of recordsThisMonth) {
          for (let r of dr.record) {
            if (r.type == "Income")
              sum += r.number;
            else
              sum -= r.number;
          }
        }
        return '' + sum;
      },

      getTotalSumThisMonthColor() {
        if (parseInt(this.getTotalSumThisMonth) < 0) {
          return `color:${this.negtiveNumberColor}`;
        }
      }
    },
    methods: {
      ...mapActions([
        'actionCurrentDisplayMonthIncrease',
        'actionCurrentDisplayMonthDecrease',
        'deleteRecord',
        'newrecordSubmit',
        'editRecord',
      ]),

      recordModalShow(){
        $("#recordAddingDialog").modal('show');
      },

      recordModalHide(){
        $("#recordAddingDialog").modal('hide');
      },

      initEditBlock(date,record){
        this.currentEditRecordId = date +'@'+record.id;
        // console.log(record);
        this.currentEdit.currentEditRecordDate = date;
        this.currentEdit.currentEditRecordId = record.id;
        this.currentEdit.currentEditRecordName = record.item;
        this.currentEdit.currentEditRecordType = record.type;
        this.currentEdit.currentEditRecordCost = Number(record.number);
        // console.log(this.currentEdit);
      },

      editSubmit(){
        let editSuccess = this.editRecord(this.currentEdit);
        this.currentEditRecordId = null;
        // toastr['success']('success');
      },

      submit(){
        //verify
        if (this.$store.state.newRecord.newRecordType == null) {
          alert("you should select a type first");
          return;
        }

        if (this.$store.state.newRecord.newRecordName == null || this.$store.state.newRecord.newRecordName.length == 0) {
          alert("you should enter what you buy");
          return;
        }

        if (this.$store.state.newRecord.newRecordPrice == null || isNaN(parseInt(this.$store.state.newRecord.newRecordPrice)) || parseInt(this.$store.state.newRecord
            .newRecordPrice) < 0) {
          alert("you should enter a number");
          return;
        }
        this.currentModalMode = this.modalMode.MODAL_MODE_ADD;
        this.newrecordSubmit();
        this.recordModalHide();
      },

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
        return (month < 10) ? '0' + month : '' + month;
      },

      getDateDay(date) {
        let day = parseInt(new Date(date).getDate());
        return (day < 10) ? '0' + day : '' + day;
      },

      changeCurrentRecordType(typename) {
        this.$store.commit(mutationType.V_MODEL_NEWRECORD_TYPE, typename);
      },

      //for mouse event listener
      recordDataEditMouseEnter(e) {
        let targetEditBlock = e.target.querySelector('.recordDataEdit');
        if(targetEditBlock)
          targetEditBlock.classList.remove("hide");
      },
      recordDataEditMouseLeave(e) {
        let targetEditBlock = e.target.querySelector('.recordDataEdit');
        if(targetEditBlock)
          targetEditBlock.classList.add("hide");
      },

      //record adding animation
      enterAnimation: function (el, done) {
        var delay = el.dataset.index * 150
        setTimeout(function () {
          $(el).velocity("stop").velocity("transition.slideDownBigIn", {
            complete: done
          })
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
          }, {
            complete: done
          })
        }, delay)
      },
    }
  }

</script>
<style lang="scss">
  input#datepicker {
    // opacity: .4;
    font-size: large;
    height: 2rem; // width: 80px;
    border: 0px;
    background: transparent;
    outline: none !important; // padding: .75em .5em;
    // font-size: 100%;
    // border: 1px solid #ccc;
    // width: 100%
  }

  #toast-container.toast-bottom-center{
    bottom:1rem;
  }

</style>

<style lang="scss" scoped>
  @import "~bootstrap/scss/bootstrap-grid.scss";
  $topNavColor:#58B09C;
  $recordContainerPadding: 1rem;
  $app-color:#CAF7E2;
  $edit-color:#b6decb;
  $light-icon-color:#6c757d;
  $text-color:#1F2D3D;
  $recordTypeContainerBGC:#EEE;
  $vividColor:#F17E29;
  $lightGray:#6c757d8a;
  $button-text-color:rgb(50, 73, 99);

  #recordAddingDialog {
    h5 {
      margin-bottom: 0;
    }

    .modal-body {
      padding-bottom: 0;
    }
  }

  .functionBtnContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1rem 0 0 0;


    .funcBtn.btn.btn-outline-success {
      margin: 0 5px;
      border-color: $topNavColor;
      color: $topNavColor;

      &:hover {
        background: $topNavColor;
        color: white;
      }
    }
  }

  .wholeMonthRecord {
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

  .recordsContainer {
    position: relative;
    // color:$topNavColor;

    .totalSumThisMonthContainer {
      margin: 1rem 0 4rem 0;
      font-size: xx-large;
      display: flex;
      justify-content: space-between;
      font-weight: 900;
      border-bottom: 1px solid;
    }
  }

  .recordContainer {
    width: -webkit-fill-available; // position: absolute;
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
    .recordDisplay{
      display: flex;
      background: $app-color;
      color: $text-color;
      flex-direction: row;
      padding: 1rem;
      align-items: center;
      height: -webkit-fill-available;
    }

    .recordEdit{
      display: flex;
      background: $edit-color;
      color: $text-color;
      flex-direction: row;
      padding: 1rem;
      align-items: center;
      height: -webkit-fill-available;
    }
  }

  .recordDataItem.recordDataIcon {
    width:30px;
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
  .fa-trash-alt,
  .fa-times-circle,
  .fa-check-circle{
    color: $light-icon-color;
  }

  .recordTypeButtonContainer {
    width: 100%;
    margin: .3rem .5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;

    &:hover {
      cursor: pointer;
      color: $vividColor;

      .iconContainer {
        .newRecordIconBackGround {
          color: $vividColor;
          opacity: .7;
        }
        .newRecordIcon {
          color: white;
        }
      }
    }

    .iconTag {
      font-size: medium;
      font-weight: 300;
      width: max-content;
    }
  }

  .newRecordContainer {
    // padding: 1rem;
    // background: $app-color;
    // margin-bottom: 3rem;
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
    flex: 1; // justify-content: center;
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

  .recordInputDatePickerContainter {
    display: flex;
    align-items: center;
    flex: 1;
    margin-bottom: .3rem;

    .recordDateIconContainer {
      text-align: center;
      width: 35px;
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
        width: 35px;
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

  .recordEdit{
    input {
        font-size: 16px;
        height: 2rem;
        border: 0px;
        background: transparent;
        border-bottom: 1px solid #00000025;

        &:focus {
          outline: none !important;
        }
    }

    .recordInputIcon {
      margin-right: 8px;
    }

    .recordDataEditName{
      display: flex;
      align-items: center;

      .recordDataEditIcon {
        flex:0
      }

      input{
        margin-left: 1rem;
        flex:1
      }
    }

    .recordDataEditNumber{
      margin-left:1rem;
      display: flex;
      align-items: center;

      .recordDataEditIcon {
        flex:0
      }

      input{
        width: 80px;
        flex:1
      }
    }

    .recordDataEditSubmit{
      position: absolute;
      width:3.5rem;
      right:1rem
    }
  }

 

</style>

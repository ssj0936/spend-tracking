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
            datepicker(id="datepicker",v-model="newRecord.newRecordDate",format="yyyy-MM-dd",:placeholder="strings.placeholder_newRecordDate")
          .recordInputContainer
            .recordInputNameContainer
              .recordTypeIconContainer
                i.recordTypeIcon.recordInputIcon.fa-lg.fas.fa-pencil-alt
              input.newRecordNameInput(v-model="newRecord.newRecordName",:placeholder="getNewRecordPlaceholder()")
            .recordInputCostContainer
              i.recordInputIcon.fas.fa-dollar-sign.fa-lg
              input.newRecordCostInput(v-model="newRecord.newRecordPrice",type="number",onkeydown="javascript: return event.keyCode == 69 ? false : true" ,:placeholder="strings.placeholder_newRecordItemPrice")
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
          .recordsTimeSwitchContainer.fa-2x
            .switchBtnContainer(@click="recordSwitchMonth('minus')")
              i.fas.fa-angle-left
            .recordsTimeSwitchShowText {{this.currentRecordDate.year+"-"+this.currentRecordDate.month}}
            .switchBtnContainer(@click="recordSwitchMonth('add')")
              i.fas.fa-angle-right
          transition-group(:css="false",@leave="leaveWholeAnimation",@enter="enterWholeAnimation")
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
                      span(v-on:click="deleteRecord(recordPerDay.date,record.id)")
                        i.recordDataEditIcon.far.fa-trash-alt
      <!--.spendingChart.col-md-->
        <!--p CHART-->
</template>
<script>
  import Datepicker from 'vuejs-datepicker';

  import fontawesome from '@fortawesome/fontawesome'
  import {
    faUtensils,
    faCoffee,
    faMobileAlt,
    faHandHoldingUsd
  } from '@fortawesome/fontawesome-free-solid'
  import {
    faTrashAlt,
    faEdit
  } from '@fortawesome/fontawesome-free-regular'


  var spendingTypeObj = (name, iconname, dataicon,bgc) => {
    return {
      typename: name,
      iconClassname: iconname,
      dataicon: dataicon,
      bgc:bgc
    }
  }

  var recordObj = (date, record) => {
    return {
      date: date,
      record: record,
    }
  }

  var recordObjDay = (id, item, type, number) => {
    return {
      "id": id,
      "item": item,
      "type": type,
      "spendingType": (type == "incoming") ? "in" : "out",
      "number": number
    }
  }

  // https://coolors.co/474747-f17e29-ffffff-58b09c-caf7e2
  export default {
    name: "mainPage",
    components:{
        Datepicker,
    },
    data() {
      return {
        records: [
          recordObj("2018-04-20", [recordObjDay(0, "McDonald", "Food", 140)]),
          recordObj("2018-03-27", [recordObjDay(0, "Coffee", "Drink", 96)]),
          recordObj("2018-03-26", [recordObjDay(0, "Breakfast", "Food", 17)]),
          recordObj("2018-03-25", [
            recordObjDay(0, "Breakfast", "Food", 150),
            recordObjDay(1, "Dinner", "Food", 510),
            recordObjDay(2, "Coke", "Drink", 60),
            recordObjDay(3, "Rack", "Digital", 195)
          ]),
          recordObj("2018-03-23", [recordObjDay(0, "Lunch", "Food", 169)]),
          recordObj("2018-03-22", [recordObjDay(0, "Lunch", "Food", 169)]),
          recordObj("2018-03-20", [recordObjDay(0, "Lunch", "Food", 169)]),
          recordObj("2018-03-05", [recordObjDay(0, "Salary", "Income", 51000)])
        ],
        spendingTypeList: [
          this.spendingTypeObj("Food", "fas fa-utensils", "utensils",'#ff9b6a'),
          this.spendingTypeObj("Drink", "fas fa-coffee", "coffee",'#f1b8e4'),
          this.spendingTypeObj("Digital", "fas fa-mobile-alt", "mobile-alt",'#d9b8f1'),
          this.spendingTypeObj("Transport", "fas fa-taxi", "taxi",'#f1ccb8'),
          this.spendingTypeObj("Entertainment", "fas fa-gamepad", "gamepad",'#f1f1b8'),
          this.spendingTypeObj("Housing", "fas fa-home", "home",'#b8f1ed'),
          this.spendingTypeObj("Medical", "fas fa-briefcase-medical", "briefcase-medical",'#b8f1cc'),
          this.spendingTypeObj("Other", "fas fa-globe", "globe",'#e7dac9'),
          this.spendingTypeObj("Living Cost", "fas fa-clipboard-list", "clipboard-list",'#b7d28d'),
          this.spendingTypeObj("Income", "fas fa-hand-holding-usd", "hand-holding-usd",'#dcff93'),

        ],
        itemsPerRow: 5,
        isDataEmpty: false,
        dateSpliter: '-',
        strings: {
          emptyText: "還沒有開始記帳喔！",
          placeholder_newRecordItemName: "Enter what you buy",
          placeholder_newRecordItemPrice: "Price",
          placeholder_newRecordDate: "Select Date",
          text_newRecoedSubmit: "Add",
        },

        newRecord: this.getNewRecord(),
        currentRecordDate:{
          year:new Date().getFullYear(),
          month:new Date().getMonth()+1,
        }
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
      getTypeColorArr(){
        return this.bgc;
      },

      getSortedRecords(){
        return this.records.sort((a,b)=>{
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        })
      },

      getDisplayRowCount() {
        return Math.ceil(this.spendingTypeList.length / this.itemsPerRow);
      },

      //used for 'watch'
      //dont want to watch every property in object
      getNewRecordType() {
        return this.newRecord.newRecordType;
      },

      getToday(){
        return new Date();
      },

      getYear(){
        console.log(new Date().getFullYear())
        return new Date().getFullYear();
      },

      getMonth(){
        console.log(new Date().getMonth()+1)
        return new Date().getMonth()+1;
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
      getNewRecord(){
        return {
          newRecordDate: new Date(),
          newRecordName: null,
          newRecordPrice: null,
          newRecordType: null,
        }
      },

      spendingTypeObj(name, iconname, dataicon,bgc){
        return {
          typename: name,
          iconClassname: iconname,
          dataicon: dataicon,
          bgc:bgc
        }
      },

      newrecordSubmit() {
        //verify
        if (this.newRecord.newRecordType == null) {
          alert("you should select a type first");
          return;
        }

        if (this.newRecord.newRecordName == null || this.newRecord.newRecordName.length == 0) {
          alert("you should enter what you buy");
          return;
        }

        if (this.newRecord.newRecordPrice == null || isNaN(parseInt(this.newRecord.newRecordPrice)) || parseInt(this.newRecord
            .newRecordPrice) < 0) {
          alert("you should enter a number");
          return;
        }

        let date = (this.newRecord.newRecordDate == null) ? new Date() : new Date(this.newRecord.newRecordDate),
          y = date.getFullYear(),
          m = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1),
          d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        this.newRecord.newRecordDate = `${y}-${m}-${d}`;
        let newRecordDate = this.newRecord.newRecordDate;
        // console.log(newRecordDate);

        //insert to records
        let find = this.records.filter((obj) => {
          return obj.date == newRecordDate;
        })
        if (find.length > 0) {
          // console.log("existed");
          let id = find[0].record[find[0].record.length - 1].id + 1 ;
          find[0].record.push(recordObjDay(id, this.newRecord.newRecordName, this.newRecord.newRecordType, Number(this.newRecord.newRecordPrice)));
        } else {
          // console.log("not existed");
          this.records.push(recordObj(this.newRecord.newRecordDate,[recordObjDay(1, this.newRecord.newRecordName, this.newRecord.newRecordType, Number(this.newRecord.newRecordPrice))]));
        }
        // console.log(this.records);
        this.resetNewRecord();
      },

      resetNewRecord(){
        for(let key in this.newRecord){
          if(key == "newRecordDate") continue;
          this.newRecord[key] = null;
        }
      },

      getSubArrayBelongToThisItem(index) {
        return this.spendingTypeList.slice((index - 1) * this.itemsPerRow, index * this.itemsPerRow)
      },

      getNewRecordPlaceholder(){
        if(this.newRecord.newRecordType == null)
          return this.strings.placeholder_newRecordItemName;
        else{
          return this.newRecord.newRecordType;
        }
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
      // getYear(date) {
      //   return date.split(this.dateSpliter)[0];
      // },
      getDateMonth(date) {
        return date.split(this.dateSpliter)[1];
      },
      getDateDay(date) {
        return date.split(this.dateSpliter)[2];
      },
      recordDataEditMouseEnter(e) {
        let targetEditBlock = e.target.querySelector('.recordDataEdit');
        targetEditBlock.classList.remove("hide");
      },
      recordDataEditMouseLeave(e) {
        let targetEditBlock = e.target.querySelector('.recordDataEdit');
        targetEditBlock.classList.add("hide");
      },
      changeCurrentRecordType(typename) {
        this.newRecord.newRecordType = typename;
      },
      getCurrentRecordType() {
        let currentRecordType = this.newRecord.newRecordType;
        let find = this.spendingTypeList.filter((obj) => {
          return obj.typename == currentRecordType
        })
        console.log(find);
        return (find.length == 0) ? "fas fa-pencil-alt" : find[0].iconClassname;
      },
      deleteRecord(date, recordId) {
        let parentObj = null,
          parentArray = null,
          targetObj = null;

        let find = this.records.filter(function (obj) {
          return obj.date == date;
        })

        if (find.length != 0) {
          parentObj = find[0];
          parentArray = find[0].record;

          let find2 = parentArray.filter(function (obj) {
            return obj.id == recordId;
          });
          targetObj = find2[0];
        }


        //do deleteing job
        if (parentArray && targetObj) {

          //last one element
          if (parentArray.length != 1) {
            parentArray.splice(parentArray.indexOf(targetObj), 1);
          } else {
            this.records.splice(this.records.indexOf(parentObj), 1);
          }

          if (this.records.length == 0)
            this.isDataEmpty = true;
        } else {
          console.log("something wrong, cannot find this record in data");
          return
        }
      },
      iconEnterAnimation(key){
        Velocity($(`.iconTag[data-key='${key}']`),{opacity:1},150)
        // console.log(e.target);
      },

      iconLeaveAnimation(key){
        Velocity($(`.iconTag[data-key='${key}']`),{opacity:0},0)
      },

      enterAnimation: function (el, done) {
        var delay = el.dataset.index * 150
        setTimeout(function () {
          Velocity(
            el,
            "transition.slideDownBigIn",
            { complete: done }
          )
        }, delay)
      },
      leaveAnimation: function (el, done) {
        var delay = el.dataset.index * 150
        setTimeout(function () {
          Velocity(el,{
              opacity: 0,
              height: 0,
              'margin-bottom': 0
            },{
              complete: done
            })
        }, delay)
      },

      enterWholeAnimation: function (el, done) {
        $(el).velocity("stop").velocity("transition.slideDownIn",{ complete: done });
      },
      leaveWholeAnimation: function (el, done) {
        $(el).velocity("stop").velocity({opacity:0},{ duration:0,complete: done });
      },
      customFormatter(date) {
        return moment(date).format('MMMM Do YYYY, h:mm:ss a');
      },
      recordSwitchMonth(type){
        
        let dateStr = `${this.currentRecordDate.year}-${this.currentRecordDate.month}-1`,
            date = new Date(dateStr);

        if(type == "minus"){
          date.setMonth(date.getMonth()-1);
          this.currentRecordDate.year = date.getFullYear();
          this.currentRecordDate.month = date.getMonth()+1;
        }else if(type == "add"){
          date.setMonth(date.getMonth()+1);
          this.currentRecordDate.year = date.getFullYear();
          this.currentRecordDate.month = date.getMonth()+1;
        }
        // console.log(this.currentRecordDate);
      }
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

  $c1:#ff9b6a;
  $c2:#f1b8e4;
  $c3:#d9b8f1;
  $c4:#f1ccb8;
  $c5:#f1f1b8;
  $c6:#b8f1ed;
  $c7:#b8f1cc;
  $c8:#e7dac9;
  $c9:#b7d28d;
  $c10:#dcff93;

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

  .recordContainer {
    margin-bottom: 3rem;
    flex-direction: column;
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
    // padding-bottom: 0.875em;
    // width: 4rem;

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

    // .iconContainer:hover {
    //   .newRecordIconBackGround {
    //     color: $vividColor;
    //     opacity: .7;
    //   }

    //   .newRecordIcon {
    //     color: white;
    //   }
    // }

    .iconTag{
      font-size: medium;
      font-weight: 300;
      width: max-content;
      // position: absolute;
      // top: 1.75em;
      // opacity: 0;
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
      background: transparent; // border-bottom: 1px solid $lightGray;
    }

    input:focus {
      outline: none !important;
    }

    .recordInputIcon {
      margin-right: 8px;
    }
  }

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

<template lang="pug">
.container
    div.emptyBlock(v-if="isDataEmpty")
      h2 {{strings.emptyText}}
    div.mainPage.row(v-else)
      .spendingTable.col-md
        .newRecordContainer
          .recordInputContainer
            .recordInputNameContainer
              .recordTypeIconContainer(style="width:35px")
                i.recordTypeIcon.recordInputIcon.fa-lg.fas.fa-pencil-alt
              input.newRecordNameInput(v-model="newRecord.newRecordName",:placeholder="strings.placeholder_newRecordItemName")
            .recordInputCostContainer
              i.recordInputIcon.fas.fa-dollar-sign.fa-lg
              input.newRecordCostInput(v-model="newRecord.newRecordPrice",type="number",onkeydown="javascript: return event.keyCode == 69 ? false : true" ,:placeholder="strings.placeholder_newRecordItemPrice")
          .recordTypeContainer.row
            .recordTypeRow.col-md(v-for="i in getDisplayRowCount")
              .recordTypeButtonContainer.fa-2x(v-for="type in getSubArrayBelongToThisItem(i)")
                span.fa-layers.fa-fw.iconContainer(@click="changeCurrentRecordType(type.typename)",@mouseenter="iconEnterAnimation",@mouseleave="iconLeaveAnimation",)
                  i.fas.fa-square.newRecordIconBackGround
                  i(:class="type.iconClassname+' fa-inverse newRecordIcon'",data-fa-transform="shrink-6")
                div.iconTag {{type.typename}}
          .recordSubmitContainer
            button.newRecordSubmit(@click="newrecordSubmit") {{strings.text_newRecoedSubmit}}
        transition-group(:css="false",@leave="leaveAnimation",@enter="enterAnimation")
          div.recordContainer(v-for="recordPerDay in getSortedRecords",:key="recordPerDay.date")
            div.recordDateContainer
              .recordDateTitle 
                .dateMonthDay.dateBlock
                  .month {{getMonth(recordPerDay.date)}}
                  .day {{getDay(recordPerDay.date)}}
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
      .spendingChart.col-md
        p CHART
</template>
<script>
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


  var spendingTypeObj = (name, iconname, dataicon) => {
    return {
      typename: name,
      iconClassname: iconname,
      dataicon: dataicon
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
    data() {
      return {
        records: [
          recordObj("2018-03-27", [recordObjDay(0, "Coffee", "drinking", 96)]),
          recordObj("2018-03-26", [recordObjDay(0, "Breakfast", "eating", 17)]),
          recordObj("2018-03-25", [
            recordObjDay(0, "Breakfast", "eating", 150),
            recordObjDay(1, "Dinner", "eating", 510),
            recordObjDay(2, "Coke", "drinking", 60),
            recordObjDay(3, "Rack", "3c", 195)
          ]),
          recordObj("2018-03-23", [recordObjDay(0, "Lunch", "eating", 169)]),
          recordObj("2018-03-22", [recordObjDay(0, "Lunch", "eating", 169)]),
          recordObj("2018-03-20", [recordObjDay(0, "Lunch", "eating", 169)]),
          recordObj("2018-03-05", [recordObjDay(0, "Salary", "incoming", 51000)])
        ],
        spendingTypeList: [
          spendingTypeObj("eating", "fas fa-utensils", "utensils"),
          spendingTypeObj("drinking", "fas fa-coffee", "coffee"),
          spendingTypeObj("3c", "fas fa-mobile-alt", "mobile-alt"),
          spendingTypeObj("traffic", "fas fa-taxi", "taxi"),
          spendingTypeObj("entertainment", "fas fa-gamepad", "gamepad"),
          spendingTypeObj("home", "fas fa-home", "home"),
          spendingTypeObj("medical", "fas fa-briefcase-medical", "briefcase-medical"),
          spendingTypeObj("other", "fas fa-globe", "globe"),
          spendingTypeObj("living cost", "fas fa-clipboard-list", "clipboard-list"),
          spendingTypeObj("incoming", "fas fa-hand-holding-usd", "hand-holding-usd"),

        ],
        itemsPerRow: 5,
        isDataEmpty: false,
        dateSpliter: '-',
        strings: {
          emptyText: "還沒有開始記帳喔！",
          placeholder_newRecordItemName: "Enter what you buy",
          placeholder_newRecordItemPrice: "Price",
          text_newRecoedSubmit: "Add",
        },

        newRecord: {
          newRecordDate: null,
          newRecordName: null,
          newRecordPrice: null,
          newRecordType: null,
        },
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
      }
    },
    methods: {
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

        if (this.newRecord.newRecordDate == null) {
          let date = new Date(),
            y = date.getFullYear(),
            m = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1),
            d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
          this.newRecord.newRecordDate = `${y}-${m}-${d}`;
        }
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
          this.newRecord[key] = null;
        }
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
      getYear(date) {
        return date.split(this.dateSpliter)[0];
      },
      getMonth(date) {
        return date.split(this.dateSpliter)[1];
      },
      getDay(date) {
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
      iconEnterAnimation(e){
        console.log(e.target);
      },

      iconLeaveAnimation(e){
        console.log(e.target);
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
        console.log($(el).get(0));
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
      }
    }
  }

</script>
<style lang="scss" scoped>
  @import "~bootstrap/scss/bootstrap-grid.scss";
  $recordContainerPadding: 1rem;
  $app-color:#CAF7E2;
  $light-icon-color:#6c757d;
  $text-color:#1F2D3D;
  $recordTypeContainerBGC:#DDD;
  $vividColor:#F17E29;
  $lightGray:#6c757d8a;
  $button-text-color:rgb(50, 73, 99);

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
    display: inline-flex;
    margin: 0 .5rem;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding-bottom: 0.875em;

    .iconTag{
      font-size: medium;
      font-weight: 300;
      width: max-content;
      position: absolute;
      top: 1.75em;
      opacity: 0;
    }
  }

  .newRecordContainer {
    padding: 1rem;
    background: $app-color;
    margin-bottom: 3rem;
  }

  .iconContainer {
    .newRecordIconBackGround {
      transition: all .3s;
    }

    .newRecordIcon {
      transition: all .3s;
    }
  }

  .iconContainer:hover {
    .newRecordIconBackGround {
      color: $vividColor;
      opacity: .7;
    }

    .newRecordIcon {
      color: white;
    }
  }

  .recordTypeRow {
    display: inline-flex;
    justify-content: center;
  }

  input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::-webkit-input-placeholder {
    opacity: .4;
  }

  .recordTypeContainer {
    padding: .5rem 0; // margin-bottom: 2rem;
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

</style>

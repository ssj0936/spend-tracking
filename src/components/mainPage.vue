<template lang="pug">
  .container
    div.emptyBlock(v-if="isDataEmpty")
      h2 {{emptyText}}
    div.mainPage.row(v-else)
      .spendingTable.col-md
        transition-group(:css="false",@leave="leaveAnimation")
          div.recordContainer(v-for="recordPerDay in records",:key="recordPerDay.date")
            div.recordDateContainer
              .recordDateTitle 
                .dateMonthDay.dateBlock
                  .month {{getMonth(recordPerDay.date)}}
                  .day {{getDay(recordPerDay.date)}}
              .recordDateSum {{getDaySum(recordPerDay)}}
            transition-group(:css="false",@leave="leaveAnimation")
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
  fontawesome.library.add(faUtensils)
  fontawesome.library.add(faCoffee)
  fontawesome.library.add(faMobileAlt)
  fontawesome.library.add(faHandHoldingUsd)
  fontawesome.library.add(faTrashAlt)
  fontawesome.library.add(faEdit)


  // https://coolors.co/474747-f17e29-ffffff-58b09c-caf7e2
  export default {
    name: "mainPage",
    data() {
      return {
        records: [{
          date: "2018-03-27",
          record: [{
            "id": 1,
            "item": "Coffee",
            "spendingType": "out",
            "type": "drinking",
            "number": 96
          }]
        }, {
          date: "2018-03-26",
          record: [{
            "id": 1,
            "item": "Breakfast",
            "type": "eating",
            "spendingType": "out",
            "number": 17
          }]
        }, {
          date: "2018-03-25",
          record: [{
            "id": 1,
            "item": "Breakfast",
            "type": "eating",
            "spendingType": "out",
            "number": 150
          }, {
            "id": 2,
            "item": "Dinner",
            "type": "eating",
            "spendingType": "out",
            "number": 510
          }, {
            "id": 3,
            "item": "Coke",
            "type": "drinking",
            "spendingType": "out",
            "number": 60
          }, {
            "id": 4,
            "item": "Rack",
            "type": "3c",
            "spendingType": "out",
            "number": 195
          }, ]

        }, {
          date: "2018-03-23",
          record: [{
            "id": 1,
            "item": "Lunch",
            "type": "eating",
            "spendingType": "out",
            "number": 169
          }]

        }, {
          date: "2018-03-22",
          record: [{
            "id": 1,
            "item": "Lunch",
            "type": "eating",
            "spendingType": "out",
            "number": 169
          }]

        }, {
          date: "2018-03-20",
          record: [{
            "id": 1,
            "item": "Lunch",
            "type": "eating",
            "spendingType": "out",
            "number": 169
          }]

        }, {
          date: "2018-03-05",
          record: [{
            "id": 1,
            "item": "Salary",
            "type": "incoming",
            "spendingType": "in",
            "number": 51000
          }]

        }],
        isDataEmpty: false,
        emptyText: "還沒有開始記帳喔！",
        dateSpliter: '-'
      }
    },
    created() {},
    methods: {
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
        // console.log(record);
        switch (record.type) {
          case "eating":
            return 'fas fa-utensils';
            break;
          case "drinking":
            return 'fas fa-coffee';
            break;
          case "3c":
            return 'fas fa-mobile-alt';
            break;
          case "incoming":
            return 'fas fa-hand-holding-usd';
            break;
        }
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
          if(parentArray.length != 1){
            parentArray.splice(parentArray.indexOf(targetObj), 1);
          }else{
            this.records.splice(this.records.indexOf(parentObj), 1);
          }

          //need to delete whole day too
          // if (parentArray.length == 0) {
          //   this.records.splice(this.records.indexOf(parentObj), 1)
          // }
          // console.log(this.records);
        }
        //cannot find target, something get wrong
        else {
          console.log("something wrong, cannot find this record in data");
          return
        }
      },
      leaveAnimation: function (el, done) {
        console.log(el);
        var delay = el.dataset.index * 150
        setTimeout(function () {
          Velocity(
            el,
            { opacity: 0, height: 0 ,'margin-bottom':0},
            { complete: done }
          )
        }, delay)
      }
    }
  }

</script>
<style lang="scss" scoped>
  @import "~bootstrap/scss/bootstrap-grid.scss";
  $recordContainerPadding: 1rem;
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
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
    background: #CAF7E2;
    color: #1F2D3D;
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
    color: #6c757d;
  }

</style>

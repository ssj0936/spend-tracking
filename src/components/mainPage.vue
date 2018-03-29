<template lang="pug">
  .container
    div.emptyBlock(v-if="isDataEmpty")
      h2 {{emptyText}}
    div.mainPage.row(v-else)
      .spendingTable.col-md
        div.recordContainer(v-for="recordPerDay in records")
          div.recordDateContainer
            .recordDateTitle 
              <!--.dateYear.dateBlock {{getYear(recordPerDay.date)}}-->
              .dateMonthDay.dateBlock
                .month {{getMonth(recordPerDay.date)}}
                .day {{getDay(recordPerDay.date)}}
            .recordDateSum {{getDaySum(recordPerDay)}}
          div.recordDataContainer(v-for="record in recordPerDay.record",v-on:mouseenter="recordDataEditHover")
            div.recordDataItem.recordDataIcon
              i(v-bind:class="getIconClassName(record)")
            div.recordDataItem.recordDataName {{record.item}}
            div.recordDataItem.recordDataNumber {{record.number}}
            div.recordDataItem.recordDataEdit.hide
              i.recordDataEditIcon.far.fa-edit
              i.recordDataEditIcon.far.fa-trash-alt

      .spendingChart.col-md
        p CHART

</template>
<script>

import fontawesome from '@fortawesome/fontawesome'
import {faUtensils,faCoffee, faMobileAlt, faHandHoldingUsd} from '@fortawesome/fontawesome-free-solid'
import {faTrashAlt,faEdit} from '@fortawesome/fontawesome-free-regular'
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
          record:[{
            "item": "咖啡",
            "spendingType": "out",
            "type":"drinking",
            "number": 96
          }]
        }, {
          date: "2018-03-26",
          record:[{
            "item": "早餐",
            "type":"eating",
            "spendingType": "out",
            "number": 17
          }]
        }, {
          date: "2018-03-25",
          record:[{
            "item": "早餐",
            "type":"eating",
            "spendingType": "out",
            "number": 150
          },{
            "item": "晚餐",
            "type":"eating",
          "spendingType": "out",
          "number": 510
          },{
            "item": "可樂",
            "type":"drinking",
          "spendingType": "out",
          "number": 60
          },{
            "item": "平板架",
            "type":"3c",
          "spendingType": "out",
          "number": 195
          },]
          
        }, {
          date: "2018-03-23",
           record:[{
             "item": "午餐",
             "type":"eating",
          "spendingType": "out",
          "number": 169
          }]
         
        }, {
          date: "2018-03-22",
           record:[{
             "item": "午餐",
             "type":"eating",
          "spendingType": "out",
          "number": 169
          }]
         
        }, {
          date: "2018-03-20",
           record:[{
             "item": "午餐",
             "type":"eating",
          "spendingType": "out",
          "number": 169
          }]
         
        }, {
          date: "2018-03-05",
          record:[{
             "item": "薪水",
             "type":"incoming",
          "spendingType": "in",
          "number": 51000
          }]
          
        }],
        isDataEmpty: false,
        emptyText: "還沒有開始記帳喔！",
        dateSpliter:'-'
      }
    },
    created() {
    },
    methods: {
      getDaySum(dayRecord){
        var sum = 0;
        for(let r of dayRecord.record){
          if(r.spendingType == "in")
            sum +=r.number;
          else
            sum -=r.number;
        }
        if(sum<0) return (sum*-1).toString();
        else return `+${sum.toString()}`;
      },

      getIconClassName(record){
        // console.log(record);
        switch(record.type){
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
      getYear(date){
        return date.split(this.dateSpliter)[0];
      },
      getMonth(date){
        return date.split(this.dateSpliter)[1];
      },
      getDay(date){
        return date.split(this.dateSpliter)[2];
      },
      recordDataEditHover(e){
        console.log(e.target);
      }
    }
  }

</script>
<style lang="scss" scoped>
    @import "~bootstrap/scss/bootstrap-grid.scss";
    $recordContainerPadding : 1rem;

    .mainPage{
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

    .recordContainer{
        // display: flex;
        // background: #F9A03F;
        margin-bottom: 3rem;
        flex-direction: column;
    }

    .recordDateContainer{
      padding-left: $recordContainerPadding;
      padding-right: $recordContainerPadding;
      margin-bottom: $recordContainerPadding;
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: space-between;
      opacity: .5;
    }

    .dateBlock{
      font-size: 0.8em;
      display: inline-block;
    }
    .dateYear.dateBlock{
      font-size: 1.8em;
    }
    .dateBlock .month{
      position: relative;
      width: 35px;
      text-align: left;
      line-height: 1;
    }

    .dateBlock .day{
     width: 35px;
      text-align: right;
      line-height: 1;
    }

    .dateBlock .month::after{
     content: '\FF0F';
      font-size: 220%;
      font-weight: 100;
      position: absolute;
      top: -4px;
      right: 3px;
    } 

    .recordDateContainer .recordDateTitle{
      // flex:1 1 auto;
          align-items: center;
    display: flex;
    }

    .recordDateContainer .recordDateSum{
      // flex:0 0 5rem;
      text-align: right;
      font-weight: bold;
    }


    .recordDataContainer{
        display: flex;
        background: #CAF7E2;
        color: #1F2D3D;
        // opacity: 0.3;
        margin-bottom: .2rem;
        flex-direction: row;
        height: 3rem;
        padding:1rem;
        align-items: center;
        // justify-content: space-between;
    }
    .recordDataItem.recordDataIcon{
      flex:0 30px;
      text-align: center;
    }

    
    .recordDataItem.recordDataName{
      padding-left: 1rem;
      flex:1;
    }
    .recordDataItem.recordDataNumber{
      flex:0;
      // opacity: .5;
    }
    .recordDataItem.recordDataEdit.hide{
      width: 0px;
      overflow: hidden;
    }

    .recordDataItem.recordDataEdit{
      display: flex;
      width: 3.5rem;
      justify-content: flex-end;
    }

    .recordDataEditIcon{
      width: 20px;
      margin-left: 5px;
    }
</style>

import Vue from 'vue';
import * as types from './mutations_type';
import * as fakeData from '../assets/fakeData.js';


//state
export const state = {
  currentDisplayYear: new Date().getFullYear(),
  currentDisplayMonth: new Date().getMonth() + 1,

  records: fakeData.records,
  spendingTypeList: fakeData.spendingTypeList,
  isDataEmpty: false,
  strings: {
    emptyText: "還沒有開始記帳喔！",
    placeholder_newRecordItemName: "Enter what you buy",
    placeholder_newRecordItemPrice: "Price",
    placeholder_newRecordDate: "Select Date",
    text_newRecoedSubmit: "Add",
  },
  newRecord: fakeData.getNewRecord(),
}

//mutations
export const mutations = {
  [types.CURRENT_MONTH_INCREASE](state) {
    let dateStr = `${state.currentDisplayYear}-${state.currentDisplayMonth}-1`,
      date = new Date(dateStr);

    date.setMonth(date.getMonth() + 1);
    state.currentDisplayYear = date.getFullYear();
    state.currentDisplayMonth = date.getMonth() + 1;
    // console.log(types.CURRENT_MONTH_INCREASE);
  },

  [types.CURRENT_MONTH_DECREASE](state) {
    let dateStr = `${state.currentDisplayYear}-${state.currentDisplayMonth}-1`,
      date = new Date(dateStr);

    date.setMonth(date.getMonth() - 1);
    state.currentDisplayYear = date.getFullYear();
    state.currentDisplayMonth = date.getMonth() + 1;

    // console.log(types.CURRENT_MONTH_DECREASE);
  },

    [types.V_MODEL_NEWRECORD_DATE](state,value) {
      state.newRecord.newRecordDate = value;
    },

  [types.V_MODEL_NEWRECORD_NAME](state, value) {
    state.newRecord.newRecordName = value;
  },

  [types.V_MODEL_NEWRECORD_PRICE](state, value) {
    state.newRecord.newRecordPrice = value;
  },

  [types.V_MODEL_NEWRECORD_TYPE](state, value) {
    state.newRecord.newRecordType = value;
  },

  [types.NEW_RECORD_SUBMIT](state) {
    //verify
    if (state.newRecord.newRecordType == null) {
      alert("you should select a type first");
      return;
    }

    if (state.newRecord.newRecordName == null || state.newRecord.newRecordName.length == 0) {
      alert("you should enter what you buy");
      return;
    }

    if (state.newRecord.newRecordPrice == null || isNaN(parseInt(state.newRecord.newRecordPrice)) || parseInt(state.newRecord
        .newRecordPrice) < 0) {
      alert("you should enter a number");
      return;
    }

    let date = (state.newRecord.newRecordDate == null) ? new Date() : new Date(state.newRecord.newRecordDate),
      y = date.getFullYear(),
      m = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1),
      d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    state.newRecord.newRecordDate = `${y}-${m}-${d}`;
    let newRecordDate = state.newRecord.newRecordDate;
    // console.log(newRecordDate);

    //insert to records
    let find = state.records.filter((obj) => {
      return obj.date == newRecordDate;
    })
    if (find.length > 0) {
      // console.log("existed");
      let id = find[0].record[find[0].record.length - 1].id + 1;
      find[0].record.push(fakeData.recordObjDay(id, state.newRecord.newRecordName, state.newRecord.newRecordType, Number(state.newRecord.newRecordPrice)));
    } else {
      // console.log("not existed");
      state.records.push(fakeData.recordObj(state.newRecord.newRecordDate, [fakeData.recordObjDay(1, state.newRecord.newRecordName, state.newRecord.newRecordType, Number(state.newRecord.newRecordPrice))]));
    }
    // console.log(this.records);

    //reset new record
    for (let key in state.newRecord) {
      if (key == "newRecordDate") continue;
      state.newRecord[key] = null;
    }
  },

  [types.DELETE_RECORD](state, para) {
    let date = para.date,
      recordId = para.id;

    let parentObj = null,
      parentArray = null,
      targetObj = null;

    let find = state.records.filter(function (obj) {
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
        state.records.splice(state.records.indexOf(parentObj), 1);
      }

      if (state.records.length == 0)
        state.isDataEmpty = true;
    } else {
      console.log("something wrong, cannot find this record in data");
    }
  },
}

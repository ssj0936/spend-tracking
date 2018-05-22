import Vue from 'vue'
import mutations from './mutations'
import * as types from './mutations_type.js'

export const actionCurrentDisplayMonthIncrease = ({ commit }) => {
  // console.log('actionCurrentDisplayYearIncrease');
  commit(types.CURRENT_MONTH_INCREASE);
}

export const actionCurrentDisplayMonthDecrease = ({ commit }) => {
  // console.log('actionDecrease');
  commit(types.CURRENT_MONTH_DECREASE);
}

export const newrecordSubmit = ({ commit }) => {
  // console.log('actionDecrease');
  commit(types.NEW_RECORD_SUBMIT);
}

export const editRecord = ({ commit },para) => {
  // console.log('editRecord');
  // console.log(para);
  commit(types.EDIT_RECORD,para);
}

export const deleteRecord = ({ commit },para) => {
  // console.log('deleteRecord');
  // console.log(para);
  commit(types.DELETE_RECORD,para);
}

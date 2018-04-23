import Vue from 'vue'
import mutations from './mutations'
// 引入 mutations_type （引用同一個 key）
import * as types from './mutations_type.js'

export const actionCurrentDisplayMonthIncrease = ({ commit }) => {
  console.log('actionCurrentDisplayYearIncrease');
  commit(types.CURRENT_MONTH_INCREASE);
}

export const actionCurrentDisplayMonthDecrease = ({ commit }) => {
  console.log('actionDecrease');
  commit(types.CURRENT_MONTH_DECREASE);
}

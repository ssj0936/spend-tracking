import Vue from 'vue';
import * as types from './mutations_type';

//state
export const state = {
    currentDisplayYear : new Date().getFullYear(),
    currentDisplayMonth : new Date().getMonth()+1,
}

//mutations
export const mutations = {
    [types.CURRENT_MONTH_INCREASE](state){
        let dateStr = `${state.currentDisplayYear}-${state.currentDisplayMonth}-1`,
            date = new Date(dateStr);

        date.setMonth(date.getMonth()+1);
        state.currentDisplayYear = date.getFullYear();
        state.currentDisplayMonth = date.getMonth()+1;
        console.log(types.CURRENT_MONTH_INCREASE);
    },

    [types.CURRENT_MONTH_DECREASE](state){
        let dateStr = `${state.currentDisplayYear}-${state.currentDisplayMonth}-1`,
            date = new Date(dateStr);

        date.setMonth(date.getMonth()-1);
        state.currentDisplayYear = date.getFullYear();
        state.currentDisplayMonth = date.getMonth()+1;

        console.log(types.CURRENT_MONTH_DECREASE);
    }
}
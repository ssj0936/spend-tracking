const getCurrentDisplayYear = state =>{ return state.currentDisplayYear};
const getCurrentDisplayMonth = state =>{ return state.currentDisplayMonth};

const records = state =>{ return state.records};
const spendingTypeList = state =>{ return state.spendingTypeList};
const isDataEmpty = state =>{ return state.isDataEmpty};
const strings = state =>{ return state.strings};
const newRecord = state =>{ return state.newRecord};

export {getCurrentDisplayYear,getCurrentDisplayMonth,records,spendingTypeList,isDataEmpty,strings,newRecord}
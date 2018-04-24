export const getNewRecord = () => {
  return {
    newRecordDate: new Date(),
    newRecordName: null,
    newRecordPrice: null,
    newRecordType: null,
  }
};

export const recordObj = (date, record) => {
  return {
    date: date,
    record: record,
  }
}

export const recordObjDay = (id, item, type, number) => {
  return {
    "id": id,
    "item": item,
    "type": type,
    "spendingType": (type == "Income") ? "in" : "out",
    "number": number
  }
}

export const spendingTypeObj = (name, iconname, dataicon, bgc) => {
  return {
    typename: name,
    iconClassname: iconname,
    dataicon: dataicon,
    bgc: bgc
  }
};


export const records = [
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
];

export const spendingTypeList = [
  spendingTypeObj("Food", "fas fa-utensils", "utensils", '#ff9b6a'),
  spendingTypeObj("Drink", "fas fa-coffee", "coffee", '#f1b8e4'),
  spendingTypeObj("Digital", "fas fa-mobile-alt", "mobile-alt", '#d9b8f1'),
  spendingTypeObj("Transport", "fas fa-taxi", "taxi", '#f1ccb8'),
  spendingTypeObj("Entertainment", "fas fa-gamepad", "gamepad", '#f1f1b8'),
  spendingTypeObj("Housing", "fas fa-home", "home", '#b8f1ed'),
  spendingTypeObj("Medical", "fas fa-briefcase-medical", "briefcase-medical", '#b8f1cc'),
  spendingTypeObj("Other", "fas fa-globe", "globe", '#e7dac9'),
  spendingTypeObj("Living Cost", "fas fa-clipboard-list", "clipboard-list", '#b7d28d'),
  spendingTypeObj("Income", "fas fa-hand-holding-usd", "hand-holding-usd", '#dcff93'),
];

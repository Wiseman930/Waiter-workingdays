module.exports = function WaitersWorking(db){


  let getWaiters = [];

   async function deleteAll(){
    await db.none('DELETE FROM working_waiters WHERE names!=$1;', 'ADMIN');
    await db.none('DELETE FROM available_days;');
    return await db.manyOrNone('SELECT working_days FROM available_days')
  }
  async function registerAll(firstName, code){
   await db.none('INSERT INTO working_waiters(names, code) values($1, $2)', [firstName, code])
   }
   async function returnRegistered(){
    return await db.one('SELECT names,code FROM working_waiters')
   }
   async function loginNames(logNames, days){
    toNewDays = days
    let upperNames = logNames
    let CountMany;
    let storedNames = await db.oneOrNone('SELECT names FROM working_waiters WHERE names=$1', [upperNames])
    let storedNameID = await db.oneOrNone("SELECT id FROM working_waiters WHERE names=$1", [upperNames])

      if(storedNames == null){
          await db.none('INSERT INTO working_waiters(names) values($1)', [upperNames])
      }
     if(typeof days === 'object' && days.length >= 3){
      for (let i = 0; i < days.length; i++) {
            CountMany = await db.oneOrNone('SELECT count(*) FROM available_days WHERE working_days=$1 AND waiter_id=$2', [days[i], storedNameID.id])
            if( CountMany.count == 0){
              await db.manyOrNone('INSERT INTO available_days (working_days, waiter_id) values($1, $2)', [days[i], storedNameID.id])
            }
          }

      }
    }
   async function getNames(logNames, days){

    let upperNames = logNames
    let storedNameID = await db.oneOrNone("SELECT id FROM working_waiters WHERE names=$1", [upperNames]) || {}
    let weekDays = await db.manyOrNone('SELECT working_days FROM available_days WHERE waiter_id=$1', [storedNameID.id])
    let finalArray = weekDays.map(function (obj) {
      return String(obj.working_days);
    });

    if (days == undefined){
      days = []
    }
    if (typeof days === 'object' || typeof days === 'string'){
      let dayToArray = Array.from(days)
      res = finalArray.filter(item => !dayToArray.includes(item));
      for (let i = 0; i < res.length; i++) {
      await db.none('DELETE FROM available_days id WHERE working_days=$1 AND waiter_id=$2', [res[i], storedNameID.id])
        }
    }
  }

  async function usersForAdmin(id, days){

    let storedNameID = id;
    if(typeof days === 'object' && days.length >= 3){
      for (let i = 0; i < days.length; i++) {
            CountMany = await db.oneOrNone('SELECT count(*) FROM available_days WHERE working_days=$1 AND waiter_id=$2', [days[i], storedNameID])
            if( CountMany.count == 0){
              await db.manyOrNone('INSERT INTO available_days (working_days, waiter_id) values($1, $2)', [days[i], storedNameID])
            }
          }

      }
}

async function deleteAdmin(id, days){
  let storedNameID = id;
  let weekDays = await db.manyOrNone('SELECT working_days FROM available_days WHERE waiter_id=$1', [storedNameID])
  let finalArray = weekDays.map(function (obj) {
    return String(obj.working_days);
  });
  if (days == undefined){
    days = []
  }
  if (typeof days === 'object' || typeof days === 'string'){
    let stringToArray = Array.from(days)
    let filteredArray = finalArray.filter(item => !stringToArray.includes(item));
    for (let i = 0; i < filteredArray.length; i++) {
    await db.none('DELETE FROM available_days id WHERE working_days=$1 AND waiter_id=$2', [filteredArray[i], storedNameID])
      }
  }
}
async function renderAdmin(){
  let dataNames = await db.manyOrNone('SELECT id FROM working_waiters')
  let arrayNames = dataNames.map(a => a.id)
  let count = await db.manyOrNone('SELECT names FROM working_waiters')
  let daysCount = await db.oneOrNone('SELECT COUNT(*) FROM available_days')
  let names = count.map(a => a.names)
  let checkState = [];

  let sevenDays = await db.manyOrNone('SELECT id FROM weekly_days')
  let sevenDaysArr  = sevenDays.map(a => a.id)

  //this generates variables and assigns them to the id's from the weekly days table
  let x = 'day'
  for(i=0; i<sevenDaysArr.length; i++){

    let dailyCounts = await db.manyOrNone('SELECT id FROM weekly_days WHERE id = $1', [sevenDaysArr[i]])
    let final = dailyCounts.map(a => a.id)
    eval('var ' + x + i + '= ' + final.toString() + ';');
  }


  let countMon = await db.one('SELECT COUNT(*) FROM available_days WHERE working_days=$1', [day0])
  let countTues = await db.one('SELECT COUNT(*) FROM available_days WHERE working_days=$1', [day1])
  let countWed = await db.one('SELECT COUNT(*) FROM available_days WHERE working_days=$1',[day2])
  let countThurs = await db.one('SELECT COUNT(*) FROM available_days WHERE working_days=$1', [day3])
  let countFri = await db.one('SELECT COUNT(*) FROM available_days WHERE working_days=$1', [day4])
  let countSat = await db.one('SELECT COUNT(*) FROM available_days WHERE working_days=$1', [day5])
  let countSun = await db.one('SELECT COUNT(*) FROM available_days WHERE working_days=$1', [day6])

  let colorMon = countMon.count < 3 ? "orange" : countMon.count == 3 ? "green" : countMon.count > 3 ? "red" : "orange";
  let colorTues = countTues.count < 3 ? "orange" : countTues.count == 3 ? "green" : countTues.count > 3 ? "red" : "orange";
  let colorWed = countWed.count < 3 ? "orange" : countWed.count == 3 ? "green" : countWed.count > 3 ? "red" : "orange";
  let colorThurs = countThurs.count < 3 ? "orange" : countThurs.count == 3 ? "green" : countThurs.count > 3 ? "red" : "orange";
  let colorFri = countFri.count < 3 ? "orange" : countFri.count == 3 ? "green" : countFri.count > 3 ? "red" : "orange";
  let colorSat = countSat.count < 3 ? "orange" : countSat.count == 3 ? "green" : countSat.count > 3 ? "red" : "orange";
  let colorSun = countSun.count < 3 ? "orange" : countSun.count == 3 ? "green" : countSun.count > 3 ? "red" : "orange";

for (let i = 0; i < arrayNames.length; i++) {

  let names2 = names[i]
  let daysCount2 = await db.oneOrNone('SELECT COUNT(*) FROM available_days WHERE waiter_id=$1', [arrayNames[i]])
  let = getDaysAdmin = await db.manyOrNone('SELECT working_days FROM available_days WHERE waiter_id=$1 ORDER BY waiter_id;', [arrayNames[i]])


  if(names2 !== 'ADMIN' && daysCount.count > 0 && daysCount2.count > 0){

  let resultDays = getDaysAdmin.map(a => a.working_days)
  let monday = !resultDays.includes(day0) ? 'unchecked' : 'checked'
  let tuesday = !resultDays.includes(day1) ? 'unchecked' : 'checked'
  let wednesday = !resultDays.includes(day2) ? 'unchecked' : 'checked'
  let thursday = !resultDays.includes(day3) ? 'unchecked' : 'checked'
  let friday = !resultDays.includes(day4) ? 'unchecked' : 'checked'
  let saturday = !resultDays.includes(day5) ? 'unchecked' : 'checked'
  let sunday = !resultDays.includes(day6) ? 'unchecked' : 'checked'

  let res2 = {
    names2,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
    colorMon,
    colorTues,
    colorWed,
    colorThurs,
    colorFri,
    colorSat,
    colorSun,
  }
  let res3  = {
    ...res2,
  };
  checkState.push(res3)
}
}
return checkState
}
async function waiterUpdate(enterName){
  let uppercaseName = enterName.toUpperCase();

  let sevenDays = await db.manyOrNone('SELECT id FROM weekly_days')
  let sevenDaysArr  = sevenDays.map(a => a.id)

  //days
  let x = 'day'
  for(i=0; i<sevenDaysArr.length; i++){

    let dailyCounts = await db.manyOrNone('SELECT id FROM weekly_days WHERE id = $1', [sevenDaysArr[i]])
    let final = dailyCounts.map(a => a.id)
    eval('var ' + x + i + '= ' + final.toString() + ';');
  }
  let storedName = await db.oneOrNone('SELECT COUNT(*) FROM working_waiters WHERE names=$1', [uppercaseName])

  if(storedName.count == 1 && uppercaseName !== 'ADMIN'){
      let storedNameID = await db.oneOrNone("SELECT id FROM working_waiters WHERE names=$1", [uppercaseName]) || {}
      let weekDays2 = await db.manyOrNone('SELECT working_days FROM available_days WHERE waiter_id=$1', [storedNameID.id])
      let resultDays = weekDays2.map(a => a.working_days) || []
      getWaiters = []


      let monday = !resultDays.includes(day0) ? 'unchecked' : 'checked'
      let tuesday = !resultDays.includes(day1) ? 'unchecked' : 'checked'
      let wednesday = !resultDays.includes(day2) ? 'unchecked' : 'checked'
      let thursday = !resultDays.includes(day3) ? 'unchecked' : 'checked'
      let friday = !resultDays.includes(day4) ? 'unchecked' : 'checked'
      let saturday = !resultDays.includes(day5) ? 'unchecked' : 'checked'
      let sunday = !resultDays.includes(day6) ? 'unchecked' : 'checked'


      let waiterDays =  {registerName: enterName.toUpperCase(),
                            mon: monday,
                            tue: tuesday,
                            wed: wednesday,
                            thurs: thursday,
                            fri: friday,
                            sat: saturday,
                            sun: sunday
      };
    getWaiters.push(waiterDays)
}
}
async function getWaiterDays(){
  return getWaiters
}


async function insertValues(uppercaseName){
  let storedNameID = await db.oneOrNone("SELECT id FROM working_waiters WHERE names=$1", [uppercaseName]) || {}
  return await db.manyOrNone('SELECT working_days FROM available_days WHERE waiter_id=$1', [storedNameID.id])
}
async function insertValuesAdmin(user_id){
  return await db.manyOrNone('SELECT working_days FROM available_days WHERE waiter_id=$1', [user_id])
}
async function returnUserAdminId(user_id){
  return user_id
}

    return {
        loginNames,
        getNames,
        deleteAll,
        usersForAdmin,
        deleteAdmin,
        registerAll,
        returnRegistered,
        insertValues,
        insertValuesAdmin,
        returnUserAdminId,
        renderAdmin,
        waiterUpdate,
        getWaiterDays,
    }

}




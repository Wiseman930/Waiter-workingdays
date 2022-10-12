module.exports = function waitersWorking(db){

  let list = []

   async function deleteAll(){
    await db.none('DELETE FROM working_waiters;');
    await db.none('DELETE FROM available_days;')
  }
   async function loginNames(logNames, days){
      toNewDays = days
      let dayToNumber = [];
      let upperNames = logNames
      let CountMany;
      let storedNames = await db.oneOrNone('SELECT names FROM working_waiters WHERE names=$1', [upperNames])
      let storedNameID = await db.oneOrNone("SELECT id FROM working_waiters WHERE names=$1", [upperNames])

        if(storedNames == null){
            await db.none('INSERT INTO working_waiters(names) values($1)', [upperNames])
        }
       if(typeof days === 'object'){
        for (let i = 0; i < days.length; i++) {
              CountMany = await db.oneOrNone('SELECT count(*) FROM available_days WHERE working_days=$1 AND waiter_id=$2', [days[i], storedNameID.id])
              if( CountMany.count == 0){
                await db.manyOrNone('INSERT INTO available_days (working_days, waiter_id) values($1, $2)', [days[i], storedNameID.id])
              }
            }

        }

       if(typeof days === 'string'){
        dayToNumber = Array.from(days)
        for (let i = 0; i < dayToNumber.length; i++) {
          CountMany = await db.oneOrNone('SELECT count(*) FROM available_days WHERE working_days=$1 AND waiter_id=$2', [dayToNumber[i], storedNameID.id])
          if( CountMany.count == 0){
            await db.oneOrNone('INSERT INTO available_days (working_days, waiter_id) values($1, $2)', [dayToNumber[i], storedNameID.id])

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
  async function getAdminNames(){
    let getForAdmin = await db.manyOrNone('SELECT names FROM working_waiters')
    return getForAdmin
  }
  async function getWorkingDays(){

        let getDaysAdmin;
        let dataNames = await db.manyOrNone('SELECT id FROM working_waiters')
        let arrayNames = dataNames.map(a => a.id)
        for (let i = 0; i < arrayNames.length; i++) {
          getDaysAdmin = await db.manyOrNone('SELECT working_days FROM available_days WHERE waiter_id=$1 ORDER BY waiter_id;', [arrayNames[i]])
          result = getDaysAdmin.map(a => a.working_days)

        }

    }
    return {
        loginNames,
        getNames,
        getAdminNames,
        getWorkingDays,
        deleteAll
    }

}



/*
  if (typeof days === 'string'){
     let dayToArray = Array.from(days)
    res = finalArray.filter(item => !dayToArray.includes(item));
      for (let i = 0; i < res.length; i++) {
      //await db.none('DELETE FROM available_days WHERE working_days=$1 AND waiter_id=$2', [res[i], storedNameID.id])
        }
    }*/

/*
var arr1 = [1,2,3,4],
    arr2 = [2,4],
    res = arr1.filter(item => !arr2.includes(item));
console.log(res);
*/

// SELECT count FROM available_days WHERE working_days=$1

/*const mobiles = [
  { working_days: 1 },
  { working_days: 4 },
  { working_days: 7 },
  { working_days: 7 }
]

mobiles.forEach(mobile => {
  for (let key in mobile) {
    let array = `${mobile[key]}`
    console.log(array)


  }
})*/




/*

*/






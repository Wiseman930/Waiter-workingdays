module.exports = function waitersWorking(db){

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
    let dayToNumber = [];
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


    //filtering days in database for a specific user
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
    let stringToArray = []
    let storedNameID = id;
    //inserting for multiple days in an array
    if(typeof days === 'object' && days.length >= 3){
      for (let i = 0; i < days.length; i++) {
            CountMany = await db.oneOrNone('SELECT count(*) FROM available_days WHERE working_days=$1 AND waiter_id=$2', [days[i], storedNameID])
            if( CountMany.count == 0){
              await db.manyOrNone('INSERT INTO available_days (working_days, waiter_id) values($1, $2)', [days[i], storedNameID])
            }
          }

      }
      //inserting for a single value that is a string
      if(typeof days === 'string'){
        stringToArray = Array.from(days)
        for (let i = 0; i < stringToArray.length; i++) {
          CountMany = await db.oneOrNone('SELECT count(*) FROM available_days WHERE working_days=$1 AND waiter_id=$2', [stringToArray[i], storedNameID.id])
          if( CountMany.count == 0){
            await db.oneOrNone('INSERT INTO available_days (working_days, waiter_id) values($1, $2)', [stringToArray[i], storedNameID.id])

          }
        }
      }
}
  //filtering days in database for a multiple users
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
async function insertValues(uppercaseName, days){
  let storedNameID = await db.oneOrNone("SELECT id FROM working_waiters WHERE names=$1", [uppercaseName]) || {}
  return await db.manyOrNone('SELECT working_days FROM available_days WHERE waiter_id=$1', [storedNameID.id])
}
async function insertValuesAdmin(user_id, userCheckbox){
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
        returnUserAdminId
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



/*
  const characters = [
      { name: 'Batman', team: 'Justice League' },
      { name: 'Hulk', team: 'Avengers' },
      { name: 'Flash', team: 'Justice League' },
      { name: 'Iron Man', team: 'Avengers' },
      { name: 'Deadpool', team: 'X-Force' }
    ];

    const avengers = characters.filter(character => character.team !== 'Avengers' || character.name !== 'Hulk' );
   // console.log(avengers)
*/


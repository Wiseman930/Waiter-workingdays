module.exports = function waiterRoute(db, waitersFunction){

  let shortCode = require('short-unique-id')
  let uid = new shortCode({length: 6})


    function home (req, res) {
        res.render('register');
      }

    async function postRegisterCode(req, res){
      let code = uid()
      let users = req.body.fname
      let format = /^[A-Za-z]+$/
      let uppercase = users.toUpperCase();
      let wordCount = await db.one('SELECT COUNT(*) FROM working_waiters WHERE names=$1', [users.toUpperCase()])


      if (format.test(users) == true && wordCount.count == 0){
      req.flash('codeMessages', 'Your login passcode is: ' + code)
      await waitersFunction.registerAll(uppercase, code)
      res.redirect('/');
      }
      else if (format.test(users) == true && wordCount.count == 1){
      req.flash('errorMessages', 'You are registered')
        res.redirect('/');
        }
      else if (format.test(users) == false){
      req.flash('errorMessages', 'Enter alphabets only')
        res.redirect('/')
      }
    }
    function login (req, res) {
      res.render('index');
    }


     async function waiterRoute (req, res) {
      let userCode = req.body.fname
      let name = await db.oneOrNone('SELECT names FROM working_waiters WHERE code=$1', [userCode]) || {}
      let format = /^[A-Za-z]+$/

      let storedCode = await db.oneOrNone('SELECT COUNT(*) FROM working_waiters WHERE code=$1', [userCode])

      if (storedCode.count == 1 && name.names !== 'ADMIN'){
      let upperName = name.names.toUpperCase()
      waitersFunction.loginNames(upperName)
      res.redirect(`/waiters/${upperName}`);
      }
      else if (storedCode.count == 1 && name.names == 'ADMIN'){
        res.redirect('/days');
        }
      else if (storedCode.count == 0 || storedCode.count == undefined){
        req.flash('errors', 'Invalid passcode')
        res.redirect('/index');
        }
      else if (format.test(name) == false){
        req.flash('errors', 'Enter alphabets only')
        res.redirect('/')
      }
    }

    async function dynamicGet (req, res) {
      let enterName = req.params.username;
      let uppercaseName = enterName.toUpperCase()
      let storedName = await db.oneOrNone('SELECT COUNT(*) FROM working_waiters WHERE names=$1', [uppercaseName])

      if(storedName.count == 1 && uppercaseName !== 'ADMIN'){
      let storedNameID = await db.oneOrNone("SELECT id FROM working_waiters WHERE names=$1", [enterName.toUpperCase()]) || {}
      let weekDays2 = await db.manyOrNone('SELECT working_days FROM available_days WHERE waiter_id=$1', [storedNameID.id])
      let resultDays = weekDays2.map(a => a.working_days) || []


       let monday = !resultDays.includes(1) ? 'unchecked' : 'checked'
       let tuesday = !resultDays.includes(2) ? 'unchecked' : 'checked'
       let wednesday = !resultDays.includes(3) ? 'unchecked' : 'checked'
       let thursday = !resultDays.includes(4) ? 'unchecked' : 'checked'
       let friday = !resultDays.includes(5) ? 'unchecked' : 'checked'
       let saturday = !resultDays.includes(6) ? 'unchecked' : 'checked'
       let sunday = !resultDays.includes(7) ? 'unchecked' : 'checked'


      res.render('waiters', {registerName: enterName.toUpperCase(),
                            mon: monday,
                            tue: tuesday,
                            wed: wednesday,
                            thurs: thursday,
                            fri: friday,
                            sat: saturday,
                            sun: sunday
      });
    }
    else if(storedName.count == 0){
      res.redirect('/')
      req.flash('errors', "Register first")
    }

    }


    async function dynamicPost (req, res) {

      let enterName = req.params.username;
      let  uppercaseName = enterName.toUpperCase();
      let days = req.body.weekday || []
      if(days.length >= 3){
      await waitersFunction.loginNames(uppercaseName, days)
      await waitersFunction.insertValues(uppercaseName, days)
      await waitersFunction.getNames(uppercaseName, days)
      req.flash('update', `${uppercaseName} your working days have been updated`)
      }
      if(days.length < 3){
      req.flash('errors', `Add 3 or more working days`)
        }
      res.redirect(`/waiters/${uppercaseName}`);

    }

    async function dayGet (req, res) {
          let dataNames = await db.manyOrNone('SELECT id FROM working_waiters')
          let arrayNames = dataNames.map(a => a.id)
          let count = await db.manyOrNone('SELECT names FROM working_waiters')
          let daysCount = await db.oneOrNone('SELECT COUNT(*) FROM available_days')
          let names = count.map(a => a.names)
          let checkState = [];


        for (let i = 0; i < arrayNames.length; i++) {
          let names2 = names[i]
          let = getDaysAdmin = await db.manyOrNone('SELECT working_days FROM available_days WHERE waiter_id=$1 ORDER BY waiter_id;', [arrayNames[i]])

          if(names2 !== 'ADMIN' && daysCount.count > 0){
          let resultDays = getDaysAdmin.map(a => a.working_days) || []
          let monday = !resultDays.includes(1) ? 'unchecked' : 'checked'
          let tuesday = !resultDays.includes(2) ? 'unchecked' : 'checked'
          let wednesday = !resultDays.includes(3) ? 'unchecked' : 'checked'
          let thursday = !resultDays.includes(4) ? 'unchecked' : 'checked'
          let friday = !resultDays.includes(5) ? 'unchecked' : 'checked'
          let saturday = !resultDays.includes(6) ? 'unchecked' : 'checked'
          let sunday = !resultDays.includes(7) ? 'unchecked' : 'checked'

          let countMon = await db.one('SELECT COUNT(*) FROM available_days WHERE working_days=$1', [1])
          let countTues = await db.one('SELECT COUNT(*) FROM available_days WHERE working_days=$1', [2])
          let countWed = await db.one('SELECT COUNT(*) FROM available_days WHERE working_days=$1',[3])
          let countThurs = await db.one('SELECT COUNT(*) FROM available_days WHERE working_days=$1', [4])
          let countFri = await db.one('SELECT COUNT(*) FROM available_days WHERE working_days=$1', [5])
          let countSat = await db.one('SELECT COUNT(*) FROM available_days WHERE working_days=$1', [6])
          let countSun = await db.one('SELECT COUNT(*) FROM available_days WHERE working_days=$1', [7])

          let colorMon = countMon.count < 3 ? "orange" : countMon.count == 3 ? "green" : countMon.count > 3 ? "red" : "orange";
          let colorTues = countTues.count < 3 ? "orange" : countTues.count == 3 ? "green" : countTues.count > 3 ? "red" : "orange";
          let colorWed = countWed.count < 3 ? "orange" : countWed.count == 3 ? "green" : countWed.count > 3 ? "red" : "orange";
          let colorThurs = countThurs.count < 3 ? "orange" : countThurs.count == 3 ? "green" : countThurs.count > 3 ? "red" : "orange";
          let colorFri = countFri.count < 3 ? "orange" : countFri.count == 3 ? "green" : countFri.count > 3 ? "red" : "orange";
          let colorSat = countSat.count < 3 ? "orange" : countSat.count == 3 ? "green" : countSat.count > 3 ? "red" : "orange";
          let colorSun = countSun.count < 3 ? "orange" : countSun.count == 3 ? "green" : countSun.count > 3 ? "red" : "orange";

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
            colorSun
          }
          checkState.push(res2)
        }
      }

        res.render('days',{
          allNames: checkState,
        })
    }

    async function dayPost (req, res) {

      let count = await db.one('SELECT COUNT(*) FROM working_waiters')
      await waitersFunction.deleteAll()
      if(count.count > 0){
      req.flash('update', "You have reseted the user's working days")
      }
      else if (count.count == 1){
      req.flash('errors', "There are no user's working days")
      }
      res.redirect('/days');
    }

   async function updateAdmin (req, res) {
    let count = await db.manyOrNone('SELECT names FROM working_waiters WHERE names != $1', 'ADMIN')
    let names = count.map(a => a.names);
    let update;
    let working;
    let arr2 = []

    for (let i = 0; i < names.length; i++) {
    let names2 = names[i]
    let storedNameID = await db.oneOrNone("SELECT id FROM working_waiters WHERE names=$1", names2) || {}
    let user_id = storedNameID.id
    let userCheckbox = req.body[names[i]] || []


    let lessDays = Array.from(Array(3).keys())
    arr2.push(userCheckbox.length)
    const founddays = lessDays.some(r=> arr2.includes(r))


    if(founddays == false){

      await waitersFunction.usersForAdmin(user_id, userCheckbox)
      await waitersFunction.deleteAdmin(user_id, userCheckbox)
      await waitersFunction.insertValuesAdmin(user_id, userCheckbox)
      update = 'working days updated'
      }
    else if (founddays == true){
      working =  'add 3 or more working days'

    }
    }
    req.flash('update', update)
    req.flash('errors', working)
    res.redirect('/days')
      }

    return{
        home,
        waiterRoute,
        dynamicGet,
        dynamicPost,
        dayGet,
        dayPost,
        updateAdmin,
        postRegisterCode,
        login
    }
}

/*    for (let i = 0; i < userCheckbox.length; i++) {
      let userCheckbox2 = userCheckbox[i]
          let object =
              {names2,
              userCheckbox2}

            pushDays.push(object)

       }*/
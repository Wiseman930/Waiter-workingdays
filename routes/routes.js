module.exports = function waiterRoute(db, waitersFunction){


    function home (req, res) {
        res.render('index');
      }


     function waiterRoute (req, res) {
      let users = req.body.fname
      let format = /^[A-Za-z]+$/
      let uppercase;
      if (format.test(users) == true){
      uppercase = users.toUpperCase()
      waitersFunction.loginNames(uppercase)
      res.redirect(`/waiters/${uppercase}`);
      }
      else if (format.test(users) == false){
        req.flash('errors', 'Enter alphabets only')
        res.redirect('/')
      }
    }

    async function dynamicGet (req, res) {


      let enterName = req.params.username;
      let storedNameID = await db.oneOrNone("SELECT id FROM working_waiters WHERE names=$1", [enterName]) || {}
      let weekDays2 = await db.manyOrNone('SELECT working_days FROM available_days WHERE waiter_id=$1', [storedNameID.id])
      let result = weekDays2.map(a => a.working_days) || []


       let monday = !result.includes(1) ? 'unchecked' : 'checked'
       let tuesday = !result.includes(2) ? 'unchecked' : 'checked'
       let wednesday = !result.includes(3) ? 'unchecked' : 'checked'
       let thursday = !result.includes(4) ? 'unchecked' : 'checked'
       let friday = !result.includes(5) ? 'unchecked' : 'checked'
       let saturday = !result.includes(6) ? 'unchecked' : 'checked'
       let sunday = !result.includes(7) ? 'unchecked' : 'checked'


      res.render('waiters', {registerName: enterName,
                            mon: monday,
                            tue: tuesday,
                            wed: wednesday,
                            thurs: thursday,
                            fri: friday,
                            sat: saturday,
                            sun: sunday
      });
    }


    async function dynamicPost (req, res) {

      let enterName = req.params.username;
      let  uppercase = enterName.toUpperCase();
      let days = req.body.weekday
      await waitersFunction.loginNames(enterName, days)
      await waitersFunction.getNames(enterName, days)
      req.flash('update', `${uppercase} your working days have been updated`)
      res.redirect(`/waiters/${uppercase}`);
    }



    async function dayGet (req, res) {
          let dataNames = await db.manyOrNone('SELECT id FROM working_waiters')
          let arrayNames = dataNames.map(a => a.id)
          let count = await db.manyOrNone('SELECT names FROM working_waiters')
          let names = count.map(a => a.names)
          let ress = [];



        for (let i = 0; i < arrayNames.length; i++) {
          let names2 = names[i]
          let = getDaysAdmin = await db.manyOrNone('SELECT working_days FROM available_days WHERE waiter_id=$1 ORDER BY waiter_id;', [arrayNames[i]])

          let = result = getDaysAdmin.map(a => a.working_days) || []
          let = monday = !result.includes(1) ? 'unchecked' : 'checked'
          let = tuesday = !result.includes(2) ? 'unchecked' : 'checked'
          let = wednesday = !result.includes(3) ? 'unchecked' : 'checked'
          let = thursday = !result.includes(4) ? 'unchecked' : 'checked'
          let = friday = !result.includes(5) ? 'unchecked' : 'checked'
          let = saturday = !result.includes(6) ? 'unchecked' : 'checked'
          let = sunday = !result.includes(7) ? 'unchecked' : 'checked'

          let res2 = {
            names2,
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday,
            sunday,
          }
          ress.push(res2)
        }
        let colorMon = 'orange'; let colorTues = 'orange'; let colorWed = 'orange'; let colorThurs = 'orange'; let colorFri = 'orange'; let colorSat = 'orange'; let colorSun = 'orange';
        let countMon = await db.one('SELECT COUNT(*) FROM available_days WHERE working_days=$1', [1])
        let countTues = await db.one('SELECT COUNT(*) FROM available_days WHERE working_days=$1', [2])
        let countWed = await db.one('SELECT COUNT(*) FROM available_days WHERE working_days=$1',[3])
        let countThurs = await db.one('SELECT COUNT(*) FROM available_days WHERE working_days=$1', [4])
        let countFri = await db.one('SELECT COUNT(*) FROM available_days WHERE working_days=$1', [5])
        let countSat = await db.one('SELECT COUNT(*) FROM available_days WHERE working_days=$1', [6])
        let countSun = await db.one('SELECT COUNT(*) FROM available_days WHERE working_days=$1', [7])

        colorMon = countMon.count < 3 ? "orange" : countMon.count == 3 ? "green" : countMon.count > 3 ? "red" : "orange";
        colorTues = countTues.count < 3 ? "orange" : countTues.count == 3 ? "green" : countTues.count > 3 ? "red" : "orange";
        colorWed = countWed.count < 3 ? "orange" : countWed.count == 3 ? "green" : countWed.count > 3 ? "red" : "orange";
        colorThurs = countThurs.count < 3 ? "orange" : countThurs.count == 3 ? "green" : countThurs.count > 3 ? "red" : "orange";
        colorFri = countFri.count < 3 ? "orange" : countFri.count == 3 ? "green" : countFri.count > 3 ? "red" : "orange";
        colorSat = countSat.count < 3 ? "orange" : countSat.count == 3 ? "green" : countSat.count > 3 ? "red" : "orange";
        colorSun = countSun.count < 3 ? "orange" : countSun.count == 3 ? "green" : countSun.count > 3 ? "red" : "orange";


        res.render('days',{
          allNames: ress,
          colorMon,
          colorTues,
          colorWed,
          colorThurs,
          colorFri,
          colorSat,
          colorSun
        })

    }

     async function dayPost (req, res) {
      let count = await db.one('SELECT COUNT(*) FROM working_waiters')
      await waitersFunction.deleteAll()
      if(count.count > 0){
      req.flash('update', "You have reseted the user's working days")
      }
      else if (count.count == 0){
      req.flash('errors', "There are no user's working days")
      }
      res.redirect('days');
    }

    return{
        home,
        waiterRoute,
        dynamicGet,
        dynamicPost,
        dayGet,
        dayPost
    }
}
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

      let uppercaseName = enterName.toUpperCase();
      let storedName = await db.oneOrNone('SELECT COUNT(*) FROM working_waiters WHERE names=$1', [uppercaseName])

      if(storedName.count == 1 && uppercaseName !== 'ADMIN'){
      await waitersFunction.waiterUpdate(enterName)
      res.render('waiters', {alldays : await waitersFunction.getWaiterDays()
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
        req.flash('update', `your working days have been updated`)
      }
      if(days.length < 3){
        req.flash('errors', `Add 3 or more working days`)
      }
      res.redirect(`/waiters/${uppercaseName}`);

    }

    async function dayGet (req, res) {
        res.render('days',{
          allNames: await waitersFunction.renderAdmin(),
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
      let daysCount2 = await db.oneOrNone('SELECT COUNT(*) FROM available_days WHERE waiter_id=$1', [user_id])
      let userCheckbox = req.body[names[i]] || []

      if(daysCount2.count > 0){
        let lessDays = Array.from(Array(3).keys())
        arr2.push(userCheckbox.length)
        let founddays = lessDays.some(r=> arr2.includes(r))

        if(founddays == false){

          await waitersFunction.usersForAdmin(user_id, userCheckbox)
          await waitersFunction.deleteAdmin(user_id, userCheckbox)
          await waitersFunction.insertValuesAdmin(user_id, userCheckbox)
          update = 'working days updated'
          }
        else if (founddays == true){
          working =  'A waiter must have 3 or more working days'
          update = ''

        }
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


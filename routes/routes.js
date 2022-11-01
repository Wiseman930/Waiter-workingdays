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
      await waitersFunction.countOfUser(uppercase)
      let wordCount = waitersFunction.returnCountUser()

      if (format.test(users) == true && wordCount == 0){
      req.flash('codeMessages', 'login passcode: ' + code)

      await waitersFunction.registerAll(uppercase, code)
      res.redirect('/');
      }
      else if (format.test(users) == true && wordCount == 1){
      req.flash('errorMessages', 'you are registered')
        res.redirect('/');
        }
      else if (format.test(users) == false){
      req.flash('errorMessages', 'enter alphabets only')
        res.redirect('/')
      }
    }
    function login (req, res) {
      res.render('index');
    }


     async function waiterRoute (req, res) {
      let userCode = req.body.fname
      await waitersFunction.nameAndCode(userCode)


      let name = await waitersFunction.returnNameAndCode()
      let format = /^[A-Za-z]+$/
      let storedCode = await waitersFunction.returnNameAndCode()

      if (storedCode.coding == 1 && name.naming !== 'ADMIN'){
      let upperName = name.naming.toUpperCase()
      waitersFunction.loginNames(upperName)
      res.redirect(`/waiters/${upperName}`);
      }
      else if (storedCode.coding == 1 && name.naming == 'ADMIN'){
        res.redirect('/days');
        }
      else if (storedCode.coding == 0 || storedCode.coding == undefined){
        req.flash('errors', 'invalid passcode')
        res.redirect('/index');
        }
      else if (format.test(name.naming) == false){
        req.flash('errors', 'enter alphabets only')
        res.redirect('/')
      }
    }

    async function dynamicGet (req, res) {
      let enterName = req.params.username;

      let uppercaseName = enterName.toUpperCase();
      await waitersFunction.dynamicCount(uppercaseName)
      let storedName =  await waitersFunction.returnDynamicCount()

      if(storedName.count == 1 && uppercaseName !== 'ADMIN'){
      await waitersFunction.waiterUpdate(enterName)
      res.render('waiters', {alldays : await waitersFunction.getWaiterDays()
          });
    }
    else if(storedName.count == 0){
      res.redirect('/')
      req.flash('errors', "register first")
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
        req.flash('errors', `add 3 or more working days`)
      }
      res.redirect(`/waiters/${uppercaseName}`);

    }

    async function dayGet (req, res) {
        res.render('days',{
          allNames: await waitersFunction.renderAdmin(),
        })
    }

    async function dayPost (req, res) {

      let count = await waitersFunction.allCounts()
      await waitersFunction.deleteAll()
      if(count.count > 1){
        req.flash('update', "you have reseted the user's working days")
      }
      else if (count.count == 1){
        req.flash('errors', "")
      }
      res.redirect('/days');
    }

   async function updateAdmin (req, res) {
    let count = await waitersFunction.notAdminName()
    let names = count.map(a => a.names);
    let update;
    let working;
    let arr2 = []

    for (let i = 0; i < names.length; i++) {
      let names2 = names[i]
      await waitersFunction.storedID(names2)
      let storedNameID = await waitersFunction.returnStoredId() || {}
      let user_id = storedNameID.id
      let daysCount2 = await waitersFunction.daysCount()
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
          working =  'a waiter must have 3 or more working days'
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


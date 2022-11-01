const assert = require('assert');
const waiterDays = require('../waiters');
const pgp = require('pg-promise')();

let shortCode = require('short-unique-id')


const DATABASE_URL =   process.env.DATABASE_URL || "postgresql://postgres:pg1999@localhost:5432/test";
const config = {
    connectionString: DATABASE_URL
}
const db = pgp(config);

describe('Waiters function for users', function(){

    beforeEach(async function(){
  await db.none('DELETE FROM working_waiters;');
  await db.none('DELETE FROM available_days;');

    });
it("should be able to register a worker", async function(){
    let waiters = waiterDays(db);
    let uid = new shortCode({length: 6});
    let code = uid()

    await waiters.registerAll("WISEMAN", code);
    assert.deepEqual({
        code: code,
        names: 'WISEMAN'
      }, await waiters.returnRegistered());

    });
it("should be able to register another workers", async function(){
    let waiters = waiterDays(db);
    let uid = new shortCode({length: 6});
    let code = uid()

    await waiters.registerAll("QUEEN", code);
    assert.deepEqual({
        code: code,
        names: 'QUEEN'
        }, await waiters.returnRegistered());

    });
// THE WORKING DAYS 1-7 REPRESENT MONDAY TO SUNDAY
it("a worker should be able to insert/update their working days", async function(){
    let waiters = waiterDays(db);
    let uid = new shortCode({length: 6});
    let code = uid()

    await waiters.registerAll("WISEMAN", code);
    assert.deepEqual({
        code: code,
        names: 'WISEMAN'
      }, await waiters.returnRegistered());

    await waiters.loginNames("WISEMAN", ['1', '2', '3']);
    assert.deepEqual([
        {
          working_days: 1
        },
        {
          working_days: 2
        },
        {
          working_days: 3
        }
      ], await waiters.insertValues('WISEMAN'));

    });

it("a different worker should also be able to also insert/update their working days", async function(){
    let waiters = waiterDays(db);
    let uid = new shortCode({length: 6});
    let code = uid()

    await waiters.registerAll("PHUME", code);
    assert.deepEqual({
        code: code,
        names: 'PHUME'
    }, await waiters.returnRegistered());

    await waiters.loginNames("PHUME", ['1', '2', '3', '5', '7']);
    assert.deepEqual([
        {
        working_days: 1
        },
        {
        working_days: 2
        },
        {
        working_days: 3
        },
        {
        working_days: 5
        },
        {
        working_days: 7
        }
    ], await waiters.insertValues('PHUME'));

    });
    it("a different worker should also be able to also insert/update their working days", async function(){
        let waiters = waiterDays(db);
        let uid = new shortCode({length: 6});
        let code = uid()

        await waiters.registerAll("ZEE", code);
        assert.deepEqual({
            code: code,
            names: 'ZEE'
        }, await waiters.returnRegistered());

        await waiters.loginNames("ZEE", ['1', '2', '3', '5', '7']);
        assert.deepEqual([
            {
            working_days: 1
            },
            {
            working_days: 2
            },
            {
            working_days: 3
            },
            {
            working_days: 5
            },
            {
            working_days: 7
            }
        ], await waiters.insertValues('ZEE'));

        });


    it("a worker should be able to insert new working days", async function(){
        let waiters = waiterDays(db);
        let uid = new shortCode({length: 6});
        let code = uid()

        await waiters.registerAll("NOKI", code);
        assert.deepEqual({
            code: code,
            names: 'NOKI'
        }, await waiters.returnRegistered());

        await waiters.loginNames("NOKI", ['1','4', '5', '6']);
        await waiters.getNames("NOKI", ['1','4', '5', '6']);

        assert.deepEqual([
            {
                working_days: 1
            },
            {
                working_days: 4
            },
            {
                working_days: 5
            },
            {
                working_days: 6
            }
        ], await waiters.insertValues('NOKI'));


        await waiters.loginNames("NOKI", ['1', '2', '7']);
        await waiters.getNames("NOKI", ['1', '2', '7']);

        assert.deepEqual([
            {
                working_days: 1
            },
            {
                working_days: 2
            },
            {
                working_days: 7
            }
        ], await waiters.insertValues('NOKI'));

        });


it("a worker cannot have less than 3 working days updated", async function(){
    let waiters = waiterDays(db);
    let uid = new shortCode({length: 6});
    let code = uid()

    await waiters.registerAll("BOLT", code);
    assert.deepEqual({
        code: code,
        names: 'BOLT'
    }, await waiters.returnRegistered());

    await waiters.loginNames("BOLT", ['1','4']);
    await waiters.getNames("BOLT", ['1','4']);

    assert.deepEqual([], await waiters.insertValues('BOLT'));

    await waiters.loginNames("BOLT", ['1']);
    await waiters.getNames("BOLT", ['1']);

    assert.deepEqual([], await waiters.insertValues('BOLT'));

    });

it("a worker cannot add the same day twice in the database table", async function(){
    let waiters = waiterDays(db);
    let uid = new shortCode({length: 6});
    let code = uid()

    await waiters.registerAll("YOHAN", code);
    assert.deepEqual({
        code: code,
        names: 'YOHAN'
    }, await waiters.returnRegistered());

    await waiters.loginNames("YOHAN", ['1','4', '4', '5']);
    await waiters.getNames("YOHAN", ['1','4', '4', '5']);

    assert.deepEqual([
        {
            working_days: 1
        },
        {
            working_days: 4
        },
        {
            working_days: 5
        }
    ], await waiters.insertValues("YOHAN"));

    await waiters.loginNames("YOHAN", ['1','1', '5', '5', '2']);
    await waiters.getNames("YOHAN", ['1','1', '5', '5', '2']);

    assert.deepEqual([
        {
            working_days: 1
        },
        {
            working_days: 5
        },
        {
            working_days: 2
        }
    ], await waiters.insertValues("YOHAN"));

    });


    it("Worker should be able to see checked and unchecked days", async function(){
        let waiters = waiterDays(db);
        let uid = new shortCode({length: 6});
        let code = uid()

        await waiters.registerAll("JONAS", code);
        assert.deepEqual({
            code: code,
            names: 'JONAS'
        }, await waiters.returnRegistered());
        await waiters.waiterUpdate('JONAS')
        await waiters.loginNames("JONAS", ['1','4', '4', '5']);
        await waiters.getNames("JONAS", ['1','4', '4', '5']);

        assert.deepEqual([
            {
              fri: 'unchecked',
              mon: 'unchecked',
              registerName: 'JONAS',
              sat: 'unchecked',
              sun: 'unchecked',
              thurs: 'unchecked',
              tue: 'unchecked',
              wed: 'unchecked'
            }
          ], await waiters.getWaiterDays("JONAS"));

          await waiters.waiterUpdate('JONAS')
          await waiters.loginNames("JONAS", ['1', '3', '7']);
          await waiters.getNames("JONAS", ['1', '3', '7']);

          assert.deepEqual([
              {
                fri: 'checked',
                mon: 'checked',
                registerName: 'JONAS',
                sat: 'unchecked',
                sun: 'unchecked',
                thurs: 'checked',
                tue: 'unchecked',
                wed: 'unchecked'
              }
            ], await waiters.getWaiterDays("JONAS"));

        });
});




describe('Waiters function for Admin', function(){

    beforeEach(async function(){
   await db.none('DELETE FROM working_waiters;');
   await db.none('DELETE FROM available_days;');

    });
it("should be able to register the admin", async function(){
        let waiters = waiterDays(db);
        let uid = new shortCode({length: 6});
        let code = uid()

        await waiters.registerAll("ADMIN", code);
        assert.deepEqual({
            code: code,
            names: 'ADMIN'
          }, await waiters.returnRegistered());

        });

it("Admin should be able to insert/update days of another different worker_id of a worker into the available_days table", async function(){

    let waiters = waiterDays(db);
    let uid = new shortCode({length: 6});
    let code = uid()

    await waiters.registerAll("THABO", code);
    assert.deepEqual({
        code: code,
        names: 'THABO'
    }, await waiters.returnRegistered());

    let ID = await db.oneOrNone("SELECT id FROM working_waiters WHERE names=$1", ['THABO'])
    await waiters.usersForAdmin(ID.id, ['1', '2', '3']);
    await waiters.deleteAdmin(ID.id, ['1', '2', '3']);
    assert.deepEqual([
        {
        working_days: 1
        },
        {
        working_days: 2
        },
        {
        working_days: 3
        }
    ], await waiters.insertValuesAdmin(ID.id));

    await waiters.usersForAdmin(ID.id, ['1', '2', '3', '7', '5']);
    await waiters.deleteAdmin(ID.id, ['1', '2', '3', '7', '5']);
    assert.deepEqual([{
        working_days: 1
        },
        {
        working_days: 2
        },
        {
        working_days: 3
        },
        {
        working_days: 7
        },
        {
        working_days: 5
        }
    ], await waiters.insertValuesAdmin(ID.id));

    });

it("Admin should be able to to filter a registered user to inserts new days", async function(){
    let waiters = waiterDays(db);
    let uid = new shortCode({length: 6});
    let code = uid()

    await waiters.registerAll("PHUME", code);
    assert.deepEqual({
        code: code,
        names: 'PHUME'
    }, await waiters.returnRegistered());

    let ID = await db.oneOrNone("SELECT id FROM working_waiters WHERE names=$1", ['PHUME'])

    await waiters.usersForAdmin(ID.id, ['4', '5', '6']);
    await waiters.deleteAdmin(ID.id, ['4', '5', '6']);

    assert.deepEqual([
        {
            working_days: 4
        },
        {
            working_days: 5
        },
        {
            working_days: 6
        }
    ], await waiters.insertValuesAdmin(ID.id));


    await waiters.usersForAdmin(ID.id, ['1', '2', '3']);
    await waiters.deleteAdmin(ID.id, ['1', '2', '3']);

    assert.deepEqual([
        {
            working_days: 1
        },
        {
            working_days: 2
        },
        {
            working_days: 3
        }
    ], await waiters.insertValuesAdmin(ID.id));

    });

it("Admin should not insert/update less than 3 working days for a worker", async function(){
    let waiters = waiterDays(db);
    let uid = new shortCode({length: 6});
    let code = uid()



    await waiters.registerAll("LINDA", code);
    assert.deepEqual({
        code: code,
        names: 'LINDA'
        }, await waiters.returnRegistered());
    let ID = await db.oneOrNone("SELECT id FROM working_waiters WHERE names=$1", ['LINDA'])

    await waiters.usersForAdmin(ID.id, ['1', '2']);
    await waiters.deleteAdmin(ID.id, ['1', '2'])
    assert.deepEqual([], await waiters.insertValuesAdmin(ID.id));

    await waiters.usersForAdmin(ID.id, ['1', '2', '7']);
    await waiters.deleteAdmin(ID.id, ['1', '2', '7'])
    assert.deepEqual([
    {
        working_days: 1
    },
    {
        working_days: 2
    },
    {
        working_days: 7
    }], await waiters.insertValuesAdmin(ID.id));

    });

it("Admin cannot add/insert same day twice into database", async function(){
        let waiters = waiterDays(db);
        let uid = new shortCode({length: 6});
        let code = uid()



        await waiters.registerAll("SPHIWE", code);
        assert.deepEqual({
            code: code,
            names: 'SPHIWE'
            }, await waiters.returnRegistered());
        let ID = await db.oneOrNone("SELECT id FROM working_waiters WHERE names=$1", ['SPHIWE'])

        await waiters.usersForAdmin(ID.id, ['7', '7', '1', '6', '4']);
        await waiters.deleteAdmin(ID.id, ['7', '7', '1', '6', '4'])
        assert.deepEqual([ {
            working_days: 7
        },
        {
            working_days: 1
        },
        {
            working_days: 6
        },
        {
            working_days: 4
        }
            ], await waiters.insertValuesAdmin(ID.id));

        await waiters.usersForAdmin(ID.id, ['4', '4', '4', '6', '3']);
        await waiters.deleteAdmin(ID.id, ['4', '4', '4', '6', '3'])
        assert.deepEqual([
        {
            working_days: 6
        },
        {
            working_days: 4
        },
        {
            working_days: 3
        }], await waiters.insertValuesAdmin(ID.id));

        });


it("Admin should be able to see checked and unchecked days, and wether there is enough,less or more subcription for each day", async function(){
            let waiters = waiterDays(db);
            let uid = new shortCode({length: 6});
            let code = uid()

            await waiters.registerAll("JONAS", 'yt47hg');
            let ID = await db.oneOrNone("SELECT id FROM working_waiters WHERE names=$1", ['JONAS'])

            await waiters.registerAll("QUEEN", 'fehfmw');
            let ID2 = await db.oneOrNone("SELECT id FROM working_waiters WHERE names=$1", ['QUEEN'])

            await waiters.registerAll("WISEMAN", 'fgtred');
            let ID3 = await db.oneOrNone("SELECT id FROM working_waiters WHERE names=$1", ['WISEMAN'])

            await waiters.registerAll("MABUSELA", 'fgtred');
            let ID4 = await db.oneOrNone("SELECT id FROM working_waiters WHERE names=$1", ['MABUSELA'])



            await waiters.usersForAdmin(ID.id, ['1','4', '4', '5']);
            await waiters.deleteAdmin(ID.id, ['1','4', '4', '5']);

            await waiters.usersForAdmin(ID2.id, ['1','4', '4', '5']);
            await waiters.deleteAdmin(ID2.id, ['1','4', '4', '5']);

            assert.deepEqual([
                {
                    color0: 'orange',
                    color1: 'orange',
                    color2: 'orange',
                    color3: 'orange',
                    color4: 'orange',
                    color5: 'orange',
                    color6: 'orange',
                    daily0: 'checked',
                    daily1: 'unchecked',
                    daily2: 'unchecked',
                    daily3: 'checked',
                    daily4: 'checked',
                    daily5: 'unchecked',
                    daily6: 'unchecked',
                    names2: 'JONAS',

                  },
                  {
                    color0: 'orange',
                    color1: 'orange',
                    color2: 'orange',
                    color3: 'orange',
                    color4: 'orange',
                    color5: 'orange',
                    color6: 'orange',
                    daily0: 'checked',
                    daily1: 'unchecked',
                    daily2: 'unchecked',
                    daily3: 'checked',
                    daily4: 'checked',
                    daily5: 'unchecked',
                    daily6: 'unchecked',
                    names2: 'QUEEN',

                  }
              ], await waiters.renderAdmin());

            await waiters.usersForAdmin(ID3.id, ['1','4', '4', '5']);
            await waiters.deleteAdmin(ID3.id, ['1','4', '4', '5']);

            assert.deepEqual([
                {
                    color0: 'green',
                    color1: 'orange',
                    color2: 'orange',
                    color3: 'green',
                    color4: 'green',
                    color5: 'orange',
                    color6: 'orange',
                    daily0: 'checked',
                    daily1: 'unchecked',
                    daily2: 'unchecked',
                    daily3: 'checked',
                    daily4: 'checked',
                    daily5: 'unchecked',
                    daily6: 'unchecked',
                    names2: 'JONAS'
                  },
                  {
                    color0: 'green',
                    color1: 'orange',
                    color2: 'orange',
                    color3: 'green',
                    color4: 'green',
                    color5: 'orange',
                    color6: 'orange',
                    daily0: 'checked',
                    daily1: 'unchecked',
                    daily2: 'unchecked',
                    daily3: 'checked',
                    daily4: 'checked',
                    daily5: 'unchecked',
                    daily6: 'unchecked',
                    names2: 'QUEEN'
                  },
                  {
                    color0: 'green',
                    color1: 'orange',
                    color2: 'orange',
                    color3: 'green',
                    color4: 'green',
                    color5: 'orange',
                    color6: 'orange',
                    daily0: 'checked',
                    daily1: 'unchecked',
                    daily2: 'unchecked',
                    daily3: 'checked',
                    daily4: 'checked',
                    daily5: 'unchecked',
                    daily6: 'unchecked',
                    names2: 'WISEMAN'
                  }
              ], await waiters.renderAdmin());

              await waiters.usersForAdmin(ID4.id, ['1','4', '4', '5']);
              await waiters.deleteAdmin(ID4.id, ['1','4', '4', '5']);

              assert.deepEqual([
                {
                    color0: 'red',
                    color1: 'orange',
                    color2: 'orange',
                    color3: 'red',
                    color4: 'red',
                    color5: 'orange',
                    color6: 'orange',
                    daily0: 'checked',
                    daily1: 'unchecked',
                    daily2: 'unchecked',
                    daily3: 'checked',
                    daily4: 'checked',
                    daily5: 'unchecked',
                    daily6: 'unchecked',
                    names2: 'JONAS'
                  },
                  {
                    color0: 'red',
                    color1: 'orange',
                    color2: 'orange',
                    color3: 'red',
                    color4: 'red',
                    color5: 'orange',
                    color6: 'orange',
                    daily0: 'checked',
                    daily1: 'unchecked',
                    daily2: 'unchecked',
                    daily3: 'checked',
                    daily4: 'checked',
                    daily5: 'unchecked',
                    daily6: 'unchecked',
                    names2: 'QUEEN'
                  },
                  {
                    color0: 'red',
                    color1: 'orange',
                    color2: 'orange',
                    color3: 'red',
                    color4: 'red',
                    color5: 'orange',
                    color6: 'orange',
                    daily0: 'checked',
                    daily1: 'unchecked',
                    daily2: 'unchecked',
                    daily3: 'checked',
                    daily4: 'checked',
                    daily5: 'unchecked',
                    daily6: 'unchecked',
                    names2: 'WISEMAN'
                  },
                  {
                    color0: 'red',
                    color1: 'orange',
                    color2: 'orange',
                    color3: 'red',
                    color4: 'red',
                    color5: 'orange',
                    color6: 'orange',
                    daily0: 'checked',
                    daily1: 'unchecked',
                    daily2: 'unchecked',
                    daily3: 'checked',
                    daily4: 'checked',
                    daily5: 'unchecked',
                    daily6: 'unchecked',
                    names2: 'MABUSELA'
                  }

              ], await waiters.renderAdmin());




            });
});
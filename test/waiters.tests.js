/*const assert = require('assert');
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


});*/
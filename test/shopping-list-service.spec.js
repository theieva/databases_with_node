const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe('Shopping List Service Object', () => {
    let db 

    let shoppingListItems = [
        {
            id: 1,
            name: 'Fish tricks', 
            price: "13.10", 
            category: 'Main',
            checked: false,  
            date_added: new Date ('2020-01-08T02:10:32.615Z')
        },
        {
            id: 2,
            name:'Not Dogs',
            price: "4.99",
            category: 'Snack',                 
            checked: true,   
            date_added: new Date ('2020-01-09T02:10:32.615Z')
        },
        {
            id: 3,
            name:'Bluffalo Wings',
            price: "5.50", 
            category:'Snack',
            checked: false,
            date_added: new Date ('2020-01-10T02:10:32.615Z')
        }
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    //clear table
    beforeEach(() => {
        return db('shopping_list').truncate()
      })

    // close connection after test
    after(() => db.destroy())

    context('Given shopping list has data', () => {
        beforeEach(() => { 
            return db 
            .into('shopping_list') 
            .insert(shoppingListItems) })

        
            it(`getAllShoppingListItems() resolves all items from 'shopping_list' table`, () => { 
                return ShoppingListService.getAllShoppingListItems(db) 
                .then(actual => { 
                    expect(actual).to.eql(shoppingListItems) 
                }) 
            })

            it(`getById() resolves an item by id from 'shopping_list' table`, () => {
                const thirdId = 3
                const thirdTestItem = shoppingListItems[thirdId - 1]
                return ShoppingListService.getById(db, thirdId)
                  .then(actual => {
                    expect(actual).to.eql({
                      id: thirdId,
                      ... thirdTestItem
                    })
                  })
              })
            
              it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
                const itemId = 3
                return ShoppingListService.deleteItem(db, itemId)
                  .then(() => ShoppingListService.getAllShoppingListItems(db))
                  .then(allItems => {
                    // copy the test items array without the "deleted" item
                    const expected = shoppingListItems.filter(item => item.id !== itemId)
                    expect(allItems).to.eql(expected)
                  })
              })

              it(`updateItem() updates an item from the 'shopping_list' table`, () => {
                const idOfItemToUpdate = 3
                const newItemData = {
                    name:'Lettuce',
                    price: "3.50", 
                    category:'Snack',
                    checked: true,
                    date_added: new Date ('2020-01-11T02:10:32.615Z')
                }
                return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
                  .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
                  .then(item => {
                    expect(item).to.eql({
                      id: idOfItemToUpdate,
                      ...newItemData,
                    })
                  })
              })

    })

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllShoppingListItems() resolves an empty array`, () => {
            return ShoppingListService.getAllShoppingListItems(db)
              .then(actual => {
                expect(actual).to.eql([])
              })
          })

          it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
            const newItemData = {
                name:'Ketchup',
                price: "3.99",
                category: 'Breakfast',                 
                checked: true,   
                date_added: new Date ('2020-01-12T02:10:32.615Z')
                }

            return ShoppingListService.insertItem(db, newItemData)

            .then(actual => {
                      expect(actual).to.eql({
                        id: 1,
                        ... newItemData
                      })
                    })
        })

    })

})


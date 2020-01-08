require('dotenv').config()
const knex = require('knex')
const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL,
})

// const searchTerm = 'Fish tricks'

// function searchByFoodName(searchTerm) { knexInstance .select('id', 'name', 'price', 'date_added', 'checked', 'category') .from('shopping_list') .where('name', 'ILIKE', `%${searchTerm}%`) .then(result => { console.log(result) }) }

// searchByFoodName('Fish tricks')


// function paginateProducts(page) {
//     const productsPerPage = 6
//     const offset = productsPerPage * (page - 1)
//     knexInstance
//       .select('id', 'name', 'price', 'date_added', 'checked', 'category')
//       .from('shopping_list')
//       .limit(productsPerPage)
//       .offset(offset)
//       .then(result => {
//         console.log(result)
//       })
//   }

//   paginateProducts(1)

// function allItemsAfterDate(days) {
//     knexInstance
//       .select('name', 'category', 'date_added')
//       .where(
//         'date_added',
//         '>',
//         knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
//       )
//       .from('shopping_list')
//       .groupBy('name','category', 'date_added')
//       .orderBy([
//         { column: 'category', order: 'ASC' },
//         { column: 'date_added', order: 'DESC' },
//       ])
//       .then(result => {
//         console.log(result)
//       })
//   }
  
//   allItemsAfterDate(1)

function totalCostOfCategory(){
    knexInstance
    .select('category')
    .from('shopping_list')
    .groupBy('category')
    .sum('price')
    .then(result =>{
        console.log(result)
    })
}

totalCostOfCategory();
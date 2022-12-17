const {
  insertBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
} = require('./handler')

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: insertBookHandler
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBookHandler
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBookByIdHandler
  },
  {
    method: 'PUT',
    path: '/book/{id}',
    handler: editBookByIdHandler
  },
  {
    method: 'DELETE',
    path: '/book/{id}',
    handler: deleteBookByIdHandler
  }
]

module.exports = routes

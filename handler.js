const { createError } = require('./helper')
const books = require('./books')
const { nanoid } = require('nanoid')
function insertBookHandler (request, h) {
  const payload = request.payload
  const { name } = payload

  if (!name) {
    const err = createError(h, 'Gagal menambahkan buku. Mohon isi name buku', 400)
    return err
  }

  const id = nanoid(16)
  const currentDate = new Date().toISOString()
  const newBook = {
    id,
    ...payload,
    insertedAt: currentDate,
    updatedAt: currentDate,
    finished: payload.pageCountr
  }

  books[id] = newBook

  return {
    success: true,
    data: {
      ...newBook
    }
  }
}

function getAllBookHandler () {
  return ''
}

function getBookByIdHandler () {
  return ''
}

function editBookByIdHandler () {
  return ''
}

function deleteBookByIdHandler () {
  return ''
}

module.exports = {
  insertBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}

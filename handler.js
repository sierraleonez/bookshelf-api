const { createError } = require('./helper')
const { books, BOOK_DATA_EXAMPLE } = require('./books')
const { nanoid } = require('nanoid')
const Fuse = require('fuse.js')

function insertBookHandler (request, reply) {
  const payload = request.payload
  const { name } = payload

  if (!name) {
    return createError(reply, 'Gagal menambahkan buku. Mohon isi nama buku', 400)
  }

  if (payload.pageCount > 0 && payload.readPage > 0) {
    if (payload.pageCount < payload.readPage) {
      return createError(reply, 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount', 400)
    }
  }
  try {
    const id = nanoid(16)
    const currentDate = new Date().toISOString()
    const pageCount = payload.pageCount ? payload.pageCount : 0
    const readPage = payload.readPage ? payload.readPage : -1
    const finished = pageCount === readPage

    const newBook = {
      id,
      ...payload,
      insertedAt: currentDate,
      updatedAt: currentDate,
      pageCount,
      readPage,
      finished
    }

    books[id] = newBook
    const res = reply.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    res.code(201)
    return res
  } catch (err) {
    return createError(reply, 'Buku gagal ditambahkan', 500, 'error')
  }
}

function getAllBookHandler (request) {
  const query = request.query
  const queryKeys = Object.keys(query)
  const allBooks = Object.values(books)
  const allBooksBrief = allBooks.map(book => ({
    id: book.id,
    name: book.name,
    publisher: book?.publisher
  }))

  if (queryKeys.length > 0) {
    if (query.name) {
      const options = {
        includeScore: false,
        keys: ['name']
      }

      const fuse = new Fuse(allBooksBrief, options)
      const searchResult = fuse.search(query.name).map(book => book.item)
      return {
        status: 'success',
        data: {
          books: searchResult
        }
      }
    } else {
      const filteredBooks = allBooks
        .filter(book =>
          book[queryKeys[0]] === Boolean(Number(query[(queryKeys[0])]))
        ).map(book => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))

      return {
        status: 'success',
        data: {
          books: filteredBooks
        }
      }
    }
  }

  return {
    status: 'success',
    data: {
      books: allBooksBrief
    }
  }
}

function getBookByIdHandler (request, reply) {
  const { id } = request.params

  if (!books[id]) {
    return createError(reply, 'Buku tidak ditemukan', 404)
  }

  return {
    status: 'success',
    data: {
      book: books[id]
    }
  }
}

function editBookByIdHandler (request, reply) {
  const { id } = request.params
  const payload = request.payload
  if (!books[id]) {
    return createError(reply, 'Gagal memperbarui buku. Id tidak ditemukan', 404)
  }

  if (!request.payload.name) {
    return createError(reply, 'Gagal memperbarui buku. Mohon isi nama buku', 400)
  }

  if (payload.pageCount > 0 && payload.readPage > 0) {
    if (payload.pageCount < payload.readPage) {
      return createError(reply, 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount', 400)
    }
  }

  // Get valid key of request based on predefined book object
  // in order to prevent unwanted key to be included inside our data
  if (typeof request.params === 'object') {
    const responseKeys = Object.keys(payload)
    const filteredResponse = responseKeys.filter(key => BOOK_DATA_EXAMPLE[key])
    const newBook = {}
    filteredResponse.forEach(validKey => {
      newBook[validKey] = payload[validKey]
    })
    books[id] = {
      ...books[id],
      ...newBook,
      updatedAt: new Date().toISOString()
    }
    return {
      status: 'success',
      message: 'Buku berhasil diperbarui',
      id
    }
  }

  return createError(reply, 'Payload invalid', 422)
}

function deleteBookByIdHandler (request, reply) {
  const { id } = request.params

  if (!books[id]) {
    return createError(reply, 'Buku gagal dihapus. Id tidak ditemukan', 404)
  }

  delete books[id]

  return {
    status: 'success',
    message: 'Buku berhasil dihapus'
  }
}

module.exports = {
  insertBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}

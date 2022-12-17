function createError (h, message, code) {
  const response = h.response({
    status: 'fail',
    message
  })

  response.code(code)
  return response
}

module.exports = { createError }

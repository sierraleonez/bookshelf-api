/**
 * Create response object to reduce boilerplate
 * @param {*} reply reply object from handler function
 * @param {string} message error mesage
 * @param {number} code error status code
 * @returns reply.response object
 */
function createError (reply, message, code, status = 'fail') {
  const response = reply.response({
    status,
    message
  })

  response.code(code)
  return response
}

module.exports = { createError }

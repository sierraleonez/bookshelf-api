const nanoid = require('nanoid')

class NotesService {
  constructor () {
    this._notes = []
  }

  addNote ({ title, body, tags }) {
    const id = nanoid(16)
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const newNote = {
      title, body, tags, id, createdAt, updatedAt
    }

    this._notes.push(newNote)

    const isSuccess = this._notes.filter(note => note.id === id).length > 0

    if (!isSuccess) throw new Error('Catatan gagal ditambahkan')

    return id
  }

  getNotes () {
    return this._notes
  }

  getNoteById (id) {
    return this._notes.find(note => note.id === id)
  }

  editNoteById (id, { body, title, tags }) {
    const noteIdx = this._notes.findIndex(note => note.id === id)
    const updatedAt = new Date().toISOString()

    if (noteIdx === -1) {
      throw new Error('Catatan tidak ditemukan')
    }
    this._notes[noteIdx] = {
      ...this._notes[noteIdx],
      body,
      title,
      tags,
      updatedAt
    }
  }

  deleteNoteById (id) {
    const noteIdx = this._notes.findIndex(note => note.id === id)

    if (noteIdx === -1) {
      throw new Error('Catatan tidak ditemukan')
    }

    this._notes.splice(noteIdx, 1)
  }
}
module.exports = { NotesService }

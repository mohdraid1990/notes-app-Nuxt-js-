import { defineStore } from 'pinia'
import { getCurrentLocation } from '~/utils/location'

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [],
    history: [],
    currentIndex: -1
  }),

  actions: {
    async addNote(note) {
      const location = await getCurrentLocation()
      const newNote = {
        id: Date.now(),
        title: note.title,
        todos: note.todos,
        createdAt: new Date(),
        location
      }
      this.notes.push(newNote)
      this.saveToHistory()
      this.saveToLocalStorage()
    },

    updateNote(noteId, updatedNote) {
      const index = this.notes.findIndex(note => note.id === noteId)
      if (index !== -1) {
        this.notes[index] = { 
          ...this.notes[index], 
          ...updatedNote,
          updatedAt: new Date()
        }
        this.saveToHistory()
        this.saveToLocalStorage()
      }
    },

    deleteNote(noteId) {
      this.notes = this.notes.filter(note => note.id !== noteId)
      this.saveToHistory()
      this.saveToLocalStorage()
    },

    clearAllNotes() {
      this.notes = []
      this.saveToHistory()
      this.saveToLocalStorage()
    },

    saveToHistory() {
      // Save the current notes state to history
      this.history.push(JSON.parse(JSON.stringify(this.notes)))
      this.currentIndex = this.history.length - 1
    },

    undo() {
      if (this.currentIndex > 0) {
        this.currentIndex--
        this.notes = JSON.parse(JSON.stringify(this.history[this.currentIndex]))
      }
    },

    redo() {
      if (this.currentIndex < this.history.length - 1) {
        this.currentIndex++
        this.notes = JSON.parse(JSON.stringify(this.history[this.currentIndex]))
      }
    },

    saveToLocalStorage() {
      localStorage.setItem('notes', JSON.stringify(this.notes))
    },

    loadFromLocalStorage() {
      const saved = localStorage.getItem('notes')
      if (saved) {
        this.notes = JSON.parse(saved)
      }
    }
  }
})

<template>
  <div class="container">
    <form @submit.prevent="saveNote" class="note-form">
      <div class="form-group">
        <label for="title">Title</label>
        <input
          id="title"
          v-model="note.title"
          type="text"
          required
          class="form-control"
          placeholder="Enter title"
          aria-label="Note title"
        >
        <!-- Hint for title -->
        <p v-if="note.title.trim() === ''" class="hint">Please fill in the title to proceed. / Пожалуйста, заполните заголовок.</p>
      </div>

      <div class="todos-section">
        <h3>Tasks</h3>
        <TransitionGroup name="fade">
          <div
            v-for="(todo, index) in note.todos"
            :key="index"
            class="todo-item"
          >
            <input
              type="checkbox"
              v-model="todo.completed"
              class="checkbox"
              :aria-label="`Todo task ${index + 1}`"
            >
            <input
              type="text"
              v-model="todo.text"
              class="form-control todo-text"
              placeholder="Enter task"
              :aria-label="`Task ${index + 1} text`"
            >
            <!-- Hint for each task -->
            <p v-if="todo.text.trim() === ''" class="hint">Please fill in this task. / Пожалуйста, заполните эту задачу.</p>
            <button
              @click="removeTodo(index)"
              class="btn btn-danger"
              type="button"
              aria-label="Remove task"
            >
              Remove
            </button>
          </div>
        </TransitionGroup>

        <button
          @click="addTodo"
          class="btn btn-primary"
          type="button"
          aria-label="Add task"
        >
          Add Task
        </button>
      </div>

      <div class="actions">
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="!isFormValid"
          aria-label="Save note"
        >
          Save
        </button>
        <button
          type="button"
          @click="confirmCancel"
          class="btn btn-danger"
          aria-label="Cancel note creation"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="undo"
          :disabled="!canUndo"
          class="btn btn-secondary"
          aria-label="Undo last change"
        >
          Undo
        </button>
        <button
          type="button"
          @click="redo"
          :disabled="!canRedo"
          class="btn btn-secondary"
          aria-label="Redo last change"
        >
          Redo
        </button>
      </div>

      <!-- Displaying error messages -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </form>
  </div>
</template>

<script>
import { useNotesStore } from '~/stores/notes'
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useNotesStore()

    const note = ref({
      title: '',
      todos: []
    })

    const errorMessage = ref('')

    const isNewNote = computed(() => route.params.id === 'new')

    onMounted(() => {
      if (!isNewNote.value) {
        const existingNote = store.notes.find(n => n.id === parseInt(route.params.id))
        if (existingNote) {
          note.value = JSON.parse(JSON.stringify(existingNote))
        } else {
          router.push('/')
        }
      }
    })

    const addTodo = () => {
      note.value.todos.push({
        text: '',
        completed: false
      })
    }

    const removeTodo = (index) => {
      note.value.todos.splice(index, 1)
    }

    const saveNote = () => {
      // Check if the title is empty
      if (note.value.title.trim() === '') {
        errorMessage.value = 'Please fill in the title. / Пожалуйста, заполните заголовок.'
        return
      }

      // Check if any task is empty
      const emptyTask = note.value.todos.some(todo => todo.text.trim() === '')
      if (emptyTask) {
        errorMessage.value = 'You cannot save because there are empty tasks. Please fill in the tasks. / Вы не можете сохранить, потому что есть пустые задачи. Пожалуйста, заполните задачи.'
        return
      }

      // Clear error message if everything is valid
      errorMessage.value = ''

      if (isNewNote.value) {
        store.addNote(note.value)
      } else {
        store.updateNote(parseInt(route.params.id), note.value)
      }
      router.push('/')
    }

    const confirmCancel = () => {
      if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
        router.push('/')
      }
    }

    const isFormValid = computed(() => {
      return note.value.title.trim() !== '' && note.value.todos.every(todo => todo.text.trim() !== '')
    })

    return {
      note,
      errorMessage,
      addTodo,
      removeTodo,
      saveNote,
      confirmCancel,
      undo: () => store.undo(),
      redo: () => store.redo(),
      canUndo: computed(() => store.currentIndex >= 0),
      canRedo: computed(() => store.currentIndex < store.history.length - 1),
      isFormValid
    }
  }
}
</script>
<style lang="scss" scoped>
.note-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 0.5rem;
}

.todo-item {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.5rem;
  animation: slideIn 0.3s ease;
}

.todo-text {
  flex: 1;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.error-message {
  color: red;
  font-size: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid red;
  background-color: #f8d7da;
  border-radius: 5px;
}

.hint {
  font-size: 0.9rem;
  color: #d9534f; /* Red color for hints */
  margin-top: 0.3rem;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>

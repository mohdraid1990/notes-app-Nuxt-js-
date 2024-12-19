<template>
  <div class="container">
    <header class="header">
      <div class="header-main">
        <h1>Notes App</h1>
        <div class="header-actions">
          <NuxtLink to="/note/new" class="btn btn-primary">New Note</NuxtLink>
          <button
            v-if="notes.length > 0"
            @click="confirmClearAll"
            class="btn btn-danger"
          >
            Clear All
          </button>
        </div>
      </div>
    </header>

    <div class="notes-grid">
      <TransitionGroup name="fade">
        <div v-for="note in notes" :key="note.id" class="note-card">
          <h2>{{ note.title }}</h2>
          <NoteMetadata :note="note" />
          <ul class="todo-list">
            <li
              v-for="(todo, index) in visibleTodos(note)"
              :key="index"
              class="todo-item"
            >
              <span :class="{ completed: todo.completed }">
                {{ index + 1 }}. {{ todo.text }}
              </span>
            </li>
          </ul>
          <div class="note-actions">
            <button
              v-if="note.todos.length > 3 && !note.showAllTodos"
              @click="toggleShowAll(note)"
              class="btn btn-secondary"
            >
              Show All Tasks
            </button>
            <button
              v-if="note.todos.length > 3 && note.showAllTodos"
              @click="toggleShowAll(note)"
              class="btn btn-secondary"
            >
              Hide Tasks
            </button>
            <NuxtLink :to="`/note/${note.id}`" class="btn btn-primary"
              >Edit</NuxtLink
            >
            <button @click="confirmDelete(note)" class="btn btn-danger">
              Delete
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <form v-if="showTaskForm" @submit.prevent="addTask">
      <input
        v-model="newTaskText"
        type="text"
        placeholder="Add a new task..."
        class="task-input"
      />
      <button class="btn btn-primary">Add Task</button>
    </form>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { useNotesStore } from "~/stores/notes";
import NoteMetadata from "~/components/NoteMetadata.vue";

export default {
  components: {
    NoteMetadata,
  },
  setup() {
    const store = useNotesStore();
    const newTaskText = ref("");
    const errorMessage = ref("");
    const showTaskForm = ref(false);

    onMounted(() => {
      store.loadFromLocalStorage();
    });

    const confirmDelete = (note) => {
      if (
        confirm(
          "Вы уверены, что хотите удалить эту заметку? / Are you sure you want to delete this note?"
        )
      ) {
        store.deleteNote(note.id);
      }
    };

    const confirmClearAll = () => {
      if (
        confirm(
          "Вы уверены, что хотите удалить все заметки? / Are you sure you want to delete all notes?"
        )
      ) {
        store.clearAllNotes();
      }
    };

    const toggleShowAll = (note) => {
      note.showAllTodos = !note.showAllTodos;
    };

    const visibleTodos = (note) => {
      return note.showAllTodos ? note.todos : note.todos.slice(0, 3);
    };

    const addTask = () => {
      if (!newTaskText.value.trim()) {
        errorMessage.value =
          "Task cannot be empty! / Пожалуйста, введите правильную задачу!";
        return;
      }
      store.addTask(newTaskText.value.trim());
      newTaskText.value = "";
      errorMessage.value = "";
    };

    const toggleTaskForm = (noteTitle) => {
      if (noteTitle.trim()) {
        showTaskForm.value = true;
      }
    };

    return {
      notes: computed(() => store.notes),
      newTaskText,
      errorMessage,
      showTaskForm,
      confirmDelete,
      confirmClearAll,
      toggleShowAll,
      visibleTodos,
      addTask,
      toggleTaskForm,
    };
  },
};
</script>

<style lang="scss" scoped>
li {
  list-style: none;
}
a {
  text-decoration: none;
}
.header {
  margin-bottom: 2rem;

  &-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &-actions {
    display: flex;
    gap: 1rem;
    
  }
}

.note-actions {
  display: flex;
  gap: 15px;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.todo-item {
  background: #f9f9f9;
  padding: 10px;
  margin: 20px 0;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease;

  &.completed {
    text-decoration: line-through;
    color: gray;
  }

  &:hover {
    background: #e0e0e0;
  }
}

.task-input {
  margin-top: 1rem;
  padding: 0.5rem;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.error-message {
  color: red;
  margin-top: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

@media (max-width: 768px) {
  .btn {
    font-size: 0.5rem; 
  }
}
</style>

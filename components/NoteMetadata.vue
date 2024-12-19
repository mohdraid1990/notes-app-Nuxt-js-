<template>
  <div class="note-metadata">
    <div class="metadata-section">
      <div class="metadata-item">
        <i class="fas fa-calendar"></i>
        <div class="metadata-content">
          <div class="english">{{ englishDate }}</div>
          <div class="russian">{{ russianDate }}</div>
        </div>
      </div>
      <div class="metadata-item">
        <i class="fas fa-map-marker-alt"></i>
        <div class="metadata-content">
          <div class="english">{{ note.location }}</div>
          <div class="russian">Место: {{ note.location }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDateTime } from '~/utils/location'

export default {
  props: {
    note: {
      type: Object,
      required: true
    }
  },
  computed: {
    englishDate() {
      return formatDateTime(this.note.createdAt, 'en')
    },
    russianDate() {
      return formatDateTime(this.note.createdAt, 'ru')
    }
  }
}
</script>

<style lang="scss" scoped>
.note-metadata {
  background: rgba(74, 144, 226, 0.1);
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
}

.metadata-section {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.metadata-item {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  
  i {
    color: #4a90e2;
    font-size: 1.2rem;
    margin-top: 0.2rem;
  }
}

.metadata-content {
  flex: 1;
  
  .english {
    color: #2c3e50;
    font-weight: 500;
    margin-bottom: 0.2rem;
  }
  
  .russian {
    color: #7f8c8d;
    font-size: 0.9rem;
    font-style: italic;
  }
}

@media (max-width: 768px) {
  .metadata-section {
    gap: 1rem;
  }
  
  .metadata-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    
    i {
      margin-top: 0;
    }
  }
}
</style>
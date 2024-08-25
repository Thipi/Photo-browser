<template>
    <div
      v-if="isVisible"
      class="photo-modal-overlay"
      @click.self="close"
      role="dialog"
      aria-labelledby="modalTitle"
      aria-describedby="modalDescription"
      tabindex="-1"
    >
      <div class="photo-modal">
        <button
          class="photo-modal-close"
          @click="close"
          aria-label="Close modal"
          @keydown.esc="close"
        >
          ×
        </button>
        <img :src="photo.url" :alt="photo.title" />
        <h2 id="modalTitle">{{ photo.title }}</h2>
        <p id="modalDescription">{{ photo.description }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      photo: {
        type: Object,
        required: true
      },
      isVisible: {
        type: Boolean,
        required: true
      }
    },
    mounted() {
      if (this.isVisible) {
        this.$nextTick(() => {
          this.$el.focus();
        });
      }
    },
    methods: {
      close() {
        this.$emit('close');
      }
    }
  }
  </script>
  
  <style scoped>
  .photo-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .photo-modal {
    position: relative;
    max-width: 650px;
    max-height: 850px;
    overflow: auto;
    color: rgb(255, 255, 255);
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .photo-modal img {
    width: 100%;
    height: auto;
  }
  
  .photo-modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 24px;
    color: rgb(255, 255, 255);
    cursor: pointer;
  }
  
  .photo-modal-close:hover {
    color: rgb(0, 0, 0);
  }
  </style>
  
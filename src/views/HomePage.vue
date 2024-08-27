<template>
  <div>
    <h1>Photo Browser</h1>
    <div ref="photoContainer" class="photo-container" @scroll.passive="debouncedHandleScroll">
      <div
        v-for="(photo, index) in visiblePhotos"
        :key="photo.id"
        class="photo-thumbnail"
        tabindex="0"
        role="button"
        @click="openModal(photo)"
        @keydown.enter="openModal(photo)"
        @keydown.space.prevent="openModal(photo)"
        aria-label="View details of photo {{ getPhotoNumber(index) }}"
      >
        <div class="photo-number">{{ getPhotoNumber(index) }}</div>
        <img :src="photo.thumbnailUrl" :alt="photo.title" />
      </div>
      <div v-if="loading || isLoadingMore || isLoadingPrevious" class="loading">Loading...</div>
    </div>

    <PhotoModal 
      v-if="selectedPhoto"
      :photo="selectedPhoto"
      :isVisible="isModalVisible"
      @close="closeModal"
    />
  </div>
</template>

<script>
import { getPhotos } from '@/services/photoservice.js';
import PhotoModal from '@/components/PhotoModal.vue';
import { debounce } from '@/utils/debouncer.js';

export default {
  components: {
    PhotoModal
  },
  data() {
    return {
      photos: [],
      visiblePhotos: [],
      currentPage: 1,
      isModalVisible: false,
      selectedPhoto: null,
      loading: false,
      maxPhotos: 15,
      photosPerPage: 15,
      isLoadingMore: false,
      isLoadingPrevious: false,
    };
  },
  created() {
    this.debouncedHandleScroll = debounce(this.handleScroll, 200);
    this.loadInitialPhotos();
  },
  methods: {
    openModal(photo) {
      this.selectedPhoto = photo;
      this.isModalVisible = true;
    },
    closeModal() {
      this.selectedPhoto = null;
      this.isModalVisible = false;
    },
    async loadInitialPhotos() {
      this.loading = true;
      try {
        const response = await getPhotos(this.currentPage, this.photosPerPage);
        this.photos = response.data;
        this.updateVisiblePhotos();
      } catch (error) {
        console.error("Failed to load initial photos:", error);
      } finally {
        this.loading = false;
      }
    },
    //When scrolling down load more photos (remove/hide the previous photos for optimization)
    async loadMorePhotos() {
      if (this.isLoadingMore) return;

      this.isLoadingMore = true;
      try {
        const response = await getPhotos(this.currentPage + 1, this.photosPerPage);
        this.photos = [...this.photos, ...response.data];
        this.currentPage++;
        this.updateVisiblePhotos();
      } catch (error) {
        console.error("Failed to load more photos:", error);
      } finally {
        this.isLoadingMore = false;
      }
    },
    //After scrolling down at least once
    async loadPreviousPhotos() {
      if (this.isLoadingPrevious || this.currentPage <= 1) return;

      this.isLoadingPrevious = true;
      try {
        const response = await getPhotos(this.currentPage - 1, this.photosPerPage);
        this.photos = [...response.data, ...this.photos];
        this.currentPage--;
        this.updateVisiblePhotos();
      } catch (error) {
        console.error("Failed to load previous photos:", error);
      } finally {
        this.isLoadingPrevious = false;
      }
    },
    //Remove photos that are not visible.
    updateVisiblePhotos() {
      const startIndex = (this.currentPage - 1) * this.photosPerPage;
      this.visiblePhotos = this.photos.slice(startIndex, startIndex + this.maxPhotos);
    },
    handleScroll() {
      const container = this.$refs.photoContainer;
      if (!container) return;

      const scrollTop = container.scrollTop;
      const scrollBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 10;

      if (scrollBottom && !this.isLoadingMore) {
        this.loadMorePhotos();
      } else if (scrollTop === 0 && this.currentPage > 1 && !this.isLoadingPrevious) {
        this.loadPreviousPhotos();
      }
    },
    debouncedHandleScroll() {
      this.debouncedHandleScroll();
    },
    getPhotoNumber(index) {
      return (this.currentPage - 1) * this.photosPerPage + index + 1;
    },
  },
};
</script>

<style>
.photo-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 10px;
  padding: 10px;
  overflow-y: auto;
  max-height: calc(100vh - 50px);
}

.photo-thumbnail {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  background-color: #f0f0f0;
}

.photo-thumbnail img {
  width: 100%;
  height: auto;
  display: block;
}

.photo-number {
  position: absolute;
  top: 5px;
  left: 5px;
  background-color: rgb(15, 49, 46);
  color: #fff;
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 12px;
}

.loading {
  text-align: center;
  color: rgb(15, 49, 46);
  margin: 20px 0;
}

/* Responsiveness */
@media (max-width: 1200px) {
  .photo-container {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 800px) {
  .photo-container {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 600px) {
  .photo-container {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    padding: 5px;
  }
}
</style>

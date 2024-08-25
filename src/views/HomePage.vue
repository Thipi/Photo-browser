<template>
  <div>
    <h1>Photo Browser</h1>
    <div ref="photoContainer" class="photo-container" @scroll.passive="handleScroll">
        <div
            v-for="(photo, index) in visiblePhotos"
            :key="photo.id"
            class="photo-thumbnail"
            tabindex="0"
            role="button"
            @click="openModal(photo)"
            @keydown.enter="openModal(photo)"
            @keydown.space.prevent="openModal(photo)"
            aria-label="View details of photo {{ index + 1 }}"
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
      maxPhotos: 42,
      photosPerPage: 24,
      isLoadingMore: false,
      isLoadingPrevious: false,
    };
  },
  created() {
    this.debouncedHandleScroll = debounce(this.handleScroll, 200);
    this.loadInitialPhotos();
  },
  methods: {
    /*Modal methods for viewing detailed popup of the photo*/
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
        const response = await getPhotos(1, this.photosPerPage);
        this.photos = response.data;
        this.visiblePhotos = this.photos.slice(0, this.maxPhotos);
      } catch (error) {
        console.error("Failed to load initial photos:", error);
      } finally {
        this.loading = false;
      }
    },
    //Loading with async method more photos when scrolling down
    async loadMorePhotos() {
      if (this.isLoadingMore) return;

      this.isLoadingMore = true;
      try {
        const response = await getPhotos(this.currentPage + 1, this.photosPerPage);
        this.photos = [...this.photos, ...response.data];
        this.visiblePhotos = this.photos.slice(0, this.maxPhotos);
        this.currentPage++;
      } catch (error) {
        console.error("Failed to load more photos:", error);
      } finally {
        this.isLoadingMore = false;
      }
    },
    async loadPreviousPhotos() {
      if (this.isLoadingPrevious || this.currentPage <= 1) return;

      this.isLoadingPrevious = true;
      this.currentPage--;
      try {
        const response = await getPhotos(this.currentPage, this.photosPerPage);
        this.photos = [...response.data, ...this.photos];
        this.visiblePhotos = this.photos.slice(0, this.maxPhotos);
      } 
      catch (error) {
        console.error("Failed to load previous photos:", error);
      } 
      finally {
        this.isLoadingPrevious = false;
      }
    },
    handleScroll() { //We want to load more photos as we scroll down without any clicks
      const container = this.$refs.photoContainer;
      const scrollTop = container.scrollTop; //Are we scrolling to top?
      const scrollBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 10; //Or are we scrolling to bottom.

      if (scrollBottom && !this.loading) {
        this.loadMorePhotos();
      } else if (scrollTop === 0 && this.currentPage > 1) {
        this.loadPreviousPhotos();
      }
    },
    debouncedHandleScroll() {
      this.debouncedHandleScroll();
    },
    getPhotoNumber(index) { //Displaying the number of the photo, so we know where we are as in the demo the color don't tell much :D
      return (this.currentPage - 1) * 20 + index + 1;
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

/* Responsive adjustments */
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

.loading {
  text-align: center;
  color: rgb(15, 49, 46);;
  margin: 20px 0;
}
</style>

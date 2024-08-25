<template>
    <div>
      <router-link to="/">Back to Photos</router-link>
      <h1>{{ photo.title }}</h1>
      <img :src="photo.url" :alt="photo.title" />
      <p>{{ photo.title }}</p>
    </div>
  </template>
  
  <script>
  import { getPhotoById } from '@/services/photoService';
  
  export default {
    data() {
      return {
        photo: {}
      };
    },
    created() {
      const { id } = this.$route.params;
      getPhotoById(id).then(response => {
        this.photo = response.data;
      });
    }
  };
  </script>
  
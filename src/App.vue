<template>
  <v-app>
    <v-main>
      <AppNavbar />
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import AppNavbar from '../src/components/AppNavbar.vue'
export default {
   components: {
    AppNavbar,
  },
  name: 'App',

  data: () => ({
    //
  }),
}
</script>

<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/task-logo6.png')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Bienvenido al Sistema de Gestión de Tareas
        </h1>

        <p class="subheading font-weight-regular">
          Selecciona una de las opciones para comenzar a gestionar tus tareas.
        </p>
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >
        <v-btn
          color="primary"
          class="mb-4"
          @click="goTo('list')"
        >
          Ver Lista de Tareas
        </v-btn>

        <v-btn
          color="secondary"
          class="mb-4"
          @click="goTo('form')"
        >
          Crear Nueva Tarea
        </v-btn>
                
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'HelloWorld',
  methods: {
    goTo(routeName) {
      this.$router.push({ name: routeName });
    }
  }
}
</script>

<style scoped>

.mb-4{
  margin-right: 5px;
}
</style>
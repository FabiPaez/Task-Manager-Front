<template>
  <v-app-bar app color="primary" dark>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-toolbar-title>Task Manager</v-toolbar-title>
    
    <v-btn text to="/">Inicio</v-btn>
    <v-btn text to="/list">Lista de Tareas</v-btn>
    <v-btn text to="/form">Crear Nueva Tarea</v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "AppNavbar",
};
</script>

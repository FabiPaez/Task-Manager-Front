<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="tasks"
      :items-per-page="10"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <v-flex xs12 class="text-center">
            <v-toolbar-title>Task List</v-toolbar-title>
          </v-flex>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="goToForm">New Task</v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.title }}</td>
          <td>{{ item.status }}</td>
          <td class="fecha">{{ item.dueDate }}</td>
          <td>
            <v-btn @click="editTask(item)" color="info" class="btn-action"
              >Edit</v-btn
            >
            <v-btn @click="deleteTask(item)" color="error" class="btn-action"
              >Delete</v-btn
            >
          </td>
          <td>
            <v-btn @click="statusHistory(item)" color="info" class="btn-action"
              >Historial</v-btn
            >
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "TaskList",
  data() {
    return {
      headers: [
        { title: "Título", align: "start" },
        { title: "Estado", align: "start" },
        { title: "Fecha de Vencimiento", align: "start" },
        { title: "Editar o Eliminar", align: "start" },
        { title: "Historial de Estados", align: "start" },
      ],
      statusNames: [],
      statusIds: [],
      tasks: [], // Aquí van las tareas obtenidas de la API
    };
  },
  methods: {
    async fetchTasks() {
      try {
        const [statusResponse, tasksResponse] = await Promise.all([
          axios.get("https://task-manager-okmnmtbtd-fabian-paezs-projects.vercel.app/api/estados"),
          axios.get("https://task-manager-okmnmtbtd-fabian-paezs-projects.vercel.app/api/tareas"),
        ]);

        this.statusNames = statusResponse.data.map((estado) => estado.Nombre);
        this.statusIds = statusResponse.data.map((estado) => estado.Id);

        this.tasks = tasksResponse.data.map((task) => ({
          id: task.Id,
          title: task.Titulo,
          status: this.statusNames[this.statusIds.indexOf(task.EstadoId)],
          dueDate: this.formatDate(task.FechaVencimiento),
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    goToForm() {
      this.$router.push("/form");
    },
    editTask(task) {
      // console.log("Editing task:", task);
      // Redirigir al formulario de edición con el ID de la tarea
      this.$router.push(`/form/${task.id}`);
    },
    statusHistory(task) {
      this.$router.push(`/tareas/${task.id}/historial`);
    },
    async deleteTask(task) {
      try {
        const confirmDelete = confirm(
          `Are you sure you want to delete "${task.title}"?`
        );
        if (confirmDelete) {
          await axios.delete(`https://task-manager-okmnmtbtd-fabian-paezs-projects.vercel.app/api/tareas/${task.id}`);
          this.fetchTasks(); // Vuelve a cargar las tareas después de eliminar
        }
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    },
    formatDate(
      dateString,
      options = { day: "2-digit", month: "2-digit", year: "numeric" }
    ) {
      return new Date(dateString).toLocaleDateString("es-ES", options);
    },
  },
  async created() {
    await this.fetchTasks();
  },
};
</script>

<style scoped>
.btn-action {
  margin-right: 5px;
}
.fecha {
  text-indent: 25px;
}
</style>
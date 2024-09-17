<template>
  <v-container>
    <v-form ref="form" v-model="valid">
      <!-- Campo de Título -->
      <v-text-field
        v-model="task.titulo"
        label="Título"
        :rules="[rules.required]"
      ></v-text-field>

      <!-- Campo de Descripción -->
      <v-textarea v-model="task.descripcion" label="Descripción"></v-textarea>

      <!-- Campo de Fecha de Vencimiento -->
      <v-text-field
        v-model="task.fechaVencimiento"
        label="Fecha de Vencimiento"
        type="date"
        :rules="[dateRules]"
      ></v-text-field>

      <!-- Campo de Estado -->
      <v-select
        :items="status"
        item-title="Nombre"
        item-value="Id"
        v-model="task.estadoId"
        label="Selecciona un Estado"
      ></v-select>

      <!-- Botón de Guardar -->
      <v-btn :disabled="!valid" color="primary" @click="submitForm">
        Guardar Tarea
      </v-btn>
    </v-form>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      valid: false,
      task: {
        descripcion: "",
        estadoId: null,
        fechaCreacion: "",
        fechaVencimiento: "",
        Id: "",
        titulo: "",
      },
      dateRules: [
        (value) => !!value || "La fecha es requerida.",
        (value) =>
          /^\d{4}-\d{2}-\d{2}$/.test(value) ||
          "El formato de la fecha debe ser AAAA-MM-DD.",
      ],
      status: [], // Aquí guardamos los estados obtenidos de la API
      rules: {
        required: (value) => !!value || "Este campo es requerido",
      },
    };
  },
  methods: {
    async fetchStatusOptions() {
      try {
        const response = await axios.get("/api/estados");
        this.status = response.data;
      } catch (error) {
        console.error("Error fetching status options:", error);
      }
    },
    async fetchTask(id) {
      try {
        const response = await axios.get(`/api/tareas/${id}`);
        const tarea = response.data;
        this.task = {
          Id: tarea.Id,
          titulo: tarea.Titulo,
          descripcion: tarea.Descripcion,
          fechaVencimiento: tarea.FechaVencimiento.split("T")[0], // Formato YYYY-MM-DD
          estadoId: tarea.EstadoId,
        };
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    },
    async submitForm() {
      if (!this.$refs.form.validate()) return;

      const taskData = {
        Titulo: this.task.titulo,
        Descripcion: this.task.descripcion,
        FechaCreacion: this.task.fechaCreacion || new Date().toISOString(),
        FechaVencimiento: this.task.fechaVencimiento,
        EstadoId: this.task.estadoId,
      };

      try {
        let response;

        if (this.task.Id) {
          // Obtener los datos de la tarea actual para comparar el EstadoId antes de actualizar
          const currentTask = await axios.get(`/api/tareas/${this.task.Id}`);

          // Actualizar tarea existente
          await axios.put(`/api/tareas/${this.task.Id}`, taskData);

          // Solo registrar en el historial si el EstadoId ha cambiado
          if (currentTask.data.EstadoId !== this.task.estadoId) {
            this.registerHistory(this.task.Id, "Estado actualizado");
          }
        } else {
          // Crear nueva tarea
          response = await axios.post("/api/tareas", taskData);
          const newTaskId = response.data.Id;
          this.registerHistory(newTaskId, "Tarea creada");
        }

        this.$router.push("/list");
      } catch (error) {
        console.error("Error al enviar la tarea:", error);
      }
    },
    async registerHistory(taskId, comentarioBase) {
      const estadoNombre = this.status.find(
        (estado) => estado.Id === this.task.estadoId
      )?.Nombre;

      const historyData = {
        TareaId: taskId,
        EstadoId: this.task.estadoId,
        FechaCambio: new Date().toISOString(),
        Comentario: `${comentarioBase}: ${estadoNombre}`,
      };

      try {
        await axios.post(`/api/tareas/${taskId}/cambiar_estado`, historyData);
      } catch (error) {
        console.error("Error registrando historial:", error);
      }
    },
  },
  created() {
    this.fetchStatusOptions();
    const id = this.$route.params.id;
    if (id) {
      this.fetchTask(id);
    }
  },
};
</script>

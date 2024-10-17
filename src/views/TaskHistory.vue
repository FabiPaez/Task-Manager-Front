<template>
  <v-container>
    <v-toolbar flat>
      <v-spacer></v-spacer>
      <v-toolbar-title class="text-center mx-auto">
        Historial de Estados de Tarea N° {{  history[0].TareaId }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-timeline align="start">
      <v-timeline-item
        v-for="(entry, index) in history"        
        :key="index"
        :dot-color="entry.Color"
      >
        <v-card>
          <v-card-title>
           {{ formatFechaCambio(entry.FechaCambio) }}            
          </v-card-title>
          <v-card-text v-if="entry.Comentario">
            {{ entry.Comentario }}
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  props: ["taskId"],
  data() {
    return {
      history: [
        {
          TareaId: "",
          EstadoId: "",
          Comentario: "",
          FechaCambio: "",
          Color: '',
        } 
      ]
             
    };
  },
  methods: {
    fetchTaskHistory(id) {
      axios
        .get(`http://localhost:3000/api/tareas/${id}/historial`)
        .then((response) => {
          this.history = response.data;
          console.log(this.history);
          this.getStatusColorHistory(this.history);          
        })
        .catch((error) => {
          console.error("Error fetching task history:", error);
        });
    },
    getStatusColorHistory(history) {
      history.forEach(element => {
        element.Color = this.getStatusColor(String(element.EstadoId));
      });
      },    
     getStatusColor(status) {
      switch (status) {
        case '1': return 'navy';
        case '2': return 'blue';
        case '3': return 'green';
        default: return 'grey';
      }
    },
    getStatusIcon(status) {
      switch (status) {
        case '1':
          return "mdi-clock-outline";
        case '2':
          return "mdi-progress-clock";
        case '3':
          return "mdi-check-circle-outline";
        default:
          return "mdi-help-circle-outline";
      }
    },
    formatFechaCambio(fechaCambio) {
      const options = { day: "2-digit", month: "2-digit", year: "numeric" };
      return new Date(fechaCambio).toLocaleDateString("es-ES", options);
    },
  },
  created() {
    const id = this.taskId || this.$route.params.id;
    if (id) {
      this.fetchTaskHistory(id);     
    } else {
      console.error("No task ID provided.");
    }

  },
  };
</script>

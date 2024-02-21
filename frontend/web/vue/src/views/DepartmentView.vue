<template>
  <v-card>
    <v-card-item>
      <v-card-title class="d-flex justify-space-between">
        <span>Department</span>
        <v-btn
          variant="tonal"
          prepend-icon="mdi-plus"
        >Add</v-btn>
      </v-card-title>

      <v-row justify="end" class="mt-1">
        <v-col lg="3" md="4" sm="6" xs="12">
          <v-text-field
            :loading="loading"
            density="compact"
            variant="solo"
            label="Search"
            append-inner-icon="mdi-magnify"
            single-line
            hide-details
            v-model="tmpQuery"
            @click:append-inner="params.searchQuery = tmpQuery"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-data-table-server
        v-model:items-per-page="params.perPage"
        :search="params.searchQuery"
        :headers="headers"
        :items-length="data.totalCount"
        :items="data.rows"
        :loading="loading"
        @update:options="getAllDepartment"
      >
      </v-data-table-server>
    </v-card-item>
  </v-card>
</template>

<script setup>
import { useDepartmentStore } from '@/stores/department';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const headers= [
  { title: 'Department Name', key: 'department_name', },
  { title: 'Parent', key: 'parent_department_name' },
  { title: 'Action' },
]

const tmpQuery = ref('')

const { data, params, loading } = storeToRefs(useDepartmentStore())
const { getAllDepartment } = useDepartmentStore()
</script>
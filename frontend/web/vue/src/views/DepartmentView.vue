<template>
  <v-card>
    <v-card-item>
      <v-card-title class="d-flex justify-space-between">
        <span>Department</span>
        <v-btn
          variant="tonal"
          prepend-icon="mdi-plus"
          @click="dialog = true"
        >Add</v-btn>
      </v-card-title>

      <v-row justify="end" class="mt-1">
        <v-col lg="3" md="4" sm="6" xs="12">
          <v-text-field
            :loading="loading"
            density="compact"
            variant="solo-filled"
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

  <v-dialog v-model="dialog" width="500" scrollable>
    <v-card>
      <v-form validate-on="submit lazy" @submit.prevent="handleSubmit">
        <v-card-title>
          Department Form
        </v-card-title>
        <v-card-text>
          <v-autocomplete
            label="Parent Department"
            :items="getSelectData()"
            item-title="department_name"
            item-value="id"
            v-model="form.parent_department_id"
          ></v-autocomplete>
          <v-text-field
            label="Department Name*"
            v-model="form.department_name"
            :rules="rules"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="dialog = false">Close</v-btn>
          <v-btn color="primary" type="submit">Submit</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
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
const dialog = ref(false)
const form = ref({
  parent_department_id: '',
  department_name: ''
})
const rules = [
  value => {
    if (value) return true

    return 'You must enter a department name.'
  },
]

const getSelectData = () => {
  if (data.totalCount > params.perPage) {
    params.perPage = data.totalCount
    getAllDepartment()
    return data.rows
  }
  return data.value.rows
}

const handleSubmit = async () => {
  console.log('form', form.value.department_name);
  if (form.value.department_name) {
    try {
      await addDepartment(form.value)
      getAllDepartment({ sortBy: [] })
    } catch (error) {
      console.error('handleSubmit error', error);
    } finally {
      dialog.value = false
    }
  }
}

const { data, params, loading } = storeToRefs(useDepartmentStore())
const { getAllDepartment, addDepartment } = useDepartmentStore()
</script>
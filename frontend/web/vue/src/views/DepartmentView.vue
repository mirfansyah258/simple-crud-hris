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
        <v-col xl="2" lg="3" md="4" sm="6" xs="12">
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
        @update:options="getDtDepartment"
      >
      <template v-slot:item.id="{ item }">
        <v-icon
          size="small"
          class="me-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          size="small"
          @click="deleteItem(item.id)"
        >
          mdi-delete
        </v-icon>
      </template>
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
            :items="all.data"
            item-title="department_name"
            item-value="id"
            v-model="form.parent_department_id"
            @update:focused="getSelectData"
            :loading="all.loading"
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
          <v-btn color="primary" @click="getSelectData()">Submit</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useDepartmentStore } from '@/stores/department';
import { storeToRefs } from 'pinia';
import { ref, toRaw } from 'vue';

import Swal from 'sweetalert2'
// import '@sweetalert2/theme-dark';

const headers = [
  { title: 'Department Name', key: 'department_name', },
  { title: 'Parent', key: 'parent_department_name' },
  { title: 'Action', key: 'id' },
]

const tmpQuery = ref('')
const dialog = ref(false)
const rules = [
  value => {
    if (value) return true

    return 'You must enter a department name.'
  },
]
const selectLoading = ref(true)

const getSelectData = (e) => {
  e && getAllDepartment()
}

const handleSubmit = async () => {
  console.log('form', form.value.department_name);
  if (form.value.department_name) {
    try {
      if (form.value.id) { // update
        await updateDepartment(form.value)
      } else { //create
        await addDepartment(form.value)
      }
    } catch (error) {
      console.error('handleSubmit error', error);
    } finally {
      // getDtDepartment({ sortBy: [] })
      dialog.value = false
      form.value = {
        id: '',
        parent_department_id: '',
        department_name: ''
      }
    }
  }
}

const editItem = (item) => {
  dialog.value = true
  console.log('item', toRaw(item));
  const data = toRaw(item)
  form.value = {
    id: data.id,
    parent_department_id: data.parent_department_id,
    department_name: data.department_name
  }
}

const deleteItem = async (id) => {
  id = toRaw(id)
  Swal.fire({
    icon: "warning",
    title: "Warning",
    text: "Are you sure want to delete this item?",
    showCancelButton: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await deleteDepartment(id)
        Swal.fire("Deleted!", "", "success");
      } catch (error) {
        console.error('deleteItem error', error);
      }
    }
  })
}

const { data, all, params, form, loading } = storeToRefs(useDepartmentStore())
const { getDtDepartment, getAllDepartment, addDepartment, updateDepartment, deleteDepartment } = useDepartmentStore()
</script>
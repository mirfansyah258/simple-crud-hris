<template>
  <v-card>
    <v-card-item>
      <v-card-title class="d-flex justify-space-between">
        <span>Employee</span>
        <v-btn
          variant="tonal"
          prepend-icon="mdi-plus"
          @click="dialog = true; getAllDepartment()"
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
        @update:options="getDtEmployee"
      >
      <template v-slot:item.is_head="{ item }">
        <v-icon
          size="small"
          class="me-2"
          color="success"
          v-if="item.is_head"
        >
          mdi-check-circle
        </v-icon>
        <v-icon
          size="small"
          color="error"
          v-else
        >
          mdi-close-circle
        </v-icon>
      </template>
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
          Employee Form
        </v-card-title>
        <v-card-text>
          <v-autocomplete
            label="Department"
            :items="all.data"
            item-title="department_name"
            item-value="id"
            v-model="form.department_id"

            :loading="all.loading"
            :rules="deptRules"
          ></v-autocomplete>
          <v-text-field
            label="Employee Name*"
            v-model="form.position_name"
            :rules="posNameRules"
          ></v-text-field>
          <v-switch
            v-model="form.is_head"
            color="primary"
            label="Is Head"
            hide-details
          ></v-switch>
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
import { usePositionStore } from '@/stores/position';
import { useEmployeeStore } from '@/stores/employee';
import { storeToRefs } from 'pinia';
import { ref, toRaw } from 'vue';

import Swal from 'sweetalert2'

const headers = [
  { title: 'EMP Number', key: 'emp_number', },
  { title: 'Fullname', key: 'fullname', },
  { title: 'Position', key: 'position_name', },
  { title: 'Department', key: 'department_name', },
  { title: 'Action', key: 'id' },
]

const tmpQuery = ref('')
const dialog = ref(false)
const posNameRules = [
  value => {
    if (value) return true

    return 'You must enter a position name.'
  },
]
const deptRules = [
  value => {
    if (value) return true

    return 'You must enter a department.'
  },
]

const handleSubmit = async () => {
  console.log('form', form.value.position_name);
  if (form.value.position_name) {
    try {
      if (form.value.id) { // update
        await updateEmployee(form.value)
      } else { //create
        await addEmployee(form.value)
      }
    } catch (error) {
      console.error('handleSubmit error', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response.data.error,
      })
    } finally {
      // getDtEmployee({ sortBy: [] })
      dialog.value = false
      form.value = {
        id: '',
        parent_position_id: '',
        position_name: ''
      }
    }
  }
}

const editItem = (item) => {
  getAllDepartment().then(() => {
    dialog.value = true
    console.log('item', toRaw(item));
    const data = toRaw(item)

    form.value = {
      id: data.id,
      parent_position_id: data.parent_position_id,
      department_id: data.department_id,
      position_name: data.position_name,
      is_head: data.is_head
    }
  })
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
        await deleteEmployee(id)
        Swal.fire("Deleted!", "", "success");
      } catch (error) {
        console.error('deleteItem error', error);
      }
    }
  })
}

const { all } = storeToRefs(useDepartmentStore())
const { getAllDepartment } = useDepartmentStore()

const { data, params, form, loading } = storeToRefs(useEmployeeStore())
const { getDtEmployee, addEmployee, updateEmployee, deleteEmployee } = useEmployeeStore()
</script>
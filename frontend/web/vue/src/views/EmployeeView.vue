<template>
  <v-card>
    <v-card-item>
      <v-card-title class="d-flex justify-space-between">
        <span>Employee</span>
        <v-btn
          variant="tonal"
          prepend-icon="mdi-plus"
          @click="dialog = true; getAllPosition()"
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

  <v-dialog v-model="dialog" max-width="960" scrollable>
    <v-card>
      <v-form validate-on="submit lazy" @submit.prevent="handleSubmit">
        <v-card-title>
          Employee Form
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col md="4" sm="12" cols="12">
              <v-file-input
                accept="image/*"
                label="Photo"
                prepend-icon="mdi-camera-account"
                class="mw-300"
              ></v-file-input>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="6" sm="12" cols="12">
              <v-text-field
                label="Employee Number*"
                v-model="form.emp_number"
                :rules="[v => !!v || 'You must enter a Employee Number']"
              ></v-text-field>
            </v-col>
            <v-col md="6" sm="12" cols="12">
              <v-text-field
                label="ID Card*"
                v-model="form.id_card_number"
                type="number"
                :rules="[
                  v => !!v || 'You must enter a ID Card',
                  v => (v && v.length == 16) || 'ID Card must be 16 characters'
                ]"
              ></v-text-field>
            </v-col>
            <v-col md="6" sm="12" cols="12">
              <v-text-field
                label="First Name*"
                v-model="form.firstname"
                :rules="[v => !!v || 'You must enter a Employee First Name']"
              ></v-text-field>
            </v-col>
            <v-col md="6" sm="12" cols="12">
              <v-text-field
                label="Last Name"
                v-model="form.lastname"
              ></v-text-field>
            </v-col>
            <v-col md="6" sm="12" cols="12">
              <v-text-field
                label="Birthdate*"
                v-model="form.birthdate"
                :rules="[v => !!v || 'You must enter a Employee Birthdate']"
                type="date"
              ></v-text-field>
            </v-col>
            <v-col md="6" sm="12" cols="12">
              <p>Gender</p>
              <v-radio-group v-model="form.gender" inline>
                <v-radio label="Male" value="M"></v-radio>
                <v-radio label="Female" value="F"></v-radio>
              </v-radio-group>
            </v-col>
            <v-col md="6" sm="12" cols="12">
              <v-switch
                v-model="form.marital_status"
                color="primary"
                :label="`Is Married? ${form.marital_status}`"
                false-value="No"
                true-value="Yes"
                hide-details
              ></v-switch>
            </v-col>
            <v-col md="6" sm="12" cols="12">
              <v-textarea
                label="Address"
                v-model="form.address"
                rows="2"
              ></v-textarea>
            </v-col>
            <v-col md="6" sm="12" cols="12">
              <v-text-field
                label="Phone"
                v-model="form.phone"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col md="6" sm="12" cols="12">
              <v-text-field
                label="Email"
                v-model="form.email"
                :rules="[v => (v && !!/.+@.+\..+/.test(v)) || 'E-mail must be valid']"
              ></v-text-field></v-col>
            <v-col md="6" sm="12" cols="12">
              <v-text-field
                label="Emergency Contact Name"
                v-model="form.emergency_contact_name"
              ></v-text-field>
            </v-col>
            <v-col md="6" sm="12" cols="12">
              <v-text-field
                label="Emergency Contact Phone"
                v-model="form.emergency_contact_phone"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col md="6" sm="12" cols="12">
              <v-text-field
                label="Join Date*"
                v-model="form.join_date"
                :rules="[v => !!v || 'You must enter a Employee Join Date']"
                type="date"
              ></v-text-field>
            </v-col>
            <v-col md="6" sm="12" cols="12">
              <v-text-field
                label="End Date*"
                v-model="form.end_date"
                :rules="[v => !!v || 'You must enter a Employee End Date']"
                type="date"
              ></v-text-field>
            </v-col>
            <v-col md="6" sm="12" cols="12">
              <v-autocomplete
                label="Position*"
                :items="all.data"
                item-title="position_name"
                item-value="id"
                v-model="form.position_id"
                :loading="all.loading"
                :rules="[v => !!v || 'You must enter a Employee Position']"
              ></v-autocomplete>
            </v-col>
            <v-col md="6" sm="12" cols="12">
              <v-text-field
                v-model="form.password"
                :append-icon="pwToggle ? 'mdi-eye' : 'mdi-eye-off'"
                :type="pwToggle ? 'text' : 'password'"
                label="Password"
                @click:append="pwToggle = !pwToggle"
              ></v-text-field>
            </v-col>
          </v-row>
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
import { usePositionStore } from '@/stores/position';
import { useEmployeeStore } from '@/stores/employee';
import { storeToRefs } from 'pinia';
import { ref, toRaw } from 'vue';
import moment from 'moment';

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
const birthdate = ref('')
const showDate = () => {
  birthdate.value = moment(form.value.birthdate).format('YYYY-MM-DD')
  console.log('form.birthdate', form.value.birthdate);
  console.log('birthdate.value', birthdate.value);
}
const pwToggle = ref(false)

const handleSubmit = async (e) => {
  const v = await e

  if (v.valid) {
    try {
      var form_data = new FormData();
      var item = form.value
  
      for (var key in item) {
        form_data.append(key, item[key]);
      }
      formData.value = form_data
  
      if (form.value.id) { // update
        await updateEmployee(formData.value)
      } else { //create
        await addEmployee(formData.value)
      }
    } catch (error) {
      console.error('handleSubmit error', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response.data.error,
      })
    } finally {
      dialog.value = false
      form.value = {
        id: '',
        emp_number: '',
        id_card_number: '',
        firstname: '',
        lastname: '',
        birthdate: null,
        gender: '',
        marital_status: false,
        address: '',
        phone: '',
        email: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        join_date: '',
        end_date: '',
        position_id: '',
        password: ''
      }
    }
  }
}

const editItem = (item) => {
  getAllPosition().then(() => {
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

const { all } = storeToRefs(usePositionStore())
const { getAllPosition } = usePositionStore()

const { data, params, form, loading, formData } = storeToRefs(useEmployeeStore())
const { getDtEmployee, addEmployee, updateEmployee, deleteEmployee } = useEmployeeStore()
</script>
import { ref, computed, toRaw } from 'vue'
import { defineStore } from 'pinia'
import { create, getAll, update, deleteEmployee as delEmp } from '@/apis/employee'

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    data: {
      rows: [],
      totalCount: 0,
      currentPage: 1,
      perPage: 1,
      totalPage: 0
    },
    all: {
      data: [],
      loading: false
    },
    params: {
      page: 1,
      perPage: 10,
      searchQuery: '',
      sort: '',
      status: 'active'
    },
    form: {
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
    },
    formData: null,
    loading: true
  }),
  getters: {
    getData: (state) => state.data,
    getParams: (state) => state.params,
  },
  actions: {
    async addEmployee(data) {
      this.loading = true
      try {
        const res = await create(data)
        console.log('res', res);
        return res.data
      } catch (error) {
        console.error('add employee error', error);
        throw error
      } finally {
        this.loading = false
        this.getDtEmployee()
      }
    },
    async getDtEmployee(dt) {
      this.loading = true
      this.params.sort = ''
      
      if (dt) {
        const datatables = toRaw(dt)
        console.log('datatables', datatables);
        if ('sortBy' in datatables) {
          if (datatables.sortBy.length) {
            let sort = datatables.sortBy
            this.params.sort = `${sort[0].key},${sort[0].order}`
          }
        }
        if (datatables.page) {
          this.params.page = datatables.page
        }
      }

      try {
        const res = await getAll(this.params)
        console.log('res', res);
        console.log('data', res.data.data);
        this.data = res.data.data
      } catch (error) {
        console.error('getDt employee error', error);
        throw error
      } finally {
        this.loading = false
      }
    },
    async getAllEmployee(perPage = 1000) {
      this.all.loading = true
      try {
        const res = await getAll({
          page: 1,
          perPage,
          searchQuery: '',
          sort: ''
        })
        this.all.data = res.data.data.rows
      } catch (error) {
        console.error('getAll employee error', error);
        throw error
      } finally {
        this.all.loading = false
      }
    },
    async updateEmployee(data) {
      this.loading = true
      try {
        const res = await update(data.id, data)
        console.log('updateEmployee res', res);
        return res.data
      } catch (error) {
        console.error('update employee error', error);
        throw error
      } finally {
        this.loading = false
        this.getDtEmployee()
      }
    },
    async deleteEmployee(id) {
      this.loading = true
      try {
        const res = await delEmp(id)
        console.log('deleteEmployee res', res);
        return res.data
      } catch (error) {
        console.error('delete employee error', error);
        throw error
      } finally {
        this.loading = false
        this.getDtEmployee()
      }
    },
  }
})

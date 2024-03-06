import { ref, computed, toRaw } from 'vue'
import { defineStore } from 'pinia'
import { create, getAll, update, deleteDepartment as delDept } from '@/apis/department'

export const useDepartmentStore = defineStore('department', {
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
      sort: ''
    },
    form: {
      id: '',
      parent_department_id: '',
      department_name: ''
    },
    loading: true
  }),
  getters: {
    getData: (state) => state.data,
    getParams: (state) => state.params,
  },
  actions: {
    async addDepartment(data) {
      this.loading = true
      try {
        const res = await create(data)
        console.log('res', res);
        return res.data
      } catch (error) {
        console.error('add department error', error);
        throw error
      } finally {
        this.loading = false
        this.getDtDepartment({ sortBy: [] })
      }
    },
    async getDtDepartment(dt) {
      this.loading = true
      const datatables = toRaw(dt)
      console.log('datatables', datatables);
      if (datatables.sortBy.length) {
        let sort = datatables.sortBy
        this.params.sort = `${sort[0].key},${sort[0].order}`
      } else {
        this.params.sort = ''
      }
      if (datatables.page) {
        this.params.page = datatables.page
      }
      try {
        const res = await getAll(this.params)
        console.log('res', res);
        console.log('data', res.data.data);
        this.data = res.data.data
      } catch (error) {
        console.error('getDt department error', error);
        throw error
      } finally {
        this.loading = false
      }
    },
    async getAllDepartment(perPage = 1000) {
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
        console.error('getAll department error', error);
        throw error
      } finally {
        this.all.loading = false
      }
    },
    async updateDepartment(data) {
      this.loading = true
      try {
        const res = await update(data.id, data)
        console.log('updateDepartment res', res);
        return res.data
      } catch (error) {
        console.error('update department error', error);
        throw error
      } finally {
        this.loading = false
        this.getDtDepartment({ sortBy: [] })
      }
    },
    async deleteDepartment(id) {
      this.loading = true
      try {
        const res = await delDept(id)
        console.log('deleteDepartment res', res);
        return res.data
      } catch (error) {
        console.error('delete department error', error);
        throw error
      } finally {
        this.loading = false
        this.getDtDepartment({ sortBy: [] })
      }
    },
  }
})

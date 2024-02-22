import { ref, computed, toRaw } from 'vue'
import { defineStore } from 'pinia'
import { create, getAll } from '@/apis/department'

export const useDepartmentStore = defineStore('department', {
  state: () => ({
    data: {
      rows: [],
      totalCount: 0,
      currentPage: 1,
      perPage: 10,
      totalPage: 0
    },
    params: {
      page: 1,
      perPage: 10,
      searchQuery: '',
      sort: ''
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
      }
    },
    async getAllDepartment({ sortBy }) {
      this.loading = true
      if (sortBy) {
        let sort = toRaw(sortBy)
        console.log('sortBy', toRaw(sortBy));
        if (sort.length) {
          this.params.sort = `${sort[0].key},${sort[0].order}`
        }
      }
      try {
        const res = await getAll(this.params)
        console.log('res', res);
        console.log('data', res.data.data);
        this.data = res.data.data
      } catch (error) {
        console.error('getAll department error', error);
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})

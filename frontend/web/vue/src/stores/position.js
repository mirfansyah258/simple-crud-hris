import { ref, computed, toRaw } from 'vue'
import { defineStore } from 'pinia'
import { create, getAll, update, deletePosition as delPos } from '@/apis/position'

export const usePositionStore = defineStore('position', {
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
      position_name: '',
      department_id: '',
      is_head: false
    },
    loading: true
  }),
  getters: {
    getData: (state) => state.data,
    getParams: (state) => state.params,
  },
  actions: {
    async addPosition(data) {
      this.loading = true
      try {
        const res = await create(data)
        console.log('res', res);
        return res.data
      } catch (error) {
        console.error('add position error', error);
        throw error
      } finally {
        this.loading = false
        this.getDtPosition()
      }
    },
    async getDtPosition(dt) {
      this.loading = true
      const datatables = toRaw(dt)
      console.log('datatables', datatables);

      this.params.sort = ''
      if ('sortBy' in datatables) {
        if (datatables.sortBy.length) {
          let sort = datatables.sortBy
          this.params.sort = `${sort[0].key},${sort[0].order}`
        }
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
        console.error('getDt position error', error);
        throw error
      } finally {
        this.loading = false
      }
    },
    async getAllPosition(perPage = 1000) {
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
        console.error('getAll position error', error);
        throw error
      } finally {
        this.all.loading = false
      }
    },
    async updatePosition(data) {
      this.loading = true
      try {
        const res = await update(data.id, data)
        console.log('updatePosition res', res);
        return res.data
      } catch (error) {
        console.error('update position error', error);
        throw error
      } finally {
        this.loading = false
        this.getDtPosition()
      }
    },
    async deletePosition(id) {
      this.loading = true
      try {
        const res = await delPos(id)
        console.log('deletePosition res', res);
        return res.data
      } catch (error) {
        console.error('delete position error', error);
        throw error
      } finally {
        this.loading = false
        this.getDtPosition()
      }
    },
  }
})

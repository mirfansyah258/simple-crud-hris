import http from "@/utils/axios";

export const create = async (data) => {
  return await http.post('/department', data)
}

export const getAll = async (params) => {
  return await http.get('/department', { params })
}

export const update = async (id, data) => {
  return await http.put(`/department/${id}`, data)
}

export const deleteDepartment = async (id) => {
  return await http.delete(`/department/${id}`)
}
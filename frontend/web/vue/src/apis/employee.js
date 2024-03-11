import http from "@/utils/axios";

export const create = async (data) => {
  return await http.post('/employee', data)
}

export const getAll = async (params) => {
  return await http.get('/employee', { params })
}

export const update = async (id, data) => {
  return await http.put(`/employee/${id}`, data)
}

export const deleteEmployee = async (id) => {
  return await http.delete(`/employee/${id}`)
}
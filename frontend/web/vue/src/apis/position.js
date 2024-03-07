import http from "@/utils/axios";

export const create = async (data) => {
  return await http.post('/position', data)
}

export const getAll = async (params) => {
  return await http.get('/position', { params })
}

export const update = async (id, data) => {
  return await http.put(`/position/${id}`, data)
}

export const deletePosition = async (id) => {
  return await http.delete(`/position/${id}`)
}
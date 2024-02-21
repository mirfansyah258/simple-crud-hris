import http from "@/utils/axios";

export const create = async (data) => {
  return await http.post('/department', data)
}

export const getAll = async (params) => {
  return await http.get('/department', { params })
}
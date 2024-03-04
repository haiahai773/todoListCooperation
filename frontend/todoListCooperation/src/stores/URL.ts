import { defineStore } from 'pinia'

export const useURLStore = defineStore('URL', () => {
  const baseURL = "http://localhost:3000";
  const userReg = baseURL + "/user/reg"
  const userLogin = baseURL + "/user/login" 
  const userCreateTodo = baseURL + "/user/createTodo"
  const userDoneTodo = baseURL + "/user/doneTodo"
  
  const orgaReg = baseURL + "/orga/reg"
  const orgaLogin = baseURL + "/orga/login"
  const orgaAsignTodo = baseURL + "/orga/asignTodo"
  const orgaGetOrgaTodo = baseURL + "/orga/getOrgaTodo"
  const orgaGetMember = baseURL + "/orga/getMember"
  const orgaAddMember = baseURL + "/orga/assMember"
  const orgaDeleteMember = baseURL + "/orga/deleteMember"
  const orgaDoneTodo = baseURL + "/orga/doneTodo"

  return {
    baseURL,
    userReg,
    userLogin,
    userCreateTodo,
    userDoneTodo,

    orgaReg,
    orgaLogin,
    orgaAsignTodo,
    orgaGetOrgaTodo,
    orgaGetMember,
    orgaAddMember,
    orgaDeleteMember,
    orgaDoneTodo
  }
})

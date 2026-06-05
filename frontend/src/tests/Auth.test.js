import { describe, it, expect, beforeEach } from "vitest";
import { saveToken, getToken, removeToken, isAuthenticated, saveUser, getUser, logout } from "../services/Auth.js";

describe('Auth Service Tests', () => {
    //clear localstorage before each test
   beforeEach(() => {
    localStorage.clear()
   })

   it('should save token to localstorage', () =>{
    saveToken('test-token-123')
    expect(localStorage.getItem('careermap_token')).toBe('test-token-123')
   })

   it('should get token from localstorage',() => {
    localStorage.setItem('careermap_token', 'test-token-123')
    expect(getToken()).toBe('test-token-123')
})

  it('should remove token from localStorage', () => {
    localStorage.setItem('careermap_token', 'test-token-123')
    removeToken()
    expect(localStorage.getItem('careermap_token')).toBeNull()
  })

   it('should return true when user is authenticated', () => {
    localStorage.setItem('careermap_token', 'test-token-123')
    expect(isAuthenticated()).toBe(true)
  })

  it('should return false when user is not authenticated', () => {
    expect(isAuthenticated()).toBe(false)
  })
 
  it('should save user to localStorage', () => {
    const user = { name: 'Satyam', email: 'satyam@test.com', role: 'student' }
    saveUser(user)
    expect(localStorage.getItem('careermap_user')).toBe(JSON.stringify(user))
  })

  it('should get user from localStorage', () => {
    const user = { name: 'Satyam', email: 'satyam@test.com', role: 'student' }
    localStorage.setItem('careermap_user', JSON.stringify(user))
    expect(getUser()).toEqual(user)
  })

  it('should logout and clear all localStorage', () => {
    localStorage.setItem('careermap_token', 'test-token-123')
    localStorage.setItem('careermap_user', JSON.stringify({ name: 'Satyam' }))
    logout()
    expect(localStorage.getItem('careermap_token')).toBeNull()
    expect(localStorage.getItem('careermap_user')).toBeNull()
  })


})

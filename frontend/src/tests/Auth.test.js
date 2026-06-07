import { describe, it, expect, beforeEach } from "vitest";
import { saveToken, getToken, removeToken, isAuthenticated, saveUser, getUser, logout } from "../services/Auth.js";

// Test suite for Auth.js service - tests all authentication utility functions
describe('Auth Service Tests', () => {

  // Clear localStorage before each test to ensure clean state
  beforeEach(() => {
    localStorage.clear()
  })

  // Test 1: saveToken should store token in localStorage
  it('should save token to localstorage', () => {
    // Arrange - define test token
    const testToken = 'test-token-123'
    // Act - call saveToken function
    saveToken(testToken)
    // Assert - check token was saved correctly
    expect(localStorage.getItem('careermap_token')).toBe('test-token-123')
  })

  // Test 2: getToken should retrieve token from localStorage
  it('should get token from localstorage', () => {
    // Arrange - manually set token in localStorage
    localStorage.setItem('careermap_token', 'test-token-123')
    // Act and Assert - getToken should return the same token
    expect(getToken()).toBe('test-token-123')
  })

  // Test 3: removeToken should delete token from localStorage
  it('should remove token from localStorage', () => {
    // Arrange - set a token first
    localStorage.setItem('careermap_token', 'test-token-123')
    // Act - remove the token
    removeToken()
    // Assert - token should now be null
    expect(localStorage.getItem('careermap_token')).toBeNull()
  })

  // Test 4: isAuthenticated should return true when token exists
  it('should return true when user is authenticated', () => {
    // Arrange - set a token to simulate logged in user
    localStorage.setItem('careermap_token', 'test-token-123')
    // Act and Assert - should return true
    expect(isAuthenticated()).toBe(true)
  })

  // Test 5: isAuthenticated should return false when no token
  it('should return false when user is not authenticated', () => {
    // Arrange - localStorage is empty (cleared in beforeEach)
    // Act and Assert - should return false
    expect(isAuthenticated()).toBe(false)
  })

  // Test 6: saveUser should store user object as JSON in localStorage
  it('should save user to localStorage', () => {
    // Arrange - define test user object
    const user = { name: 'Satyam', email: 'satyam@test.com', role: 'student' }
    // Act - save user
    saveUser(user)
    // Assert - user should be stored as JSON string
    expect(localStorage.getItem('careermap_user')).toBe(JSON.stringify(user))
  })

  // Test 7: getUser should retrieve and parse user from localStorage
  it('should get user from localStorage', () => {
    // Arrange - manually store user as JSON string
    const user = { name: 'Satyam', email: 'satyam@test.com', role: 'student' }
    localStorage.setItem('careermap_user', JSON.stringify(user))
    // Act and Assert - getUser should return parsed user object
    expect(getUser()).toEqual(user)
  })

  // Test 8: logout should remove both token and user from localStorage
  it('should logout and clear all localStorage', () => {
    // Arrange - set both token and user
    localStorage.setItem('careermap_token', 'test-token-123')
    localStorage.setItem('careermap_user', JSON.stringify({ name: 'Satyam' }))
    // Act - logout
    logout()
    // Assert - both token and user should be null
    expect(localStorage.getItem('careermap_token')).toBeNull()
    expect(localStorage.getItem('careermap_user')).toBeNull()
  })

})
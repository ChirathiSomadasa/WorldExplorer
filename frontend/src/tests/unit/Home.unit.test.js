import { render, screen, fireEvent } from '@testing-library/react'
import Home from "../../pages/Home";
import axios from 'axios'

jest.mock('axios')
jest.mock('../../utils/Alert', () => ({
  showSuccessAlert: jest.fn(),
  showErrorAlert: jest.fn(),
  showInfoAlert: jest.fn()
}))

describe('Home Component - Unit Tests', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
    localStorage.clear()
    
    // Default successful API responses
    axios.get.mockImplementation((url) => {
      if (url.includes('/filters')) {
        return Promise.resolve({
          data: {
            regions: ['Europe', 'Asia'],
            languages: ['en', 'es']
          }
        })
      }
      if (url.includes('/all')) {
        return Promise.resolve({
          data: {
            data: [{
              name: 'Test Country',
              capital: 'Test Capital',
              region: 'Europe',
              population: 1000000,
              flag: 'flag-url'
            }],
            totalPages: 1
          }
        })
      }
      return Promise.reject(new Error('Unknown URL'))
    })
    
    axios.post.mockResolvedValue({
      data: {
        favorites: ['Test Country']
      }
    })
  })

  test('renders without crashing', async () => {
    render(<Home />)
    expect(await screen.findByText('Featured Countries')).toBeInTheDocument()
  })

  test('search input updates searchQuery state', async () => {
    render(<Home />)
    const searchInput = await screen.findByPlaceholderText('Search for a country...')
    fireEvent.change(searchInput, { target: { value: 'France' } })
    expect(searchInput.value).toBe('France')
  })

  test('filter changes update state', async () => {
    render(<Home />)
    const regionSelect = await screen.findByLabelText('Region')
    fireEvent.change(regionSelect, { target: { value: 'Europe' } })
    expect(regionSelect.value).toBe('Europe')
    
    const languageSelect = await screen.findByLabelText('Language')
    fireEvent.change(languageSelect, { target: { value: 'es' } })
    expect(languageSelect.value).toBe('es')
  })

  test('reset filters clears all states', async () => {
    render(<Home />)
    const resetButton = await screen.findByText('Reset')
    fireEvent.click(resetButton)
    
    expect(await screen.findByLabelText('Region')).toHaveValue('')
    expect(await screen.findByLabelText('Language')).toHaveValue('')
    expect(await screen.findByPlaceholderText('Search for a country...')).toHaveValue('')
  })

  test('toggleFavorite adds to favorites', async () => {
    localStorage.setItem('auth_token', 'test-token')
    render(<Home />)
    
    const exploreButton = await screen.findByText('Explore')
    const card = exploreButton.closest('.bg-white')
    const favoriteButton = card.querySelector('button')
    
    fireEvent.click(favoriteButton)
    
    expect(axios.post).toHaveBeenCalled()
    expect(require('../utils/Alert').showSuccessAlert).toHaveBeenCalledWith(
      'Added to Favorites',
      'Test Country was successfully added.'
    )
  })

  test('shows error when unauthenticated user tries to favorite', async () => {
    render(<Home />)
    
    const exploreButton = await screen.findByText('Explore')
    const card = exploreButton.closest('.bg-white')
    const favoriteButton = card.querySelector('button')
    
    fireEvent.click(favoriteButton)
    
    expect(require('../utils/Alert').showErrorAlert).toHaveBeenCalledWith(
      'Login Required',
      'Please log in to manage favorites.'
    )
  })

  test('displays error message on failed country fetch', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'))
    render(<Home />)
    
    expect(await screen.findByText('Fetch Error')).toBeInTheDocument()
  })
})
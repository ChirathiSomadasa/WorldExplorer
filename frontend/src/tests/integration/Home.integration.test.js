import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from "../../pages/Home";
import axios from 'axios'

jest.mock('axios')
jest.mock('../../utils/Alert', () => ({
  showSuccessAlert: jest.fn(),
  showErrorAlert: jest.fn(),
  showInfoAlert: jest.fn()
}))

describe('Home Component - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    
    // Mock API responses
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
              name: 'France',
              capital: 'Paris',
              region: 'Europe',
              population: 67000000,
              flag: 'france-flag'
            }],
            totalPages: 1
          }
        })
      }
      return Promise.reject(new Error('Unknown URL'))
    })
    
    axios.post.mockResolvedValue({
      data: {
        favorites: ['France']
      }
    })
  })

  test('user can perform full search and filter workflow', async () => {
    render(<Home />)
    
    // Search for country
    const searchInput = await screen.findByPlaceholderText('Search for a country...')
    fireEvent.change(searchInput, { target: { value: 'France' } })
    
    // Apply search
    const searchButton = screen.getByText('Search')
    fireEvent.click(searchButton)
    
    // Wait for results
    expect(await screen.findByText('France')).toBeInTheDocument()
    
    // Apply region filter
    const regionSelect = screen.getByLabelText('Region')
    fireEvent.change(regionSelect, { target: { value: 'Europe' } })
    
    // Check if filtered results show
    expect(screen.getByText('France')).toBeInTheDocument()
  })

  test('pagination works correctly', async () => {
    // Mock second page response
    axios.get.mockImplementation((url) => {
      if (url.includes('/all') && url.includes('page=2')) {
        return Promise.resolve({
          data: {
            data: [{
              name: 'Page 2 Country',
              capital: 'Capital',
              region: 'Europe',
              population: 1000000,
              flag: 'flag'
            }],
            totalPages: 2
          }
        })
      }
      return Promise.reject(new Error('Unexpected URL'))
    })
    
    render(<Home />)
    
    // Wait for initial load
    expect(await screen.findByText('Featured Countries')).toBeInTheDocument()
    
    // Go to next page
    const nextPageButton = screen.getByText('Next')
    fireEvent.click(nextPageButton)
    
    // Check for new country
    expect(await screen.findByText('Page 2 Country')).toBeInTheDocument()
    
    // Go back to previous page
    const prevPageButton = screen.getByText('Previous')
    fireEvent.click(prevPageButton)
    
    // Check original country is back
    expect(await screen.findByText('France')).toBeInTheDocument()
  })

  test('favorite functionality persists across sessions', async () => {
    // Initial render with no favorites
    render(<Home />)
    expect(await screen.findByText('France')).toBeInTheDocument()
    
    // Add to favorites
    localStorage.setItem('auth_token', 'test-token')
    const exploreButton = screen.getByText('Explore')
    const card = exploreButton.closest('.bg-white')
    const favoriteButton = card.querySelector('button')
    
    fireEvent.click(favoriteButton)
    
    // Verify success message
    expect(require('../utils/Alert').showSuccessAlert).toHaveBeenCalledWith(
      'Added to Favorites',
      'France was successfully added.'
    )
    
    // Re-render component
    render(<Home />)
    
    // Check if favorite is preserved
    expect(await screen.findByText('France')).toBeInTheDocument()
    const updatedCard = screen.getByText('France').closest('.bg-white')
    const filledHeart = updatedCard.querySelector('.MuiSvgIcon-root')
    expect(filledHeart).toBeInTheDocument()
  })

  test('error handling displays proper messages', async () => {
    // Mock error for filters
    axios.get.mockRejectedValueOnce(new Error('Filters failed'))
    
    render(<Home />)
    
    // Wait for error alert
    await waitFor(() => {
      expect(require('../utils/Alert').showErrorAlert).toHaveBeenCalledWith(
        'Failed to Load Filters',
        'Could not load regions or languages.'
      )
    })
    
    // Mock error for countries
    axios.get.mockRejectedValueOnce(new Error('Countries failed'))
    
    // Force re-render by changing page
    const nextPageButton = await screen.findByText('Next')
    fireEvent.click(nextPageButton)
    
    await waitFor(() => {
      expect(require('../utils/Alert').showErrorAlert).toHaveBeenCalledWith(
        'Fetch Error',
        'Unable to retrieve country data at this time.'
      )
    })
  })
})
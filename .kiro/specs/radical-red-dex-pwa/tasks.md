# Implementation Plan: Radical Red Dex PWA

## Overview

This implementation plan breaks down the Radical Red Dex PWA into discrete coding tasks. The application is a vanilla JavaScript Progressive Web App that works completely offline, is installable on mobile devices, and runs on GitHub Pages. The implementation follows a bottom-up approach: data layer first, then application logic, then UI components, and finally PWA features.

## Tasks

- [x] 1. Set up project structure and core files
  - Create root directory structure with index.html, style.css, script.js, manifest.json, service-worker.js
  - Create /data subdirectory for JSON files
  - Create /icons subdirectory for app icons
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

- [x] 2. Implement Data Manager module
  - [x] 2.1 Create DataManager object with data storage and loading functions
    - Implement loadAllData() to fetch all JSON files (species, moves, abilities, items, trainers, tmMoves, tutorMoves, types, areas, natures, eggGroups, splits, evolutions, scaledLevels, caps, sprites)
    - Store loaded data in memory for session
    - Add try-catch blocks for fetch operations
    - _Requirements: 3.1, 3.2, 10.1-10.16_
  
  - [x] 2.2 Add data accessor methods with null checks
    - Implement getSpecies(id), getMove(id), getAbility(id) and other accessors
    - Add validation for missing fields with default values
    - Use optional chaining for nested property access
    - _Requirements: 3.3, 3.5, 11.1, 11.4_
  
  - [ ]* 2.3 Write property test for missing field handling
    - **Property 2: Missing Field Graceful Handling**
    - **Validates: Requirements 3.3, 11.1**
    - Generate random malformed JSON objects with missing fields
    - Assert no errors thrown when accessing data
    - Use fast-check with 100 iterations
  
  - [x] 2.4 Add error handling for failed data loading
    - Display user-friendly error message when JSON loading fails
    - Prevent application crash with empty data structure fallbacks
    - Log errors to console for debugging
    - _Requirements: 3.4, 11.2_

- [x] 3. Implement Favorites Manager module
  - [x] 3.1 Create FavoritesManager object with localStorage integration
    - Implement load() to read from localStorage key 'radical-red-favorites'
    - Implement save() to persist favorites array to localStorage
    - Store favorites in a Set for efficient lookup
    - Handle localStorage errors gracefully
    - _Requirements: 6.2, 6.3, 6.4_
  
  - [x] 3.2 Add toggle and check methods
    - Implement toggle(pokemonId) to add/remove favorites
    - Implement isFavorite(pokemonId) to check favorite status
    - Call save() after each toggle operation
    - _Requirements: 6.2_
  
  - [ ]* 3.3 Write property test for favorites persistence
    - **Property 6: Favorites Persistence Round-Trip**
    - **Validates: Requirements 6.2, 6.3**
    - Generate random sets of Pokémon IDs
    - Save to localStorage and load back
    - Assert all favorites preserved correctly
    - Use fast-check with 100 iterations

- [x] 4. Implement UI Utilities module
  - [x] 4.1 Create UIUtils object with DOM helper functions
    - Implement createElement(tag, className, content)
    - Implement clearElement(element)
    - Implement showError(message) with dismissible error display
    - _Requirements: 11.2_
  
  - [x] 4.2 Add type color mapping and formatting functions
    - Implement getTypeColor(type) with color mappings for all Pokémon types
    - Implement formatStatName(stat) for display formatting
    - Use red (#ff0000) as accent color per design requirements
    - _Requirements: 7.2_

- [x] 5. Implement Home Screen component
  - [x] 5.1 Create HomeScreen object with search and list rendering
    - Implement render() to display search bar and Pokémon list
    - Implement handleSearch(query) with case-insensitive filtering
    - Filter by both name and ID
    - Use minimal DOM updates for performance
    - _Requirements: 4.1, 4.2, 4.3, 4.5, 4.6_
  
  - [x] 5.2 Add Pokémon list rendering with favorite indicators
    - Implement renderPokemonList(pokemon) to create list items
    - Display Pokémon ID, name, and favorite star indicator
    - Add click handlers to navigate to detail view
    - Show star (★) for favorited Pokémon
    - _Requirements: 4.4, 6.5_
  
  - [ ]* 5.3 Write property test for search filtering
    - **Property 3: Search Filtering Correctness**
    - **Validates: Requirements 4.3**
    - Generate random search query strings
    - Assert all results match query (name or ID)
    - Assert no matching Pokémon excluded
    - Use fast-check with 100 iterations
  
  - [ ]* 5.4 Write property test for favorites display
    - **Property 7: Favorites Display Indicator**
    - **Validates: Requirements 6.5**
    - Generate random favorite sets
    - Assert star indicator shown for all favorited Pokémon
    - Assert no star for non-favorited Pokémon
    - Use fast-check with 100 iterations

- [x] 6. Implement Detail View component
  - [x] 6.1 Create DetailView object with rendering functions
    - Implement render(pokemonId) to display all Pokémon information
    - Implement renderBasicInfo() for name, sprite, types
    - Implement renderStats() for base stats display
    - Implement renderAbilities() for abilities list
    - Implement renderEvolutions() for evolution chain
    - Implement renderMoves() for move list
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_
  
  - [x] 6.2 Add favorite toggle and back navigation
    - Implement handleFavoriteToggle() to toggle favorite status
    - Implement handleBack() to navigate to home screen
    - Add favorite button in header
    - Add back button in header
    - _Requirements: 5.8, 6.1_
  
  - [ ]* 6.3 Write property test for detail view completeness
    - **Property 5: Detail View Completeness**
    - **Validates: Requirements 5.1-5.7**
    - Generate random Pokémon IDs
    - Assert all required fields displayed when data available
    - Assert graceful handling of missing optional fields
    - Use fast-check with 100 iterations
  
  - [ ]* 6.4 Write property test for navigation to detail view
    - **Property 4: Navigation to Detail View**
    - **Validates: Requirements 4.4**
    - Generate random Pokémon IDs
    - Simulate click on list item
    - Assert correct Pokémon displayed in detail view
    - Use fast-check with 100 iterations

- [x] 7. Implement View Manager and navigation
  - [x] 7.1 Create ViewManager object with routing logic
    - Implement init() to set up hash change listeners
    - Implement handleHashChange() to parse URL hash
    - Implement showHome() to render home screen
    - Implement showDetail(pokemonId) to render detail view
    - Support hash formats: #, #home, #pokemon/{id}
    - _Requirements: 4.4_
  
  - [x] 7.2 Add browser back button support
    - Use hash navigation for back button compatibility
    - Update hash when navigating between views
    - Listen for popstate events
    - _Requirements: 5.8_

- [x] 8. Checkpoint - Ensure core functionality works
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Create HTML structure
  - [x] 9.1 Create index.html with semantic structure
    - Add DOCTYPE, html, head, and body tags
    - Link to style.css and script.js with relative paths
    - Link to manifest.json
    - Add meta tags for viewport and theme-color (#ff0000)
    - Create main container div for app content
    - _Requirements: 8.5, 9.1_
  
  - [x] 9.2 Add service worker registration script
    - Register service-worker.js in index.html
    - Handle registration errors gracefully
    - Log registration status to console
    - _Requirements: 2.1, 11.5_

- [x] 10. Create CSS styling
  - [x] 10.1 Implement dark theme with mobile-first design
    - Set background color to #111
    - Set accent color to #ff0000
    - Use clean typography with system fonts
    - Implement responsive layout with flexbox/grid
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [x] 10.2 Style home screen components
    - Style search bar with dark theme
    - Style Pokémon list items with hover effects
    - Style favorite star indicator
    - Ensure mobile-friendly touch targets
    - _Requirements: 7.3, 7.5_
  
  - [x] 10.3 Style detail view components
    - Style header with back button and favorite button
    - Style sprite display
    - Style type badges with appropriate colors
    - Style stats display
    - Style abilities, evolutions, and moves sections
    - _Requirements: 7.5, 7.6_
  
  - [x] 10.4 Style error messages
    - Create dismissible error message styling
    - Use red accent color for error indicators
    - Ensure visibility without being intrusive
    - _Requirements: 11.2_

- [x] 11. Implement Service Worker
  - [x] 11.1 Create service-worker.js with cache versioning
    - Define cache version constant (e.g., 'cache-v1')
    - List all static assets to cache (HTML, CSS, JS, manifest)
    - List all JSON data files to cache
    - List all icon files to cache
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [x] 11.2 Implement install event handler
    - Cache all static assets on install
    - Cache all JSON data files on install
    - Use waitUntil to ensure caching completes
    - _Requirements: 2.1, 2.2_
  
  - [x] 11.3 Implement activate event handler
    - Delete old caches when version changes
    - Keep only current version cache
    - Use waitUntil to ensure cleanup completes
    - _Requirements: 2.3_
  
  - [x] 11.4 Implement fetch event handler with cache-first strategy
    - Check cache first for all requests
    - Fall back to network if cache miss
    - Handle cache failures gracefully
    - _Requirements: 2.5, 2.6_
  
  - [ ]* 11.5 Write property test for offline resource serving
    - **Property 1: Offline Resource Serving**
    - **Validates: Requirements 2.5**
    - Generate random cached resource requests
    - Mock offline state
    - Assert resources served from cache
    - Use fast-check with 100 iterations

- [x] 12. Create PWA manifest
  - [x] 12.1 Create manifest.json with app configuration
    - Set name to "Radical Red Dex"
    - Set short_name to "RR Dex"
    - Set start_url to "/"
    - Set display to "standalone"
    - Set background_color to "#000000"
    - Set theme_color to "#ff0000"
    - Add icon entries for 192x192 and 512x512 sizes
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 13. Create app icons
  - [x] 13.1 Generate or create app icons
    - Create icon-192.png (192x192 pixels)
    - Create icon-512.png (512x512 pixels)
    - Use Radical Red theme colors (red on dark background)
    - Save icons to /icons directory
    - _Requirements: 1.5_

- [x] 14. Wire all components together in main script
  - [x] 14.1 Create application initialization function
    - Initialize DataManager and load all data
    - Initialize FavoritesManager and load favorites
    - Initialize ViewManager and set up navigation
    - Handle initialization errors gracefully
    - _Requirements: 3.1, 3.2_
  
  - [x] 14.2 Set up event listeners and start application
    - Add DOMContentLoaded listener to start app
    - Connect all component event handlers
    - Handle hash navigation on page load
    - Display loading state during data loading
    - _Requirements: 4.3, 4.4, 6.1_
  
  - [ ]* 14.3 Write property test for error-free execution
    - **Property 9: Error-Free Execution**
    - **Validates: Requirements 11.3**
    - Generate random user interactions
    - Assert no uncaught errors thrown
    - Assert application remains functional
    - Use fast-check with 100 iterations

- [x] 15. Add data validation and error handling
  - [x] 15.1 Add comprehensive null checks throughout application
    - Validate all data field accesses
    - Use default values for missing fields
    - Add try-catch blocks around critical operations
    - _Requirements: 3.5, 11.1, 11.4_
  
  - [x] 15.2 Test error scenarios
    - Test with missing JSON files
    - Test with malformed JSON data
    - Test with missing Pokémon fields
    - Verify error messages display correctly
    - _Requirements: 3.4, 11.2_

- [x] 16. Validate relative paths and GitHub Pages compatibility
  - [x] 16.1 Ensure all resource paths are relative
    - Check HTML links to CSS, JS, manifest
    - Check service worker cache paths
    - Check JSON data fetch paths
    - Check icon paths in manifest
    - _Requirements: 8.5_
  
  - [ ]* 16.2 Write property test for relative path usage
    - **Property 8: Relative Path Usage**
    - **Validates: Requirements 8.5**
    - Parse all HTML, CSS, JS files for resource references
    - Assert no absolute paths used
    - Assert all paths are relative or root-relative
    - Use fast-check with 100 iterations
  
  - [x] 16.3 Verify no backend dependencies
    - Confirm no server-side code required
    - Confirm no build tools required
    - Confirm application works as static files
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 17. Final checkpoint - Complete testing and validation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests use fast-check with minimum 100 iterations
- All property tests include comment tags referencing design document properties
- Service worker enables offline functionality after first load
- Application uses vanilla JavaScript with no frameworks or build tools
- Dark theme with red accent color throughout
- Mobile-first responsive design for iOS Safari compatibility

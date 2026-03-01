// Radical Red Dex - Main Application Script

// ============================================================================
// Data Manager Module
// ============================================================================

const DataManager = {
  data: {
    species: null,
    moves: null,
    abilities: null,
    items: null,
    trainers: null,
    tmMoves: null,
    tutorMoves: null,
    types: null,
    areas: null,
    natures: null,
    eggGroups: null,
    splits: null,
    evolutions: null,
    scaledLevels: null,
    caps: null,
    sprites: null
  },

  /**
   * Load all JSON data files into memory
   * @returns {Promise<void>}
   */
  async loadAllData() {
    const dataFiles = [
      'species',
      'moves',
      'abilities',
      'items',
      'trainers',
      'tmMoves',
      'tutorMoves',
      'types',
      'areas',
      'natures',
      'eggGroups',
      'splits',
      'evolutions',
      'scaledLevels',
      'caps',
      'sprites'
    ];

    let hasErrors = false;
    const failedFiles = [];

    const loadPromises = dataFiles.map(async (fileName) => {
      try {
        const response = await fetch(`data/${fileName}.json`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        this.data[fileName] = await response.json();
        console.log(`Loaded ${fileName}.json successfully`);
      } catch (error) {
        console.error(`Error loading ${fileName}.json:`, error);
        // Provide empty data structure fallback to prevent crashes
        this.data[fileName] = {};
        hasErrors = true;
        failedFiles.push(fileName);
      }
    });

    await Promise.all(loadPromises);

    if (hasErrors) {
      console.error('Failed to load some data files:', failedFiles);
      // Display user-friendly error message
      if (typeof UIUtils !== 'undefined' && UIUtils.showError) {
        UIUtils.showError(
          'Some Pokémon data failed to load. The app may not work correctly. Please check your connection and refresh the page.',
          true // persistent error
        );
      }
    } else {
      console.log('All data loaded successfully');
    }
  },

  /**
   * Get species data by ID with null checks
   * @param {string|number} id - Species ID
   * @returns {Object|null} Species data or null if not found
   */
  getSpecies(id) {
    if (!this.data.species) return null;
    const species = this.data.species[String(id)];
    if (!species) return null;
    
    return {
      id: species.id ?? String(id),
      name: species.name ?? 'Unknown',
      types: species.types ?? [],
      baseStats: {
        hp: species.baseStats?.hp ?? 0,
        attack: species.baseStats?.attack ?? 0,
        defense: species.baseStats?.defense ?? 0,
        spAttack: species.baseStats?.spAttack ?? 0,
        spDefense: species.baseStats?.spDefense ?? 0,
        speed: species.baseStats?.speed ?? 0
      },
      abilities: species.abilities ?? [],
      evolutions: species.evolutions ?? [],
      moves: species.moves ?? [],
      sprite: species.sprite ?? null
    };
  },

  /**
   * Get move data by ID with null checks
   * @param {string|number} id - Move ID
   * @returns {Object|null} Move data or null if not found
   */
  getMove(id) {
    if (!this.data.moves) return null;
    const move = this.data.moves[String(id)];
    if (!move) return null;
    
    return {
      id: move.id ?? String(id),
      name: move.name ?? 'Unknown',
      type: move.type ?? 'Normal',
      category: move.category ?? '—',
      power: move.power ?? 0,
      accuracy: move.accuracy ?? 0,
      pp: move.pp ?? 0,
      description: move.description ?? 'No description available'
    };
  },

  /**
   * Get ability data by ID with null checks
   * @param {string|number} id - Ability ID
   * @returns {Object|null} Ability data or null if not found
   */
  getAbility(id) {
    if (!this.data.abilities) return null;
    const ability = this.data.abilities[String(id)];
    if (!ability) return null;
    
    return {
      id: ability.id ?? String(id),
      name: ability.name ?? 'Unknown',
      description: ability.description ?? 'No description available'
    };
  },

  /**
   * Get item data by ID with null checks
   * @param {string|number} id - Item ID
   * @returns {Object|null} Item data or null if not found
   */
  getItem(id) {
    if (!this.data.items) return null;
    const item = this.data.items[String(id)];
    if (!item) return null;
    
    return {
      id: item.id ?? String(id),
      name: item.name ?? 'Unknown',
      description: item.description ?? 'No description available'
    };
  },

  /**
   * Get type data by name with null checks
   * @param {string} name - Type name
   * @returns {Object|null} Type data or null if not found
   */
  getType(name) {
    if (!this.data.types) return null;
    const type = this.data.types[name];
    if (!type) return null;
    
    return {
      name: type.name ?? name,
      strengths: type.strengths ?? [],
      weaknesses: type.weaknesses ?? [],
      immunities: type.immunities ?? []
    };
  },

  /**
   * Get nature data by name with null checks
   * @param {string} name - Nature name
   * @returns {Object|null} Nature data or null if not found
   */
  getNature(name) {
    if (!this.data.natures) return null;
    const nature = this.data.natures[name];
    if (!nature) return null;
    
    return {
      name: nature.name ?? name,
      increased: nature.increased ?? null,
      decreased: nature.decreased ?? null
    };
  },

  /**
   * Get all species as an array
   * @returns {Array} Array of species objects
   */
  getAllSpecies() {
    if (!this.data.species) return [];
    return Object.values(this.data.species).map(species => this.getSpecies(species.id));
  },

  /**
   * Get trainer data by ID with null checks
   * @param {string|number} id - Trainer ID
   * @returns {Object|null} Trainer data or null if not found
   */
  getTrainer(id) {
    if (!this.data.trainers) return null;
    const trainer = this.data.trainers[String(id)];
    if (!trainer) return null;
    
    return {
      id: trainer.id ?? String(id),
      name: trainer.name ?? 'Unknown',
      class: trainer.class ?? 'Trainer',
      pokemon: trainer.pokemon ?? []
    };
  },

  /**
   * Get area data by ID with null checks
   * @param {string|number} id - Area ID
   * @returns {Object|null} Area data or null if not found
   */
  getArea(id) {
    if (!this.data.areas) return null;
    const area = this.data.areas[String(id)];
    if (!area) return null;
    
    return {
      id: area.id ?? String(id),
      name: area.name ?? 'Unknown',
      encounters: area.encounters ?? []
    };
  }
};

console.log('Radical Red Dex initialized');

// ============================================================================
// Favorites Manager Module
// ============================================================================

const FavoritesManager = {
  favorites: new Set(),
  storageKey: 'radical-red-favorites',

  /**
   * Load favorites from localStorage
   * Handles localStorage errors gracefully
   */
  load() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const favoritesArray = JSON.parse(stored);
        if (Array.isArray(favoritesArray)) {
          this.favorites = new Set(favoritesArray);
          console.log(`Loaded ${this.favorites.size} favorites from localStorage`);
        } else {
          console.warn('Invalid favorites data in localStorage, using empty set');
          this.favorites = new Set();
        }
      } else {
        console.log('No favorites found in localStorage');
        this.favorites = new Set();
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
      this.favorites = new Set();
      // Display user-friendly error if UIUtils is available
      if (typeof UIUtils !== 'undefined' && UIUtils.showError) {
        UIUtils.showError('Failed to load your favorites. Your favorites may not be saved.');
      }
    }
  },

  /**
   * Save favorites to localStorage
   * Handles localStorage errors gracefully
   */
  save() {
    try {
      const favoritesArray = Array.from(this.favorites);
      localStorage.setItem(this.storageKey, JSON.stringify(favoritesArray));
      console.log(`Saved ${favoritesArray.length} favorites to localStorage`);
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
      // Display user-friendly error if UIUtils is available
      if (typeof UIUtils !== 'undefined' && UIUtils.showError) {
        UIUtils.showError('Failed to save your favorites. Your changes may not be preserved.');
      }
    }
  },

  /**
   * Toggle favorite status for a Pokémon
   * @param {string|number} pokemonId - Pokémon ID to toggle
   * @returns {boolean} New favorite status (true if now favorited, false if unfavorited)
   */
  toggle(pokemonId) {
    const id = String(pokemonId);
    if (this.favorites.has(id)) {
      this.favorites.delete(id);
      this.save();
      console.log(`Removed ${id} from favorites`);
      return false;
    } else {
      this.favorites.add(id);
      this.save();
      console.log(`Added ${id} to favorites`);
      return true;
    }
  },

  /**
   * Check if a Pokémon is favorited
   * @param {string|number} pokemonId - Pokémon ID to check
   * @returns {boolean} True if favorited, false otherwise
   */
  isFavorite(pokemonId) {
    return this.favorites.has(String(pokemonId));
  }
};

// ============================================================================
// UI Utilities Module
// ============================================================================

const UIUtils = {
  /**
   * Create a DOM element with optional class and content
   * @param {string} tag - HTML tag name
   * @param {string} className - CSS class name
   * @param {string} content - Text content
   * @returns {HTMLElement} Created element
   */
  createElement(tag, className = '', content = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.textContent = content;
    return element;
  },

  /**
   * Clear all children from an element
   * @param {HTMLElement} element - Element to clear
   */
  clearElement(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  },

  /**
   * Display a user-friendly error message
   * @param {string} message - Error message to display
   * @param {boolean} persistent - Whether the error should stay until dismissed
   */
  showError(message, persistent = false) {
    // Remove any existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    // Create error message container
    const errorDiv = this.createElement('div', 'error-message');
    
    // Create error icon
    const errorIcon = this.createElement('span', 'error-icon', '⚠️');
    
    // Create error text
    const errorText = this.createElement('span', 'error-text', message);
    
    // Create dismiss button
    const dismissBtn = this.createElement('button', 'error-dismiss', '×');
    dismissBtn.addEventListener('click', () => {
      errorDiv.remove();
    });

    // Assemble error message
    errorDiv.appendChild(errorIcon);
    errorDiv.appendChild(errorText);
    errorDiv.appendChild(dismissBtn);

    // Add to DOM
    const app = document.getElementById('app');
    if (app) {
      app.insertBefore(errorDiv, app.firstChild);
    } else {
      document.body.insertBefore(errorDiv, document.body.firstChild);
    }

    // Auto-dismiss after 10 seconds if not persistent
    if (!persistent) {
      setTimeout(() => {
        if (errorDiv.parentNode) {
          errorDiv.remove();
        }
      }, 10000);
    }

    // Log to console for debugging
    console.error('Error displayed to user:', message);
  },

  /**
   * Get color for a Pokémon type
   * @param {string} type - Type name
   * @returns {string} Hex color code
   */
  getTypeColor(type) {
    const typeColors = {
      Normal: '#A8A878',
      Fire: '#F08030',
      Water: '#6890F0',
      Electric: '#F8D030',
      Grass: '#78C850',
      Ice: '#98D8D8',
      Fighting: '#C03028',
      Poison: '#A040A0',
      Ground: '#E0C068',
      Flying: '#A890F0',
      Psychic: '#F85888',
      Bug: '#A8B820',
      Rock: '#B8A038',
      Ghost: '#705898',
      Dragon: '#7038F8',
      Dark: '#705848',
      Steel: '#B8B8D0',
      Fairy: '#EE99AC'
    };
    return typeColors[type] || '#777';
  },

  /**
   * Format stat name for display
   * @param {string} stat - Stat name
   * @returns {string} Formatted stat name
   */
  formatStatName(stat) {
    const statNames = {
      hp: 'HP',
      attack: 'Attack',
      defense: 'Defense',
      spAttack: 'Sp. Atk',
      spDefense: 'Sp. Def',
      speed: 'Speed'
    };
    return statNames[stat] || stat;
  }
};

// ============================================================================
// Home Screen Component
// ============================================================================

const HomeScreen = {
  searchQuery: '',
  filteredPokemon: [],
  container: null,

  /**
   * Render the home screen with search bar and Pokémon list
   */
  render() {
    // Get or create container
    this.container = document.getElementById('app');
    if (!this.container) {
      console.error('App container not found');
      return;
    }

    // Clear container
    UIUtils.clearElement(this.container);

    // Create home screen wrapper
    const homeWrapper = UIUtils.createElement('div', 'home-screen');

    // Create search bar
    const searchBar = this.createSearchBar();
    homeWrapper.appendChild(searchBar);

    // Create Pokémon list container
    const listContainer = UIUtils.createElement('div', 'pokemon-list');
    listContainer.id = 'pokemon-list';
    homeWrapper.appendChild(listContainer);

    // Add to DOM
    this.container.appendChild(homeWrapper);

    // Initialize with all Pokémon
    this.filteredPokemon = DataManager.getAllSpecies();
    this.renderPokemonList();
  },

  /**
   * Create search bar element
   * @returns {HTMLElement} Search bar element
   */
  createSearchBar() {
    const searchWrapper = UIUtils.createElement('div', 'search-bar');

    // Create search input
    const searchInput = UIUtils.createElement('input', 'search-input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search Pokémon by name or ID...';
    searchInput.id = 'search-input';

    // Add input event listener for real-time filtering
    searchInput.addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
    });

    searchWrapper.appendChild(searchInput);
    return searchWrapper;
  },

  /**
   * Handle search query with case-insensitive filtering
   * Filters by both name and ID
   * @param {string} query - Search query
   */
  handleSearch(query) {
    this.searchQuery = query.trim().toLowerCase();

    // Get all species
    const allSpecies = DataManager.getAllSpecies();

    // Filter by name or ID (case-insensitive)
    if (this.searchQuery === '') {
      // Show all Pokémon when search is empty
      this.filteredPokemon = allSpecies;
    } else {
      this.filteredPokemon = allSpecies.filter(pokemon => {
        if (!pokemon) return false;
        
        // Match by name (case-insensitive)
        const nameMatch = pokemon.name && 
          pokemon.name.toLowerCase().includes(this.searchQuery);
        
        // Match by ID (convert to string for comparison)
        const idMatch = pokemon.id && 
          String(pokemon.id).includes(this.searchQuery);
        
        return nameMatch || idMatch;
      });
    }

    // Re-render the list with filtered results
    this.renderPokemonList();
  },

  /**
   * Render Pokémon list with minimal DOM updates
   */
  renderPokemonList() {
    const listContainer = document.getElementById('pokemon-list');
    if (!listContainer) {
      console.error('Pokemon list container not found');
      return;
    }

    // Clear existing list
    UIUtils.clearElement(listContainer);

    // Show message if no results
    if (this.filteredPokemon.length === 0) {
      const noResults = UIUtils.createElement('div', 'no-results', 'No Pokémon found');
      listContainer.appendChild(noResults);
      return;
    }

    // Create list items for filtered Pokémon
    this.filteredPokemon.forEach(pokemon => {
      if (!pokemon) return;

      const listItem = this.createPokemonListItem(pokemon);
      listContainer.appendChild(listItem);
    });
  },

  /**
   * Create a single Pokémon list item
   * @param {Object} pokemon - Pokémon data
   * @returns {HTMLElement} List item element
   */
  createPokemonListItem(pokemon) {
    const listItem = UIUtils.createElement('div', 'pokemon-item');
    listItem.dataset.id = pokemon.id;

    // Pokémon ID
    const pokemonId = UIUtils.createElement('span', 'pokemon-id', `#${pokemon.id}`);
    listItem.appendChild(pokemonId);

    // Pokémon name
    const pokemonName = UIUtils.createElement('span', 'pokemon-name', pokemon.name);
    listItem.appendChild(pokemonName);

    // Favorite indicator (star)
    if (FavoritesManager.isFavorite(pokemon.id)) {
      const favoriteIndicator = UIUtils.createElement('span', 'favorite-indicator', '★');
      listItem.appendChild(favoriteIndicator);
    }

    // Add click handler to navigate to detail view
    listItem.addEventListener('click', () => {
      this.handlePokemonClick(pokemon.id);
    });

    return listItem;
  },

  /**
   * Handle Pokémon click to navigate to detail view
   * @param {string|number} pokemonId - Pokémon ID
   */
  handlePokemonClick(pokemonId) {
    // Navigate to detail view using hash
    window.location.hash = `#pokemon/${pokemonId}`;
  }
};

// ============================================================================
// Detail View Component
// ============================================================================

const DetailView = {
  currentPokemon: null,
  container: null,

  /**
   * Render the detail view for a specific Pokémon
   * @param {string|number} pokemonId - Pokémon ID to display
   */
  render(pokemonId) {
    // Get container
    this.container = document.getElementById('app');
    if (!this.container) {
      console.error('App container not found');
      return;
    }

    // Load Pokémon data
    this.currentPokemon = DataManager.getSpecies(pokemonId);
    if (!this.currentPokemon) {
      console.error(`Pokémon with ID ${pokemonId} not found`);
      UIUtils.showError(`Pokémon #${pokemonId} not found`);
      // Navigate back to home
      window.location.hash = '#home';
      return;
    }

    // Clear container
    UIUtils.clearElement(this.container);

    // Create detail view wrapper
    const detailWrapper = UIUtils.createElement('div', 'detail-view');

    // Render all sections
    const header = this.renderHeader();
    const basicInfo = this.renderBasicInfo();
    const stats = this.renderStats();
    const abilities = this.renderAbilities();
    const evolutions = this.renderEvolutions();
    const moves = this.renderMoves();

    // Assemble detail view
    detailWrapper.appendChild(header);
    detailWrapper.appendChild(basicInfo);
    detailWrapper.appendChild(stats);
    detailWrapper.appendChild(abilities);
    detailWrapper.appendChild(evolutions);
    detailWrapper.appendChild(moves);

    // Add to DOM
    this.container.appendChild(detailWrapper);
  },

  /**
   * Render header with back button and favorite button
   * @returns {HTMLElement} Header element
   */
  renderHeader() {
    const header = UIUtils.createElement('div', 'detail-header');

    // Back button
    const backBtn = UIUtils.createElement('button', 'back-button', '← Back');
    backBtn.addEventListener('click', () => this.handleBack());
    header.appendChild(backBtn);

    // Pokémon name and ID
    const titleWrapper = UIUtils.createElement('div', 'detail-title');
    const pokemonName = UIUtils.createElement('h1', 'pokemon-name', this.currentPokemon.name);
    const pokemonId = UIUtils.createElement('span', 'pokemon-id', `#${this.currentPokemon.id}`);
    titleWrapper.appendChild(pokemonName);
    titleWrapper.appendChild(pokemonId);
    header.appendChild(titleWrapper);

    // Favorite button
    const isFavorite = FavoritesManager.isFavorite(this.currentPokemon.id);
    const favoriteBtn = UIUtils.createElement('button', 'favorite-button', isFavorite ? '★' : '☆');
    favoriteBtn.classList.toggle('favorited', isFavorite);
    favoriteBtn.addEventListener('click', () => this.handleFavoriteToggle(favoriteBtn));
    header.appendChild(favoriteBtn);

    return header;
  },

  /**
   * Render basic info: name, sprite, types
   * @returns {HTMLElement} Basic info section
   */
  renderBasicInfo() {
    const basicInfo = UIUtils.createElement('div', 'basic-info');

    // Sprite
    if (this.currentPokemon.sprite) {
      const spriteImg = document.createElement('img');
      spriteImg.className = 'pokemon-sprite';
      spriteImg.src = this.currentPokemon.sprite;
      spriteImg.alt = this.currentPokemon.name;
      spriteImg.onerror = () => {
        // Hide image if it fails to load
        spriteImg.style.display = 'none';
      };
      basicInfo.appendChild(spriteImg);
    }

    // Types
    if (this.currentPokemon.types && this.currentPokemon.types.length > 0) {
      const typesWrapper = UIUtils.createElement('div', 'types-wrapper');
      this.currentPokemon.types.forEach(type => {
        const typeBadge = UIUtils.createElement('span', 'type-badge', type);
        typeBadge.style.backgroundColor = UIUtils.getTypeColor(type);
        typesWrapper.appendChild(typeBadge);
      });
      basicInfo.appendChild(typesWrapper);
    }

    return basicInfo;
  },

  /**
   * Render base stats display
   * @returns {HTMLElement} Stats section
   */
  renderStats() {
    const statsSection = UIUtils.createElement('div', 'stats-section');
    
    // Section title
    const title = UIUtils.createElement('h2', 'section-title', 'Base Stats');
    statsSection.appendChild(title);

    // Stats container
    const statsContainer = UIUtils.createElement('div', 'stats-container');

    // Render each stat
    const stats = this.currentPokemon.baseStats;
    const statOrder = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed'];
    
    statOrder.forEach(statKey => {
      const statValue = stats[statKey] || 0;
      const statName = UIUtils.formatStatName(statKey);

      const statRow = UIUtils.createElement('div', 'stat-row');
      
      // Stat name
      const statNameEl = UIUtils.createElement('span', 'stat-name', statName);
      statRow.appendChild(statNameEl);

      // Stat value
      const statValueEl = UIUtils.createElement('span', 'stat-value', String(statValue));
      statRow.appendChild(statValueEl);

      // Stat bar
      const statBar = UIUtils.createElement('div', 'stat-bar');
      const statBarFill = UIUtils.createElement('div', 'stat-bar-fill');
      // Scale stat value to percentage (max 255)
      const percentage = Math.min((statValue / 255) * 100, 100);
      statBarFill.style.width = `${percentage}%`;
      statBar.appendChild(statBarFill);
      statRow.appendChild(statBar);

      statsContainer.appendChild(statRow);
    });

    statsSection.appendChild(statsContainer);
    return statsSection;
  },

  /**
   * Render abilities list
   * @returns {HTMLElement} Abilities section
   */
  renderAbilities() {
    const abilitiesSection = UIUtils.createElement('div', 'abilities-section');
    
    // Section title
    const title = UIUtils.createElement('h2', 'section-title', 'Abilities');
    abilitiesSection.appendChild(title);

    // Abilities container
    const abilitiesContainer = UIUtils.createElement('div', 'abilities-container');

    if (this.currentPokemon.abilities && this.currentPokemon.abilities.length > 0) {
      this.currentPokemon.abilities.forEach(abilityName => {
        const abilityItem = UIUtils.createElement('div', 'ability-item');
        
        // Ability name
        const abilityNameEl = UIUtils.createElement('span', 'ability-name', abilityName);
        abilityItem.appendChild(abilityNameEl);

        // Try to get ability description
        const abilityData = DataManager.getAbility(abilityName);
        if (abilityData && abilityData.description) {
          const abilityDesc = UIUtils.createElement('span', 'ability-description', abilityData.description);
          abilityItem.appendChild(abilityDesc);
        }

        abilitiesContainer.appendChild(abilityItem);
      });
    } else {
      const noAbilities = UIUtils.createElement('div', 'no-data', 'No abilities data available');
      abilitiesContainer.appendChild(noAbilities);
    }

    abilitiesSection.appendChild(abilitiesContainer);
    return abilitiesSection;
  },

  /**
   * Render evolution chain
   * @returns {HTMLElement} Evolutions section
   */
  renderEvolutions() {
    const evolutionsSection = UIUtils.createElement('div', 'evolutions-section');
    
    // Section title
    const title = UIUtils.createElement('h2', 'section-title', 'Evolutions');
    evolutionsSection.appendChild(title);

    // Evolutions container
    const evolutionsContainer = UIUtils.createElement('div', 'evolutions-container');

    if (this.currentPokemon.evolutions && this.currentPokemon.evolutions.length > 0) {
      this.currentPokemon.evolutions.forEach(evolution => {
        const evolutionItem = UIUtils.createElement('div', 'evolution-item');
        
        // Evolution species name
        const speciesName = evolution.species || 'Unknown';
        const evolutionName = UIUtils.createElement('span', 'evolution-name', speciesName);
        evolutionItem.appendChild(evolutionName);

        // Evolution method/level
        let methodText = '';
        if (evolution.level) {
          methodText = `Level ${evolution.level}`;
        } else if (evolution.method) {
          methodText = evolution.method;
        } else if (evolution.item) {
          methodText = `Use ${evolution.item}`;
        } else {
          methodText = 'Special method';
        }
        const evolutionMethod = UIUtils.createElement('span', 'evolution-method', methodText);
        evolutionItem.appendChild(evolutionMethod);

        evolutionsContainer.appendChild(evolutionItem);
      });
    } else {
      const noEvolutions = UIUtils.createElement('div', 'no-data', 'Does not evolve');
      evolutionsContainer.appendChild(noEvolutions);
    }

    evolutionsSection.appendChild(evolutionsContainer);
    return evolutionsSection;
  },

  /**
   * Render move list
   * @returns {HTMLElement} Moves section
   */
  renderMoves() {
    const movesSection = UIUtils.createElement('div', 'moves-section');
    
    // Section title
    const title = UIUtils.createElement('h2', 'section-title', 'Moves');
    movesSection.appendChild(title);

    // Moves container
    const movesContainer = UIUtils.createElement('div', 'moves-container');

    if (this.currentPokemon.moves && this.currentPokemon.moves.length > 0) {
      // Sort moves by level
      const sortedMoves = [...this.currentPokemon.moves].sort((a, b) => {
        const levelA = a.level || 0;
        const levelB = b.level || 0;
        return levelA - levelB;
      });

      sortedMoves.forEach(moveEntry => {
        const moveItem = UIUtils.createElement('div', 'move-item');
        
        // Move level
        const levelText = moveEntry.level ? `Lv. ${moveEntry.level}` : 'TM/HM';
        const moveLevel = UIUtils.createElement('span', 'move-level', levelText);
        moveItem.appendChild(moveLevel);

        // Move name
        const moveName = moveEntry.move || 'Unknown';
        const moveNameEl = UIUtils.createElement('span', 'move-name', moveName);
        moveItem.appendChild(moveNameEl);

        // Try to get move type
        const moveData = DataManager.getMove(moveName);
        if (moveData && moveData.type) {
          const moveType = UIUtils.createElement('span', 'move-type', moveData.type);
          moveType.style.backgroundColor = UIUtils.getTypeColor(moveData.type);
          moveItem.appendChild(moveType);
        }

        movesContainer.appendChild(moveItem);
      });
    } else {
      const noMoves = UIUtils.createElement('div', 'no-data', 'No moves data available');
      movesContainer.appendChild(noMoves);
    }

    movesSection.appendChild(movesContainer);
    return movesSection;
  },

  /**
   * Handle favorite toggle button click
   * @param {HTMLElement} button - Favorite button element
   */
  handleFavoriteToggle(button) {
    const isFavorite = FavoritesManager.toggle(this.currentPokemon.id);
    button.textContent = isFavorite ? '★' : '☆';
    button.classList.toggle('favorited', isFavorite);
  },

  /**
   * Handle back button click to navigate to home screen
   */
  handleBack() {
    window.location.hash = '#home';
  }
};

// ============================================================================
// View Manager Module
// ============================================================================

const ViewManager = {
  currentView: 'home',

  /**
   * Initialize the view manager and set up navigation
   * Sets up hash change listeners for routing
   */
  init() {
    // Listen for hash changes (browser back/forward buttons)
    window.addEventListener('hashchange', () => {
      this.handleHashChange();
    });

    // Handle initial hash on page load
    this.handleHashChange();

    console.log('ViewManager initialized');
  },

  /**
   * Handle hash change events and route to appropriate view
   * Supports hash formats: #, #home, #pokemon/{id}
   */
  handleHashChange() {
    const hash = window.location.hash;

    // Parse the hash
    if (!hash || hash === '#' || hash === '#home') {
      // Show home screen
      this.showHome();
    } else if (hash.startsWith('#pokemon/')) {
      // Extract Pokémon ID from hash
      const pokemonId = hash.replace('#pokemon/', '');
      if (pokemonId) {
        this.showDetail(pokemonId);
      } else {
        // Invalid hash, default to home
        console.warn('Invalid pokemon hash, redirecting to home');
        this.showHome();
      }
    } else {
      // Unknown hash format, default to home
      console.warn(`Unknown hash format: ${hash}, redirecting to home`);
      this.showHome();
    }
  },

  /**
   * Show the home screen
   */
  showHome() {
    this.currentView = 'home';
    console.log('Navigating to home screen');
    HomeScreen.render();
  },

  /**
   * Show the detail view for a specific Pokémon
   * @param {string|number} pokemonId - Pokémon ID to display
   */
  showDetail(pokemonId) {
    this.currentView = 'detail';
    console.log(`Navigating to detail view for Pokémon #${pokemonId}`);
    DetailView.render(pokemonId);
  }
};

// ============================================================================
// Application Initialization
// ============================================================================

const App = {
  isInitialized: false,
  isLoading: false,

  /**
   * Initialize the application
   * Loads all data, initializes managers, and sets up navigation
   */
  async init() {
    if (this.isInitialized) {
      console.warn('App already initialized');
      return;
    }

    if (this.isLoading) {
      console.warn('App initialization already in progress');
      return;
    }

    this.isLoading = true;
    console.log('Initializing Radical Red Dex...');

    try {
      // Show loading state
      this.showLoadingState();

      // Initialize DataManager and load all data
      console.log('Loading Pokémon data...');
      await DataManager.loadAllData();

      // Initialize FavoritesManager and load favorites
      console.log('Loading favorites...');
      FavoritesManager.load();

      // Initialize ViewManager and set up navigation
      console.log('Setting up navigation...');
      ViewManager.init();

      // Mark as initialized
      this.isInitialized = true;
      this.isLoading = false;

      console.log('Radical Red Dex initialized successfully!');

    } catch (error) {
      // Handle initialization errors gracefully
      console.error('Error during app initialization:', error);
      this.isLoading = false;

      // Display user-friendly error message
      UIUtils.showError(
        'Failed to initialize the app. Please refresh the page and try again.',
        true // persistent error
      );

      // Still try to show the UI even if data loading failed
      try {
        ViewManager.init();
      } catch (viewError) {
        console.error('Failed to initialize ViewManager:', viewError);
      }
    }
  },

  /**
   * Display loading state during data loading
   */
  showLoadingState() {
    const app = document.getElementById('app');
    if (!app) {
      console.error('App container not found');
      return;
    }

    // Clear container
    UIUtils.clearElement(app);

    // Create loading screen
    const loadingScreen = UIUtils.createElement('div', 'loading-screen');
    
    // Loading spinner
    const spinner = UIUtils.createElement('div', 'loading-spinner');
    loadingScreen.appendChild(spinner);

    // Loading text
    const loadingText = UIUtils.createElement('div', 'loading-text', 'Loading Pokémon data...');
    loadingScreen.appendChild(loadingText);

    // Add to DOM
    app.appendChild(loadingScreen);
  }
};

// ============================================================================
// Event Listeners and Application Start
// ============================================================================

/**
 * Start the application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, starting application...');
  App.init();
});

/**
 * Handle page visibility changes to reload data if needed
 */
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && App.isInitialized) {
    console.log('Page became visible, app is ready');
  }
});

/**
 * Handle online/offline events
 */
window.addEventListener('online', () => {
  console.log('Connection restored');
});

window.addEventListener('offline', () => {
  console.log('Connection lost - app will continue to work offline');
});

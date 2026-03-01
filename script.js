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

  async loadAllData() {
    const dataFiles = [
      'species', 'moves', 'abilities', 'items', 'trainers', 'tmMoves',
      'tutorMoves', 'types', 'areas', 'natures', 'eggGroups', 'splits',
      'evolutions', 'scaledLevels', 'caps', 'sprites'
    ];

    let hasErrors = false;
    const failedFiles = [];

    const loadPromises = dataFiles.map(async (fileName) => {
      try {
        const response = await fetch(`data/${fileName}.json`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        this.data[fileName] = await response.json();
        console.log(`Loaded ${fileName}.json successfully`);
      } catch (error) {
        console.error(`Error loading ${fileName}.json:`, error);
        this.data[fileName] = {};
        hasErrors = true;
        failedFiles.push(fileName);
      }
    });

    await Promise.all(loadPromises);

    if (hasErrors) {
      console.error('Failed to load some data files:', failedFiles);
      if (typeof UIUtils !== 'undefined' && UIUtils.showError) {
        UIUtils.showError('Some Pokémon data failed to load. The app may not work correctly. Please check your connection and refresh the page.', true);
      }
    } else {
      console.log('All data loaded successfully');
    }
  },

  getSpecies(id) {
    if (!this.data.species || !this.data.types || !this.data.abilities || !this.data.moves || !this.data.sprites) return null;
    const species = this.data.species[String(id)];
    if (!species) return null;
    
    const stats = species.stats || [0, 0, 0, 0, 0, 0];
    const baseStats = {
      hp: stats[0] || 0,
      attack: stats[1] || 0,
      defense: stats[2] || 0,
      spAttack: stats[3] || 0,
      spDefense: stats[4] || 0,
      speed: stats[5] || 0
    };
    
    const typeIds = species.type || [];
    const types = typeIds.map(typeId => {
      const typeData = this.data.types[String(typeId)];
      return typeData ? typeData.name : 'Unknown';
    }).filter(name => name !== 'Unknown');
    
    const abilityPairs = species.abilities || [];
    const abilities = abilityPairs
      .filter(pair => pair[0] !== 0)
      .map(pair => {
        const abilityId = pair[0];
        const abilityData = this.data.abilities[String(abilityId)];
        if (abilityData && abilityData.names && abilityData.names.length > 0) {
          return abilityData.names[0];
        }
        return null;
      })
      .filter(name => name !== null);
    
    const levelupMoves = species.levelupMoves || [];
    const moves = levelupMoves.map(movePair => {
      const moveId = movePair[0];
      const level = movePair[1];
      const moveData = this.data.moves[String(moveId)];
      return {
        move: moveData ? moveData.name : 'Unknown',
        level: level
      };
    });
    
    const sprite = this.data.sprites[String(id)] || null;
    
    const evolutionData = species.evolutions || [];
    const evolutions = evolutionData.map(evo => {
      const targetSpeciesId = evo[2];
      const level = evo[1];
      const targetSpecies = this.data.species[String(targetSpeciesId)];
      return {
        species: targetSpecies ? targetSpecies.name : 'Unknown',
        level: level
      };
    });
    
    return {
      id: species.ID || species.id || String(id),
      name: species.name || 'Unknown',
      types: types,
      baseStats: baseStats,
      abilities: abilities,
      evolutions: evolutions,
      moves: moves,
      sprite: sprite
    };
  },

  getMove(id) {
    if (!this.data.moves || !this.data.types) return null;
    const move = this.data.moves[String(id)];
    if (!move) return null;
    
    const typeId = move.type;
    const typeData = this.data.types[String(typeId)];
    const typeName = typeData ? typeData.name : 'Normal';
    
    return {
      id: move.ID || move.id || String(id),
      name: move.name || 'Unknown',
      type: typeName,
      category: move.category || '—',
      power: move.power || 0,
      accuracy: move.accuracy || 0,
      pp: move.pp || 0,
      description: move.description || 'No description available'
    };
  },

  getAbility(id) {
    if (!this.data.abilities) return null;
    const ability = this.data.abilities[String(id)];
    if (!ability) return null;
    
    const name = (ability.names && ability.names.length > 0) ? ability.names[0] : 'Unknown';
    
    return {
      id: ability.ID || ability.id || String(id),
      name: name,
      description: ability.description || 'No description available'
    };
  },

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

  getTypeById(id) {
    if (!this.data.types) return null;
    const type = this.data.types[String(id)];
    if (!type) return null;
    
    return {
      id: type.ID || type.id || String(id),
      name: type.name ?? 'Unknown',
      color: type.color ?? '#777'
    };
  },

  getType(name) {
    if (!this.data.types) return null;
    for (const typeId in this.data.types) {
      const type = this.data.types[typeId];
      if (type.name === name) {
        return {
          id: type.ID || type.id || typeId,
          name: type.name,
          color: type.color ?? '#777'
        };
      }
    }
    return null;
  },

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

  getAllSpecies() {
    if (!this.data.species) return [];
    return Object.values(this.data.species).map(species => this.getSpecies(species.ID || species.id));
  },

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
      if (typeof UIUtils !== 'undefined' && UIUtils.showError) {
        UIUtils.showError('Failed to load your favorites. Your favorites may not be saved.');
      }
    }
  },

  save() {
    try {
      const favoritesArray = Array.from(this.favorites);
      localStorage.setItem(this.storageKey, JSON.stringify(favoritesArray));
      console.log(`Saved ${favoritesArray.length} favorites to localStorage`);
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
      if (typeof UIUtils !== 'undefined' && UIUtils.showError) {
        UIUtils.showError('Failed to save your favorites. Your changes may not be preserved.');
      }
    }
  },

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

  isFavorite(pokemonId) {
    return this.favorites.has(String(pokemonId));
  }
};

// ============================================================================
// UI Utilities Module
// ============================================================================

const UIUtils = {
  createElement(tag, className = '', content = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.textContent = content;
    return element;
  },

  clearElement(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  },

  showError(message, persistent = false) {
    const existingError = document.querySelector('.error-message');
    if (existingError) existingError.remove();

    const errorDiv = this.createElement('div', 'error-message');
    const errorIcon = this.createElement('span', 'error-icon', '⚠️');
    const errorText = this.createElement('span', 'error-text', message);
    const dismissBtn = this.createElement('button', 'error-dismiss', '×');
    dismissBtn.addEventListener('click', () => errorDiv.remove());

    errorDiv.appendChild(errorIcon);
    errorDiv.appendChild(errorText);
    errorDiv.appendChild(dismissBtn);

    const app = document.getElementById('app');
    if (app) {
      app.insertBefore(errorDiv, app.firstChild);
    } else {
      document.body.insertBefore(errorDiv, document.body.firstChild);
    }

    if (!persistent) {
      setTimeout(() => {
        if (errorDiv.parentNode) errorDiv.remove();
      }, 10000);
    }

    console.error('Error displayed to user:', message);
  },

  getTypeColor(type) {
    const typeColors = {
      Normal: '#A8A878', Fire: '#F08030', Water: '#6890F0', Electric: '#F8D030',
      Grass: '#78C850', Ice: '#98D8D8', Fighting: '#C03028', Poison: '#A040A0',
      Ground: '#E0C068', Flying: '#A890F0', Psychic: '#F85888', Bug: '#A8B820',
      Rock: '#B8A038', Ghost: '#705898', Dragon: '#7038F8', Dark: '#705848',
      Steel: '#B8B8D0', Fairy: '#EE99AC'
    };
    return typeColors[type] || '#777';
  },

  formatStatName(stat) {
    const statNames = {
      hp: 'HP', attack: 'Attack', defense: 'Defense',
      spAttack: 'Sp. Atk', spDefense: 'Sp. Def', speed: 'Speed'
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

  render() {
    this.container = document.getElementById('app');
    if (!this.container) {
      console.error('App container not found');
      return;
    }

    UIUtils.clearElement(this.container);
    const homeWrapper = UIUtils.createElement('div', 'home-screen');
    const searchBar = this.createSearchBar();
    homeWrapper.appendChild(searchBar);

    const listContainer = UIUtils.createElement('div', 'pokemon-list');
    listContainer.id = 'pokemon-list';
    homeWrapper.appendChild(listContainer);

    this.container.appendChild(homeWrapper);
    this.filteredPokemon = DataManager.getAllSpecies();
    this.renderPokemonList();
  },

  createSearchBar() {
    const searchWrapper = UIUtils.createElement('div', 'search-bar');
    const searchInput = UIUtils.createElement('input', 'search-input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search Pokémon by name or ID...';
    searchInput.id = 'search-input';
    searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
    searchWrapper.appendChild(searchInput);
    return searchWrapper;
  },

  handleSearch(query) {
    this.searchQuery = query.trim().toLowerCase();
    const allSpecies = DataManager.getAllSpecies();

    if (this.searchQuery === '') {
      this.filteredPokemon = allSpecies;
    } else {
      this.filteredPokemon = allSpecies.filter(pokemon => {
        if (!pokemon) return false;
        const nameMatch = pokemon.name && pokemon.name.toLowerCase().includes(this.searchQuery);
        const idMatch = pokemon.id && String(pokemon.id).includes(this.searchQuery);
        return nameMatch || idMatch;
      });
    }

    this.renderPokemonList();
  },

  renderPokemonList() {
    const listContainer = document.getElementById('pokemon-list');
    if (!listContainer) {
      console.error('Pokemon list container not found');
      return;
    }

    UIUtils.clearElement(listContainer);

    if (this.filteredPokemon.length === 0) {
      const noResults = UIUtils.createElement('div', 'no-results', 'No Pokémon found');
      listContainer.appendChild(noResults);
      return;
    }

    this.filteredPokemon.forEach(pokemon => {
      if (!pokemon) return;
      const listItem = this.createPokemonListItem(pokemon);
      listContainer.appendChild(listItem);
    });
  },

  createPokemonListItem(pokemon) {
    const listItem = UIUtils.createElement('div', 'pokemon-item');
    listItem.dataset.id = pokemon.id;

    const pokemonId = UIUtils.createElement('span', 'pokemon-id', `#${pokemon.id}`);
    listItem.appendChild(pokemonId);

    const pokemonName = UIUtils.createElement('span', 'pokemon-name', pokemon.name);
    listItem.appendChild(pokemonName);

    if (FavoritesManager.isFavorite(pokemon.id)) {
      const favoriteIndicator = UIUtils.createElement('span', 'favorite-indicator', '★');
      listItem.appendChild(favoriteIndicator);
    }

    listItem.addEventListener('click', () => this.handlePokemonClick(pokemon.id));
    return listItem;
  },

  handlePokemonClick(pokemonId) {
    window.location.hash = `#pokemon/${pokemonId}`;
  }
};

// ============================================================================
// Detail View Component
// ============================================================================

const DetailView = {
  currentPokemon: null,
  container: null,

  render(pokemonId) {
    this.container = document.getElementById('app');
    if (!this.container) {
      console.error('App container not found');
      return;
    }

    this.currentPokemon = DataManager.getSpecies(pokemonId);
    if (!this.currentPokemon) {
      console.error(`Pokémon with ID ${pokemonId} not found`);
      UIUtils.showError(`Pokémon #${pokemonId} not found`);
      window.location.hash = '#home';
      return;
    }

    UIUtils.clearElement(this.container);
    const detailWrapper = UIUtils.createElement('div', 'detail-view');

    const header = this.renderHeader();
    const basicInfo = this.renderBasicInfo();
    const stats = this.renderStats();
    const abilities = this.renderAbilities();
    const evolutions = this.renderEvolutions();
    const moves = this.renderMoves();

    detailWrapper.appendChild(header);
    detailWrapper.appendChild(basicInfo);
    detailWrapper.appendChild(stats);
    detailWrapper.appendChild(abilities);
    detailWrapper.appendChild(evolutions);
    detailWrapper.appendChild(moves);

    this.container.appendChild(detailWrapper);
  },

  renderHeader() {
    const header = UIUtils.createElement('div', 'detail-header');

    const backBtn = UIUtils.createElement('button', 'back-button', '← Back');
    backBtn.addEventListener('click', () => this.handleBack());
    header.appendChild(backBtn);

    const titleWrapper = UIUtils.createElement('div', 'detail-title');
    const pokemonName = UIUtils.createElement('h1', 'pokemon-name', this.currentPokemon.name);
    const pokemonId = UIUtils.createElement('span', 'pokemon-id', `#${this.currentPokemon.id}`);
    titleWrapper.appendChild(pokemonName);
    titleWrapper.appendChild(pokemonId);
    header.appendChild(titleWrapper);

    const isFavorite = FavoritesManager.isFavorite(this.currentPokemon.id);
    const favoriteBtn = UIUtils.createElement('button', 'favorite-button', isFavorite ? '★' : '☆');
    favoriteBtn.classList.toggle('favorited', isFavorite);
    favoriteBtn.addEventListener('click', () => this.handleFavoriteToggle(favoriteBtn));
    header.appendChild(favoriteBtn);

    return header;
  },

  renderBasicInfo() {
    const basicInfo = UIUtils.createElement('div', 'basic-info');

    if (this.currentPokemon.sprite) {
      const spriteImg = document.createElement('img');
      spriteImg.className = 'pokemon-sprite';
      spriteImg.src = this.currentPokemon.sprite;
      spriteImg.alt = this.currentPokemon.name;
      spriteImg.onerror = () => spriteImg.style.display = 'none';
      basicInfo.appendChild(spriteImg);
    }

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

  renderStats() {
    const statsSection = UIUtils.createElement('div', 'stats-section');
    const title = UIUtils.createElement('h2', 'section-title', 'Base Stats');
    statsSection.appendChild(title);

    const statsContainer = UIUtils.createElement('div', 'stats-container');
    const stats = this.currentPokemon.baseStats;
    const statOrder = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed'];
    
    statOrder.forEach(statKey => {
      const statValue = stats[statKey] || 0;
      const statName = UIUtils.formatStatName(statKey);

      const statRow = UIUtils.createElement('div', 'stat-row');
      const statNameEl = UIUtils.createElement('span', 'stat-name', statName);
      statRow.appendChild(statNameEl);

      const statValueEl = UIUtils.createElement('span', 'stat-value', String(statValue));
      statRow.appendChild(statValueEl);

      const statBar = UIUtils.createElement('div', 'stat-bar');
      const statBarFill = UIUtils.createElement('div', 'stat-bar-fill');
      const percentage = Math.min((statValue / 255) * 100, 100);
      statBarFill.style.width = `${percentage}%`;
      statBar.appendChild(statBarFill);
      statRow.appendChild(statBar);

      statsContainer.appendChild(statRow);
    });

    statsSection.appendChild(statsContainer);
    return statsSection;
  },

  renderAbilities() {
    const abilitiesSection = UIUtils.createElement('div', 'abilities-section');
    const title = UIUtils.createElement('h2', 'section-title', 'Abilities');
    abilitiesSection.appendChild(title);

    const abilitiesContainer = UIUtils.createElement('div', 'abilities-container');

    if (this.currentPokemon.abilities && this.currentPokemon.abilities.length > 0) {
      this.currentPokemon.abilities.forEach(abilityName => {
        const abilityItem = UIUtils.createElement('div', 'ability-item');
        const abilityNameEl = UIUtils.createElement('span', 'ability-name', abilityName);
        abilityItem.appendChild(abilityNameEl);

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

  renderEvolutions() {
    const evolutionsSection = UIUtils.createElement('div', 'evolutions-section');
    const title = UIUtils.createElement('h2', 'section-title', 'Evolutions');
    evolutionsSection.appendChild(title);

    const evolutionsContainer = UIUtils.createElement('div', 'evolutions-container');

    if (this.currentPokemon.evolutions && this.currentPokemon.evolutions.length > 0) {
      this.currentPokemon.evolutions.forEach(evolution => {
        const evolutionItem = UIUtils.createElement('div', 'evolution-item');
        const speciesName = evolution.species || 'Unknown';
        const evolutionName = UIUtils.createElement('span', 'evolution-name', speciesName);
        evolutionItem.appendChild(evolutionName);

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

  renderMoves() {
    const movesSection = UIUtils.createElement('div', 'moves-section');
    const title = UIUtils.createElement('h2', 'section-title', 'Moves');
    movesSection.appendChild(title);

    const movesContainer = UIUtils.createElement('div', 'moves-container');

    if (this.currentPokemon.moves && this.currentPokemon.moves.length > 0) {
      const sortedMoves = [...this.currentPokemon.moves].sort((a, b) => {
        const levelA = a.level || 0;
        const levelB = b.level || 0;
        return levelA - levelB;
      });

      sortedMoves.forEach(moveEntry => {
        const moveItem = UIUtils.createElement('div', 'move-item');
        const levelText = moveEntry.level ? `Lv. ${moveEntry.level}` : 'TM/HM';
        const moveLevel = UIUtils.createElement('span', 'move-level', levelText);
        moveItem.appendChild(moveLevel);

        const moveName = moveEntry.move || 'Unknown';
        const moveNameEl = UIUtils.createElement('span', 'move-name', moveName);
        moveItem.appendChild(moveNameEl);

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

  handleFavoriteToggle(button) {
    const isFavorite = FavoritesManager.toggle(this.currentPokemon.id);
    button.textContent = isFavorite ? '★' : '☆';
    button.classList.toggle('favorited', isFavorite);
  },

  handleBack() {
    window.location.hash = '#home';
  }
};

// ============================================================================
// View Manager Module
// ============================================================================

const ViewManager = {
  currentView: 'home',

  init() {
    window.addEventListener('hashchange', () => this.handleHashChange());
    this.handleHashChange();
    console.log('ViewManager initialized');
  },

  handleHashChange() {
    const hash = window.location.hash;

    if (!hash || hash === '#' || hash === '#home') {
      this.showHome();
    } else if (hash.startsWith('#pokemon/')) {
      const pokemonId = hash.replace('#pokemon/', '');
      if (pokemonId) {
        this.showDetail(pokemonId);
      } else {
        console.warn('Invalid pokemon hash, redirecting to home');
        this.showHome();
      }
    } else {
      console.warn(`Unknown hash format: ${hash}, redirecting to home`);
      this.showHome();
    }
  },

  showHome() {
    this.currentView = 'home';
    console.log('Navigating to home screen');
    HomeScreen.render();
  },

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
      this.showLoadingState();
      console.log('Loading Pokémon data...');
      await DataManager.loadAllData();

      console.log('Loading favorites...');
      FavoritesManager.load();

      console.log('Setting up navigation...');
      ViewManager.init();

      this.isInitialized = true;
      this.isLoading = false;

      console.log('Radical Red Dex initialized successfully!');

    } catch (error) {
      console.error('Error during app initialization:', error);
      this.isLoading = false;

      UIUtils.showError('Failed to initialize the app. Please refresh the page and try again.', true);

      try {
        ViewManager.init();
      } catch (viewError) {
        console.error('Failed to initialize ViewManager:', viewError);
      }
    }
  },

  showLoadingState() {
    const app = document.getElementById('app');
    if (!app) {
      console.error('App container not found');
      return;
    }

    UIUtils.clearElement(app);
    const loadingScreen = UIUtils.createElement('div', 'loading-screen');
    const spinner = UIUtils.createElement('div', 'loading-spinner');
    loadingScreen.appendChild(spinner);

    const loadingText = UIUtils.createElement('div', 'loading-text', 'Loading Pokémon data...');
    loadingScreen.appendChild(loadingText);

    app.appendChild(loadingScreen);
  }
};

// ============================================================================
// Event Listeners and Application Start
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, starting application...');
  App.init();
});

document.addEventListener('visibilitychange', () => {
  if (!document.hidden && App.isInitialized) {
    console.log('Page became visible, app is ready');
  }
});

window.addEventListener('online', () => {
  console.log('Connection restored');
});

window.addEventListener('offline', () => {
  console.log('Connection lost - app will continue to work offline');
});

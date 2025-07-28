// Application de gestion d'entraînement de football
class FootballManager {
    constructor() {
        this.currentUser = null;
        this.currentView = 'home';
        this.players = [];
        this.events = [];
        this.coachProfile = {};
        this.selectedCategory = '';
        this.currentWeek = new Date();
        this.charts = {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadData();
        this.showLoader();
        
        // Simuler le chargement
        setTimeout(() => {
            this.hideLoader();
            this.showView('home');
        }, 2000);
    }

    // Gestion du loader
    showLoader() {
        document.getElementById('loader').classList.remove('hidden');
    }

    hideLoader() {
        document.getElementById('loader').classList.add('hidden');
    }

    // Gestion des vues
    showView(viewName) {
        // Masquer toutes les vues
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        // Afficher la vue demandée
        const targetView = document.getElementById(`${viewName}-view`);
        if (targetView) {
            targetView.classList.add('active');
            this.currentView = viewName;
        }

        // Gérer la navigation
        if (viewName === 'home' || viewName === 'login' || viewName === 'register') {
            document.getElementById('main-nav').classList.add('hidden');
        } else {
            document.getElementById('main-nav').classList.remove('hidden');
        }

        // Actions spécifiques par vue
        switch (viewName) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'players':
                this.updatePlayersView();
                break;
            case 'analysis':
                this.updateAnalysisView();
                break;
            case 'calendar':
                this.updateCalendarView();
                break;
            case 'training-plans':
                this.updateTrainingPlansView();
                break;
        }
    }

    // Configuration des écouteurs d'événements
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('[data-view]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showView(link.dataset.view);
            });
        });

        // Authentification
        document.getElementById('login-btn').addEventListener('click', () => this.showView('login'));
        document.getElementById('register-btn').addEventListener('click', () => this.showView('register'));
        document.getElementById('switch-to-register').addEventListener('click', (e) => {
            e.preventDefault();
            this.showView('register');
        });
        document.getElementById('switch-to-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.showView('login');
        });
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());

        // Formulaires d'authentification
        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('register-form').addEventListener('submit', (e) => this.handleRegister(e));

        // Profil du coach
        document.getElementById('coach-profile-form').addEventListener('submit', (e) => this.saveCoachProfile(e));

        // Catégories d'âge
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => this.selectCategory(card.dataset.category));
        });
        document.getElementById('confirm-category').addEventListener('click', () => this.confirmCategory());

        // Calendrier
        document.getElementById('prev-week').addEventListener('click', () => this.changeWeek(-1));
        document.getElementById('next-week').addEventListener('click', () => this.changeWeek(1));
        document.getElementById('add-event-btn').addEventListener('click', () => this.showEventModal());

        // Joueurs
        document.getElementById('add-player-btn').addEventListener('click', () => this.showPlayerModal());
        document.getElementById('player-search').addEventListener('input', (e) => this.filterPlayers(e.target.value));
        document.getElementById('position-filter').addEventListener('change', (e) => this.filterPlayersByPosition(e.target.value));

        // Analyse
        document.querySelectorAll('.analysis-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchAnalysisTab(btn.dataset.tab));
        });
        document.getElementById('analysis-player-select').addEventListener('change', (e) => this.showPlayerAnalysis(e.target.value));

        // Plans d'entraînement
        document.getElementById('generate-plan-btn').addEventListener('click', () => this.generateTrainingPlan());
        document.getElementById('create-custom-plan-btn').addEventListener('click', () => this.createCustomPlan());
        document.getElementById('export-pdf-btn').addEventListener('click', () => this.exportToPDF());
        document.getElementById('save-plan-btn').addEventListener('click', () => this.savePlan());

        // Modales
        this.setupModalListeners();

        // Navigation mobile
        document.querySelector('.nav-toggle').addEventListener('click', () => {
            document.querySelector('.nav-menu').classList.toggle('active');
        });

        // Sliders de compétences
        this.setupSkillSliders();
    }

    setupModalListeners() {
        // Fermeture des modales
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => this.closeModals());
        });

        // Clic en dehors de la modale
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModals();
                }
            });
        });

        // Formulaire d'événement
        document.getElementById('event-form').addEventListener('submit', (e) => this.saveEvent(e));
        document.getElementById('cancel-event').addEventListener('click', () => this.closeModals());

        // Formulaire de joueur
        document.getElementById('player-form').addEventListener('submit', (e) => this.savePlayer(e));
        document.getElementById('cancel-player').addEventListener('click', () => this.closeModals());

        // Onglets du formulaire joueur
        document.querySelectorAll('.player-form-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchPlayerFormTab(btn.dataset.tab));
        });
    }

    setupSkillSliders() {
        document.querySelectorAll('input[type="range"]').forEach(slider => {
            const valueDisplay = slider.nextElementSibling;
            
            slider.addEventListener('input', () => {
                valueDisplay.textContent = slider.value;
            });
        });
    }

    // Authentification
    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Simulation de l'authentification
        if (email && password) {
            this.currentUser = { email, name: 'Coach' };
            this.showNotification('Connexion réussie!', 'success');
            this.showView('dashboard');
        } else {
            this.showNotification('Veuillez remplir tous les champs', 'error');
        }
    }

    handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        // Simulation de l'inscription
        if (name && email && password) {
            this.currentUser = { email, name };
            this.showNotification('Inscription réussie!', 'success');
            this.showView('dashboard');
        } else {
            this.showNotification('Veuillez remplir tous les champs', 'error');
        }
    }

    logout() {
        this.currentUser = null;
        this.showNotification('Déconnexion réussie', 'info');
        this.showView('home');
    }

    // Profil du coach
    saveCoachProfile(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        this.coachProfile = {
            name: document.getElementById('coach-name').value,
            age: document.getElementById('coach-age').value,
            nationality: document.getElementById('coach-nationality').value,
            phone: document.getElementById('coach-phone').value,
            continent: document.getElementById('coach-continent').value,
            license: document.getElementById('coach-license').value,
            style: document.getElementById('coach-style').value
        };

        this.saveData();
        this.showNotification('Profil sauvegardé avec succès!', 'success');
    }

    // Catégories d'âge
    selectCategory(category) {
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        document.querySelector(`[data-category="${category}"]`).classList.add('selected');
        document.getElementById('selected-category').textContent = category;
        document.getElementById('category-selection').classList.remove('hidden');
    }

    confirmCategory() {
        const selectedCard = document.querySelector('.category-card.selected');
        if (selectedCard) {
            this.selectedCategory = selectedCard.dataset.category;
            this.saveData();
            this.showNotification(`Catégorie ${this.selectedCategory} sélectionnée!`, 'success');
        }
    }

    // Calendrier
    updateCalendarView() {
        this.updateWeekDisplay();
        this.generateCalendarGrid();
        this.displayEvents();
    }

    updateWeekDisplay() {
        const weekStart = this.getWeekStart(this.currentWeek);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const startStr = weekStart.toLocaleDateString('fr-FR', options);
        const endStr = weekEnd.toLocaleDateString('fr-FR', options);
        
        document.getElementById('current-week').textContent = `${startStr} - ${endStr}`;
    }

    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    changeWeek(direction) {
        this.currentWeek.setDate(this.currentWeek.getDate() + (direction * 7));
        this.updateCalendarView();
    }

    generateCalendarGrid() {
        const calendarBody = document.getElementById('calendar-body');
        calendarBody.innerHTML = '';

        const hours = [];
        for (let i = 8; i <= 22; i++) {
            hours.push(`${i}:00`);
        }

        hours.forEach(hour => {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            
            const timeLabel = document.createElement('div');
            timeLabel.className = 'time-label';
            timeLabel.textContent = hour;
            timeSlot.appendChild(timeLabel);

            for (let day = 0; day < 7; day++) {
                const dayCell = document.createElement('div');
                dayCell.className = 'day-cell';
                dayCell.dataset.day = day;
                dayCell.dataset.hour = hour;
                
                dayCell.addEventListener('click', () => {
                    this.showEventModal(day, hour);
                });
                
                timeSlot.appendChild(dayCell);
            }

            calendarBody.appendChild(timeSlot);
        });
    }

    displayEvents() {
        // Effacer les événements existants
        document.querySelectorAll('.calendar-event').forEach(event => event.remove());

        const weekStart = this.getWeekStart(this.currentWeek);

        this.events.forEach(event => {
            const eventDate = new Date(event.date);
            const dayDiff = Math.floor((eventDate - weekStart) / (1000 * 60 * 60 * 24));

            if (dayDiff >= 0 && dayDiff < 7) {
                const eventHour = event.time.split(':')[0] + ':00';
                const targetCell = document.querySelector(`[data-day="${dayDiff}"][data-hour="${eventHour}"]`);

                if (targetCell) {
                    const eventElement = document.createElement('div');
                    eventElement.className = `calendar-event ${event.type}`;
                    eventElement.textContent = event.title;
                    eventElement.title = `${event.title} - ${event.time}`;
                    
                    eventElement.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.editEvent(event);
                    });

                    targetCell.appendChild(eventElement);
                }
            }
        });
    }

    showEventModal(day = null, hour = null) {
        const modal = document.getElementById('event-modal');
        modal.classList.add('active');

        if (day !== null && hour !== null) {
            const weekStart = this.getWeekStart(this.currentWeek);
            const eventDate = new Date(weekStart);
            eventDate.setDate(eventDate.getDate() + day);
            
            document.getElementById('event-date').value = eventDate.toISOString().split('T')[0];
            document.getElementById('event-time').value = hour;
        }
    }

    saveEvent(e) {
        e.preventDefault();
        
        const event = {
            id: Date.now(),
            title: document.getElementById('event-title').value,
            type: document.getElementById('event-type').value,
            date: document.getElementById('event-date').value,
            time: document.getElementById('event-time').value,
            duration: document.getElementById('event-duration').value,
            description: document.getElementById('event-description').value
        };

        this.events.push(event);
        this.saveData();
        this.closeModals();
        this.displayEvents();
        this.showNotification('Événement ajouté avec succès!', 'success');
    }

    // Gestion des joueurs
    updatePlayersView() {
        this.displayPlayers();
    }

    displayPlayers(filteredPlayers = null) {
        const playersGrid = document.getElementById('players-grid');
        playersGrid.innerHTML = '';

        const playersToShow = filteredPlayers || this.players;

        playersToShow.forEach(player => {
            const playerCard = this.createPlayerCard(player);
            playersGrid.appendChild(playerCard);
        });
    }

    createPlayerCard(player) {
        const card = document.createElement('div');
        card.className = 'player-card';
        
        const avgSkills = this.calculatePlayerAverages(player);
        
        card.innerHTML = `
            <div class="player-card-header">
                <div class="player-number">${player.number || '?'}</div>
                <div class="player-name">${player.name}</div>
                <div class="player-position">${this.getPositionName(player.position)}</div>
            </div>
            <div class="player-card-body">
                <div class="player-stats">
                    <div class="stat-item">
                        <span class="stat-value">${avgSkills.technical.toFixed(1)}</span>
                        <span class="stat-label">Technique</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${avgSkills.physical.toFixed(1)}</span>
                        <span class="stat-label">Physique</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${avgSkills.tactical.toFixed(1)}</span>
                        <span class="stat-label">Tactique</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${avgSkills.mental.toFixed(1)}</span>
                        <span class="stat-label">Mental</span>
                    </div>
                </div>
                <div class="player-actions">
                    <button class="btn-icon btn-edit" onclick="footballManager.editPlayer(${player.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="footballManager.deletePlayer(${player.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    getPositionName(position) {
        const positions = {
            'GK': 'Gardien',
            'DEF': 'Défenseur',
            'MID': 'Milieu',
            'ATT': 'Attaquant'
        };
        return positions[position] || position;
    }

    calculatePlayerAverages(player) {
        const skills = player.skills || {};
        
        const technical = Object.values(skills.technical || {});
        const physical = Object.values(skills.physical || {});
        const tactical = Object.values(skills.tactical || {});
        const mental = Object.values(skills.mental || {});

        return {
            technical: technical.length ? technical.reduce((a, b) => a + b, 0) / technical.length : 0,
            physical: physical.length ? physical.reduce((a, b) => a + b, 0) / physical.length : 0,
            tactical: tactical.length ? tactical.reduce((a, b) => a + b, 0) / tactical.length : 0,
            mental: mental.length ? mental.reduce((a, b) => a + b, 0) / mental.length : 0
        };
    }

    filterPlayers(searchTerm) {
        const filtered = this.players.filter(player => 
            player.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.displayPlayers(filtered);
    }

    filterPlayersByPosition(position) {
        if (!position) {
            this.displayPlayers();
            return;
        }
        
        const filtered = this.players.filter(player => player.position === position);
        this.displayPlayers(filtered);
    }

    showPlayerModal(playerId = null) {
        const modal = document.getElementById('player-modal');
        const title = document.getElementById('player-modal-title');
        
        if (playerId) {
            title.textContent = 'Modifier le joueur';
            this.loadPlayerData(playerId);
        } else {
            title.textContent = 'Ajouter un joueur';
            this.resetPlayerForm();
        }
        
        modal.classList.add('active');
    }

    loadPlayerData(playerId) {
        const player = this.players.find(p => p.id === playerId);
        if (!player) return;

        document.getElementById('player-name').value = player.name || '';
        document.getElementById('player-age').value = player.age || '';
        document.getElementById('player-position').value = player.position || '';
        document.getElementById('player-number').value = player.number || '';

        // Charger les compétences
        if (player.skills) {
            this.loadSkillsToForm(player.skills);
        }
    }

    loadSkillsToForm(skills) {
        const skillMappings = {
            'skill-passing': skills.technical?.['التمرير'] || 10,
            'skill-receiving': skills.technical?.['الاستقبال'] || 10,
            'skill-dribbling': skills.technical?.['المراوغة'] || 10,
            'skill-shooting': skills.technical?.['التسديد'] || 10,
            'skill-heading': skills.technical?.['الضرب بالرأس'] || 10,
            'skill-ball-control': skills.technical?.['التحكم بالكرة'] || 10,
            'skill-endurance': skills.physical?.['التحمل البدني'] || 10,
            'skill-fitness': skills.physical?.['اللياقة البدنية'] || 10,
            'skill-speed': skills.physical?.['السرعة'] || 10,
            'skill-strength': skills.physical?.['القوة البدنية'] || 10,
            'skill-agility': skills.physical?.['التوازن والرشاقة'] || 10,
            'skill-balance': skills.physical?.['التوازن والرشاقة'] || 10,
            'skill-positioning': skills.tactical?.['التمركز الصحيح'] || 10,
            'skill-game-reading': skills.tactical?.['قراءة اللعب'] || 10,
            'skill-decision-making': skills.tactical?.['الذكاء بالكرة أو بدونها'] || 10,
            'skill-teamwork': skills.tactical?.['التنظيم والضغط الجماعي'] || 10,
            'skill-concentration': skills.mental?.['التركيز'] || 10,
            'skill-confidence': skills.mental?.['الثقة بالنفس'] || 10,
            'skill-leadership': skills.mental?.['القيادة'] || 10,
            'skill-motivation': skills.mental?.['الحافز والرغبة في الفوز'] || 10
        };

        Object.entries(skillMappings).forEach(([skillId, value]) => {
            const slider = document.getElementById(skillId);
            if (slider) {
                slider.value = value;
                const valueDisplay = slider.nextElementSibling;
                if (valueDisplay) {
                    valueDisplay.textContent = value;
                }
            }
        });
    }

    resetPlayerForm() {
        document.getElementById('player-form').reset();
        
        // Réinitialiser tous les sliders à 10
        document.querySelectorAll('#player-form input[type="range"]').forEach(slider => {
            slider.value = 10;
            const valueDisplay = slider.nextElementSibling;
            if (valueDisplay) {
                valueDisplay.textContent = '10';
            }
        });
    }

    switchPlayerFormTab(tabName) {
        // Gérer les onglets
        document.querySelectorAll('.player-form-tabs .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Gérer le contenu
        document.querySelectorAll('#player-modal .tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-info`).classList.add('active');
    }

    savePlayer(e) {
        e.preventDefault();
        
        const playerData = {
            id: Date.now(),
            name: document.getElementById('player-name').value,
            age: parseInt(document.getElementById('player-age').value),
            position: document.getElementById('player-position').value,
            number: parseInt(document.getElementById('player-number').value),
            skills: this.getSkillsFromForm()
        };

        // Vérifier si le numéro est déjà utilisé
        if (this.players.some(p => p.number === playerData.number && p.id !== playerData.id)) {
            this.showNotification('Ce numéro de maillot est déjà utilisé!', 'error');
            return;
        }

        this.players.push(playerData);
        this.saveData();
        this.closeModals();
        this.updatePlayersView();
        this.showNotification('Joueur ajouté avec succès!', 'success');
    }

    getSkillsFromForm() {
        return {
            technical: {
                'التمرير': parseInt(document.getElementById('skill-passing').value),
                'الاستقبال': parseInt(document.getElementById('skill-receiving').value),
                'المراوغة': parseInt(document.getElementById('skill-dribbling').value),
                'التسديد': parseInt(document.getElementById('skill-shooting').value),
                'الضرب بالرأس': parseInt(document.getElementById('skill-heading').value),
                'التحكم بالكرة': parseInt(document.getElementById('skill-ball-control').value)
            },
            physical: {
                'التحمل البدني': parseInt(document.getElementById('skill-endurance').value),
                'اللياقة البدنية': parseInt(document.getElementById('skill-fitness').value),
                'السرعة': parseInt(document.getElementById('skill-speed').value),
                'القوة البدنية': parseInt(document.getElementById('skill-strength').value),
                'التوازن والرشاقة': parseInt(document.getElementById('skill-agility').value)
            },
            tactical: {
                'التمركز الصحيح': parseInt(document.getElementById('skill-positioning').value),
                'قراءة اللعب': parseInt(document.getElementById('skill-game-reading').value),
                'الذكاء بالكرة أو بدونها': parseInt(document.getElementById('skill-decision-making').value),
                'التنظيم والضغط الجماعي': parseInt(document.getElementById('skill-teamwork').value)
            },
            mental: {
                'التركيز': parseInt(document.getElementById('skill-concentration').value),
                'الثقة بالنفس': parseInt(document.getElementById('skill-confidence').value),
                'القيادة': parseInt(document.getElementById('skill-leadership').value),
                'الحافز والرغبة في الفوز': parseInt(document.getElementById('skill-motivation').value)
            }
        };
    }

    editPlayer(playerId) {
        this.showPlayerModal(playerId);
    }

    deletePlayer(playerId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce joueur ?')) {
            this.players = this.players.filter(p => p.id !== playerId);
            this.saveData();
            this.updatePlayersView();
            this.showNotification('Joueur supprimé avec succès!', 'success');
        }
    }

    // Analyse
    updateAnalysisView() {
        this.updatePlayerSelector();
        this.updateTeamAnalysis();
    }

    updatePlayerSelector() {
        const select = document.getElementById('analysis-player-select');
        select.innerHTML = '<option value="">Choisir un joueur...</option>';
        
        this.players.forEach(player => {
            const option = document.createElement('option');
            option.value = player.id;
            option.textContent = `${player.name} (${this.getPositionName(player.position)})`;
            select.appendChild(option);
        });
    }

    switchAnalysisTab(tabName) {
        // Gérer les onglets
        document.querySelectorAll('.analysis-tabs .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Gérer le contenu
        document.querySelectorAll('.analysis-container .tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-analysis`).classList.add('active');

        if (tabName === 'suggestions') {
            this.generateSuggestions();
        }
    }

    showPlayerAnalysis(playerId) {
        if (!playerId) return;
        
        const player = this.players.find(p => p.id == playerId);
        if (!player || !player.skills) return;

        this.createPlayerCharts(player);
    }

    createPlayerCharts(player) {
        const skills = player.skills;
        
        // Graphique technique
        this.createRadarChart('technical-chart', 'Compétences techniques', skills.technical);
        
        // Graphique physique
        this.createRadarChart('physical-chart', 'Capacités physiques', skills.physical);
        
        // Graphique tactique
        this.createRadarChart('tactical-chart', 'Intelligence tactique', skills.tactical);
        
        // Graphique mental
        this.createRadarChart('mental-chart', 'Aspect mental', skills.mental);
    }

    createRadarChart(canvasId, title, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        // Détruire le graphique existant s'il y en a un
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        const labels = Object.keys(data).map(key => this.translateSkill(key));
        const values = Object.values(data);

        this.charts[canvasId] = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: title,
                    data: values,
                    backgroundColor: 'rgba(46, 139, 87, 0.2)',
                    borderColor: 'rgba(46, 139, 87, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(46, 139, 87, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(46, 139, 87, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 20,
                        ticks: {
                            stepSize: 5
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    translateSkill(arabicSkill) {
        const translations = {
            'التمرير': 'Passes',
            'الاستقبال': 'Réception',
            'المراوغة': 'Dribble',
            'التسديد': 'Tir',
            'الضرب بالرأس': 'Jeu de tête',
            'التحكم بالكرة': 'Contrôle',
            'التحمل البدني': 'Endurance',
            'اللياقة البدنية': 'Condition',
            'السرعة': 'Vitesse',
            'القوة البدنية': 'Force',
            'التوازن والرشاقة': 'Agilité',
            'التمركز الصحيح': 'Positionnement',
            'قراءة اللعب': 'Lecture du jeu',
            'الذكاء بالكرة أو بدونها': 'Intelligence',
            'التنظيم والضغط الجماعي': 'Jeu d\'équipe',
            'التركيز': 'Concentration',
            'الثقة بالنفس': 'Confiance',
            'القيادة': 'Leadership',
            'الحافز والرغبة في الفوز': 'Motivation'
        };
        return translations[arabicSkill] || arabicSkill;
    }

    updateTeamAnalysis() {
        if (this.players.length === 0) return;

        const teamAverages = this.calculateTeamAverages();
        
        // Mettre à jour les moyennes affichées
        document.getElementById('team-technical-avg').textContent = teamAverages.technical.toFixed(1);
        document.getElementById('team-physical-avg').textContent = teamAverages.physical.toFixed(1);
        document.getElementById('team-tactical-avg').textContent = teamAverages.tactical.toFixed(1);
        document.getElementById('team-mental-avg').textContent = teamAverages.mental.toFixed(1);

        // Créer les graphiques d'équipe
        this.createTeamCharts(teamAverages);
    }

    calculateTeamAverages() {
        if (this.players.length === 0) {
            return { technical: 0, physical: 0, tactical: 0, mental: 0 };
        }

        const totals = { technical: 0, physical: 0, tactical: 0, mental: 0 };
        
        this.players.forEach(player => {
            const averages = this.calculatePlayerAverages(player);
            totals.technical += averages.technical;
            totals.physical += averages.physical;
            totals.tactical += averages.tactical;
            totals.mental += averages.mental;
        });

        return {
            technical: totals.technical / this.players.length,
            physical: totals.physical / this.players.length,
            tactical: totals.tactical / this.players.length,
            mental: totals.mental / this.players.length
        };
    }

    createTeamCharts(averages) {
        // Graphique de répartition (Pie)
        this.createPieChart('team-distribution-chart', averages);
        
        // Graphique radar de l'équipe
        this.createTeamRadarChart('team-radar-chart', averages);
    }

    createPieChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        this.charts[canvasId] = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Technique', 'Physique', 'Tactique', 'Mental'],
                datasets: [{
                    data: [data.technical, data.physical, data.tactical, data.mental],
                    backgroundColor: [
                        'rgba(46, 139, 87, 0.8)',
                        'rgba(255, 107, 53, 0.8)',
                        'rgba(23, 162, 184, 0.8)',
                        'rgba(255, 193, 7, 0.8)'
                    ],
                    borderColor: [
                        'rgba(46, 139, 87, 1)',
                        'rgba(255, 107, 53, 1)',
                        'rgba(23, 162, 184, 1)',
                        'rgba(255, 193, 7, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createTeamRadarChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        this.charts[canvasId] = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Technique', 'Physique', 'Tactique', 'Mental'],
                datasets: [{
                    label: 'Profil de l\'équipe',
                    data: [data.technical, data.physical, data.tactical, data.mental],
                    backgroundColor: 'rgba(46, 139, 87, 0.2)',
                    borderColor: 'rgba(46, 139, 87, 1)',
                    borderWidth: 3,
                    pointBackgroundColor: 'rgba(46, 139, 87, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(46, 139, 87, 1)',
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 20,
                        ticks: {
                            stepSize: 5
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    generateSuggestions() {
        const suggestionsContainer = document.getElementById('team-suggestions');
        const recommendedStyleContainer = document.getElementById('recommended-style');
        
        if (this.players.length === 0) {
            suggestionsContainer.innerHTML = '<p>Ajoutez des joueurs pour obtenir des suggestions.</p>';
            recommendedStyleContainer.innerHTML = '<p>Aucune recommandation disponible.</p>';
            return;
        }

        const averages = this.calculateTeamAverages();
        const suggestions = this.generateTeamSuggestions(averages);
        const recommendedStyle = this.getRecommendedStyle(averages);

        // Afficher les suggestions
        suggestionsContainer.innerHTML = suggestions.map(suggestion => 
            `<div class="suggestion-item">${suggestion}</div>`
        ).join('');

        // Afficher le style recommandé
        recommendedStyleContainer.innerHTML = `
            <h4>${recommendedStyle.name}</h4>
            <p>${recommendedStyle.description}</p>
        `;
    }

    generateTeamSuggestions(averages) {
        const suggestions = [];
        
        if (averages.technical < 12) {
            suggestions.push('🎯 Concentrez-vous sur l\'amélioration des compétences techniques : passes, contrôle de balle et dribbles.');
        }
        
        if (averages.physical < 12) {
            suggestions.push('💪 Renforcez la condition physique de l\'équipe avec plus d\'entraînements cardio et de musculation.');
        }
        
        if (averages.tactical < 12) {
            suggestions.push('🧠 Travaillez sur l\'intelligence tactique : positionnement, lecture du jeu et organisation collective.');
        }
        
        if (averages.mental < 12) {
            suggestions.push('🎭 Développez l\'aspect mental : confiance, concentration et gestion du stress.');
        }

        // Suggestions spécifiques basées sur les points forts
        const strongest = Object.keys(averages).reduce((a, b) => averages[a] > averages[b] ? a : b);
        const weakest = Object.keys(averages).reduce((a, b) => averages[a] < averages[b] ? a : b);

        if (strongest === 'technical') {
            suggestions.push('⚡ Exploitez vos compétences techniques supérieures avec un jeu de possession.');
        } else if (strongest === 'physical') {
            suggestions.push('🏃 Utilisez votre avantage physique avec un jeu de pressing et de transitions rapides.');
        }

        if (suggestions.length === 0) {
            suggestions.push('✅ Votre équipe présente un bon équilibre dans tous les domaines. Continuez le travail !');
        }

        return suggestions;
    }

    getRecommendedStyle(averages) {
        const styles = {
            technical: {
                name: 'Jeu de possession',
                description: 'Privilégiez un jeu basé sur la conservation du ballon, les passes courtes et la construction patiente.'
            },
            physical: {
                name: 'Jeu de transition',
                description: 'Exploitez votre condition physique avec un jeu direct, du pressing haut et des transitions rapides.'
            },
            tactical: {
                name: 'Jeu organisé',
                description: 'Misez sur une organisation défensive solide et des mouvements tactiques précis.'
            },
            mental: {
                name: 'Jeu de caractère',
                description: 'Votre force mentale vous permet d\'adopter un style agressif et de prendre des risques.'
            }
        };

        const dominant = Object.keys(averages).reduce((a, b) => averages[a] > averages[b] ? a : b);
        return styles[dominant] || styles.technical;
    }

    // Plans d'entraînement
    updateTrainingPlansView() {
        // Initialiser la vue des plans d'entraînement
    }

    generateTrainingPlan() {
        const planType = document.getElementById('plan-type').value;
        const planContent = document.getElementById('training-plan-content');
        
        if (this.players.length === 0) {
            this.showNotification('Ajoutez des joueurs pour générer un plan d\'entraînement', 'warning');
            return;
        }

        const averages = this.calculateTeamAverages();
        const plan = this.createTrainingPlan(planType, averages);
        
        planContent.innerHTML = plan;
        this.showNotification('Plan d\'entraînement généré avec succès!', 'success');
    }

    createTrainingPlan(type, averages) {
        const weakestArea = Object.keys(averages).reduce((a, b) => averages[a] < averages[b] ? a : b);
        
        let plan = `<h3>Plan d'entraînement ${type === 'weekly' ? 'hebdomadaire' : type === 'monthly' ? 'mensuel' : 'de préparation physique'}</h3>`;
        
        if (type === 'weekly') {
            plan += this.generateWeeklyPlan(weakestArea);
        } else if (type === 'monthly') {
            plan += this.generateMonthlyPlan(averages);
        } else if (type === 'physical') {
            plan += this.generatePhysicalPlan();
        }
        
        return plan;
    }

    generateWeeklyPlan(focusArea) {
        const plans = {
            technical: `
                <div class="training-day">
                    <h4>Lundi - Technique individuelle</h4>
                    <ul>
                        <li>Échauffement (15 min)</li>
                        <li>Passes et contrôles (30 min)</li>
                        <li>Dribbles et feintes (20 min)</li>
                        <li>Tirs au but (15 min)</li>
                    </ul>
                </div>
                <div class="training-day">
                    <h4>Mercredi - Jeu collectif</h4>
                    <ul>
                        <li>Échauffement (15 min)</li>
                        <li>Possession en supériorité numérique (25 min)</li>
                        <li>Jeu à 11 contre 11 (40 min)</li>
                        <li>Retour au calme (10 min)</li>
                    </ul>
                </div>
                <div class="training-day">
                    <h4>Vendredi - Finition</h4>
                    <ul>
                        <li>Échauffement (15 min)</li>
                        <li>Centres et reprises (25 min)</li>
                        <li>Situations de but (25 min)</li>
                        <li>Étirements (15 min)</li>
                    </ul>
                </div>
            `,
            physical: `
                <div class="training-day">
                    <h4>Lundi - Endurance</h4>
                    <ul>
                        <li>Échauffement (15 min)</li>
                        <li>Course continue (25 min)</li>
                        <li>Exercices avec ballon (30 min)</li>
                        <li>Retour au calme (10 min)</li>
                    </ul>
                </div>
                <div class="training-day">
                    <h4>Mercredi - Force et vitesse</h4>
                    <ul>
                        <li>Échauffement (15 min)</li>
                        <li>Sprints courts (20 min)</li>
                        <li>Musculation (25 min)</li>
                        <li>Étirements (20 min)</li>
                    </ul>
                </div>
                <div class="training-day">
                    <h4>Vendredi - Agilité</h4>
                    <ul>
                        <li>Échauffement (15 min)</li>
                        <li>Parcours d'agilité (25 min)</li>
                        <li>Jeu réduit (30 min)</li>
                        <li>Récupération (10 min)</li>
                    </ul>
                </div>
            `,
            tactical: `
                <div class="training-day">
                    <h4>Lundi - Organisation défensive</h4>
                    <ul>
                        <li>Échauffement (15 min)</li>
                        <li>Placement défensif (25 min)</li>
                        <li>Pressing coordonné (25 min)</li>
                        <li>Jeu 11v11 (25 min)</li>
                    </ul>
                </div>
                <div class="training-day">
                    <h4>Mercredi - Construction du jeu</h4>
                    <ul>
                        <li>Échauffement (15 min)</li>
                        <li>Sortie de balle (25 min)</li>
                        <li>Circulation du ballon (25 min)</li>
                        <li>Situations de match (25 min)</li>
                    </ul>
                </div>
                <div class="training-day">
                    <h4>Vendredi - Phases arrêtées</h4>
                    <ul>
                        <li>Échauffement (15 min)</li>
                        <li>Corners et coups francs (30 min)</li>
                        <li>Remises en jeu (15 min)</li>
                        <li>Match d'application (30 min)</li>
                    </ul>
                </div>
            `,
            mental: `
                <div class="training-day">
                    <h4>Lundi - Concentration</h4>
                    <ul>
                        <li>Échauffement (15 min)</li>
                        <li>Exercices de précision (25 min)</li>
                        <li>Jeu sous pression (30 min)</li>
                        <li>Relaxation (10 min)</li>
                    </ul>
                </div>
                <div class="training-day">
                    <h4>Mercredi - Confiance</h4>
                    <ul>
                        <li>Échauffement (15 min)</li>
                        <li>Réussite technique (25 min)</li>
                        <li>Situations de réussite (25 min)</li>
                        <li>Encouragements collectifs (15 min)</li>
                    </ul>
                </div>
                <div class="training-day">
                    <h4>Vendredi - Leadership</h4>
                    <ul>
                        <li>Échauffement (15 min)</li>
                        <li>Communication sur le terrain (25 min)</li>
                        <li>Responsabilités individuelles (25 min)</li>
                        <li>Débriefing collectif (15 min)</li>
                    </ul>
                </div>
            `
        };
        
        return plans[focusArea] || plans.technical;
    }

    generateMonthlyPlan(averages) {
        return `
            <div class="monthly-plan">
                <h4>Semaine 1 - Évaluation et bases</h4>
                <p>Tests physiques, évaluation technique, mise en place des automatismes de base.</p>
                
                <h4>Semaine 2 - Développement technique</h4>
                <p>Perfectionnement des gestes techniques, travail individuel intensif.</p>
                
                <h4>Semaine 3 - Tactique collective</h4>
                <p>Organisation de jeu, mouvements collectifs, phases de jeu spécifiques.</p>
                
                <h4>Semaine 4 - Intégration et match</h4>
                <p>Synthèse du travail, situations de match, préparation compétition.</p>
            </div>
        `;
    }

    generatePhysicalPlan() {
        return `
            <div class="physical-plan">
                <h4>Phase 1 - Endurance de base (2 semaines)</h4>
                <ul>
                    <li>Course continue 30-45 minutes</li>
                    <li>Travail aérobie avec ballon</li>
                    <li>Récupération active</li>
                </ul>
                
                <h4>Phase 2 - Force et puissance (2 semaines)</h4>
                <ul>
                    <li>Musculation spécifique</li>
                    <li>Pliométrie</li>
                    <li>Sprints courts</li>
                </ul>
                
                <h4>Phase 3 - Vitesse et agilité (2 semaines)</h4>
                <ul>
                    <li>Sprints répétés</li>
                    <li>Changements de direction</li>
                    <li>Coordination</li>
                </ul>
            </div>
        `;
    }

    createCustomPlan() {
        const planContent = document.getElementById('training-plan-content');
        planContent.innerHTML = `
            <div class="custom-plan-editor">
                <h3>Créer un plan personnalisé</h3>
                <textarea id="custom-plan-text" rows="15" placeholder="Décrivez votre plan d'entraînement personnalisé..."></textarea>
                <button class="btn btn-primary" onclick="footballManager.saveCustomPlan()">Sauvegarder le plan</button>
            </div>
        `;
    }

    saveCustomPlan() {
        const customText = document.getElementById('custom-plan-text').value;
        if (customText.trim()) {
            this.showNotification('Plan personnalisé sauvegardé!', 'success');
        } else {
            this.showNotification('Veuillez saisir un contenu pour le plan', 'warning');
        }
    }

    exportToPDF() {
        const planContent = document.getElementById('training-plan-content');
        if (!planContent.innerHTML.trim()) {
            this.showNotification('Générez d\'abord un plan d\'entraînement', 'warning');
            return;
        }

        // Utiliser jsPDF pour générer le PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.text('Plan d\'Entraînement', 20, 30);
        
        doc.setFontSize(12);
        const text = planContent.textContent || planContent.innerText;
        const lines = doc.splitTextToSize(text, 170);
        doc.text(lines, 20, 50);
        
        doc.save('plan-entrainement.pdf');
        this.showNotification('PDF exporté avec succès!', 'success');
    }

    savePlan() {
        this.showNotification('Plan sauvegardé!', 'success');
    }

    // Tableau de bord
    updateDashboard() {
        this.updateDashboardStats();
        this.updateDashboardCharts();
        this.updateUpcomingEvents();
    }

    updateDashboardStats() {
        document.getElementById('total-players').textContent = this.players.length;
        document.getElementById('total-trainings').textContent = this.events.filter(e => e.type === 'training').length;
        document.getElementById('total-matches').textContent = this.events.filter(e => e.type === 'match').length;
        
        if (this.players.length > 0) {
            const teamAvg = this.calculateTeamAverages();
            const overallAvg = (teamAvg.technical + teamAvg.physical + teamAvg.tactical + teamAvg.mental) / 4;
            document.getElementById('team-average').textContent = overallAvg.toFixed(1);
        } else {
            document.getElementById('team-average').textContent = '0';
        }
    }

    updateDashboardCharts() {
        if (this.players.length > 0) {
            const averages = this.calculateTeamAverages();
            this.createPieChart('team-skills-chart', averages);
        }
    }

    updateUpcomingEvents() {
        const upcomingContainer = document.getElementById('upcoming-events');
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const upcomingEvents = this.events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= today && eventDate <= nextWeek;
        }).sort((a, b) => new Date(a.date) - new Date(b.date));

        if (upcomingEvents.length === 0) {
            upcomingContainer.innerHTML = '<p>Aucun événement prévu cette semaine.</p>';
            return;
        }

        upcomingContainer.innerHTML = upcomingEvents.map(event => `
            <div class="event-item ${event.type}">
                <div class="event-title">${event.title}</div>
                <div class="event-time">${new Date(event.date).toLocaleDateString('fr-FR')} à ${event.time}</div>
            </div>
        `).join('');
    }

    // Modales
    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    // Notifications
    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const messageElement = document.getElementById('notification-message');
        
        messageElement.textContent = message;
        notification.className = `notification ${type} show`;
        
        // Fermer automatiquement après 5 secondes
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    // Sauvegarde et chargement des données
    saveData() {
        const data = {
            players: this.players,
            events: this.events,
            coachProfile: this.coachProfile,
            selectedCategory: this.selectedCategory
        };
        localStorage.setItem('footballManagerData', JSON.stringify(data));
    }

    loadData() {
        const savedData = localStorage.getItem('footballManagerData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.players = data.players || [];
            this.events = data.events || [];
            this.coachProfile = data.coachProfile || {};
            this.selectedCategory = data.selectedCategory || '';
        }
    }
}

// Initialiser l'application
const footballManager = new FootballManager();

// Fermer les notifications
document.getElementById('notification-close').addEventListener('click', () => {
    document.getElementById('notification').classList.remove('show');
});


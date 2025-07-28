// Script pour charger les données de démonstration
class DemoDataLoader {
    static async loadDemoData() {
        try {
            const response = await fetch('data/demo_players.json');
            const demoData = await response.json();
            
            // Charger les données dans l'application
            if (window.footballManager) {
                footballManager.players = demoData.players;
                footballManager.events = demoData.events;
                footballManager.coachProfile = demoData.coachProfile;
                footballManager.selectedCategory = demoData.selectedCategory;
                
                // Sauvegarder dans le localStorage
                footballManager.saveData();
                
                // Mettre à jour l'interface si nécessaire
                if (footballManager.currentView === 'dashboard') {
                    footballManager.updateDashboard();
                } else if (footballManager.currentView === 'players') {
                    footballManager.updatePlayersView();
                } else if (footballManager.currentView === 'analysis') {
                    footballManager.updateAnalysisView();
                }
                
                console.log('Données de démonstration chargées avec succès!');
                footballManager.showNotification('Données de démonstration chargées avec 18 joueurs!', 'success');
                
                return true;
            }
        } catch (error) {
            console.error('Erreur lors du chargement des données de démonstration:', error);
            return false;
        }
    }
    
    static createDemoButton() {
        // Créer un bouton pour charger les données de démonstration
        const demoButton = document.createElement('button');
        demoButton.id = 'load-demo-btn';
        demoButton.className = 'btn btn-secondary';
        demoButton.innerHTML = '<i class="fas fa-database"></i> Charger données démo';
        demoButton.style.position = 'fixed';
        demoButton.style.bottom = '20px';
        demoButton.style.right = '20px';
        demoButton.style.zIndex = '1000';
        
        demoButton.addEventListener('click', () => {
            DemoDataLoader.loadDemoData();
        });
        
        document.body.appendChild(demoButton);
    }
    
    static init() {
        // Vérifier si des données existent déjà
        const existingData = localStorage.getItem('footballManagerData');
        
        if (!existingData || JSON.parse(existingData).players?.length === 0) {
            // Charger automatiquement les données de démonstration si aucune donnée n'existe
            setTimeout(() => {
                DemoDataLoader.loadDemoData();
            }, 3000); // Attendre que l'application soit initialisée
        }
        
        // Créer le bouton de démonstration
        DemoDataLoader.createDemoButton();
    }
}

// Initialiser le chargeur de données de démonstration quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    DemoDataLoader.init();
});


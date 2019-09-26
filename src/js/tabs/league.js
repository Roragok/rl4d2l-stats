import Handsontable from 'handsontable';
import BaseTab from './base';

class LeagueTab extends BaseTab {
    constructor(App, tabId) {
        super(App, tabId);
    }

    getTitle() {
        const sel = document.getElementById('season-select');
        return `Season ${sel.options[sel.selectedIndex].text}`;
    }
    
    onTabShow() {
        this.updateSeason(this.App.selectedSeason);
    }

    getRoute() {
        return `${location.pathname}#/${this.tabId.replace('-tab', '')}/${this.App.selectedSeason}`;
    }
    
    async init() {
        // season change handler
        this.App.on('seasonChanged', (season) => {
            this.updateSeason(season);
        });
        
        this.updateSeason(this.App.selectedSeason);
    }
    
    updateSeason(season) {
        $('.season-container').removeClass('active');
        $(`.season-${season}`).addClass('active');
    }
}

export default LeagueTab;

// js/calendar.js

let daysToMatch = 5;
let coachEnergy = 100;
let teamPrep = 50;

function updateCalendarUI() {
    document.getElementById('days-left').innerText = daysToMatch;
    document.getElementById('coach-energy').innerText = coachEnergy;
    document.getElementById('team-prep').innerText = teamPrep;
    
    if (coachEnergy < 30) {
        document.getElementById('coach-energy').style.color = '#f44336'; // Red for low energy
    } else {
        document.getElementById('coach-energy').style.color = '#ffffff';
    }

    // Trigger Match Day
    if (daysToMatch <= 0) {
        logEvent("⚽ MATCH DAY! The media is waiting and the tactical board is locked.");
        document.querySelector('.action-buttons').style.opacity = "0.5";
        document.querySelector('.action-buttons').style.pointerEvents = "none";
        
        // Wait 1.5 seconds so the user can read the log, then load the pitch
        setTimeout(initMatchDay, 1500); 
    }
}

function logEvent(message) {
    const log = document.getElementById('calendar-log');
    // Prepend the new message to the top of the log
    log.innerHTML = `<p>> ${message}</p>` + log.innerHTML;
}

// Attach actions to the window object so inline HTML buttons can access them
window.takeAction = function(actionType) {
    if (daysToMatch <= 0) return;

    // Prevent action if energy is dangerously low
    if (coachEnergy <= 15 && actionType !== 'rest') {
        logEvent("⚠️ You are too exhausted! You must rest to avoid burnout.");
        return;
    }

    switch(actionType) {
        case 'tactics':
            coachEnergy -= 25;
            teamPrep += 20;
            logEvent("Ran a grueling tactical drill. The squad's movement looks sharper.");
            advanceDay();
            break;
        case 'meeting':
            coachEnergy -= 15;
            // Grab a random unhappy player and boost their mood
            let targetPlayer = squad.sort((a, b) => a.happiness - b.happiness)[0];
            targetPlayer.happiness = Math.min(100, targetPlayer.happiness + 25);
            renderRoster(); // Re-render the locker room UI
            logEvent(`Held a private 1-on-1 with ${targetPlayer.name}. Morale improved.`);
            advanceDay();
            break;
        case 'media':
            // Halt the calendar and open the narrative modal instead
            openPressConference(); 
            break;
        case 'rest':
            coachEnergy = Math.min(100, coachEnergy + 45);
            logEvent("Went home early. Recharged the batteries for tomorrow.");
            advanceDay();
            break;
    }
};

// New helper function to advance the clock after an action or media event completes
window.advanceDay = function() {
    // Cap stats safely
    if (teamPrep > 100) teamPrep = 100;
    if (coachEnergy < 0) coachEnergy = 0;

    // Advance the clock
    daysToMatch--;
    updateCalendarUI();
};
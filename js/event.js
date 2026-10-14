// js/events.js

function checkLockerRoomEvents() {
    // Only check for events 30% of the time to prevent spam
    if (Math.random() > 0.3) return;

    let eventTriggered = false;

    // Loop through the factions we established in player.js
    for (const [factionName, data] of Object.entries(lockerRoomFactions)) {
        // Calculate the average happiness of this specific clique
        let avgFactionHappiness = data.members.reduce((sum, p) => sum + p.happiness, 0) / data.members.length;

        // Trigger a negative event if the clique is toxic (Happiness < 40)
        if (avgFactionHappiness < 40 && !eventTriggered) {
            let randomEvent = Math.floor(Math.random() * 3);
            
            if (randomEvent === 0) {
                logEvent(`🚨 MEDIA LEAK: The ${factionName} leaked your tactical weaknesses to the press. (-15 Team Prep)`);
                teamPrep -= 15;
            } else if (randomEvent === 1) {
                logEvent(`🚨 SILENT PROTEST: Members of the ${factionName} gave half-effort in training. (-10 Coach Energy)`);
                coachEnergy -= 10;
            } else {
                logEvent(`🚨 BOARD COMPLAINT: A leader of the ${factionName} bypassed you and complained to the Board. (-10 Board Trust)`);
                if (typeof boardConfidence !== 'undefined') {
                    boardConfidence -= 10;
                    updateBoardUI();
                }
            }
            eventTriggered = true;
            
        // Trigger a positive event if the clique is ecstatic (Happiness > 85)
        } else if (avgFactionHappiness > 85 && !eventTriggered) {
            logEvent(`🌟 SQUAD HARMONY: The ${factionName} organized a team dinner. Morale is soaring!`);
            squad.forEach(p => p.happiness = Math.min(100, p.happiness + 5));
            renderRoster();
            eventTriggered = true;
        }
    }
}
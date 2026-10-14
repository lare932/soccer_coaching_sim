// js/match.js

let firstHalfUs = 0;
let firstHalfOpp = 0;
let oppPower = 80;
let aiCounterTactic = "";

function initMatchDay() {
    document.querySelector('.calendar-container').style.display = 'none';
    document.getElementById('match-day-panel').style.display = 'block';
    document.getElementById('halftime-controls').style.display = 'none';
    document.getElementById('sim-btn').style.display = 'inline-block';
    document.getElementById('match-result').innerHTML = '';
}

function playFirstHalf() {
    // 1. Calculate Base Team Strength
    let baseStrength = squad.reduce((total, player) => total + player.skillLevel, 0) / squad.length;
    let avgHappiness = squad.reduce((total, player) => total + player.happiness, 0) / squad.length;
    let moraleModifier = (avgHappiness - 50) / 10;
    let prepModifier = (teamPrep - 50) / 5; 

    let myPower = baseStrength + moraleModifier + prepModifier;
    oppPower = 75 + Math.floor(Math.random() * 15);

    // 2. Simulate 1st Half Score
    let diff = myPower - oppPower;
    firstHalfUs = diff > 0 ? Math.floor(Math.random() * 2) : 0;
    firstHalfOpp = diff < 0 ? Math.floor(Math.random() * 2) : 0;

    // 3. AI Adaptation Logic: Inspect Phase Memory or Current Drawing Mode
    const drawMode = document.querySelector('input[name="drawMode"]:checked')?.value || 'run';
    
    if (drawMode === 'pass') {
        aiCounterTactic = "Tightened Midfield Block (Negates short passing lanes)";
        oppPower += 8; // AI counters passing setups
    } else {
        aiCounterTactic = "Deep Defensive Line (Blocks overlapping runs)";
        oppPower += 6; // AI counters direct running setups
    }

    // 4. Update UI for Halftime
    document.getElementById('match-result').innerHTML = `
        <h3 style="color: #ffeb3b;">Halftime: Us ${firstHalfUs} - ${firstHalfOpp} Opponent</h3>
        <p style="color: #4fc3f7;"><strong>Opposing Manager's Halftime Shift:</strong> ${aiCounterTactic}</p>
    `;

    document.getElementById('sim-btn').style.display = 'none';
    document.getElementById('halftime-controls').style.display = 'block';
}

function playSecondHalf(tacticalShift) {
    let secondHalfUs = 0;
    let secondHalfOpp = 0;

    // Player Halftime Micro-Coaching Choices
    if (tacticalShift === 'overload') {
        // High Risk / High Reward
        firstHalfUs += Math.random() > 0.4 ? 1 : 0;
        oppPower -= 2;
    } else if (tacticalShift === 'defend') {
        // Protect lead
        oppPower -= 5;
    }

    // Simulate 2nd Half
    secondHalfUs = Math.floor(Math.random() * 2);
    secondHalfOpp = Math.floor(Math.random() * 2);

    let finalUs = firstHalfUs + secondHalfUs;
    let finalOpp = firstHalfOpp + secondHalfOpp;

    // Output Final Score
    document.getElementById('match-result').innerHTML = `
        <h3 style="color: #ffeb3b; font-size: 1.6em;">FULL TIME</h3>
        <h2 style="font-size: 2.2em; margin: 10px 0;">Us ${finalUs} - ${finalOpp} Opponent</h2>
        <p style="color: #aaa;">AI Strategy Executed: ${aiCounterTactic}</p>
    `;

    // Post-Match Psychology Effects
    if (finalUs > finalOpp) {
        squad.forEach(p => p.happiness = Math.min(100, p.happiness + 15));
    } else if (finalUs < finalOpp) {
        squad.forEach(p => p.happiness = Math.max(0, p.happiness - 20));
    }

    // --- Evaluate Board Confidence ---
    evaluateBoard(finalUs > finalOpp, finalUs < finalOpp);
    // ---------------------------------

    renderRoster();

    document.getElementById('halftime-controls').style.display = 'none';
    document.getElementById('next-week-btn').style.display = 'inline-block';
}

function resetWeek() {
    daysToMatch = 5;
    coachEnergy = 100;
    teamPrep = 50;
    updateCalendarUI();

    document.getElementById('match-day-panel').style.display = 'none';
    document.querySelector('.calendar-container').style.display = 'block';
    document.getElementById('next-week-btn').style.display = 'none';
    document.getElementById('match-result').innerHTML = '';

    document.querySelector('.action-buttons').style.opacity = "1";
    document.querySelector('.action-buttons').style.pointerEvents = "auto";
    document.getElementById('calendar-log').innerHTML = `<p>> A new week begins. Time to prepare.</p>`;
}
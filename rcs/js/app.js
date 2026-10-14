// ==========================================
// 1. STATE, DATA MODELS & LEAGUE ENGINE
// ==========================================
let week = 1;
let daysToMatch = 5;
let coachEnergy = 100, teamPrep = 50, boardConfidence = 75;
let activeMandate = null, currentOpponent = null;
let firstHalfUs = 0, firstHalfOpp = 0;

class Player {
    constructor(name, position, age, nationality, skillLevel) {
        this.name = name; this.position = position; this.age = age; 
        this.nationality = nationality; this.skillLevel = skillLevel;
        this.ego = Math.floor(Math.random() * 20) + 1;
        this.happiness = 100; this.faction = null;
    }
    reactToBench() {
        if (this.ego > 15) { this.happiness -= 20; return "furious"; }
        else { this.happiness -= 10; return "unhappy"; }
    }
}

// Updated Squad with Positions
const squad = [
    new Player("Marco Rossi", "ST", 28, "Italian", 88), new Player("Luigi Bianchi", "CM", 22, "Italian", 76),
    new Player("James Smith", "CB", 31, "English", 82), new Player("Tom Johnson", "RB", 19, "English", 68),
    new Player("Carlos Silva", "LW", 26, "Brazilian", 89), new Player("Joao Santos", "GK", 24, "Brazilian", 81)
];

// League Teams Data
let leagueTeams = [
    { id: 0, name: "🛡️ AFC Phoenix", isUs: true, pts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, power: 0 }, // Player team
    { id: 1, name: "🦅 London United", isUs: false, pts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, power: 85 },
    { id: 2, name: "👑 Madrid Royals", isUs: false, pts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, power: 90 },
    { id: 3, name: "🐺 Munich Wolves", isUs: false, pts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, power: 88 },
    { id: 4, name: "🚢 Milan City", isUs: false, pts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, power: 82 },
    { id: 5, name: "🗼 Paris Elite", isUs: false, pts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, power: 89 },
    { id: 6, name: "⚓ FC Porto", isUs: false, pts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, power: 78 },
    { id: 7, name: "🦁 Amsterdam Ajax", isUs: false, pts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, power: 77 },
    { id: 8, name: "☘️ Celtic Rovers", isUs: false, pts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, power: 72 },
    { id: 9, name: "⚔️ Sparta Athens", isUs: false, pts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, power: 68 }
];
const lockerRoomFactions = {};

// ==========================================
// 2. INITIALIZATION & UI
// ==========================================
function initGame() {
    squad.forEach(p => {
        const cliqueKey = `${p.nationality} Squad`;
        if (!lockerRoomFactions[cliqueKey]) lockerRoomFactions[cliqueKey] = { members: [] };
        lockerRoomFactions[cliqueKey].members.push(p);
        p.faction = cliqueKey;
    });
    pickOpponent();
    renderRoster();
    updateUI();
    renderLeagueTable();
    drawPitch();
}

function renderRoster() {
    const squadList = document.getElementById('squad-list');
    squadList.innerHTML = '';
    squad.forEach((player, index) => {
        const card = document.createElement('div');
        card.className = 'player-card';
        if (player.happiness < 50) card.style.borderLeftColor = '#f44336';
        card.innerHTML = `
            <div class="player-info">
                <h4><span class="pos-tag">${player.position}</span> ${player.name} (OVR: ${player.skillLevel})</h4>
                <p>Faction: ${player.faction} | Happy: ${player.happiness}%</p>
            </div>
            <button class="bench-btn" data-index="${index}">Bench</button>`;
        squadList.appendChild(card);
    });
    document.querySelectorAll('.bench-btn').forEach(btn => btn.addEventListener('click', (e) => {
        squad[e.target.getAttribute('data-index')].reactToBench();
        renderRoster();
    }));
}

function pickOpponent() {
    const aiTeams = leagueTeams.filter(t => !t.isUs);
    currentOpponent = aiTeams[Math.floor(Math.random() * aiTeams.length)];
    document.getElementById('next-opponent').innerText = currentOpponent.name;
    document.getElementById('match-header').innerText = `🛡️ AFC Phoenix vs ${currentOpponent.name}`;
}

function updateUI() {
    document.getElementById('week-counter').innerText = week;
    document.getElementById('days-left').innerText = daysToMatch;
    document.getElementById('coach-energy').innerText = coachEnergy;
    document.getElementById('team-prep').innerText = teamPrep;
    document.getElementById('board-confidence').innerText = boardConfidence;
    
    if(!activeMandate) activeMandate = {text: "Win the next match.", type: "win"};
    document.getElementById('board-mandate').innerText = activeMandate.text;

    if (daysToMatch <= 0) {
        logEvent(`⚽ MATCH DAY! You face ${currentOpponent.name}.`);
        document.querySelector('.action-buttons').style.pointerEvents = "none";
        setTimeout(() => {
            document.getElementById('match-day-panel').style.display = 'flex';
        }, 1500);
    }
}

function logEvent(msg) { document.getElementById('calendar-log').innerHTML = `<p>> ${msg}</p>` + document.getElementById('calendar-log').innerHTML; }

// ==========================================
// 3. TACTICS CANVAS
// ==========================================
const canvas = document.getElementById('pitchCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
const tacticalMemory = { phase1: null, phase2: null };

function drawPitch() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(canvas.width/2, 0); ctx.lineTo(canvas.width/2, canvas.height); ctx.stroke();
    ctx.beginPath(); ctx.arc(canvas.width/2, canvas.height/2, 50, 0, Math.PI*2); ctx.stroke();
}
canvas.addEventListener('mousedown', (e) => { isDrawing = true; draw(e); });
canvas.addEventListener('mouseup', () => { isDrawing = false; ctx.beginPath(); });
canvas.addEventListener('mousemove', draw);
function draw(e) {
    if (!isDrawing) return;
    const mode = document.querySelector('input[name="drawMode"]:checked').value;
    ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.strokeStyle = mode === 'pass' ? '#03a9f4' : '#ffeb3b';
    ctx.setLineDash(mode === 'pass' ? [15, 15] : []);
    ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY);
}
document.getElementById('clearBoard').addEventListener('click', drawPitch);
const savePhase = (p) => { tacticalMemory[p] = canvas.toDataURL(); alert(`Saved ${p.toUpperCase()}!`); };
const loadPhase = (p) => { if(tacticalMemory[p]) { const img = new Image(); img.src = tacticalMemory[p]; img.onload = () => { drawPitch(); ctx.drawImage(img, 0, 0); }; } };
document.getElementById('savePhase1').onclick = () => savePhase('phase1');
document.getElementById('loadPhase1').onclick = () => loadPhase('phase1');
document.getElementById('savePhase2').onclick = () => savePhase('phase2');
document.getElementById('loadPhase2').onclick = () => loadPhase('phase2');

// ==========================================
// 4. CALENDAR & EVENTS
// ==========================================
window.takeAction = function(actionType) {
    if (daysToMatch <= 0 || (coachEnergy <= 15 && actionType !== 'rest')) return logEvent("⚠️ Exhausted! Must rest.");
    
    switch(actionType) {
        case 'tactics': coachEnergy -= 25; teamPrep += 20; logEvent("Ran a tactical drill."); advanceDay(); break;
        case 'meeting': coachEnergy -= 15; let t = squad.sort((a,b) => a.happiness - b.happiness)[0]; t.happiness = Math.min(100, t.happiness + 25); logEvent(`Boosted ${t.name}'s morale.`); advanceDay(); break;
        case 'rest': coachEnergy += 45; logEvent("Recharged energy."); advanceDay(); break;
        case 'media': logEvent("🎙️ Held a press conference (+Team Prep)."); teamPrep += 10; coachEnergy -= 10; advanceDay(); break;
    }
}

function advanceDay() {
    teamPrep = Math.min(100, teamPrep); coachEnergy = Math.min(100, coachEnergy);
    daysToMatch--; renderRoster(); updateUI();
}

// ==========================================
// 5. MATCH & LEAGUE ENGINE
// ==========================================
window.playFirstHalf = function() {
    let myPower = (squad.reduce((s, p) => s + p.skillLevel, 0) / squad.length) + ((teamPrep - 50)/5);
    let diff = myPower - currentOpponent.power;
    firstHalfUs = diff > 0 ? Math.floor(Math.random() * 2) : 0;
    firstHalfOpp = diff < 0 ? Math.floor(Math.random() * 2) : 0;
    
    document.getElementById('match-result').innerHTML = `<h3 style="color:#ffeb3b">Halftime: Us ${firstHalfUs} - ${firstHalfOpp} ${currentOpponent.name}</h3>`;
    document.getElementById('sim-btn').style.display = 'none';
    document.getElementById('halftime-controls').style.display = 'block';
}

window.playSecondHalf = function(shift) {
    let finalUs = firstHalfUs + Math.floor(Math.random() * 2);
    let finalOpp = firstHalfOpp + Math.floor(Math.random() * 2);
    if (shift === 'overload' && Math.random() > 0.4) finalUs++;
    else if (shift === 'defend') finalOpp = Math.max(0, finalOpp - 1);
    
    document.getElementById('match-result').innerHTML = `<h3 style="color:#ffeb3b; font-size:1.5em">FULL TIME</h3><h2>Us ${finalUs} - ${finalOpp} ${currentOpponent.name}</h2>`;
    
    // Process Our Result
    processMatchResult(leagueTeams[0], currentOpponent, finalUs, finalOpp);
    
    // Simulate Rest of the League
    simulateLeagueRound();
    
    // Evaluate Psychology and Board
    if (finalUs > finalOpp) { squad.forEach(p => p.happiness += 15); boardConfidence += 10; }
    else if (finalUs < finalOpp) { squad.forEach(p => p.happiness -= 20); boardConfidence -= 15; }
    
    if (boardConfidence <= 0) { alert("🚨 SACKED! Board trust hit 0%."); location.reload(); }
    
    renderLeagueTable();
    renderRoster();
    document.getElementById('halftime-controls').style.display = 'none';
    document.getElementById('next-week-btn').style.display = 'inline-block';
}

function processMatchResult(teamA, teamB, goalsA, goalsB) {
    teamA.gf += goalsA; teamA.ga += goalsB; teamA.gd = teamA.gf - teamA.ga;
    teamB.gf += goalsB; teamB.ga += goalsA; teamB.gd = teamB.gf - teamB.ga;
    if (goalsA > goalsB) { teamA.w++; teamA.pts += 3; teamB.l++; }
    else if (goalsA < goalsB) { teamB.w++; teamB.pts += 3; teamA.l++; }
    else { teamA.d++; teamB.d++; teamA.pts += 1; teamB.pts += 1; }
}

function simulateLeagueRound() {
    // Simulate matches between AI teams (skipping the user and current opponent)
    const aiTeams = leagueTeams.filter(t => !t.isUs && t.id !== currentOpponent.id);
    for(let i = 0; i < aiTeams.length; i += 2) {
        if(aiTeams[i+1]) {
            let t1 = aiTeams[i], t2 = aiTeams[i+1];
            let diff = t1.power - t2.power;
            let g1 = diff > 0 ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 2);
            let g2 = diff < 0 ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 2);
            processMatchResult(t1, t2, g1, g2);
        }
    }
}

function renderLeagueTable() {
    // Sort by Points, then Goal Difference, then Goals For
    leagueTeams.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
    
    const ui = document.getElementById('league-table-ui');
    ui.innerHTML = `<tr><th>Pos</th><th class="team-name">Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr>`;
    
    leagueTeams.forEach((t, index) => {
        let rowClass = "";
        if (index < 3) rowClass = "ucl"; // Top 3 Champions League
        else if (index === 3) rowClass = "uecl"; // 4th Conference League
        else if (index >= 8) rowClass = "rel"; // Bottom 2 Relegation
        
        // Bold the user's team
        let nameFormat = t.isUs ? `<span style="color:#ffeb3b">${t.name}</span>` : t.name;
        
        ui.innerHTML += `<tr class="${rowClass}">
            <td>${index + 1}</td>
            <td class="team-name">${nameFormat}</td>
            <td>${t.w + t.d + t.l}</td>
            <td>${t.w}</td><td>${t.d}</td><td>${t.l}</td>
            <td>${t.gd > 0 ? '+'+t.gd : t.gd}</td>
            <td style="font-weight:bold">${t.pts}</td>
        </tr>`;
    });
    document.getElementById('matchday-counter').innerText = week;
}

window.resetWeek = function() {
    week++; daysToMatch = 5; coachEnergy = 100; teamPrep = 50;
    pickOpponent();
    document.getElementById('match-day-panel').style.display = 'none';
    document.getElementById('next-week-btn').style.display = 'none';
    document.querySelector('.action-buttons').style.pointerEvents = "auto";
    document.getElementById('match-result').innerHTML = '';
    document.getElementById('sim-btn').style.display = 'inline-block';
    updateUI();
}

// Boot up the game
initGame();
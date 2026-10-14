// js/board.js

let boardConfidence = 75;
let activeMandate = null;

const mandates = [
    { text: "We need a victory this week. No excuses.", type: "win" },
    { text: "The locker room is toxic. Get squad happiness above 70%.", type: "morale" },
    { text: "Focus on tactics. Ensure Team Prep is above 80% by match day.", type: "prep" },
    { text: "No pressure this week. Just don't embarrass the club.", type: "none" }
];

function generateMandate() {
    activeMandate = mandates[Math.floor(Math.random() * mandates.length)];
    updateBoardUI();
}

function updateBoardUI() {
    const confidenceSpan = document.getElementById('board-confidence');
    if (confidenceSpan) {
        confidenceSpan.innerText = boardConfidence;
        if (boardConfidence < 40) confidenceSpan.style.color = '#f44336'; // Red for danger
        else if (boardConfidence > 75) confidenceSpan.style.color = '#4caf50'; // Green for safe
        else confidenceSpan.style.color = '#ffffff';
    }

    const mandateSpan = document.getElementById('board-mandate');
    if (mandateSpan) {
        mandateSpan.innerText = activeMandate ? activeMandate.text : "None.";
    }
}

// Called by match.js after the final whistle
function evaluateBoard(matchWon, matchLost) {
    let avgHappiness = squad.reduce((total, player) => total + player.happiness, 0) / squad.length;
    let mandatePassed = false;

    // 1. Evaluate the Match Result
    if (matchWon) boardConfidence += 5;
    if (matchLost) boardConfidence -= 10;

    // 2. Evaluate the Mandate
    if (activeMandate.type === 'win' && matchWon) mandatePassed = true;
    if (activeMandate.type === 'morale' && avgHappiness >= 70) mandatePassed = true;
    if (activeMandate.type === 'prep' && teamPrep >= 80) mandatePassed = true;
    if (activeMandate.type === 'none') mandatePassed = true;

    // Apply Mandate Consequences
    if (mandatePassed && activeMandate.type !== 'none') {
        boardConfidence += 10;
        console.log("The Board is pleased you met their mandate.");
    } else if (!mandatePassed) {
        boardConfidence -= 15;
        console.log("The Board is furious you failed their mandate.");
    }

    // Cap confidence between 0 and 100
    boardConfidence = Math.max(0, Math.min(100, boardConfidence));
    updateBoardUI();

    // 3. Check for Sack
    if (boardConfidence === 0) {
        alert("🚨 GAME OVER. The Board has sacked you due to poor performance.");
        location.reload(); // Restarts the simulator
    } else {
        generateMandate(); // Set the new mandate for the upcoming week
    }
}
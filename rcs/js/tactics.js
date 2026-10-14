// Initialize the Canvas
const canvas = document.getElementById('pitchCanvas');
const ctx = canvas.getContext('2d');

// --- 1. Draw the Base Pitch ---
function drawPitch() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    ctx.strokeStyle = '#ffffff'; 
    ctx.lineWidth = 3;
    ctx.setLineDash([]); // Enforces solid lines for the pitch

    // Draw Halfway Line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // Draw Center Circle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw Center Spot
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
}

// Call the function when the script loads
drawPitch();


// --- 2. Tactical Drawing Logic ---
let isDrawing = false;

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseout', endPosition); 

function startPosition(e) {
    isDrawing = true;
    draw(e); 
}

function endPosition() {
    isDrawing = false;
    ctx.beginPath(); 
}

function draw(e) {
    if (!isDrawing) return; 

    // Check which mode is currently selected in the HTML controls
    const drawMode = document.querySelector('input[name="drawMode"]:checked').value;

    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    if (drawMode === 'pass') {
        ctx.strokeStyle = '#03a9f4'; // Tactical Blue for passes
        ctx.setLineDash([15, 15]);   // Creates a dashed line
    } else {
        ctx.strokeStyle = '#ffeb3b'; // Tactical Yellow for runs
        ctx.setLineDash([]);         // Solid line
    }

    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}


// --- 3. Clear Board Logic ---
const clearButton = document.getElementById('clearBoard');
if (clearButton) {
    clearButton.addEventListener('click', () => {
        drawPitch(); 
    });
}


// --- 4. Phased Game Plan Memory ---
const tacticalMemory = {
    phase1: null,
    phase2: null
};

// Helper function to save the current canvas state
function savePhase(phaseKey) {
    tacticalMemory[phaseKey] = canvas.toDataURL();
    alert(`Saved to ${phaseKey.toUpperCase()}!`);
}

// Helper function to load a saved canvas state
function loadPhase(phaseKey) {
    if (!tacticalMemory[phaseKey]) {
        alert(`No tactics saved for ${phaseKey.toUpperCase()} yet.`);
        return;
    }
    
    const img = new Image();
    img.src = tacticalMemory[phaseKey];
    img.onload = () => {
        drawPitch();              // Clear current board and draw fresh grass/lines
        ctx.drawImage(img, 0, 0); // Overlay the saved tactical drawings
    };
}

// Wire up the Phase buttons
document.getElementById('savePhase1')?.addEventListener('click', () => savePhase('phase1'));
document.getElementById('loadPhase1')?.addEventListener('click', () => loadPhase('phase1'));
document.getElementById('savePhase2')?.addEventListener('click', () => savePhase('phase2'));
document.getElementById('loadPhase2')?.addEventListener('click', () => loadPhase('phase2'));
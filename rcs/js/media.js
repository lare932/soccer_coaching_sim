// js/media.js

const mediaQuestions = [
    {
        question: "Coach, rumors are circulating about factions forming in the locker room. Care to comment?",
        options: [
            { 
                text: "Protect the players (Aggressive to media)", 
                effect: () => { 
                    coachEnergy -= 15; 
                    squad.forEach(p => p.happiness = Math.min(100, p.happiness + 5)); 
                    return "You yelled at the journalists. It exhausted you, but the squad appreciated the loyalty."; 
                } 
            },
            { 
                text: "Admit there are internal issues", 
                effect: () => { 
                    squad.forEach(p => p.happiness -= 10); 
                    return "The media praised your honesty, but the locker room feels betrayed."; 
                } 
            },
            { 
                text: "No comment.", 
                effect: () => { return "You deflected the question. The media runs with their own wild narrative."; } 
            }
        ]
    },
    {
        question: "Your upcoming opponent is known for a devastating high press. Are you prepared?",
        options: [
            { 
                text: "We have a specific tactical plan for them.", 
                effect: () => { 
                    teamPrep += 15; 
                    coachEnergy -= 5;
                    return "You confidently detailed your tactical plan. Team prep increased."; 
                } 
            },
            { 
                text: "We focus on our own game, not theirs.", 
                effect: () => { 
                    squad.forEach(p => p.happiness = Math.min(100, p.happiness + 10)); 
                    return "You projected supreme confidence. The players feel invincible."; 
                } 
            }
        ]
    }
];

function openPressConference() {
    // Pick a random question from our array
    const qData = mediaQuestions[Math.floor(Math.random() * mediaQuestions.length)];
    
    document.getElementById('media-question').innerText = `"${qData.question}"`;
    
    const optionsContainer = document.getElementById('media-options');
    optionsContainer.innerHTML = ''; // Clear old buttons
    
    // Generate the answer buttons dynamically
    qData.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt.text;
        btn.style.backgroundColor = "#5e35b1";
        btn.style.marginBottom = "10px";
        btn.style.width = "100%";
        btn.style.textAlign = "left";
        
        btn.onclick = () => {
            // Apply the consequences of the answer
            const logMsg = opt.effect();
            
            // Close modal, log the result, and advance the calendar day
            document.getElementById('media-modal').style.display = 'none';
            logEvent(`🎙️ ${logMsg}`);
            renderRoster(); // Update locker room UI
            advanceDay();   // Move to the next day
        };
        optionsContainer.appendChild(btn);
    });
    
    // Show the modal overlay
    document.getElementById('media-modal').style.display = 'flex';
}
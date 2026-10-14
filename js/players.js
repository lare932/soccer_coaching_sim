// js/player.js

class Player {
    constructor(name, age, nationality, skillLevel) {
        this.name = name;
        this.age = age;
        this.nationality = nationality;
        this.skillLevel = skillLevel; // 1-100
        
        // Hidden Psychological Traits (1-20 scale)
        this.ego = Math.floor(Math.random() * 20) + 1;
        this.loyalty = Math.floor(Math.random() * 20) + 1;
        this.skepticism = Math.floor(Math.random() * 20) + 1;
        this.clutchFactor = Math.floor(Math.random() * 20) + 1;
        
        // Current state variables
        this.happiness = 100; 
        this.faction = null;
    }

    // A method to simulate how a player reacts to being benched
    reactToBench() {
        if (this.ego > 15) {
            this.happiness -= 20;
            console.log(`${this.name} is furious about being benched! Ego clashed.`);
            return "negative";
        } else if (this.loyalty > 15) {
            this.happiness -= 5;
            console.log(`${this.name} accepts the benching for the good of the team.`);
            return "neutral";
        } else {
            this.happiness -= 10;
            console.log(`${this.name} is unhappy but keeping quiet.`);
            return "negative";
        }
    }
}// --- Squad Generation ---
const squad = [
    new Player("Marco Rossi", 28, "Italian", 85),
    new Player("Luigi Bianchi", 22, "Italian", 76),
    new Player("James Smith", 31, "English", 82),
    new Player("Tom Johnson", 19, "English", 68),
    new Player("Carlos Silva", 26, "Brazilian", 89),
    new Player("Joao Santos", 24, "Brazilian", 81),
    new Player("Lucas Moura", 29, "Brazilian", 84)
];

// --- Locker Room Politics Engine ---
const lockerRoomFactions = {};

function establishFactions(team) {
    team.forEach(player => {
        // Group players by Nationality to form factions
        const cliqueKey = `${player.nationality} Contingent`;
        
        if (!lockerRoomFactions[cliqueKey]) {
            lockerRoomFactions[cliqueKey] = {
                members: [],
                influence: 0 // Higher influence means media leaks are more likely
            };
        }
        
        lockerRoomFactions[cliqueKey].members.push(player);
        player.faction = cliqueKey;
        
        // Calculate the faction's power based on the skill and ego of its members
        lockerRoomFactions[cliqueKey].influence += (player.skillLevel + (player.ego * 2));
    });

    console.log("Locker Room Ecosystem Established:");
    console.log(lockerRoomFactions);
}

// Run the engine when the script loads
establishFactions(squad);
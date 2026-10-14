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
}
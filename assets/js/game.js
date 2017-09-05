
var playerSelected = false;
var enemySelected = false;

var Characters = {
	"Luke": { hp: 125, attack: 15, imgUrl:"lukeskywalker.png" }, 
	"Rey": { hp: 100, attack: 11, imgUrl: "reyskywalker.png" }, 
	"Gen. Hux": { hp: 110, attack: 10, imgUrl: "generalhux.jpg" }, 
	"Kylo Ren": { hp: 147, attack: 21, imgUrl: "kyloren.jpg" }
};

var Player = {
	name: "",
	healthPoints: 0,
	attack: 0,
	baseAttack: 0,
	imageURL: "",
	increaseAttack: function(){
		this.attack += this.baseAttack;
	},
	choose: function(charName){
		this.name = charName;
		var Character = Characters[charName];
		this.healthPoints = Character.hp;
		this.attack = 0; // attack will be increased by base before striking
		this.baseAttack = Character.attack;
		this.imageURL = Character.imgURL;
	}
};

var Defender = {
	name: "",
	healthPoints: 0,
	counterAttack: 0,
	imageURL: "",
	choose: function(charName){
		this.name = charName;
		var Character = Characters[charName];
		this.healthPoints = Character.hp;
		this.counterAttack = Character.attack;
		this.imageURL = Character.imgURL;
	}
};

function generateDiv(charName){
	var Character = Characters[charName];

	// generate HTML for div
	var charDiv = $("<div>");
	charDiv.attr("itemType", "Fighter");
	charDiv.attr("fighterName", charName);
	charDiv.css("display", "inline-block");
	charDiv.css("margin", "5px");

	// add character's name
	charDiv.append($("<p>").html(charName));

	// add image for character
	var charImg = $("<img>");
	charImg.attr("height", "100px");
	charImg.attr("width", "100px");
	charImg.attr("src", "assets/images/" + Character.imgUrl);
	charDiv.append(charImg);

	charDiv.append("<br/><br/>"); // add line break

	// add character's HP
	var charHP = $("<p>");
	charHP.attr("class", "healthPoints");
	charHP.html(Character.hp);
	charDiv.append(charHP);

	return charDiv;
}

function startGame(){
	// clear player and defender
	playerSelected = false;
	$("#player").empty();
	enemySelected = false;
	$("#defender").empty();

	// hide buttons, clear turn events, and instruct user to select a character
	$("#gameCommand").html("Please select a character");
	$("#turnEvents").empty();
	$("button").hide();

	// populate characters
	$("#characters").empty();
	for (charName in Characters){
		$("#characters").append(generateDiv(charName));
	}
	// set event for picking fighter
	$("[itemType='Fighter'").on("click", pickFighter);
}

function pickFighter(){
	if (playerSelected && enemySelected){
		// player and defender are selected, do not continue
		return;
	}

	// select the fighter
	var fighterChosen = $(this).attr("fighterName");

	// if player not selected, select a player
	if (!playerSelected){
		$("#player").html(this);
		Player.choose(fighterChosen);
		playerSelected = true;
		$("#gameCommand").html("Now, select a defender");
	} 

	// if defender not selected, select a defender
	else if (!enemySelected){
		$("#defender").html(this);
		Defender.choose(fighterChosen);
		enemySelected = true;
		$("#gameCommand").html("Fight!");

		// start the game, allowing an attack
		$("#attackButton").show();
	}
}

function attack(){
	// increase player's attack before striking
	Player.increaseAttack(); 

	var turnLog = "";	// log of the turn's events

	// player attacks defender
	Defender.healthPoints -= Player.attack;
	turnLog += Player.name + " attacks " + Defender.name + " for " + Player.attack + " points. <br/>";
	$("#defender").find(".healthPoints").html(Defender.healthPoints);

	// defender counter-attacks
	Player.healthPoints -= Defender.counterAttack;
	turnLog += Defender.name + " counter-attacks " + Player.name + " for " + Defender.counterAttack + " points. <br/>";
	$("#player").find(".healthPoints").html(Player.healthPoints);

	// if player lost all their HP, game over
	if (Player.healthPoints <= 0){
		$("#player").find(".healthPoints").html(0); // write 0 to HP
		
		// show turn events
		turnLog += "You have been defeated. Game over. <br/>";
		console.log(turnLog);
		$("#turnEvents").html(turnLog);

		$("#attackButton").hide(); // hide Attack button
		$("#replayButton").show(); // show Replay button

		// leave function
		return;
	} 
	
	// if defender lost all their HP, defender is defeated
	if (Defender.healthPoints <= 0){
		// remove defender
		$("#defender").empty();
		enemySelected = false;

		// log defender defeat
		turnLog += "You have defeated " + Defender.name + ". <br/>";

		// hide Attack button until another defender selected
		$("#attackButton").hide();

		// check if there are any characters left to fight
		if ($("#characters").children().length > 0){
			$("#gameCommand").html("Select another defender");
		} 
		// if there are no more characters to fight, game is won
		else {
			turnLog += "You have won! Game over. <br/>";
			$("#replayButton").show(); // show Replay button
		}
	} 

	// log events of past turn
	console.log(turnLog);
	$("#turnEvents").html(turnLog);
}

// start the game when the page loads
$(document).ready(startGame);

// add functions to click events of elements
$("#attackButton").on("click", attack);
$("#replayButton").on("click", startGame);
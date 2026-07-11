const difficultyScreen = document.getElementById("difficulty-screen");
const gameScreen = document.getElementById("game-screen");

const easy = document.getElementById("easy-level");
const medium = document.getElementById("medium-level");
const hard = document.getElementById("hard-level");

const gameBoard = document.getElementById("game-board");
easy.addEventListener("click", function(){

    difficultyScreen.style.display = "none";

    gameScreen.style.display = "block";

});
medium.addEventListener("click", function(){

    difficultyScreen.style.display = "none";

    gameScreen.style.display = "block";

});
hard.addEventListener("click", function(){

    difficultyScreen.style.display = "none";

    gameScreen.style.display = "block";

});
const gameBack = document.getElementById("game-back");
gameBack.addEventListener("click", function () {

    gameScreen.style.display = "none";

    difficultyScreen.style.display = "block";

});
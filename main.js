import { possibleWords } from "./words.js";

$(document).ready(() => {
  let answer;

  const getRandomWord = () => {
    const max = possibleWords.length;
    const min = 0;
    const rand = Math.floor(Math.random() * (max - min + 1) + min);
    const randomWord = possibleWords[rand];
    return randomWord;
  };

  const generateAnswer = async () => {
    // Get word
    const thisWord = getRandomWord();
    // check if this randomWord is real
    // await the info from the api link
    const response = await fetch(
      `https://dictionaryapi.com/api/v3/references/collegiate/json/${thisWord}?key=3f23d705-7caf-4c53-a19f-b646f6127bf1`
    );
    // await the response to be turned into json before data is a thing
    const data = await response.json();
    // when data is a thing obtain the shortdef (if there is no short definition and it isn't a word, it is undefined)
    const validWord = data[0].shortdef;

    if (!validWord) {
      // Word is not real, so get another one
      generateAnswer();
    } else {
      console.log("word is real");
      // Set word
      answer = thisWord;
      console.log(answer.length, answer);
      for (let i = 0; i < answer.length; i++) {
        $("#answerSection").append("<section class='answerBox'></section>");
      }
    }
  };

  generateAnswer();

  const updateHangmanDrawing = () => {
    // Get the current background image
    const backgroundImage = $("#hangmanDrawing").css("background-image");
    // Get the length of the string that is returned
    const backgroundImageLength = backgroundImage.length;
    // get the index in the string that is returned of where the word 'stage' starts
    const imageURLIndex = backgroundImage.indexOf("stage");
    // slice the string from where the word stage starts (plug the length of stage so it is not included) to the end minus the length to remove ".svg')" so that all is left is the number stage we are at
    const stage = backgroundImage.slice(
      imageURLIndex + 5,
      backgroundImageLength - 6
    );
    // if there is currently a stage (so a life has already been lost) and it is not already on the last one (game over)
    if (stage && stage !== 11) {
      // set the background to the next stage Number(stage) is used because stage is a string to begin with so adding 1 to stage 1 becomes 11 not 2. (Typescript is really good btw)
      $("#hangmanDrawing").css(
        "background-image",
        `url('./images/stage${Number(stage) + 1}.svg')`
      );
    } else {
      // if they have not lost any lives yet then set to stage 1
      $("#hangmanDrawing").css(
        "background-image",
        "url('./images/stage1.svg')"
      );
    }
  };

  $(".keyboardButton").on("click", (e) => {
    // Which letter is being clicked?
    const letterClicked = e.target.innerHTML;
    // Check if this letter is in the word and what positions it is in
    // Split the answer into an array of letters
    const answerSplit = answer.split("");
    // Check to see if the letter is actually in the answer
    if (answer.includes(letterClicked)) {
      // Loop through the array of letters
      answerSplit.forEach((letter, index) => {
        // Is the letter in the answer in this iteration the same as the one clicked by the user?
        if (letter === letterClicked) {
          const answerSection = $("#answerSection").children();
          answerSection[index].innerHTML = letterClicked;
        }
      });
    } else {
      updateHangmanDrawing();
    }
    // Letter has been used so make the keyboard key disabled
    $(`button[data-key=${letterClicked}]`).attr("disabled", "true");
  });

  $("#submitGuess").on("click", () => {
    // Check if the value of the input box matches the answer
    const submitGuess = $("#guessedWord").val();
    if (submitGuess === "") {
      return;
    }
    // if value matches win game
    if (submitGuess === answer) {
      alert("Congrats, your answer is correct!");
      const answerSplit = answer.split("");
      answerSplit.forEach((letter, index) => {
        // Is the letter in the answer in this iteration the same as the one clicked by the user?
        const answerSection = $("#answerSection").children();
        answerSection[index].innerHTML = letter;
      });
    } else {
      // if value doesnt match, clear the input box and move image to next stage
      alert("Incorrect guess! You lose a life.");
      updateHangmanDrawing();
      $("#guessedWord").val("");
    }
  });

  // Event listener on the input box to see if the user presses "Enter" and if they do then do the same as submit guess does.
  $("#guessedWord").on("keypress", (e) => {
    const keyPressed = e.key;
    if (keyPressed === "Enter") {
      const submitGuess = $("#guessedWord").val();
      if (submitGuess === "") {
        return;
      }
      if (submitGuess === answer) {
        alert("Congrats, your answer is correct!");
        const answerSplit = answer.split("");
        answerSplit.forEach((letter, index) => {
          // Is the letter in the answer in this iteration the same as the one clicked by the user?
          const answerSection = $("#answerSection").children();
          answerSection[index].innerHTML = letter;
        });
      } else {
        alert("Incorrect guess! You lose a life.");
        updateHangmanDrawing();
        $("#guessedWord").val("");
      }
    }
  });
});

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
    }
  };

  generateAnswer();
});

/*
Author: Jacob Williams
Purpose; creates the trnalating logic and creates the server for public_html. When interatcting with the web page ajax sends requests to
          this file to return a translated text.
Usage: open console and type 'node translation.js' then open a browser and copy/paste url from console into browser
*/
// using express instead of http
const express = require('express');
const app = express();
const hostname = 'localhost'
const port = 3000 ;
const fs = require('fs');
const readline = require('readline');

// creates the dictionaries/ javascript objects
englishToSpanish = {};
englishToGerman = {};
spanishToEnglish = {};
germanToEnglish = {};
spanishToGerman = {};
germanToSpanish = {};
// reads the data from the filename and creates a dicitonary and reverse dictionary
async function loadTheData(filename, dictionary, reverseDictionary){
  const fileStream = fs.createReadStream(filename);
  const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
  for await(const line of rl){
    components = line.split('\t');
    if(components[0][0] != '#' && components.length >= 2){
      baseWord = components[0].toLowerCase();
      translation_lis = components[1];
      let i;
      let index = translation_lis.length;
      for(i = 0; i < translation_lis.length; i++ ){
        var char = translation_lis[i];
        if(char == '[' || char == ',' || char == '(' || char == '/n'){ // finds lines with special characters
          if(translation_lis[i-1] == ' '){
            index = i -1;
          }else{
            index = i;
          }
          break;
        }
      }
      translation = translation_lis.substring(0,index).toLowerCase();
      dictionary[baseWord] = translation;
      reverseDictionary[translation] = baseWord;
    }
  }
}
// links the german and spanish dictionaries together into two new dictionaries
function combineDictionaries(){
  for (key in englishToSpanish){
    var germanWord = String(englishToGerman[key]).toLowerCase();
    var spanishWord = String(englishToSpanish[key]).toLowerCase();
    germanToSpanish[germanWord] = spanishWord;
    spanishToGerman[spanishWord] = germanWord;
  }
}
// code for startup
loadTheData('Spanish.txt',englishToSpanish, spanishToEnglish);
loadTheData('German.txt', englishToGerman, germanToEnglish);

// given a list of words and String translation type this returns a complete translated string
function translateWords(content,type){
  combineDictionaries();
  if(type == 'e2s'){
    var retVal = '';
    for(let word of content){
      retVal += englishToSpanish[word] + ' ';
    }
  }else if(type == 'e2g'){
    var retVal = '';
    for(let word of content){
      retVal += englishToGerman[word] + ' ';
    }
  }else if(type == 's2e'){
    var retVal = '';
    for(let word of content){
      retVal += spanishToEnglish[word] + ' ';
    }
  }else if(type == 'g2e'){
    var retVal = '';
    for(let word of content){
      retVal += germanToEnglish[word] + ' ';
    }
  }else if(type == 's2g'){
    var retVal = '';
    for(let word of content){
      retVal += spanishToGerman[word] + ' ';
    }
  }else if(type == 'g2s'){
    var retVal = '';
    for(let word of content){
      retVal += germanToSpanish[word] + ' ';
    }
  }else{
    var retVal = '';
    for(let word of content){
      retVal += word + ' ';
    }
  }
  return retVal;
}

// sets up path for static files to be used
app.use(express.static('public_html'));
// given the special format in the url this will return a phrase to be sent back to code.js which will change the DOM
app.get('/translate/:type/:words', function(req, res){
  if(req.url != '/favicon.ico'){
    var type = req.params.type;
    var content = req.params.words.split(' ');
    translated_phrase = translateWords(content,type);
    translated_phrase = translated_phrase.replace("undefined", "?");
    res.end(translated_phrase);
  }
});
// listens for the server to start and prints url into console
app.listen(port,function () {
  console.log(`App listening at http://localhost:${port}`);
});

/*
Author: Jacob Williams
Purpose; using Node js we set up a local server that takes information from the url and creates a translation between English, German, and Spanish
Usage: open console and type 'node translation.js' then open a browser and copy/paste url from console into browser
*/
const http = require('http');
const hostname = 'localhost';
const port = 5000;
const fs = require('fs');
const readline = require('readline');
// creates the dictionaries/ javascript objects
let englishToSpanish = {};
let englishToGerman = {};
let spanishToEnglish = {};
let germanToEnglish = {};
let spanishToGerman = {};
let germanToSpanish = {};
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
// creates the server object  and loads in data from url
const server = http.createServer( function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.statusCode = 200;
  //http://127.0.0.1:5000/translate/e2s/you+want+to+sail
  if(req.url != '/favicon.ico'){
      combineDictionaries();
      urlComponents = req.url.split('/');
      if(urlComponents.length > 2){
      type = urlComponents[2];
      content = urlComponents[3].split('+');
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
      }
      res.end(retVal);
    }
  }
});
// listens for the server to start and prints url into console
server.listen(port, hostname,function () {
  console.log(`Server running at http://${hostname}:${port}/translate/TYPE/CONTENT`);
});

/*
Author: Jacob Williams
Purpose: This code interacts with the html event handlers and the server
        Everytime a language is changed or somethig is typed this function sends
        requests to the server using ajax
Usage: type words, change langueges, enter special format in url
*/

function getTranslation(){
  var httpRequest = new XMLHttpRequest();
  if (!httpRequest) {
    return false;
  }

  if(!(document.getElementById("textA").value.length <= 0) ){

    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          var textB = document.getElementById("textB");
          textB.value = httpRequest.responseText;
        } else { alert('ERROR'); }
      }
    }
    lang1 = document.getElementById("lang1").value;
    lang2 = document.getElementById("lang2").value;
    type = lang1.charAt(0).toLowerCase() +"2"+ lang2.charAt(0).toLowerCase();
    words = document.getElementById("textA").value;
    url = "http://localhost:3000/translate/"+type+"/"+words;
    httpRequest.open("GET",url);
    httpRequest.send();
  }
}

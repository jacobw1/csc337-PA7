function getTranslation(){

  var httpRequest = new XMLHttpRequest();
  if (!httpRequest) {
    return false;
  }

  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var textB = document.getElementById("textB");
        textB.value = httpRequest.responseText;
      } else { alert('ERROR'); }
    }
  }
  console.log("get here 1");
  lang1 = document.getElementById("lang1").value;
  lang2 = document.getElementById("lang2").value;
  type = lang1.charAt(0).toLowerCase() +"2"+ lang2.charAt(0).toLowerCase();
  words = document.getElementById("textA").value.replace(" ","+");
  url = "http://localhost:3000/translate/"+type+"/"+words;
  httpRequest.open("GET",url);
  httpRequest.send();
}

// window.onload = function() {
//     var x = document.createElement("INPUT");
    
//     x.setAttribute("type", "text");
//     x.setAttribute("value", "Hello World!");
//     document.body.appendChild(x);
// }

function saveOptions(e: { preventDefault: () => void; }) {
    e.preventDefault();
    chrome.storage.sync.set({
      color: (document.querySelector("#color") as HTMLInputElement).value 
    });
  }
  
  function restoreOptions() {
  
    function setCurrentChoice(result: { color: string; }) {
        (document.querySelector("#color") as HTMLInputElement) || "blue";
    }
  
    function onError(error: any) {
      console.log(`Error: ${error}`);
    }
  
    let getting = chrome.storage.sync.get("color");
    getting.then(setCurrentChoice, onError);
  }
  
  document.addEventListener("DOMContentLoaded", restoreOptions);
  document.querySelector("form").addEventListener("submit", saveOptions);
  

  function onError(error: any) {
    console.log(`Error: ${error}`);
  }
  
  function onGot(item: { color: string; }) {
    let color = "blue";
    if (item.color) {
      color = item.color;
    }
    document.body.style.border = "10px solid " + color;
  }
  
  let getting = chrome.storage.sync.get("color");
  getting.then(onGot, onError);
  
/**
 * Create a list element with a delete button
 * @param ul HTML element to append the list element
 * @param url url to show
 * @param type type to show
 */
function createListElement(ul : HTMLElement, url : string, type : string, index : string){
    var li = document.createElement("li");

    var button = document.createElement("button");
    button.textContent = "Delete";
    button.id = index + "_" + url + "_" + type;
    button.onclick = function() {
        deleteEntry(button);
    }; // Add function deleteEntry to the button

    var label = document.createElement("label");
    label.style.cssText = "padding-right: 20px;";
    label.textContent = "URL: " + url + " Type: " + type;

    li.appendChild(label);
    li.appendChild(button);
    ul.appendChild(li);
}


/**
 * Save the entry to the storage
 */
var saveEntry = function(){
    // Get the values from the form
    var url = document.getElementById("url") as HTMLInputElement;
    var type = document.getElementById("type") as HTMLSelectElement;

    // Create entry to save
    const entry = {
        url: url.value,
        type: type.selectedOptions.item(0).value
    }

    // Save the entry
    chrome.storage.local.get('entries', (result) => {
        let entries = result.entries;
      
        // If the list doesn't exist yet, initialize it
        if (!entries) {
          entries = [];
        }
      
        // Check if the entry already exists
        if (entries.some((e: { url: string; }) => e.url === entry.url)) {
            console.log('Entry already exists, skipping');
            return;
        }

        // Append the new element
        entries.push(entry);
      
        // Save the updated list back to storage
        chrome.storage.local.set({entries: entries}, () => {
          console.log('Entry saved');
        });
    });
}


/**
 * Delete the entry from the storage
 * @param button button that triggered the delete
 */
function deleteEntry(button : HTMLButtonElement) {
    // Delete the entry
    chrome.storage.local.get('entries', (result) => {
        let entries = result.entries;
      
        // If the list doesn't exist yet, do nothing
        if (!entries) {
            console.log('No entries to delete');
            return;
        }
      
        // Remove the element
        entries.splice(parseInt(button.id.split("_")[0]), 1);
      
        // Save the updated list back to storage
        chrome.storage.local.set({entries: entries}, () => {
            console.log('Entry deleted');
        });
    });
    // Reload the page
    location.reload();
}

// Add function saveEntry to the button
document.getElementById('custom_entry').onsubmit = saveEntry;

// Add entries to ul list
window.onload = () => {
    var ul = document.getElementById("custom-entries");

    // Get entries from storage
    chrome.storage.local.get('entries', (result) => {
        let entries = result.entries;
      
        // If the list doesn't exist yet, initialize it
        if (!entries) {
          entries = [];
        }
      
        // Append the new entry
        entries.forEach((entry: { url: string; type: string; }) => {
            createListElement(ul, entry.url, entry.type, entries.indexOf(entry).toString());
        });
    });

}
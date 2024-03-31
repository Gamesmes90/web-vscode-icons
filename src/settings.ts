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
    label.textContent = "URL: " + url + " | Type: " + type;

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

    // Stop if the url is empty
    if (!url.value) {
        console.log(chrome.runtime.getManifest().name + ": " + 'URL is empty');
        return;
    }
    // Stop if the type is empty
    if (!type.selectedOptions.item(0)) {
        console.log(chrome.runtime.getManifest().name + ": " + 'Type is empty');
        return;
    }

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
            console.log(chrome.runtime.getManifest().name + ": " + 'Entry already exists, skipping');
            return;
        }

        // Append the new element
        entries.push(entry);
      
        // Save the updated list back to storage
        chrome.storage.local.set({entries: entries}, () => {
          console.log(chrome.runtime.getManifest().name + ": " + 'Entry saved');
        });
    });

    // Add entry to content_scripts
    try{
        const script = {
            id: entry.url,
            matches: ['*://' + entry.url + '/*'],
            js: [entry.type + '.js'],
        }
        chrome.scripting.registerContentScripts([script], () => console.log(chrome.runtime.getManifest().name + ": " + 'Content script registered.'));
    } catch (e) {
        console.log(chrome.runtime.getManifest().name + ": " + 'Error registering content script');
        console.log(chrome.runtime.getManifest().name + ": " + e);
    }
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
            console.log(chrome.runtime.getManifest().name + ": " + 'No entries to delete');
            return;
        }
      
        // Remove the element
        entries.splice(parseInt(button.id.split("_")[0]), 1);
      
        // Save the updated list back to storage
        chrome.storage.local.set({entries: entries}, () => {
            console.log(chrome.runtime.getManifest().name + ": " + 'Entry deleted');
        });
    });
    // Reload the page
    location.reload();

    // Remove entry from content_scripts
    try{
        const filter: chrome.scripting.ContentScriptFilter = {
            ids: [button.id.split("_")[1]],
        }
        chrome.scripting.unregisterContentScripts(filter, () => console.log(chrome.runtime.getManifest().name + ": " + 'Content script unregistered.'));
    } catch (e) {
        console.log(chrome.runtime.getManifest().name + ": " + 'Error unregistering content script');
        console.log(chrome.runtime.getManifest().name + ": " + e);
    }
}

// Add function saveEntry to the button
document.getElementById('save').onclick = saveEntry;

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
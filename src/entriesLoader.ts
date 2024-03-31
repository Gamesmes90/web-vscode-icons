// Get the entries from the local storage
chrome.storage.local.get('entries', (result) => {
    let entries = result.entries;

    // Add each entry to content_scripts
    if (entries) {
        entries.forEach((entry: { url: string; type: string; }) => {
            const script = {
                id: entry.url,
                matches: ['*://' + entry.url + '/*'],
                js: [entry.type + '.js'],
            }
            try{
                chrome.scripting.registerContentScripts([script], () => console.log(chrome.runtime.getManifest().name + ": " + 'Content script registered for ' + entry.url));
            } catch (e) {
                console.log(chrome.runtime.getManifest().name + ": " + 'Error registering content script');
                console.log(chrome.runtime.getManifest().name + ": " + e);
            }
        });
    }
  
});
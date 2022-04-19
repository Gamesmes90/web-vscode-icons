import { createChromeManifest } from "./manifestChrome"
import { createFirefoxManifest } from "./manifestFirefox"
import { script } from "./out"
import { writeFileSync } from 'fs';

if (process.env.BROWSER){
    script(__filename, `Creating  manifest.json`, (_, exit) => {
        let manifest;
        switch (process.env.BROWSER) {
            case 'CHROME':
                manifest = createChromeManifest();
                break;

            case 'FIREFOX':
                manifest = createFirefoxManifest();
                break;
            default:
                throw new Error(`unknown BROWSER env '${process.env.BROWSER}'. Please use 'FIREFOX' or 'CHROME'`);
                break;
        }
        const manifestJSON = JSON.stringify(manifest, null, 2);
        writeFileSync('./dist/manifest.json', manifestJSON);
        exit();
    });
    
} else {
    throw new Error('No browser selected, please add BROWSER env');
}  
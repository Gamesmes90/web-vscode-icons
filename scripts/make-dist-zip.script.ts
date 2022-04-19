/**
 * Compress build/ folder to create archive which will be consumed by browser
 */
import { script } from './out';
import { createWriteStream } from 'fs';
import * as Archiver from 'archiver';

const manifest = require('../dist/manifest.json');
const manifestVersion = manifest.version;
const archiveName = 'gitea-vsci';

if (process.env.BROWSER && ['CHROME', 'FIREFOX', 'EDGE'].includes(process.env.BROWSER)) {
	const name = process.env.BROWSER.toLowerCase();
	script(__filename, `Creating '${name}-${archiveName}-${manifestVersion}.zip' ready to upload to stores`, ({ log, Ch }, exit) => {
		const distZip = createWriteStream(`${process.cwd()}/build/${name}-${archiveName}-${manifestVersion}.zip`);
		const archive = Archiver('zip', { zlib: { level: 9 } });

		// On end, print total bytes
		distZip.on('close', () => {
			log(archive.pointer() + ' total bytes');
			log(Ch.green(`> '${name}-${archiveName}-${manifestVersion}.zip' file created`));
			exit();
		});

		archive.pipe(distZip);
		archive.directory('./dist', false);

		archive.finalize();
	});

} else {
	throw new Error('Please, set BROWSER env to CHROME, FIREFOX or EDGE');
}



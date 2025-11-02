import path from 'path';
import { fileURLToPath } from 'url';
import { compareFiles } from './compare.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const [,, arg1, arg2] = process.argv;

if (!arg1 || !arg2) {
    console.log('Choose your destiny!!! Usage: node run.js <file1> <file2>');
    process.exit(1);
}

const file1 = path.isAbsolute(arg1) ? arg1 : path.join(__dirname, arg1);
const file2 = path.isAbsolute(arg2) ? arg2 : path.join(__dirname, arg2);

console.log(`Final round! Fight! :\n  1 ${file1}\n  2 ${file2}\n`);

(async () => {
    try {
        const result = await compareFiles(file1, file2);
        console.log(
            result
                ? 'You win!!! Files are identical!'
                : 'You loose!!! Files are not identical or have different length!'
        );
    } catch (err) {
        console.error('Error:', err.message);
    }
})();
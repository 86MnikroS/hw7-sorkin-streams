import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file1Path = path.join(__dirname, 'photos', 'photo1.jpg');
const file2Path = path.join(__dirname, 'photos', 'photo2.jpg');

console.log('Choose your destiny! Compare your files...');

const stream1 = fs.createReadStream(file1Path);
const stream2 = fs.createReadStream(file2Path);

let identical = true;
let buffer2 = [];

stream2.on('data', chunk => buffer2.push(chunk));

stream1.on('data', chunk1 => {
    const chunk2 = buffer2.shift();
    if (!chunk2 || !chunk1.equals(chunk2)) {
        identical = false;
        console.log('You lose! The files are not identical!');
        stream1.destroy();
        stream2.destroy();
    }
});

stream1.on('end', checkEnd);
stream2.on('end', checkEnd);

stream1.on('error', e => console.error('File1 error:', e.message));
stream2.on('error', e => console.error('File2 error:', e.message));

function checkEnd() {
    if (!identical) return;
    if (stream1.readableEnded && stream2.readableEnded)
        console.log('You win! Files are identical!');
    else if (stream1.readableEnded && !stream2.readableEnded)
        console.log('You lose! Files have different length!');
}
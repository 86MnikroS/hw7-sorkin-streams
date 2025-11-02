import fs from 'fs';

export function compareFiles(file1Path, file2Path) {
    return new Promise((resolve, reject) => {
        const s1 = fs.createReadStream(file1Path);
        const s2 = fs.createReadStream(file2Path);

        let identical = true;
        let buffer1 = Buffer.alloc(0);
        let buffer2 = Buffer.alloc(0);

        s1.on('data', chunk => {
            buffer1 = Buffer.concat([buffer1, chunk]);
            compareBuffers();
        });

        s2.on('data', chunk => {
            buffer2 = Buffer.concat([buffer2, chunk]);
            compareBuffers();
        });

        s1.on('end', checkEnd);
        s2.on('end', checkEnd);

        s1.on('error', reject);
        s2.on('error', reject);

        function compareBuffers() {
            const minLength = Math.min(buffer1.length, buffer2.length);
            if (minLength === 0) return;

            const part1 = buffer1.subarray(0, minLength);
            const part2 = buffer2.subarray(0, minLength);

            if (!part1.equals(part2)) {
                identical = false;
                s1.destroy();
                s2.destroy();
                return resolve(false);
            }

            buffer1 = buffer1.subarray(minLength);
            buffer2 = buffer2.subarray(minLength);
        }

        function checkEnd() {
            if (!identical) return;
            if (s1.readableEnded && s2.readableEnded) {
                if (buffer1.length === 0 && buffer2.length === 0) resolve(true);
                else resolve(false);
            }
        }
    });
}
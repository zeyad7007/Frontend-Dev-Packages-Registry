const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function runTestsInDir(directory) {
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
        files.forEach(file => {
            if (file.endsWith('.js')) {
                exec(`node ${path.join(directory, file)}`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error running ${file}:`, error);
                        return;
                    }
                    console.log(`Output of ${file}:\n`, stdout);
                    if (stderr) console.error(`Error output of ${file}:\n`, stderr);
                });
            }
        });
    });
}

// Run all tests in both e2e and unit directories
runTestsInDir(path.resolve(__dirname, 'dist/e2e'));
runTestsInDir(path.resolve(__dirname, 'dist/unit'));

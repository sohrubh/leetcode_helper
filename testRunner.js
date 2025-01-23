const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const os = require('os');

async function runTestCases(filePath, language) {
    const testCasesPath = path.join(path.dirname(filePath), 'testCases.txt');
    if (!fs.existsSync(testCasesPath)) {
        vscode.window.showErrorMessage('No test cases found. Please fetch test cases first.');
        return { passed: 0, total: 0, details: [] };
    }

    const testCases = fs.readFileSync(testCasesPath, 'utf-8').split('\n\n');
    let passed = 0;
    const details = [];

    for (let i = 0; i < testCases.length; i++) {
        const [input, expectedOutput] = testCases[i].split('\n');
        const actualOutput = await executeCode(filePath, language, input);
        const isPassed = actualOutput.trim() === expectedOutput.trim();

        if (isPassed) {
            passed++;
        }

        details.push({
            testCase: i + 1,
            input,
            expectedOutput,
            actualOutput,
            passed: isPassed,
        });
    }

    return { passed, total: testCases.length, details };
}

function executeCode(filePath, language, input) {
    return new Promise((resolve, reject) => {
        const fileName = path.basename(filePath);
        const fileNameWithoutExt = path.basename(filePath, path.extname(filePath));
        const fileDir = path.dirname(filePath); // Directory containing the file

        const config = vscode.workspace.getConfiguration('lch.language');

        let command;
        if (language === 'cpp') {
            const compileCommand = config.get('cpp.compile', 'g++ -std=c++17 -o $fileNameWithoutExt $fileName')
                .replace('$fileNameWithoutExt', fileNameWithoutExt)
                .replace('$fileName', fileName);

            const runCommand = config.get('cpp.run', '$fileNameWithoutExt$executableExtension')
                .replace('$fileNameWithoutExt', fileNameWithoutExt)
                .replace('$executableExtension', os.platform() === 'win32' ? '.exe' : '');

            // Change to the directory containing the file before running command
            command = `cd "${fileDir}" && ${compileCommand} && ${runCommand}`;
        } else if (language === 'python') {
            command = `cd "${fileDir}" && python ${fileName}`;
        } else {
            reject(new Error(`Unsupported language: ${language}`));
            return;
        }

        const process = exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });

        process.stdin?.write(input);
        process.stdin?.end();
    });
}

module.exports = { runTestCases };
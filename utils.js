const fs = require('fs');
const path = require('path');
const vscode = require('vscode');

function saveTestCasesToFile(testCases) {
    const testCasesString = testCases.map((tc) => `${tc.input}\n${tc.output}`).join('\n\n');
    const filePath = path.join(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '', 'testCases.txt');
    fs.writeFileSync(filePath, testCasesString);
}

module.exports = { saveTestCasesToFile };
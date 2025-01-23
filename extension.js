const vscode = require('vscode');
const { scrapeLeetCodeTestCases } = require('./scrapeLeetCode');
const { runTestCases } = require('./testRunner');
const { saveTestCasesToFile } = require('./utils');

function activate(context) {
	let fetchTestCasesCommand = vscode.commands.registerCommand('lch.fetchTestCases', async () => {
		const problemUrl = await vscode.window.showInputBox({ prompt: 'Enter the LeetCode problem URL' });
		if (problemUrl) {
			const testCases = await scrapeLeetCodeTestCases(problemUrl);
			if (testCases.length > 0) {
				saveTestCasesToFile(testCases);
				vscode.window.showInformationMessage('Test cases fetched and saved successfully!');
			} else {
				vscode.window.showErrorMessage('No test cases found or an error occurred during scraping.');
			}
		}
	});

	let runTestCasesCommand = vscode.commands.registerCommand('lch.runTestCases', async () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const filePath = editor.document.uri.fsPath;
			const language = editor.document.languageId;
			const results = await runTestCases(filePath, language);

			// It displays overall results
			vscode.window.showInformationMessage(`Test cases executed: ${results.passed}/${results.total}`);

			// It displays detailed results for the failed test cases
			if (results.passed < results.total) {
				const failedDetails = results.details
					.filter((detail) => !detail.passed)
					.map((detail) => {
						return `Test Case ${detail.testCase}:
- Input: ${detail.input}
- Expected: ${detail.expectedOutput}
- Actual: ${detail.actualOutput}`;
					})
					.join('\n\n');

				vscode.window.showErrorMessage(`Failed Test Cases:\n\n${failedDetails}`);
			}
		} else {
			vscode.window.showErrorMessage('No active editor found.');
		}
	});

	context.subscriptions.push(fetchTestCasesCommand, runTestCasesCommand);
}

function deactivate() { }

module.exports = { activate, deactivate };
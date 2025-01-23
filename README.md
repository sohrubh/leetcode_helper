# LeetCode Helper (LCH) - VS Code Extension

The **LeetCode Helper (LCH)** is a VS Code extension designed to streamline the process of solving LeetCode problems. It allows you to fetch test cases directly from LeetCode, run your code against them, and view detailed results, including which test cases passed or failed.

---

## Features

1. **Fetch Test Cases**:
   - Fetch test cases directly from a LeetCode problem URL.
   - Test cases are saved locally for easy access.

2. **Run Test Cases**:
   - Execute your code against the fetched test cases.
   - Supports multiple programming languages (C++, Python, etc.).

3. **Detailed Results**:
   - View a comparison of expected vs. actual outputs for each test case.
   - Highlights discrepancies for easier debugging.

4. **Custom Configuration**:
   - Configure compile and run commands for different programming languages.

---

## Installation

1. **Prerequisites**:
   - [Visual Studio Code](https://code.visualstudio.com/) installed.
   - [Node.js](https://nodejs.org/) (for development and testing).

2. **Install the Extension**:
   - Clone this repository to your local machine.
   - Open the project in VS Code.
   - Run the following command to install dependencies:
     ```bash
     npm install
     ```
   - Press `F5` to build and run the extension in a new Extension Development Host window.

---

## Usage

### Fetch Test Cases

1. Open a LeetCode problem in your browser and copy the URL.
2. In VS Code, run the command `LCH: Fetch Test Cases`.
3. Paste the LeetCode problem URL when prompted.
4. The test cases will be fetched and saved locally.

### Run Test Cases

1. Write your solution in your preferred programming language.
2. Run the command `LCH: Run Test Cases`.
3. The extension will execute your code against the fetched test cases and display the results.

### View Results

- If all test cases pass, you'll see a success message.
- If any test cases fail, the extension will display:
  - The input for the failed test case.
  - The expected output.
  - The actual output.

---

## Configuration

You can customize the compile and run commands for different programming languages in the `settings.json` file. Here’s an example configuration:

### Default Configuration for C++

```json
{
  "lch.language.cpp.compile": "g++ -std=c++17 -o $fileNameWithoutExt $fileName",
  "lch.language.cpp.run": "$fileNameWithoutExt$executableExtension"
}
```

### Default Configuration for Python

```json
{
  "lch.language.python.run": "python $fileName"
}
```
---

### License
This project is licensed under the MIT License.

### Acknowledgments
- [LeetCode](https://leetcode.com/) for providing the problem statements and test cases.
- VS Code API for making this extension possible.

### Support
If you encounter any issues or have suggestions for improvement, please open an issue on the GitHub repository.

Enjoy solving LeetCode problems with ease using the LeetCode Helper (LCH) extension! 🚀
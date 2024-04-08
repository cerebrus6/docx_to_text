const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

// Function to convert DOCX files to TXT
async function convertDocxToTxt(docxFilePath) {
    try {
        // Check if a corresponding TXT file already exists
        const txtFilename = path.parse(docxFilePath).name + '.txt';
        const txtFilePath = path.join(path.parse(docxFilePath).dir, txtFilename);
        if (fs.existsSync(txtFilePath)) {
            console.log(`TXT file already exists for ${docxFilePath}. Skipping conversion.`);
            return;
        }

        // Convert DOCX to TXT
        const { value } = await mammoth.extractRawText({ path: docxFilePath });

        // Create a new TXT file
        fs.writeFileSync(txtFilePath, value);

        console.log(`Converted ${docxFilePath} to ${txtFilePath}`);
    } catch (error) {
        console.error(`Error converting ${docxFilePath}: ${error.message}`);
    }
}

// Get the current directory
const currentDirectory = process.cwd();

// Loop through all files in the current directory
fs.readdirSync(currentDirectory).forEach(filename => {
    if (filename.endsWith('.docx')) {
        const docxFilePath = path.join(currentDirectory, filename);
        convertDocxToTxt(docxFilePath);
    }
});

const fs = require('fs');
const path = require('path');
const readline = require('readline');
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

// Ask for directory path
var directory = process.argv[2] ?? false;

if(!directory) {
	// Create interface to read input from command line
	const rl = readline.createInterface({
	    input: process.stdin,
	    output: process.stdout
	});

	rl.question("Enter the directory path: ", function(targetDirectory) {
	    // Replace backslashes with forward slashes
	    targetDirectory = targetDirectory.replace(/"/g, '')

	    // Check if directory exists
	    if (!fs.existsSync(targetDirectory) && targetDirectory !== '') {
	        console.error("Directory does not exist.");
	        rl.close();
	        return;
	    }

		convert_all_docx_in_directory(targetDirectory)

	    // Close the interface
	    rl.close();
	});

} else {
    // Replace backslashes with forward slashes
    let targetDirectory = directory.replace(/"/g, '')
	convert_all_docx_in_directory(targetDirectory);
}


async function convert_all_docx_in_directory(targetDirectory = "") {
	    // Replace backslashes with forward slashes
	    targetDirectory = targetDirectory.replace(/"/g, '')

	    // Default directory is current directory
	    if (targetDirectory === '') {
	        targetDirectory = process.cwd();
	    	console.log('No directory given, using current directory: ' + targetDirectory);
	    }

	    // Loop through all files in the target directory
	    fs.readdirSync(targetDirectory).forEach(filename => {
	        if (filename.endsWith('.docx')) {
	            const docxFilePath = path.join(targetDirectory, filename);
	            convertDocxToTxt(docxFilePath);
	        }
	    });
}
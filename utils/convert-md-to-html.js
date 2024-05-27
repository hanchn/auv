import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const projectRoot = process.cwd();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to get the current time
const getCurrentTime = () => {
  return new Date().toISOString();
};

// Function to convert Markdown to HTML
const convertMarkdownToHtml = async (inputPath, outputPath, isUpdate) => {
  try {
    const markdownContent = await fs.readFile(inputPath, 'utf-8');
    const htmlContent = marked(markdownContent);

    let finalHtmlContent = htmlContent;

    if (isUpdate) {
      const updateTime = getCurrentTime();
      finalHtmlContent += `\n<span data-update="${updateTime}"></span>`;
    } else {
      const generateTime = getCurrentTime();
      finalHtmlContent += `\n<span data-generate="${generateTime}"></span>`;
    }

    await fs.writeFile(outputPath, finalHtmlContent);
    console.log(`Converted ${inputPath} to ${outputPath}`);
  } catch (error) {
    console.error(`Error converting ${inputPath}:`, error);
  }
};

// Function to check if the HTML file exists
const checkIfHtmlExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

// Function to recursively traverse the directory
const traverseDirectory = async (srcDir, destDir) => {
  try {
    const files = await fs.readdir(srcDir, { withFileTypes: true });
    for (const file of files) {
      const srcFilePath = path.join(srcDir, file.name);
      const destFilePath = path.join(destDir, file.name);
      if (file.isDirectory()) {
        await fs.mkdir(destFilePath, { recursive: true });
        await traverseDirectory(srcFilePath, destFilePath);
      } else if (file.isFile() && path.extname(file.name) === '.md') {
        const outputFilePath = path.join(destDir, path.basename(file.name, '.md') + '.html');
        const htmlExists = await checkIfHtmlExists(outputFilePath);
        await convertMarkdownToHtml(srcFilePath, outputFilePath, htmlExists);
      }
    }
  } catch (error) {
    console.error(`Error traversing directory ${srcDir}:`, error);
  }
};

// Main function to start the process
const main = async () => {
  const srcDirectory = path.join(projectRoot, 'theme');
  const destDirectory = path.join(projectRoot, 'dist');
  await fs.mkdir(destDirectory, { recursive: true });
  await traverseDirectory(srcDirectory, destDirectory);
};

main();

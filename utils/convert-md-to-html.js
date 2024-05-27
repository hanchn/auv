import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
const projectRoot = process.cwd();

// Helper function to get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to convert Markdown to HTML
const convertMarkdownToHtml = async (inputPath, outputPath) => {
  try {
    const markdownContent = await fs.readFile(inputPath, 'utf-8');
    const htmlContent = marked(markdownContent);
    await fs.writeFile(outputPath, htmlContent);
    console.log(`Converted ${inputPath} to ${outputPath}`);
  } catch (error) {
    console.error(`Error converting ${inputPath}:`, error);
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
        await convertMarkdownToHtml(srcFilePath, outputFilePath);
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

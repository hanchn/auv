import { exec } from 'child_process';

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    const process = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ${command}:`, error);
        reject(error);
      } else {
        console.log(`Output of ${command}:`, stdout);
        if (stderr) {
          console.error(`Error output of ${command}:`, stderr);
        }
        resolve(stdout);
      }
    });
    
    process.stdout.pipe(process.stdout);
    process.stderr.pipe(process.stderr);
  });
};

const main = async () => {
  try {
    await runCommand('echo "Running some script"');
    await runCommand('echo "Running another script"');
    // Add more commands as needed
  } catch (error) {
    console.error('Error running commands:', error);
    process.exit(1);
  }
};

main();

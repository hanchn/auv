import { exec } from 'child_process';
import { scripts } from './index.js';
const scriptName = process.argv[2];
if (scripts[scriptName]) {
  exec(scripts[scriptName], (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error}`);
      return;
    }
    if (stdout) {
      console.log(stdout);
    }
    if (stderr) {
      console.error(stderr);
    }
  });
} else {
  console.error(`Script "${scriptName}" not found in scripts.js`);
  process.exit(1);
}

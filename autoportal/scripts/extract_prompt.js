const fs = require('fs');
const readline = require('readline');
const transcriptPath = 'C:\\Users\\7assan\\.gemini\\antigravity\\brain\\d694cd89-5fe0-4eb2-9786-871e8d1dfcfb\\.system_generated\\logs\\transcript_full.jsonl';
const stream = fs.createReadStream(transcriptPath);
const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
let lastUserLine = null;

rl.on('line', (line) => {
  if (line.includes('"type":"USER_INPUT"')) {
    lastUserLine = line;
  }
});

rl.on('close', () => {
  if (lastUserLine) {
    const data = JSON.parse(lastUserLine);
    console.log('User input content length:', data.content.length);
    fs.writeFileSync('e:\\autofyon fof VSCode\\autoportal\\data_raw_user.txt', data.content, 'utf8');
    console.log('Saved to data_raw_user.txt');
  } else {
    console.log('No user input found');
  }
});

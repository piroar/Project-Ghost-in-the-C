const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const cors = require('cors');
const { Script } = require('vm');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/execute-python', (req, res) => {
  const activatescript="source env/bin/activate";
  const pythonCommand=`python3 pygen.py ${JSON.stringify(req.body.input)}`;
  const fullCommand=`${activatescript} && ${pythonCommand}`;
  const pythonProcess= spawn('bash',['-c',fullCommand]);
  
  //const pythonProcess = spawn('python3', ['pygen.py', req.body.input]); 

  let output = '';
  let errorOutput = '';

  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      res.json({ result: output });
    } else {
      res.status(500).json({ error: errorOutput });
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
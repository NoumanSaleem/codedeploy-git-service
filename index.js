var crypto = require('crypto'),
    express = require('express'),
    childProcess = require('child_process'),
    format = require('util').format,
    path = require('path'),
    schema = require('./schema'),
    tv4 = require('tv4');

var app = express(),
    createDeploymentScript = path.join(__dirname, 'create-deployment');

function validateSecret(req, res, next) {
  if (req.header('X-Hub-Signature') !== format('sha1=%s', crypto.createHmac('sha1', process.env.SECRET).update(JSON.stringify(req.body)).digest('hex'))) return res.status(400).end();
  next();
}

function validatePayload(req, res, next) {
  var result = tv4.validateMultiple(req.body, schema);
  if (!result.valid) return res.status(400).body(result);
  next();
}

app.use(require('body-parser').json());
if (process.env.SECRET) app.use(validateSecret);
app.use(validatePayload);

app.post('/:repo/:branch', function (req, res, next) {
  var branch = req.body.ref.match(/\/([\d\w\-]+)$/)[1];

  if (req.params.repo !== req.body.repository.name || req.params.branch !== branch) return next();

  childProcess.execFile(createDeploymentScript, [req.body.repository.name, branch, req.body.after, req.body.repository.full_name], function (err) {
      if (err) console.log(err);
      res.end();
  });
});

app.listen(process.env.PORT);

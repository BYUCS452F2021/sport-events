const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// ENDPOINTS HERE
// ex: app.get('path/for/endpoint', async (req, res) => {
//  code for endpoint here. access parameters using req.body.param_name and stuff in the URL using req.params.name
// }

app.listen(3000, () => console.log('Server listening on port 3000!'));

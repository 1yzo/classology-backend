const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const PORT = 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

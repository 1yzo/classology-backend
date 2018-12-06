const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

require('./mongo').connect();
const auth = require('./routes/auth');

const app = express();
app.use(cors());
app.use(bodyParser.json());
// Routes
app.use('/api/v1/auth', auth);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

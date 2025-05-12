// src/runInitialize.js

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const esm = require('esm')(module);
esm('./initializeFirebase.js');
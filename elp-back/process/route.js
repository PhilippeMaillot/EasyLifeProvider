function getRouteContent(name) {
    return `const express = require('express');
const router = express.Router();
const ${name}Controller = require('../controllers/${name}Controller');

router.get('/', ${name}Controller.getAll);

router.post('/', ${name}Controller.create);

router.put('/:id', ${name}Controller.update);

router.delete('/:id', ${name}Controller.delete);

module.exports = router;
`;
}

module.exports = { getRouteContent };

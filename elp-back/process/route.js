function getRouteContent(name, data) {
    const baseRoutes = `
const express = require('express');
const router = express.Router();
const ${name}Controller = require('../controllers/${name}Controller');

router.get('/', ${name}Controller.getAll);
router.post('/', ${name}Controller.create);
router.put('/:id', ${name}Controller.update);
router.delete('/:id', ${name}Controller.delete);
`;

    const dynamicRoutes = data.map(item => {
        return `router.post('/${item.fcname}', ${name}Controller.${item.fcname});`;
    }).join('\n');

    return `${baseRoutes}
${dynamicRoutes}

module.exports = router;
`;
}

module.exports = { getRouteContent };

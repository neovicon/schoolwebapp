const fs = require('fs');
const path = require('path');

const apis = ['page', 'post', 'teacher', 'course', 'event', 'global-setting'];

apis.forEach(api => {
  const dir = path.join(__dirname, '../src/api', api);
  const typesDir = path.join(dir, 'content-types', api);
  const controllersDir = path.join(dir, 'controllers');
  const routesDir = path.join(dir, 'routes');
  const servicesDir = path.join(dir, 'services');

  [dir, typesDir, controllersDir, routesDir, servicesDir].forEach(d => {
    if (!fs.existsSync(d)) {
      fs.mkdirSync(d, { recursive: true });
    }
  });

  const uid = `api::${api}.${api}`;

  fs.writeFileSync(path.join(controllersDir, `${api}.js`), `'use strict';\n\nconst { createCoreController } = require('@strapi/strapi').factories;\n\nmodule.exports = createCoreController('${uid}');\n`);
  fs.writeFileSync(path.join(routesDir, `${api}.js`), `'use strict';\n\nconst { createCoreRouter } = require('@strapi/strapi').factories;\n\nmodule.exports = createCoreRouter('${uid}');\n`);
  fs.writeFileSync(path.join(servicesDir, `${api}.js`), `'use strict';\n\nconst { createCoreService } = require('@strapi/strapi').factories;\n\nmodule.exports = createCoreService('${uid}');\n`);
});

console.log('Scaffolding complete');

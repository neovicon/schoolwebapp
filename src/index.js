'use strict';

module.exports = {
  register(/*{ strapi }*/) {},

  async bootstrap({ strapi }) {
    // Automatically grant permissions to the 'public' role
    try {
      const publicRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      if (publicRole) {
        const apis = ['page', 'post', 'teacher', 'course', 'event'];
        
        for (const api of apis) {
          const uids = [`api::${api}.${api}.find`, `api::${api}.${api}.findOne`];
          for (const action of uids) {
            const permissionExists = await strapi
              .query('plugin::users-permissions.permission')
              .findOne({ where: { role: publicRole.id, action } });

            if (!permissionExists) {
              await strapi.query('plugin::users-permissions.permission').create({
                data: {
                  action,
                  role: publicRole.id,
                },
              });
            }
          }
        }
        
        const globalAction = 'api::global-setting.global-setting.find';
        const globalExists = await strapi
            .query('plugin::users-permissions.permission')
            .findOne({ where: { role: publicRole.id, action: globalAction } });
        
        if (!globalExists) {
           await strapi.query('plugin::users-permissions.permission').create({
              data: {
                action: globalAction,
                role: publicRole.id,
              },
           });
        }
      }
    } catch (err) {
      console.error('Error setting public permissions in bootstrap:', err);
    }
  },
};

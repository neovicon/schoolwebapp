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
        const apis = ['page', 'post', 'teacher', 'course', 'event', 'faq', 'notice', 'download', 'gallery-item'];
        
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

        const createApis = ['admission-inquiry', 'message'];
        for (const api of createApis) {
          const action = `api::${api}.${api}.create`;
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

        const schoolSettingAction = 'api::school-setting.school-setting.find';
        const schoolSettingExists = await strapi
            .query('plugin::users-permissions.permission')
            .findOne({ where: { role: publicRole.id, action: schoolSettingAction } });
        
        if (!schoolSettingExists) {
           await strapi.query('plugin::users-permissions.permission').create({
              data: {
                action: schoolSettingAction,
                role: publicRole.id,
              },
           });
        }

        const pageBgAction = 'api::page-background.page-background.find';
        const pageBgExists = await strapi
            .query('plugin::users-permissions.permission')
            .findOne({ where: { role: publicRole.id, action: pageBgAction } });
        
        if (!pageBgExists) {
           await strapi.query('plugin::users-permissions.permission').create({
              data: {
                action: pageBgAction,
                role: publicRole.id,
              },
           });
        }
      }

      // Automatically create default ERP roles
      const erpRoles = [
        { name: 'Student', type: 'student', description: 'ERP Student portal access role' },
        { name: 'Teacher', type: 'teacher', description: 'ERP Teacher portal access role' },
        { name: 'Staff', type: 'staff', description: 'ERP Administrative Staff portal access role' },
      ];

      for (const roleInfo of erpRoles) {
        const roleExists = await strapi
          .query('plugin::users-permissions.role')
          .findOne({ where: { type: roleInfo.type } });

        if (!roleExists) {
          await strapi.query('plugin::users-permissions.role').create({
            data: {
              name: roleInfo.name,
              type: roleInfo.type,
              description: roleInfo.description,
            },
          });
          console.log(`Created ERP role: ${roleInfo.name}`);
        }
      }

      // Automatically grant permissions to 'public' and 'authenticated' roles for ERP APIs
      const erpApis = [
        'student-profile',
        'teacher-profile',
        'teaching-assignment',
        'enrollment',
        'section',
        'class',
        'academic-year',
        'subject',
        'teacher'
      ];
      const rolesToGrant = ['public', 'authenticated'];
      for (const roleType of rolesToGrant) {
        const roleObj = await strapi
          .query('plugin::users-permissions.role')
          .findOne({ where: { type: roleType } });

        if (roleObj) {
          for (const api of erpApis) {
            const actions = ['find', 'findOne', 'create', 'update', 'delete'].map(act => `api::${api}.${api}.${act}`);
            for (const action of actions) {
              const permissionExists = await strapi
                .query('plugin::users-permissions.permission')
                .findOne({ where: { role: roleObj.id, action } });

              if (!permissionExists) {
                await strapi.query('plugin::users-permissions.permission').create({
                  data: {
                    action,
                    role: roleObj.id,
                  },
                });
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('Error setting public permissions/ERP roles/ERP permissions in bootstrap:', err);
    }
  },
};

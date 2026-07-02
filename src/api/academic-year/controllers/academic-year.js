'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::academic-year.academic-year', ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body;
    const entity = await super.create(ctx);
    if (data?.isCurrent || data?.status === 'active') {
      await strapi.db.query('api::academic-year.academic-year').updateMany({
        where: { id: { $ne: entity.id } },
        data: { isCurrent: false, status: 'inactive' },
      });
    }
    return entity;
  },
  async update(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;
    const entity = await super.update(ctx);
    if (data?.isCurrent || data?.status === 'active') {
      await strapi.db.query('api::academic-year.academic-year').updateMany({
        where: { id: { $ne: parseInt(id) } },
        data: { isCurrent: false, status: 'inactive' },
      });
    }
    return entity;
  },
}));

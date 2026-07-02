'use strict';

// Custom routes for admission workflow actions.
// The core CRUD routes are provided by the default router in admission-inquiry.js.
module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/admission-inquiries/:id/move-stage',
      handler: 'admission-inquiry.moveStage',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/admission-inquiries/:id/convert-to-student',
      handler: 'admission-inquiry.convertToStudent',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::admission-inquiry.admission-inquiry', ({ strapi }) => ({

  // ---------------------------------------------------------------------------
  // POST /admission-inquiries/:id/move-stage
  // Body: { stage: string }
  // ---------------------------------------------------------------------------
  async moveStage(ctx) {
    const { id } = ctx.params;
    const { stage } = ctx.request.body;

    if (!stage) {
      return ctx.badRequest('Stage is required');
    }

    /** @type {any} */
    const admission = await strapi.entityService.findOne(
      'api::admission-inquiry.admission-inquiry',
      id
    );

    if (!admission) {
      return ctx.notFound('Admission not found');
    }

    const data = { stage };

    // Set timestamp markers based on which stage we're entering
    if (stage === 'submitted') data.submittedAt = new Date();
    if (stage === 'interview_scheduled') data.interviewAt = new Date();
    if (['accepted', 'rejected', 'enrolled'].includes(stage)) data.decisionAt = new Date();

    const updated = await strapi.entityService.update(
      'api::admission-inquiry.admission-inquiry',
      id,
      { data }
    );

    return updated;
  },

  // ---------------------------------------------------------------------------
  // POST /admission-inquiries/:id/convert-to-student
  // Creates a student-profile + enrollment record, then archives the inquiry.
  // ---------------------------------------------------------------------------
  async convertToStudent(ctx) {
    const { id } = ctx.params;

    /** @type {any} */
    const admission = await strapi.entityService.findOne(
      'api::admission-inquiry.admission-inquiry',
      id,
      { populate: ['desiredClass', 'academicYear'] }
    );

    if (!admission) {
      return ctx.notFound('Admission not found');
    }

    // Guard against duplicate student
    const existing = await strapi.entityService.findMany(
      'api::student-profile.student-profile',
      { filters: { admissionNumber: `ADM-${id}` } }
    );
    if (existing && existing.length > 0) {
      return ctx.badRequest('Student profile for this admission already exists');
    }

    // --- 1. Create student profile ---
    // student-profile required fields: admissionNumber, firstName, lastName,
    // dateOfBirth, emergencyContact
    const admissionNumber = `ADM-${id}`;
    const studentData = {
      admissionNumber,
      firstName: admission.studentName || 'Unknown',
      // parentName is the guardian — use as last name placeholder until updated by staff
      lastName: admission.parentName || 'Unknown',
      dateOfBirth: admission.dateOfBirth || null,
      // Use parent phone as emergency contact until a dedicated field is collected
      emergencyContact: admission.phone || 'N/A',
    };

    const studentProfile = await strapi.entityService.create(
      'api::student-profile.student-profile',
      { data: studentData }
    );

    // --- 2. Create enrollment ---
    // enrollment required fields: rollNumber (generated), enrollmentDate
    // Relations: studentProfile, academicYear, section (optional at this stage)
    const enrollmentData = {
      rollNumber: `${admissionNumber}-R`,
      enrollmentDate: new Date(),
      studentProfile: studentProfile.id,
      academicYear: admission.academicYear?.id || null,
    };

    const enrollment = await strapi.entityService.create(
      'api::enrollment.enrollment',
      { data: enrollmentData }
    );

    // --- 3. Mark inquiry as enrolled (status stays in its valid enum) ---
    await strapi.entityService.update(
      'api::admission-inquiry.admission-inquiry',
      id,
      { data: { stage: 'enrolled', decisionAt: new Date() } }
    );

    return { studentProfile, enrollment };
  },
}));
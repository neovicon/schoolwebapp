'use strict';

async function seedSchoolERP(strapi) {
  console.log('Seeding School ERP database...');

  // 1. Create School
  let school = await strapi.documents('api::school.school').findFirst({
    filters: { code: 'WA01' }
  });

  if (!school) {
    school = await strapi.documents('api::school.school').create({
      data: {
        name: 'Westfield Academy',
        code: 'WA01',
        email: 'info@westfield.edu',
        phone: '+1 555-0199',
        address: '123 Education Way, Westfield',
        status: 'active',
        publishedAt: new Date(),
      }
    });
    console.log('Created School: Westfield Academy');
  } else {
    console.log('School already exists:', school.name);
  }

  // 2. Create Academic Years
  let academicYear = await strapi.documents('api::academic-year.academic-year').findFirst({
    filters: { name: '2026-2027' }
  });

  if (!academicYear) {
    academicYear = await strapi.documents('api::academic-year.academic-year').create({
      data: {
        name: '2026-2027',
        startDate: '2026-09-01',
        endDate: '2027-06-30',
        isCurrent: true,
        school: school.documentId,
      }
    });
    console.log('Created Academic Year: 2026-2027');
  } else {
    console.log('Academic Year already exists:', academicYear.name);
  }

  // 3. Create Classes
  const classNames = [
    { name: 'Grade 10', code: 'G10', level: 10 },
    { name: 'Grade 11', code: 'G11', level: 11 },
    { name: 'Grade 12', code: 'G12', level: 12 },
  ];

  const classesMap = {};

  for (const c of classNames) {
    let classObj = await strapi.documents('api::class.class').findFirst({
      filters: { code: c.code, school: school.documentId }
    });

    if (!classObj) {
      classObj = await strapi.documents('api::class.class').create({
        data: {
          name: c.name,
          code: c.code,
          level: c.level,
          school: school.documentId,
        }
      });
      console.log(`Created Class: ${c.name}`);
    } else {
      console.log(`Class already exists: ${classObj.name}`);
    }
    classesMap[c.code] = classObj;
  }

  // 4. Create Sections for each Class
  const sectionsMap = {};

  for (const classCode of Object.keys(classesMap)) {
    const classObj = classesMap[classCode];
    const sectionNames = ['A', 'B'];

    for (const name of sectionNames) {
      const sectionKey = `${classCode}-${name}`;
      let sectionObj = await strapi.documents('api::section.section').findFirst({
        filters: { name, class: classObj.documentId, academicYear: academicYear.documentId }
      });

      if (!sectionObj) {
        sectionObj = await strapi.documents('api::section.section').create({
          data: {
            name,
            room: `Room ${classObj.level * 10 + (name === 'A' ? 1 : 2)}`,
            capacity: 35,
            class: classObj.documentId,
            academicYear: academicYear.documentId,
          }
        });
        console.log(`Created Section ${name} for ${classObj.name}`);
      } else {
        console.log(`Section ${name} for ${classObj.name} already exists`);
      }
      sectionsMap[sectionKey] = sectionObj;
    }
  }

  // 5. Create Students
  const studentsData = [
    {
      firstName: 'Sarah',
      lastName: 'Connor',
      admissionNumber: 'ADM-2026-001',
      dateOfBirth: '2010-05-14',
      gender: 'female',
      bloodGroup: 'O+',
      phone: '+1 555-0101',
      address: '742 Evergreen Terrace, Springfield',
      emergencyContact: 'John Connor (+1 555-0102) - Mother',
      status: 'active',
      classCode: 'G10',
      sectionName: 'A',
      rollNumber: '10A01',
    },
    {
      firstName: 'John',
      lastName: 'Doe',
      admissionNumber: 'ADM-2026-002',
      dateOfBirth: '2009-08-23',
      gender: 'male',
      bloodGroup: 'A-',
      phone: '+1 555-0103',
      address: '123 Main Street, Metropolis',
      emergencyContact: 'Robert Doe (+1 555-0104) - Father',
      status: 'active',
      classCode: 'G11',
      sectionName: 'B',
      rollNumber: '11B05',
    },
    {
      firstName: 'Emma',
      lastName: 'Watson',
      admissionNumber: 'ADM-2026-003',
      dateOfBirth: '2008-04-15',
      gender: 'female',
      bloodGroup: 'B+',
      phone: '+1 555-0105',
      address: '4 Privet Drive, Little Whinging',
      emergencyContact: 'Jean Watson (+1 555-0106) - Mother',
      status: 'active',
      classCode: 'G12',
      sectionName: 'A',
      rollNumber: '12A03',
    },
    {
      firstName: 'Peter',
      lastName: 'Parker',
      admissionNumber: 'ADM-2026-004',
      dateOfBirth: '2010-10-10',
      gender: 'male',
      bloodGroup: 'O-',
      phone: '+1 555-0107',
      address: '20 Ingram Street, Forest Hills',
      emergencyContact: 'May Parker (+1 555-0108) - Aunt',
      status: 'suspended',
      classCode: 'G10',
      sectionName: 'B',
      rollNumber: '10B12',
    },
    {
      firstName: 'Bruce',
      lastName: 'Wayne',
      admissionNumber: 'ADM-2026-005',
      dateOfBirth: '2008-02-19',
      gender: 'male',
      bloodGroup: 'AB+',
      phone: '+1 555-0109',
      address: '1007 Mountain Drive, Gotham',
      emergencyContact: 'Alfred Pennyworth (+1 555-0110) - Guardian',
      status: 'active',
      classCode: 'G12',
      sectionName: 'B',
      rollNumber: '12B01',
    }
  ];

  for (const s of studentsData) {
    let studentProfile = await strapi.documents('api::student-profile.student-profile').findFirst({
      filters: { admissionNumber: s.admissionNumber }
    });

    if (!studentProfile) {
      studentProfile = await strapi.documents('api::student-profile.student-profile').create({
        data: {
          firstName: s.firstName,
          lastName: s.lastName,
          admissionNumber: s.admissionNumber,
          dateOfBirth: s.dateOfBirth,
          gender: s.gender,
          bloodGroup: s.bloodGroup,
          phone: s.phone,
          address: s.address,
          emergencyContact: s.emergencyContact,
          status: s.status,
          school: school.documentId,
          publishedAt: new Date(),
        }
      });
      console.log(`Created Student Profile: ${s.firstName} ${s.lastName}`);

      const sectionKey = `${s.classCode}-${s.sectionName}`;
      const section = sectionsMap[sectionKey];

      if (section) {
        await strapi.documents('api::enrollment.enrollment').create({
          data: {
            rollNumber: s.rollNumber,
            enrollmentDate: '2026-06-29',
            status: 'active',
            studentProfile: studentProfile.documentId,
            section: section.documentId,
            academicYear: academicYear.documentId,
          }
        });
        console.log(`Enrolled ${s.firstName} in ${s.classCode}-${s.sectionName}`);
      }
    } else {
      console.log(`Student already exists: ${studentProfile.firstName} ${studentProfile.lastName}`);
    }
  }

  // 6. Create Subjects
  const subjectsData = [
    { name: 'Mathematics', code: 'MTH10', classCode: 'G10' },
    { name: 'English', code: 'ENG10', classCode: 'G10' },
    { name: 'Science', code: 'SCI10', classCode: 'G10' },
    { name: 'Mathematics', code: 'MTH11', classCode: 'G11' },
    { name: 'Physics', code: 'PHY11', classCode: 'G11' },
    { name: 'Chemistry', code: 'CHM11', classCode: 'G11' },
    { name: 'Mathematics', code: 'MTH12', classCode: 'G12' },
    { name: 'Physics', code: 'PHY12', classCode: 'G12' },
    { name: 'Chemistry', code: 'CHM12', classCode: 'G12' },
  ];

  const subjectsMap = {};

  for (const s of subjectsData) {
    const classObj = classesMap[s.classCode];
    if (classObj) {
      let subjectObj = await strapi.documents('api::subject.subject').findFirst({
        filters: { code: s.code }
      });

      if (!subjectObj) {
        subjectObj = await strapi.documents('api::subject.subject').create({
          data: {
            name: s.name,
            code: s.code,
            class: classObj.documentId,
          }
        });
        console.log(`Created Subject: ${s.name} (${s.code})`);
      } else {
        console.log(`Subject already exists: ${s.name} (${s.code})`);
      }
      subjectsMap[s.code] = subjectObj;
    }
  }

  // 7. Create Teachers and Teacher Profiles
  const teachersData = [
    {
      firstName: 'Walter',
      lastName: 'White',
      employeeId: 'EMP-2026-001',
      phoneNumber: '+1 555-0201',
      qualification: 'Ph.D. in Chemistry',
      joiningDate: '2026-09-01',
      status: 'active',
      gender: 'male',
      bloodGroup: 'A+',
      address: '308 Negra Arroyo Lane, Albuquerque',
      email: 'w.white@westfield.edu',
      bio: 'Ph.D. in Organic Chemistry. Specializes in advanced synthetic pathways and lab safety.',
      subjectName: 'Chemistry',
      assignments: [
        { subjectCode: 'CHM11', classCode: 'G11', sectionName: 'A' },
        { subjectCode: 'CHM12', classCode: 'G12', sectionName: 'B' }
      ]
    },
    {
      firstName: 'Minerva',
      lastName: 'McGonagall',
      employeeId: 'EMP-2026-002',
      phoneNumber: '+1 555-0202',
      qualification: 'Master of Arts in English',
      joiningDate: '2026-09-01',
      status: 'active',
      gender: 'female',
      bloodGroup: 'AB-',
      address: 'Hogwarts Castle, Scotland',
      email: 'm.mcgonagall@westfield.edu',
      bio: 'Expert in classical literature, grammar systems, and rhetoric. Dedicated to academic discipline.',
      subjectName: 'English',
      assignments: [
        { subjectCode: 'ENG10', classCode: 'G10', sectionName: 'A' },
        { subjectCode: 'ENG10', classCode: 'G10', sectionName: 'B' }
      ]
    },
    {
      firstName: 'Albert',
      lastName: 'Einstein',
      employeeId: 'EMP-2026-003',
      phoneNumber: '+1 555-0203',
      qualification: 'Ph.D. in Physics',
      joiningDate: '2026-09-01',
      status: 'active',
      gender: 'male',
      bloodGroup: 'O+',
      address: '112 Mercer Street, Princeton',
      email: 'a.einstein@westfield.edu',
      bio: 'Theoretical physicist. Passionate about mechanics, thermodynamics, and the theory of relativity.',
      subjectName: 'Physics',
      assignments: [
        { subjectCode: 'PHY11', classCode: 'G11', sectionName: 'B' },
        { subjectCode: 'PHY12', classCode: 'G12', sectionName: 'A' }
      ]
    }
  ];

  for (const t of teachersData) {
    let teacherProfile = await strapi.documents('api::teacher-profile.teacher-profile').findFirst({
      filters: { employeeId: t.employeeId }
    });

    if (!teacherProfile) {
      // Step 1: Create public website teacher
      const teacher = await strapi.documents('api::teacher.teacher').create({
        data: {
          name: `${t.firstName} ${t.lastName}`,
          email: t.email,
          subject: t.subjectName,
          bio: t.bio,
          publishedAt: new Date()
        }
      });
      console.log(`Created Teacher (public): ${t.firstName} ${t.lastName}`);

      // Step 2: Create Teacher Profile
      teacherProfile = await strapi.documents('api::teacher-profile.teacher-profile').create({
        data: {
          employeeId: t.employeeId,
          phoneNumber: t.phoneNumber,
          qualification: t.qualification,
          joiningDate: t.joiningDate,
          status: t.status,
          firstName: t.firstName,
          lastName: t.lastName,
          email: t.email,
          gender: t.gender,
          bloodGroup: t.bloodGroup,
          address: t.address,
          dateOfBirth: '1980-01-01',
          school: school.documentId,
          teacher: teacher.documentId,
          publishedAt: new Date()
        }
      });
      console.log(`Created Teacher Profile: ${t.firstName} ${t.lastName}`);

      // Step 3: Create Teaching Assignments
      for (const assign of t.assignments) {
        const subjectObj = subjectsMap[assign.subjectCode];
        const sectionKey = `${assign.classCode}-${assign.sectionName}`;
        const sectionObj = sectionsMap[sectionKey];

        if (subjectObj && sectionObj) {
          await strapi.documents('api::teaching-assignment.teaching-assignment').create({
            data: {
              status: 'active',
              teacherProfile: teacherProfile.documentId,
              subject: subjectObj.documentId,
              section: sectionObj.documentId,
              academicYear: academicYear.documentId,
              publishedAt: new Date()
            }
          });
          console.log(`Assigned ${t.firstName} to teach ${assign.subjectCode} in ${sectionKey}`);
        }
      }
    } else {
      console.log(`Teacher Profile already exists: ${teacherProfile.firstName} ${teacherProfile.lastName}`);
    }
  }

  console.log('Seeding completed successfully!');
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = 'error';

  try {
    await seedSchoolERP(app);
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await app.destroy();
  }

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

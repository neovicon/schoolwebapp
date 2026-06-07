const fs = require('fs');
const path = require('path');

const apiPath = path.join(__dirname, '../src/api');

const schemas = {
  faq: {
    kind: "collectionType",
    collectionName: "faqs",
    info: {
      singularName: "faq",
      pluralName: "faqs",
      displayName: "FAQ"
    },
    options: { draftAndPublish: true },
    attributes: {
      question: { type: "string", required: true },
      answer: { type: "text", required: true },
      category: { 
        type: "enumeration", 
        enum: ["admissions", "academics", "fees", "general"],
        default: "general"
      },
      order: { type: "integer" }
    }
  },
  notice: {
    kind: "collectionType",
    collectionName: "notices",
    info: {
      singularName: "notice",
      pluralName: "notices",
      displayName: "Notice"
    },
    options: { draftAndPublish: true },
    attributes: {
      title: { type: "string", required: true },
      body: { type: "richtext" },
      priority: {
        type: "enumeration",
        enum: ["urgent", "important", "general"],
        default: "general"
      },
      attachment: { type: "media", allowedTypes: ["files", "images"], multiple: false }
    }
  },
  download: {
    kind: "collectionType",
    collectionName: "downloads",
    info: {
      singularName: "download",
      pluralName: "downloads",
      displayName: "Download"
    },
    options: { draftAndPublish: true },
    attributes: {
      title: { type: "string", required: true },
      file: { type: "media", required: true, allowedTypes: ["files", "images"], multiple: false },
      category: {
        type: "enumeration",
        enum: ["syllabus", "forms", "circulars", "results", "other"],
        default: "other"
      },
      description: { type: "text" }
    }
  },
  "gallery-item": {
    kind: "collectionType",
    collectionName: "gallery_items",
    info: {
      singularName: "gallery-item",
      pluralName: "gallery-items",
      displayName: "Gallery Item"
    },
    options: { draftAndPublish: true },
    attributes: {
      title: { type: "string" },
      image: { type: "media", required: true, allowedTypes: ["images"], multiple: false },
      category: {
        type: "enumeration",
        enum: ["sports", "academics", "events", "campus", "other"],
        default: "other"
      }
    }
  },
  "admission-inquiry": {
    kind: "collectionType",
    collectionName: "admission_inquiries",
    info: {
      singularName: "admission-inquiry",
      pluralName: "admission-inquiries",
      displayName: "Admission Inquiry"
    },
    options: { draftAndPublish: false },
    attributes: {
      studentName: { type: "string", required: true },
      dateOfBirth: { type: "date" },
      gradeApplying: { type: "string", required: true },
      previousSchool: { type: "string" },
      parentName: { type: "string", required: true },
      relation: { type: "string" },
      phone: { type: "string", required: true },
      email: { type: "email", required: true },
      occupation: { type: "string" },
      message: { type: "text" },
      status: {
        type: "enumeration",
        enum: ["pending", "reviewing", "accepted", "rejected"],
        default: "pending"
      }
    }
  },
  message: {
    kind: "collectionType",
    collectionName: "messages",
    info: {
      singularName: "message",
      pluralName: "messages",
      displayName: "Message"
    },
    options: { draftAndPublish: false },
    attributes: {
      name: { type: "string", required: true },
      email: { type: "email", required: true },
      phone: { type: "string" },
      subject: { type: "string" },
      message: { type: "text", required: true },
      status: {
        type: "enumeration",
        enum: ["new", "read", "replied"],
        default: "new"
      }
    }
  }
};

const createJS = (name, type) => {
  if (type === 'controllers') {
    return `'use strict';\n\nconst { createCoreController } = require('@strapi/strapi').factories;\n\nmodule.exports = createCoreController('api::${name}.${name}');`;
  }
  if (type === 'routes') {
    return `'use strict';\n\nconst { createCoreRouter } = require('@strapi/strapi').factories;\n\nmodule.exports = createCoreRouter('api::${name}.${name}');`;
  }
  if (type === 'services') {
    return `'use strict';\n\nconst { createCoreService } = require('@strapi/strapi').factories;\n\nmodule.exports = createCoreService('api::${name}.${name}');`;
  }
};

Object.keys(schemas).forEach(name => {
  const dir = path.join(apiPath, name);
  const typesDir = path.join(dir, 'content-types', name);
  
  // Create directories
  ['controllers', 'routes', 'services'].forEach(type => {
    fs.mkdirSync(path.join(dir, type), { recursive: true });
    fs.writeFileSync(path.join(dir, type, `${name}.js`), createJS(name, type));
  });
  
  fs.mkdirSync(typesDir, { recursive: true });
  fs.writeFileSync(path.join(typesDir, 'schema.json'), JSON.stringify(schemas[name], null, 2));
  
  console.log(`Created ${name} schema and controller/route/service.`);
});

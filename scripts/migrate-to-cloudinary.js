const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { createStrapi } = require('@strapi/strapi');

async function run() {
  console.log('Initializing Strapi...');
  const app = await createStrapi().load();

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });

  console.log('Fetching local files from database...');
  const files = await app.db.query('plugin::upload.file').findMany({
    where: { provider: 'local' }
  });

  let migrated = 0;
  let failed = 0;
  const missing = [];

  for (const file of files) {
    try {
      const filePath = path.join(app.dirs.static.public, file.url);
      if (!fs.existsSync(filePath)) {
        console.warn(`Missing file on disk: ${filePath}`);
        missing.push(file.name);
        failed++;
        continue;
      }

      console.log(`Uploading ${file.name} to Cloudinary...`);
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: file.hash,
        resource_type: 'auto'
      });

      const newFormats = {};
      if (file.formats) {
        for (const [key, format] of Object.entries(file.formats)) {
          const formatPath = path.join(app.dirs.static.public, format.url);
          if (fs.existsSync(formatPath)) {
            const formatResult = await cloudinary.uploader.upload(formatPath, {
              public_id: `${key}_${file.hash}`,
              resource_type: 'auto'
            });
            newFormats[key] = {
              ...format,
              url: formatResult.secure_url,
              provider_metadata: {
                public_id: formatResult.public_id,
                resource_type: formatResult.resource_type
              }
            };
          } else {
            newFormats[key] = format;
          }
        }
      }

      await app.db.query('plugin::upload.file').update({
        where: { id: file.id },
        data: {
          provider: 'cloudinary',
          url: result.secure_url,
          provider_metadata: {
            public_id: result.public_id,
            resource_type: result.resource_type
          },
          formats: Object.keys(newFormats).length > 0 ? newFormats : null
        }
      });

      console.log(`Successfully migrated ${file.name}`);
      migrated++;
    } catch (err) {
      console.error(`Failed to migrate ${file.name}:`, err);
      failed++;
    }
  }

  console.log('\n--- Migration Report ---');
  console.log(`Total Media Migrated: ${migrated}`);
  console.log(`Failed Uploads: ${failed}`);
  if (missing.length > 0) {
    console.log(`Missing Local Files: ${missing.join(', ')}`);
  }
  
  app.destroy();
}

run();

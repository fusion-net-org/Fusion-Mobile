// eas-build-pre-install.js
/* global Buffer */
const fs = require('fs');
const path = require('path');

const googleServices = process.env.GOOGLE_SERVICES_JSON;
const filePath = path.join(process.cwd(), 'android', 'google-services.json');

if (googleServices) {
  console.log('📱 Writing google-services.json from EAS secret...');
  try {
    const decoded = Buffer.from(googleServices, 'base64').toString('utf8');
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, decoded);
    console.log('✅ google-services.json written successfully!');
  } catch (err) {
    console.error('❌ Failed to write google-services.json:', err);
  }
} else {
  console.warn('⚠️ GOOGLE_SERVICES_JSON not found in environment variables.');
}

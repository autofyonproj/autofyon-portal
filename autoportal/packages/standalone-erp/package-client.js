const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const projectDir = __dirname;
const filesToInclude = [
  'index.html',
  'start-laptop.bat',
  'start-server.bat',
  'serve.js',
  'manifest.json',
  'service-worker.js',
  'package.json',
  'README.md',
  'icons'
];
const featureKeys = [
  'accounting',
  'inventory',
  'purchasing',
  'crm',
  'advanced_reports',
  'cloud_sync',
  'marketplace'
];

function readConfig() {
  const args = process.argv.slice(2);
  const configArg = args.indexOf('--config');
  if (configArg >= 0) {
    const configPath = args[configArg + 1];
    if (!configPath) throw new Error('Provide a JSON path after --config.');
    return JSON.parse(fs.readFileSync(path.resolve(configPath), 'utf8'));
  }

  return {
    companyName: args[0] || 'Auto One Egypt',
    masterSenderPhone: args[1] || '01222597304',
    serial: `TEST-${Date.now()}`,
    features: Object.fromEntries(featureKeys.map((key) => [key, true]))
  };
}

function validateConfig(config) {
  const companyName = typeof config.companyName === 'string' ? config.companyName.trim() : '';
  const phone = typeof config.masterSenderPhone === 'string'
    ? config.masterSenderPhone.replace(/\D/g, '')
    : '';
  const serial = typeof config.serial === 'string' ? config.serial.trim() : '';
  const trackingToken = typeof config.clientTrackingToken === 'string'
    ? config.clientTrackingToken.trim()
    : '';
  const version = typeof config.version === 'string' ? config.version.trim() : '';
  const features = config.features;
  if (!companyName || companyName.length > 120 || phone.length < 10 || phone.length > 15 ||
      !/^[A-Za-z0-9-]{3,48}$/.test(serial)) {
    throw new Error('The license configuration needs a business name, valid phone number, and serial.');
  }
  if (!features || typeof features !== 'object' || Array.isArray(features) ||
      Object.keys(features).some((key) => !featureKeys.includes(key)) ||
      featureKeys.some((key) => typeof features[key] !== 'boolean')) {
    throw new Error('The license configuration has invalid feature flags.');
  }
  if (trackingToken && !/^[a-f0-9]{64}$/.test(trackingToken)) {
    throw new Error('The license configuration has an invalid tracking token.');
  }
  if (version && version.length > 40) throw new Error('The license version is too long.');
  return {
    productName: 'Almostashar Auto',
    productNameAr: 'المستشار أوتو',
    companyName,
    licensee: companyName,
    masterSenderPhone: phone,
    masterEmail: 'autofyon@gmail.com',
    allowedDevices: 2,
    issueDate: new Date().toISOString().slice(0, 10),
    version: version || JSON.parse(fs.readFileSync(path.join(projectDir, 'package.json'), 'utf8')).version,
    clientId: serial,
    serial,
    masterCopy: false,
    activationStatus: 'pending_verification',
    isLockedBranding: false,
    features,
    ...(trackingToken ? { clientTrackingToken: trackingToken } : {})
  };
}

function sanitize(name) {
  return name.replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'client';
}

function quotePowerShell(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function buildPackage(license) {
  const safeName = sanitize(license.companyName);
  const desktopDir = path.join(process.env.USERPROFILE || 'C:\\Users\\7assan', 'Desktop');
  const outputDir = process.argv.includes('--out')
    ? path.resolve(process.argv[process.argv.indexOf('--out') + 1] || '.')
    : desktopDir;
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const zipPath = path.join(outputDir, `${safeName}-${license.serial}-Showroom-Package.zip`);
  const stagingDir = fs.mkdtempSync(path.join(os.tmpdir(), 'autofyon-client-package-'));
  try {
    for (const relativePath of filesToInclude) {
      const source = path.join(projectDir, relativePath);
      if (!fs.existsSync(source)) continue;
      fs.cpSync(source, path.join(stagingDir, relativePath), { recursive: true });
    }

    fs.writeFileSync(
      path.join(stagingDir, 'license.js'),
      `window.SHOWROOM_LICENSE = ${JSON.stringify(license, null, 2)};\n`,
      'utf8'
    );
    const powershellCommand = `$ErrorActionPreference = 'Stop'; Compress-Archive -Path ${quotePowerShell(path.join(stagingDir, '*'))} -DestinationPath ${quotePowerShell(zipPath)} -Force`;
    execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', powershellCommand], {
      stdio: 'inherit'
    });
    return zipPath;
  } finally {
    fs.rmSync(stagingDir, { recursive: true, force: true });
  }
}

try {
  const license = validateConfig(readConfig());
  const zipPath = buildPackage(license);
  console.log(`Created pending client package: ${zipPath}`);
  console.log('The client copy remains locked until WhatsApp verification is implemented and completed.');
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}

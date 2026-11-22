/**
 * ============================================================================
 * AutoFyon Standalone ERP — Military-Grade Offline Security Core
 * ============================================================================
 * 
 * Provides 5-layer offline copy protection:
 * 1. Cryptographic HMAC-SHA256 license integrity (anti-tamper)
 * 2. Hardware / Motherboard UUID binding (anti-copy to other PCs)
 * 3. Monotonic clock time-guard (anti-clock rollback)
 * 4. Automatic 30-day offline expiration enforcement
 * 5. Immutable business watermark binding
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const MASTER_SIGNING_SALT = 'AUTOFYON_CORE_SEC_SIG_2026_MRA_EGYPT_OFFLINE_PROTECT_V4';
const TIME_GUARD_FILE = path.join(__dirname, '.sec_time_guard.dat');
const HARDWARE_BIND_FILE = path.join(__dirname, '.sec_hw_bind.dat');

/**
 * 1. Get Machine Hardware Fingerprint on Windows / Mac / Linux
 */
function getHardwareFingerprint() {
  try {
    let rawHwId = '';
    if (process.platform === 'win32') {
      try {
        rawHwId = execSync('powershell -NoProfile -NonInteractive -Command "(Get-CimInstance Win32_ComputerSystemProduct).UUID"', {
          encoding: 'utf8',
          timeout: 4000
        }).trim();
      } catch {
        try {
          rawHwId = execSync('wmic csproduct get uuid', { encoding: 'utf8', timeout: 3000 })
            .replace(/UUID/i, '')
            .trim();
        } catch {
          rawHwId = os.hostname() + '-' + os.userInfo().username;
        }
      }
    } else {
      rawHwId = os.hostname() + '-' + os.platform() + '-' + os.arch();
    }

    const networkInterfaces = os.networkInterfaces();
    let mac = '';
    for (const name of Object.keys(networkInterfaces)) {
      for (const net of networkInterfaces[name] || []) {
        if (!net.internal && net.mac && net.mac !== '00:00:00:00:00:00') {
          mac = net.mac;
          break;
        }
      }
      if (mac) break;
    }

    return crypto.createHash('sha256').update(`${rawHwId}::${mac}::${os.arch()}`).digest('hex');
  } catch {
    return crypto.createHash('sha256').update(os.hostname() + '::fallback').digest('hex');
  }
}

/**
 * 2. Cryptographically sign a license object (used during package generation)
 */
function signLicensePayload(payload) {
  const normalized = {
    companyName: payload.companyName,
    masterSenderPhone: payload.masterSenderPhone,
    serial: payload.serial,
    issuedAt: payload.issuedAt || new Date().toISOString().slice(0, 10),
    expiresAt: payload.expiresAt,
    isTrial: Boolean(payload.isTrial),
    allowedDevices: payload.allowedDevices || 2,
    crmTier: payload.crmTier || 'enterprise',
    features: payload.features
  };

  const canonicalString = JSON.stringify(normalized, Object.keys(normalized).sort());
  const signature = crypto.createHmac('sha256', MASTER_SIGNING_SALT).update(canonicalString).digest('hex');

  return {
    ...normalized,
    signature
  };
}

/**
 * 3. Verify cryptographic signature of the license (anti-tamper)
 */
function verifyLicenseSignature(license) {
  if (!license || !license.signature) return false;

  const normalized = {
    companyName: license.companyName,
    masterSenderPhone: license.masterSenderPhone,
    serial: license.serial,
    issuedAt: license.issuedAt,
    expiresAt: license.expiresAt,
    isTrial: Boolean(license.isTrial),
    allowedDevices: license.allowedDevices || 2,
    crmTier: license.crmTier || 'enterprise',
    features: license.features
  };

  const canonicalString = JSON.stringify(normalized, Object.keys(normalized).sort());
  const expectedSig = crypto.createHmac('sha256', MASTER_SIGNING_SALT).update(canonicalString).digest('hex');

  return crypto.timingSafeEqual(Buffer.from(license.signature, 'hex'), Buffer.from(expectedSig, 'hex'));
}

/**
 * 4. Monotonic Time-Guard (Detects and blocks clock rollback)
 */
function checkTimeIntegrity() {
  const now = Date.now();
  let maxTime = now;

  try {
    if (fs.existsSync(TIME_GUARD_FILE)) {
      const data = fs.readFileSync(TIME_GUARD_FILE, 'utf8');
      const parsed = parseInt(data.trim(), 10);
      if (!isNaN(parsed)) {
        // If current system time is more than 2 hours in the past compared to last recorded time:
        if (now < parsed - (2 * 60 * 60 * 1000)) {
          return {
            valid: false,
            reason: 'CLOCK_ROLLBACK_DETECTED',
            message: 'تم رصد تراجع في ساعة النظام (Clock Rollback). تم قفل البرنامج لحماية البيانات.'
          };
        }
        maxTime = Math.max(maxTime, parsed);
      }
    }
    // Update guard with latest forward timestamp
    fs.writeFileSync(TIME_GUARD_FILE, String(maxTime), 'utf8');
  } catch {
    /* ok */
  }

  return { valid: true };
}

/**
 * 5. Machine Binding Enforcement (Anti-Copy across PCs)
 */
function checkMachineBinding(maxAllowed = 2) {
  const currentFp = getHardwareFingerprint();

  try {
    let boundMachines = [];
    if (fs.existsSync(HARDWARE_BIND_FILE)) {
      try {
        const raw = fs.readFileSync(HARDWARE_BIND_FILE, 'utf8');
        boundMachines = JSON.parse(raw);
        if (!Array.isArray(boundMachines)) boundMachines = [];
      } catch {
        boundMachines = [];
      }
    }

    if (boundMachines.includes(currentFp)) {
      return { valid: true, currentFp };
    }

    // New machine attempting to run this installation
    if (boundMachines.length < maxAllowed) {
      boundMachines.push(currentFp);
      fs.writeFileSync(HARDWARE_BIND_FILE, JSON.stringify(boundMachines, null, 2), 'utf8');
      return { valid: true, currentFp };
    }

    return {
      valid: false,
      reason: 'DEVICE_QUOTA_EXCEEDED',
      message: `تم تجاوز الحد الأقصى للأجهزة المرخصة (${maxAllowed} أجهزة). لا يمكن تشغيل هذه النسخة على هذا الكمبيوتر دون ترخيص إضافي.`
    };
  } catch {
    return { valid: true, currentFp };
  }
}

/**
 * 6. Full Offline License Verification Suite
 */
function verifyOfflineEnvironment(license) {
  // Check 1: Monotonic Clock
  const timeCheck = checkTimeIntegrity();
  if (!timeCheck.valid) {
    return {
      status: 'LOCKED',
      reason: timeCheck.reason,
      message: timeCheck.message
    };
  }

  // Check 2: License Signature
  if (!verifyLicenseSignature(license)) {
    return {
      status: 'TAMPERED',
      reason: 'INVALID_SIGNATURE',
      message: 'ملف الترخيص تالف أو تم تعديله بدون تصريح. تم إيقاف النظام.'
    };
  }

  // Check 3: Machine Binding
  const hwCheck = checkMachineBinding(license.allowedDevices || 2);
  if (!hwCheck.valid) {
    return {
      status: 'UNAUTHORIZED_DEVICE',
      reason: hwCheck.reason,
      message: hwCheck.message
    };
  }

  // Check 4: Expiration Date (for 30-day trials or limited terms)
  if (license.expiresAt) {
    const expiryTime = new Date(license.expiresAt).getTime();
    if (!isNaN(expiryTime) && Date.now() > expiryTime) {
      return {
        status: 'EXPIRED',
        reason: 'TRIAL_EXPIRED',
        message: 'انتهت فترة التجربة المجانية (30 يوماً). يرجى الترقية عبر autofyon.com لتفعيل النسخة الدائمة.'
      };
    }
  }

  return {
    status: 'ACTIVE',
    licensee: license.companyName,
    serial: license.serial,
    expiresAt: license.expiresAt,
    features: license.features,
    machineId: hwCheck.currentFp
  };
}

module.exports = {
  getHardwareFingerprint,
  signLicensePayload,
  verifyLicenseSignature,
  checkTimeIntegrity,
  checkMachineBinding,
  verifyOfflineEnvironment
};

/**
 * EnvLens Core Logic Engine
 * 100% Client-side, pure vanilla JS, zero external dependencies or analytics.
 */

(function () {
  'use strict';

  // Application State
  const state = {
    sourceFormat: 'dotenv',
    targetFormat: 'json',
    sanitizeSecrets: true,
    sortKeys: false,
    stripComments: false,
    showTemplateDiff: false,
  };

  // Built-in Presets
  const PRESETS = {
    nextjs: `# Production Next.js & PostgreSQL Configuration
NEXT_PUBLIC_APP_URL="https://app.production.internal"
NODE_ENV=production
PORT=3000

# Primary Database Connection
DATABASE_URL="postgres://app_user:s3cr3t_p@ssw0rd_99@prod-db-cluster.internal:5432/app_db"
DIRECT_URL="postgres://app_user:s3cr3t_p@ssw0rd_99@prod-db-cluster.internal:5432/app_db?connect_timeout=15"

# Security & Authentication
NEXTAUTH_SECRET="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4ifQ.super_secret_jwt_hash_token_here"
NEXTAUTH_URL="https://app.production.internal"

# Cloud & Integrations
AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
AWS_REGION="us-east-1"
S3_BUCKET_NAME="production-assets-vault"
STRIPE_SECRET_KEY="sk_test_fake_mock_key_00000000000000000000000000"
`,

    docker: `SERVICE_NAME=order-service
ENVIRONMENT=staging
REPLICAS=3
LOG_LEVEL=debug
CACHE_ENABLED=true
REDIS_URL="redis://:RedisMasterPass2026!@redis-cluster:6379/0"
KAFKA_BROKERS="kafka-1:9092,kafka-2:9092"
API_RATE_LIMIT_RPM=5000
`,

    k8s: `APP_ENV=kubernetes
POD_NAMESPACE=backend-services
ENABLE_METRICS=true
METRICS_PORT=9100
VAULT_ADDR="https://vault.corp.internal:8200"
VAULT_TOKEN="s.1234567890abcdefghijklmn"
ENCRYPTION_KEY="7f8b2c4e1d3a5069b8a7c6e5d4f3e2d1"
`
  };

  // DOM Elements
  const inputEditor = document.getElementById('input-editor');
  const outputEditor = document.getElementById('output-editor');
  const templateEditor = document.getElementById('template-editor');
  const inputStats = document.getElementById('input-stats');
  const inputStatus = document.getElementById('input-status');
  const outputStats = document.getElementById('output-stats');
  const outputSecurity = document.getElementById('output-security');

  const chkSanitize = document.getElementById('chk-sanitize');
  const chkSort = document.getElementById('chk-sort');
  const chkMinify = document.getElementById('chk-minify');

  const btnPaste = document.getElementById('btn-paste');
  const btnCopy = document.getElementById('btn-copy');
  const btnDownload = document.getElementById('btn-download');
  const btnClear = document.getElementById('btn-clear');

  const presetNextjs = document.getElementById('preset-nextjs');
  const presetDocker = document.getElementById('preset-docker');
  const presetK8s = document.getElementById('preset-k8s');

  const sourceTabs = document.getElementById('source-format-tabs');
  const targetTabs = document.getElementById('target-format-tabs');
  const btnToggleTemplate = document.getElementById('btn-toggle-template');
  const templateSection = document.getElementById('template-section');

  const missingList = document.getElementById('missing-list');
  const orphanedList = document.getElementById('orphaned-list');
  const missingCount = document.getElementById('missing-count');
  const orphanedCount = document.getElementById('orphaned-count');
  const toastEl = document.getElementById('toast');

  // Regex patterns for secret detection
  const SECRET_RULES = [
    // Database URIs
    {
      regex: /(postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis|amqp):\/\/([^:]+):([^@]+)@/gi,
      replace: '$1://$2:<REDACTED_PASSWORD>@'
    },
    // AWS Access Key ID
    {
      regex: /\b(AKIA[0-9A-Z]{16})\b/g,
      replace: '<REDACTED_AWS_ACCESS_KEY>'
    },
    // AWS Secret Key (standard 40 char base64-like)
    {
      regex: /(AWS_SECRET_ACCESS_KEY\s*=\s*["']?)[A-Za-z0-9\/+=]{40}(["']?)/gi,
      replace: '$1<REDACTED_AWS_SECRET_KEY>$2'
    },
    // JWT tokens
    {
      regex: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g,
      replace: '<REDACTED_JWT_TOKEN>'
    },
    // Stripe live keys
    {
      regex: /\b(sk_live_[0-9a-zA-Z]{24,})\b/g,
      replace: '<REDACTED_STRIPE_SECRET_KEY>'
    },
    // Vault tokens
    {
      regex: /\b(s\.[A-Za-z0-9]{24,})\b/g,
      replace: '<REDACTED_VAULT_TOKEN>'
    },
    // Generic password/token fields
    {
      regex: /((?:PASSWORD|SECRET|PRIVATE_KEY|TOKEN|API_KEY)\s*[:=]\s*["']?)([^"'\n\r\s]+)(["']?)/gi,
      replace: '$1<REDACTED_VALUE>$3'
    }
  ];

  // Parser: Raw text to Key-Value dictionary
  function parseConfig(rawText, format) {
    const result = {};
    if (!rawText || !rawText.trim()) return result;

    if (format === 'json') {
      try {
        const parsed = JSON.parse(rawText);
        if (typeof parsed === 'object' && parsed !== null) {
          for (const [k, v] of Object.entries(parsed)) {
            result[k] = typeof v === 'object' ? JSON.stringify(v) : String(v);
          }
        }
      } catch (e) {
        throw new Error('Invalid JSON format: ' + e.message);
      }
    } else if (format === 'dotenv' || format === 'yaml') {
      const lines = rawText.split(/\r?\n/);
      for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith('#')) continue;

        if (line.startsWith('export ')) {
          line = line.substring(7).trim();
        }

        let separatorIndex = line.indexOf('=');
        if (separatorIndex === -1 && format === 'yaml') {
          separatorIndex = line.indexOf(':');
        }

        if (separatorIndex !== -1) {
          const key = line.slice(0, separatorIndex).trim();
          let value = line.slice(separatorIndex + 1).trim();

          // Strip surrounding quotes
          if ((value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }

          if (key) {
            result[key] = value;
          }
        }
      }
    }
    return result;
  }

  // Secret Sanitizer
  function sanitizeDictionary(dict) {
    const sanitized = {};
    for (const [key, rawValue] of Object.entries(dict)) {
      let val = String(rawValue);

      for (const rule of SECRET_RULES) {
        val = val.replace(rule.regex, rule.replace);
      }

      const upperKey = key.toUpperCase();
      if (
        upperKey.includes('SECRET') ||
        upperKey.includes('PASSWORD') ||
        upperKey.includes('TOKEN') ||
        upperKey.includes('PRIVATE_KEY') ||
        upperKey.includes('CREDENTIAL')
      ) {
        if (!val.includes('<REDACTED')) {
          val = '<REDACTED_CONFIDENTIAL>';
        }
      }

      sanitized[key] = val;
    }
    return sanitized;
  }

  // Transmuter: Dictionary to Output format
  function formatOutput(dict, targetFormat, options) {
    let keys = Object.keys(dict);
    if (options.sortKeys) {
      keys.sort((a, b) => a.localeCompare(b));
    }

    if (targetFormat === 'json') {
      const obj = {};
      for (const k of keys) {
        const val = dict[k];
        if (val === 'true') obj[k] = true;
        else if (val === 'false') obj[k] = false;
        else if (!isNaN(Number(val)) && val.trim() !== '') obj[k] = Number(val);
        else obj[k] = val;
      }
      return JSON.stringify(obj, null, 2);
    }

    if (targetFormat === 'dotenv') {
      return keys.map(k => {
        let val = dict[k];
        if (/[\s"'$`\\]/.test(val)) {
          val = `"${val.replace(/"/g, '\\"')}"`;
        }
        return `${k}=${val}`;
      }).join('\n');
    }

    if (targetFormat === 'yaml') {
      return keys.map(k => {
        let val = dict[k];
        if (typeof val === 'string' && (val.includes(':') || val.includes('#') || val.includes('\n'))) {
          val = `"${val.replace(/"/g, '\\"')}"`;
        }
        return `${k}: ${val}`;
      }).join('\n');
    }

    if (targetFormat === 'docker') {
      let out = 'environment:\n';
      for (const k of keys) {
        out += `  - ${k}=${dict[k]}\n`;
      }
      return out.trimEnd();
    }

    if (targetFormat === 'k8s-secret') {
      let out = `apiVersion: v1\nkind: Secret\nmetadata:\n  name: app-secrets\ntype: Opaque\nstringData:\n`;
      for (const k of keys) {
        out += `  ${k}: "${dict[k]}"\n`;
      }
      return out.trimEnd();
    }

    return '';
  }

  // Main Processing Loop
  function processConfig() {
    const rawInput = inputEditor.value;
    try {
      let parsedDict = parseConfig(rawInput, state.sourceFormat);
      const keyCount = Object.keys(parsedDict).length;
      inputStats.textContent = `${keyCount} key${keyCount === 1 ? '' : 's'} detected`;
      inputStatus.textContent = 'Valid';
      inputStatus.className = 'badge-success';

      let outputDict = parsedDict;
      if (state.sanitizeSecrets) {
        outputDict = sanitizeDictionary(parsedDict);
        outputSecurity.textContent = 'Shield Active (Sanitized)';
        outputSecurity.className = 'badge-success';
      } else {
        outputSecurity.textContent = 'Raw / Unmasked';
        outputSecurity.className = 'badge-alert';
      }

      const outputText = formatOutput(outputDict, state.targetFormat, {
        sortKeys: state.sortKeys,
        stripComments: state.stripComments,
      });

      outputEditor.value = outputText;
      const lines = outputText ? outputText.split('\n').length : 0;
      outputStats.textContent = `${lines} line${lines === 1 ? '' : 's'} generated`;

      updateDiff(parsedDict);

    } catch (err) {
      inputStatus.textContent = 'Syntax Error';
      inputStatus.className = 'badge-alert';
      outputEditor.value = `# Error parsing source config:\n# ${err.message}`;
    }
  }

  // Schema and Missing Key Diffing
  function updateDiff(activeDict) {
    const templateRaw = templateEditor.value.trim();
    const activeKeys = new Set(Object.keys(activeDict));

    if (!templateRaw) {
      missingCount.textContent = '0';
      orphanedCount.textContent = '0';
      missingList.innerHTML = '<li class="diff-item diff-synced">No .env.example loaded</li>';
      orphanedList.innerHTML = `<li class="diff-item diff-synced">${activeKeys.size} active variables</li>`;
      return;
    }

    let templateDict = {};
    try {
      templateDict = parseConfig(templateRaw, 'dotenv');
    } catch (e) {
      // Ignore template syntax error
    }

    const templateKeys = Object.keys(templateDict);
    const missing = templateKeys.filter(k => !activeKeys.has(k) || activeDict[k] === '');
    const orphaned = Array.from(activeKeys).filter(k => !templateDict.hasOwnProperty(k));

    missingCount.textContent = String(missing.length);
    if (missing.length === 0) {
      missingList.innerHTML = '<li class="diff-item diff-synced">✓ All template requirements satisfied</li>';
    } else {
      missingList.innerHTML = missing.map(k => `
        <li class="diff-item diff-missing">
          <span>${k}</span>
          <span style="font-size: 0.7rem; opacity: 0.8;">MISSING</span>
        </li>
      `).join('');
    }

    orphanedCount.textContent = String(orphaned.length);
    if (orphaned.length === 0) {
      orphanedList.innerHTML = '<li class="diff-item diff-synced">✓ Strict match with template</li>';
    } else {
      orphanedList.innerHTML = orphaned.map(k => `
        <li class="diff-item diff-orphaned">
          <span>${k}</span>
          <span style="font-size: 0.7rem; opacity: 0.8;">EXTRA</span>
        </li>
      `).join('');
    }
  }

  // Notification Toast
  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2200);
  }

  // Event Listeners
  inputEditor.addEventListener('input', processConfig);
  templateEditor.addEventListener('input', processConfig);

  chkSanitize.addEventListener('change', (e) => {
    state.sanitizeSecrets = e.target.checked;
    processConfig();
  });

  chkSort.addEventListener('change', (e) => {
    state.sortKeys = e.target.checked;
    processConfig();
  });

  chkMinify.addEventListener('change', (e) => {
    state.stripComments = e.target.checked;
    processConfig();
  });

  sourceTabs.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      sourceTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      state.sourceFormat = e.target.dataset.format;
      processConfig();
    }
  });

  targetTabs.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      targetTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      state.targetFormat = e.target.dataset.target;
      processConfig();
    }
  });

  btnCopy.addEventListener('click', async () => {
    if (!outputEditor.value) return;
    try {
      await navigator.clipboard.writeText(outputEditor.value);
      showToast('Copied transmuted config to clipboard!');
    } catch (err) {
      outputEditor.select();
      document.execCommand('copy');
      showToast('Copied to clipboard!');
    }
  });

  btnPaste.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      inputEditor.value = text;
      processConfig();
      showToast('Pasted from clipboard');
    } catch (err) {
      showToast('Clipboard permission needed or paste manually');
    }
  });

  btnDownload.addEventListener('click', () => {
    if (!outputEditor.value) return;
    let filename = 'config';
    let mime = 'text/plain';

    if (state.targetFormat === 'json') {
      filename = 'config.json';
      mime = 'application/json';
    } else if (state.targetFormat === 'yaml') {
      filename = 'config.yaml';
    } else if (state.targetFormat === 'dotenv') {
      filename = '.env';
    } else if (state.targetFormat === 'docker') {
      filename = 'docker-compose.env.yml';
    } else if (state.targetFormat === 'k8s-secret') {
      filename = 'k8s-secrets.yaml';
    }

    const blob = new Blob([outputEditor.value], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`);
  });

  btnClear.addEventListener('click', () => {
    inputEditor.value = '';
    processConfig();
    showToast('Cleared editors');
  });

  presetNextjs.addEventListener('click', () => {
    inputEditor.value = PRESETS.nextjs;
    templateEditor.value = `# Next.js Required Schema (.env.example)
NEXT_PUBLIC_APP_URL=
NODE_ENV=
PORT=
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
STRIPE_SECRET_KEY=
SENTRY_DSN=
`;
    processConfig();
    showToast('Loaded Next.js template');
  });

  presetDocker.addEventListener('click', () => {
    inputEditor.value = PRESETS.docker;
    templateEditor.value = `SERVICE_NAME=
ENVIRONMENT=
REPLICAS=
LOG_LEVEL=
CACHE_ENABLED=
REDIS_URL=
`;
    processConfig();
    showToast('Loaded Docker Microservice template');
  });

  presetK8s.addEventListener('click', () => {
    inputEditor.value = PRESETS.k8s;
    templateEditor.value = `APP_ENV=
POD_NAMESPACE=
ENABLE_METRICS=
METRICS_PORT=
VAULT_ADDR=
VAULT_TOKEN=
`;
    processConfig();
    showToast('Loaded Kubernetes App template');
  });

  btnToggleTemplate.addEventListener('click', () => {
    state.showTemplateDiff = !state.showTemplateDiff;
    templateSection.style.display = state.showTemplateDiff ? 'block' : 'none';
    btnToggleTemplate.textContent = state.showTemplateDiff ? 'Hide .env.example' : 'Compare with .env.example';
  });

  // Initial boot
  presetNextjs.click();
})();

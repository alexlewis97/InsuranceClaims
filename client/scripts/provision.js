/**
 * Build-time provisioning script.
 * Calls the existing create-table-runner Edge Function to ensure tables exist.
 * 
 * Usage: node scripts/provision.js
 * Requires: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';


const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnvIfPresent() {
  const envPath = resolve(__dirname, '..', '.env');

  if (!existsSync(envPath)) {
    return; // Cloud / CI / Vercel — totally fine
  }

  const content = readFileSync(envPath, 'utf-8');

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const [key, ...rest] = trimmed.split('=');
    const value = rest.join('=').trim();

    // Do NOT overwrite already-set env vars
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

// Load local .env if it exists
loadEnvIfPresent();

// Now always read from process.env
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('ERROR: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const schemas = [
  {
    schema: 'public',
    table: 'profiles',
    if_not_exists: true,
    columns: [
      { name: 'id', type: 'uuid', primary_key: true },
      { name: 'name', type: 'text', nullable: false },
      { name: 'role', type: 'text', nullable: false, default: "'user'" },
      { name: 'created_at', type: 'timestamptz', default: 'now()' },
    ],
  },
  {
    schema: 'public',
    table: 'claims',
    if_not_exists: true,
    columns: [
      { name: 'id', type: 'uuid', default: 'gen_random_uuid()', primary_key: true },
      { name: 'user_id', type: 'uuid', nullable: false },
      { name: 'policy_number', type: 'text', nullable: false },
      { name: 'incident_date', type: 'date', nullable: false },
      { name: 'description', type: 'text', nullable: false },
      { name: 'damage_estimate', type: 'numeric(10,2)' },
      { name: 'status', type: 'text', nullable: false, default: "'pending'" },
      { name: 'admin_notes', type: 'text' },
      { name: 'created_at', type: 'timestamptz', default: 'now()' },
      { name: 'updated_at', type: 'timestamptz', default: 'now()' },
    ],
  },
];

async function provisionTable(schema) {
  const url = `${SUPABASE_URL}/functions/v1/create-table-runner`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(schema),
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(`Failed to provision ${schema.table}: ${body.error || res.statusText}`);
  }
  return body;
}

async function main() {
  console.log('Provisioning tables...');
  for (const schema of schemas) {
    try {
      await provisionTable(schema);
      console.log(`  ✓ ${schema.schema}.${schema.table}`);
    } catch (err) {
      console.error(`  ✗ ${schema.schema}.${schema.table}: ${err.message}`);
      process.exit(1);
    }
  }
  console.log('Provisioning complete.');
}

main();

export const profilesSchema = {
  schema: 'public',
  table: 'profiles',
  if_not_exists: true,
  columns: [
    { name: 'id', type: 'uuid', primary_key: true },
    { name: 'name', type: 'text', nullable: false },
    { name: 'role', type: 'text', nullable: false, default: "'user'" },
    { name: 'created_at', type: 'timestamptz', default: 'now()' },
  ],
};

export const claimsSchema = {
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
};

export const allSchemas = [profilesSchema, claimsSchema];

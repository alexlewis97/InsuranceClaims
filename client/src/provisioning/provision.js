import { supabase } from '../services/supabase';

export async function provisionTable(schemaPayload) {
  const { data, error } = await supabase.functions.invoke('create-table-runner', {
    body: schemaPayload,
  });

  if (error) {
    console.error('Provisioning failed:', error);
    throw error;
  }
  console.log('Table provisioned:', data);
  return data;
}

export async function provisionAll(schemas) {
  const results = [];
  for (const schema of schemas) {
    const result = await provisionTable(schema);
    results.push({ table: schema.table, ...result });
  }
  return results;
}

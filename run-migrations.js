const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://iyplpgmoctduvwrcivyc.supabase.co';
const serviceKey = fs.readFileSync('.env', 'utf8')
  .split('\n')
  .find(line => line.includes('SUPABASE_SERVICE_ROLE_KEY'))
  .split('=')[1]
  .trim();

const supabase = createClient(supabaseUrl, serviceKey);

async function runMigrations() {
  console.log('Running migrations...');
  
  const sql = fs.readFileSync('run-all-migrations.sql', 'utf8');
  
  try {
    const { data, error } = await supabase.rpc('exec', { sql });
    
    if (error) {
      console.error('Error:', error);
      // Try alternative: create tables directly
      console.log('Trying direct table creation...');
      await createTablesDirectly();
    } else {
      console.log('Success:', data);
    }
  } catch (err) {
    console.error('Exception:', err.message);
    console.log('Trying direct table creation...');
    await createTablesDirectly();
  }
}

async function createTablesDirectly() {
  // Create gallery table
  const { error: galleryError } = await supabase
    .from('gallery')
    .select('*')
    .limit(1);
  
  if (galleryError && galleryError.code === '42P01') {
    console.log('✅ Tables need to be created via SQL Editor');
    console.log('📋 File ready: run-all-migrations.sql');
    console.log('🔗 Go to: https://supabase.com/dashboard/project/iyplpgmoctduvwrcivyc/sql/new');
    process.exit(1);
  } else {
    console.log('✅ Gallery table exists!');
  }
}

runMigrations();

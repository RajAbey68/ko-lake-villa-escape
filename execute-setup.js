#!/usr/bin/env node

import fs from 'fs';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const SUPABASE_URL = 'https://zctpyveoakvbrrjmviqg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdHB5dmVvYWt2YnJyam12aXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNDgyMTMsImV4cCI6MjA3MTcyNDIxM30.rgB4Cy_ktvQ9Dq0KmpX7IrM5vVqZW4HgtwiqulkV3Rg';

// Read the SQL file
const sql = fs.readFileSync('COMPLETE_SETUP.sql', 'utf8');

// Execute SQL via Supabase REST API
const url = new URL('/rest/v1/rpc/exec_sql', SUPABASE_URL);

const postData = JSON.stringify({ query: sql });

const options = {
  hostname: url.hostname,
  port: 443,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🚀 Executing COMPLETE_SETUP.sql against Supabase...\n');

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Response: ${data}\n`);
    
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('✅ SQL executed successfully!');
      console.log('\nNext steps:');
      console.log('1. Visit https://supabase.com/dashboard/project/zctpyveoakvbrrjmviqg/storage/buckets');
      console.log('2. Verify "gallery" bucket exists');
      console.log('3. Test upload at your /upload route');
      console.log('4. View gallery at your /gallery route');
    } else {
      console.log('❌ SQL execution failed');
      console.log('Manual fix: Copy COMPLETE_SETUP.sql to Supabase SQL Editor and run it there');
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Request failed: ${e.message}`);
  console.log('\n📋 MANUAL FIX:');
  console.log('1. Go to https://supabase.com/dashboard/project/zctpyveoakvbrrjmviqg/sql/new');
  console.log('2. Copy/paste COMPLETE_SETUP.sql');
  console.log('3. Click Run');
});

req.write(postData);
req.end();

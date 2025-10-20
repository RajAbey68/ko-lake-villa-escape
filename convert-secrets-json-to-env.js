#!/usr/bin/env node
/**
 * Convert Replit JSON secrets to .env format
 * Usage: node convert-secrets-json-to-env.js secrets.json
 */

const fs = require('fs');

// Check if JSON file provided
const jsonFile = process.argv[2];

if (!jsonFile) {
  console.log('Usage: node convert-secrets-json-to-env.js <secrets.json>');
  console.log('');
  console.log('Or paste JSON and press Ctrl+D:');
  
  let jsonInput = '';
  process.stdin.on('data', chunk => jsonInput += chunk);
  process.stdin.on('end', () => {
    try {
      const secrets = JSON.parse(jsonInput);
      convertToEnv(secrets);
    } catch (err) {
      console.error('Error parsing JSON:', err.message);
      process.exit(1);
    }
  });
  return;
}

// Read JSON file
try {
  const jsonData = fs.readFileSync(jsonFile, 'utf8');
  const secrets = JSON.parse(jsonData);
  convertToEnv(secrets);
} catch (err) {
  console.error('Error reading file:', err.message);
  process.exit(1);
}

function convertToEnv(secrets) {
  console.log('# ==========================================');
  console.log('# Environment Variables from Replit JSON');
  console.log('# Generated:', new Date().toISOString());
  console.log('# ==========================================');
  console.log('');
  
  // Organize secrets by category
  const categories = {
    'SUPABASE': [],
    'GUESTY': [],
    'OPENAI': [],
    'STRIPE': [],
    'DATABASE': [],
    'GITHUB': [],
    'SENDGRID': [],
    'SESSION': [],
    'STORAGE': [],
    'OTHER': []
  };
  
  Object.entries(secrets).forEach(([key, value]) => {
    if (key.includes('SUPABASE')) categories['SUPABASE'].push([key, value]);
    else if (key.includes('GUESTY')) categories['GUESTY'].push([key, value]);
    else if (key.includes('OPENAI')) categories['OPENAI'].push([key, value]);
    else if (key.includes('STRIPE')) categories['STRIPE'].push([key, value]);
    else if (key.includes('PG') || key.includes('DATABASE')) categories['DATABASE'].push([key, value]);
    else if (key.includes('GITHUB')) categories['GITHUB'].push([key, value]);
    else if (key.includes('SENDGRID')) categories['SENDGRID'].push([key, value]);
    else if (key.includes('SESSION')) categories['SESSION'].push([key, value]);
    else if (key.includes('STORAGE') || key.includes('BUCKET')) categories['STORAGE'].push([key, value]);
    else categories['OTHER'].push([key, value]);
  });
  
  // Print organized output
  Object.entries(categories).forEach(([category, secrets]) => {
    if (secrets.length > 0) {
      console.log(`# ${category}`);
      secrets.forEach(([key, value]) => {
        // Handle values with spaces or special characters
        const needsQuotes = typeof value === 'string' && (
          value.includes(' ') || 
          value.includes('#') || 
          value.includes('$') ||
          value.includes('"')
        );
        
        if (needsQuotes) {
          console.log(`${key}="${value}"`);
        } else {
          console.log(`${key}=${value}`);
        }
      });
      console.log('');
    }
  });
  
  console.log('# Copy the above output to your .env file');
}

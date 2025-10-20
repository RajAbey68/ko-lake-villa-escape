#!/usr/bin/env python3
"""
Extract only the required secrets for Ko Lake Villa project
Run this in your Replit Shell: python extract_replit_secrets.py
"""

import os

# Only the secrets we actually need
REQUIRED_SECRETS = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'VITE_GUESTY_API_KEY',
    'VITE_GUESTY_BASE_URL',
    'GUESTY_CLIENT_ID',
    'GUESTY_CLIENT_SECRET',
    'GUESTY_API_KEY',
    'GUESTY_LISTING_ID',
]

print("=" * 60)
print("KO LAKE VILLA - REQUIRED SECRETS ONLY")
print("=" * 60)
print()

found = []
missing = []

for key in REQUIRED_SECRETS:
    value = os.getenv(key)
    if value:
        found.append(key)
        print(f"{key}={value}")
    else:
        missing.append(key)
        print(f"# {key}=NOT_FOUND")

print()
print("=" * 60)
print(f"✅ Found: {len(found)}/{len(REQUIRED_SECRETS)} secrets")
if missing:
    print(f"❌ Missing: {', '.join(missing)}")
print("=" * 60)
print()
print("📋 COPY EVERYTHING ABOVE (excluding # lines) and paste to Cascade")

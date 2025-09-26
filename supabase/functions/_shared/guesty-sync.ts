import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface GuestyProperty {
  id: string;
  title: string;
  nickname?: string;
  publicDescription?: {
    summary?: string;
    space?: string;
    guestAccess?: string;
    interaction?: string;
    houseRules?: string;
  };
  prices: {
    basePrice: number;
    currency: string;
    guestsIncludedInRegularFee?: number;
  };
  terms?: {
    minNights?: number;
    maxNights?: number;
  };
  accommodates?: number;
  bedrooms?: number;
  bathrooms?: number;
  beds?: number;
  address?: any;
  amenities?: any;
  pictures?: any;
  tags?: any;
  timezone?: string;
  availability?: any;
  fees?: any;
  policies?: any;
}

interface SyncState {
  last_full_sync_at: string | null;
  running: boolean;
  backoff_until: string | null;
  rate_limit_remaining: number;
}

// Helper function to get Guesty OAuth token
export async function getGuestyToken(clientId: string, clientSecret: string): Promise<string> {
  const tokenResponse = await fetch('https://open-api.guesty.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'grant_type': 'client_credentials',
      'scope': 'open-api',
      'client_id': clientId,
      'client_secret': clientSecret
    }).toString()
  });

  if (!tokenResponse.ok) {
    throw new Error(`Failed to get Guesty token: ${tokenResponse.status}`);
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

// Helper function to compute data hash for change detection
function computeDataHash(property: GuestyProperty): string {
  const relevantData = {
    title: property.title,
    nickname: property.nickname,
    basePrice: property.prices?.basePrice,
    currency: property.prices?.currency,
    maxGuests: property.prices?.guestsIncludedInRegularFee || property.accommodates,
    minNights: property.terms?.minNights,
    maxNights: property.terms?.maxNights,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    publicDescription: property.publicDescription,
    amenities: property.amenities,
    pictures: property.pictures
  };
  
  return btoa(JSON.stringify(relevantData));
}

// Main sync function that updates all properties from Guesty API
export async function syncGuestyProperties(
  guestyClientId: string, 
  guestyClientSecret: string,
  supabaseUrl: string,
  supabaseKey: string
): Promise<{ success: boolean; updated: number; error?: string }> {
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Atomic check and lock: only proceed if sync is not running AND not in backoff
    const { data: lockResult } = await supabase
      .from('guesty_sync_state')
      .update({ running: true })
      .eq('id', 1)
      .is('running', false)
      .or('backoff_until.is.null,backoff_until.lt.now()')
      .select()
      .single();
    
    if (!lockResult) {
      console.log('Sync already running or in backoff period, skipping...');
      return { success: true, updated: 0 };
    }
    
    // Check if sync is needed (TTL check - 10 minutes)  
    const lastSync = lockResult.last_full_sync_at ? new Date(lockResult.last_full_sync_at) : null;
    const syncTTL = 10 * 60 * 1000; // 10 minutes
    
    if (lastSync && (Date.now() - lastSync.getTime()) < syncTTL) {
      // Release lock and skip sync
      await supabase
        .from('guesty_sync_state')
        .update({ running: false })
        .eq('id', lockResult.id);
      console.log('Sync not needed yet, within TTL period');
      return { success: true, updated: 0 };
    }
    
    console.log('Starting Guesty properties sync...');
    
    // Get OAuth token
    const accessToken = await getGuestyToken(guestyClientId, guestyClientSecret);
    
    // Fetch all properties from Guesty API
    let allProperties: GuestyProperty[] = [];
    let page = 1;
    const limit = 50;
    
    while (true) {
      const response = await fetch(`https://open-api.guesty.com/v1/listings?limit=${limit}&skip=${(page - 1) * limit}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch properties: ${response.status}`);
      }
      
      const data = await response.json();
      const properties = data.results || [];
      
      if (properties.length === 0) break;
      
      allProperties = allProperties.concat(properties);
      page++;
      
      // Prevent infinite loop
      if (page > 20) break;
    }
    
    console.log(`Fetched ${allProperties.length} properties from Guesty`);
    
    let updatedCount = 0;
    
    // Process each property
    for (const property of allProperties) {
      const dataHash = computeDataHash(property);
      
      // Check if property exists and needs update
      const { data: existing } = await supabase
        .from('guesty_properties')
        .select('data_hash')
        .eq('id', property.id)
        .single();
      
      // Skip if hash matches (no changes)
      if (existing?.data_hash === dataHash) {
        continue;
      }
      
      // Prepare property data for upsert
      const propertyData = {
        id: property.id,
        title: property.title,
        nickname: property.nickname,
        description: property.publicDescription?.summary || property.publicDescription?.space,
        base_price: property.prices?.basePrice || 199,
        currency: property.prices?.currency || 'USD',
        max_guests: property.prices?.guestsIncludedInRegularFee || property.accommodates || 6,
        accommodates: property.accommodates,
        min_nights: property.terms?.minNights || 1,
        max_nights: property.terms?.maxNights || 30,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        beds: property.beds,
        booking_url_template: `https://www.guesty.com/book/${property.id}`,
        address: property.address,
        amenities: property.amenities,
        pictures: property.pictures,
        public_description: property.publicDescription,
        tags: property.tags,
        timezone: property.timezone,
        availability_rules: property.availability || {},
        pricing_rules: {},
        fees: property.fees || {},
        policies: property.policies || {},
        source_raw: property,
        source_updated_at: new Date().toISOString(),
        last_synced_at: new Date().toISOString(),
        data_hash: dataHash,
        is_active: true
      };
      
      // Upsert property
      const { error } = await supabase
        .from('guesty_properties')
        .upsert(propertyData);
      
      if (error) {
        console.error(`Failed to upsert property ${property.id}:`, error);
        continue;
      }
      
      updatedCount++;
    }
    
    // Update sync state and release lock
    await supabase
      .from('guesty_sync_state')
      .update({
        last_full_sync_at: new Date().toISOString(),
        running: false,
        backoff_until: null,
        last_error: null,
        rate_limit_remaining: 1000
      })
      .eq('id', lockResult.id);
    
    console.log(`Sync completed. Updated ${updatedCount} properties.`);
    
    return { success: true, updated: updatedCount };
    
  } catch (error) {
    console.error('Sync error:', error);
    
    // Set error state, backoff, and release lock
    await supabase
      .from('guesty_sync_state')
      .update({
        running: false,
        backoff_until: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 min backoff
        last_error: error.message
      })
      .eq('id', 1);
    
    return { success: false, updated: 0, error: error.message };
  }
}
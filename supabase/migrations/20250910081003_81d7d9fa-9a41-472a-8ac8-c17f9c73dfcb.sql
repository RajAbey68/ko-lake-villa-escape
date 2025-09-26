-- Update Entire Villa details
UPDATE room_types 
SET bedrooms = 7, 
    bathrooms = 8,
    description = 'Complete 7-bedroom ensuite AC villa with 8 bathrooms (including pool/guest shower WC). Stunning lake, pool and lush garden views. All rooms feature ensuite bathrooms with rainwater showers. Perfect for large groups seeking luxury and privacy.',
    direct_price = 450,
    airbnb_price = 600
WHERE name = 'Entire Villa';

-- Update Triple/Twin Rooms description  
UPDATE room_types 
SET description = 'Flexible room with super king bed and sofa bed (2 singles). Stunning lake and garden views with ensuite bathroom and rainwater shower. Ideal for families or groups of friends.',
    direct_price = 80,
    airbnb_price = 120
WHERE name = 'Triple/Twin Rooms';

-- Remove the duplicate Birds Eye Lake View room, keep only Birds Eye Left Wing
DELETE FROM room_types WHERE name = 'Birds Eye Lake View';

-- Update remaining Birds Eye Left Wing room
UPDATE room_types 
SET name = 'Birds Eye Lake View',
    description = 'Elevated room offering panoramic bird''s eye views of the lake and surrounding gardens. Features king-size bed and ensuite bathroom with rainwater shower. Includes private balcony for sunrise/sunset viewing.',
    direct_price = 95,
    airbnb_price = 140
WHERE name = 'Birds Eye Left Wing';

-- Update other room pricing
UPDATE room_types 
SET direct_price = 90, airbnb_price = 130
WHERE name = 'Master Family Suite';

UPDATE room_types 
SET direct_price = 85, airbnb_price = 125  
WHERE name = 'Pool Room Modal Duwa View';

UPDATE room_types 
SET direct_price = 110, airbnb_price = 160
WHERE name = 'Lake & Roof Verandah';
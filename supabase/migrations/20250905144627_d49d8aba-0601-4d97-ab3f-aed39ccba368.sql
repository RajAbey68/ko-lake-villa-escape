-- Fix typo: Update location information to correct spelling "Koggala Lake"
UPDATE location_info 
SET 
  title = 'Serene Location at Koggala Lake',
  description = 'Nestled on the tranquil shores of Koggala Lake in Ahangama, Ko Lake Villa offers breathtaking lake views and easy access to the Southern Province''s pristine beaches and cultural attractions',
  address = 'Koggala Lake, Ahangama, Galle, Sri Lanka',
  coordinates = '5.9808° N, 80.3481° E',
  nearby_attractions = '{
    "beaches": [
      {"name": "Galle Fort", "distance": "15 km"},
      {"name": "Hikkaduwa Beach", "distance": "20 km"},
      {"name": "Unawatuna Beach", "distance": "25 km"}
    ],
    "cultural": [
      {"name": "Stilt Fishermen", "distance": "10 km"},
      {"name": "Snake Island", "distance": "5 km"},
      {"name": "Martin Wickramasinghe Folk Museum", "distance": "8 km"}
    ],
    "nature": [
      {"name": "Koggala Lake", "distance": "0 km"},
      {"name": "Handunugoda Tea Estate", "distance": "12 km"},
      {"name": "Kathaluwa Temple", "distance": "6 km"}
    ]
  }',
  updated_at = now()
WHERE id = '64e78144-3993-4dfa-9657-7a140d655ba7';
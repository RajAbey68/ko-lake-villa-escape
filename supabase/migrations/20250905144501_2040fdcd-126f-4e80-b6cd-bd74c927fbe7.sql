-- Update location information to correct address (Koggal Lake Ahangama)
UPDATE location_info 
SET 
  title = 'Serene Location at Koggal Lake',
  description = 'Nestled on the tranquil shores of Koggal Lake in Ahangama, Ko Lake Villa offers breathtaking lake views and easy access to the Southern Province''s pristine beaches and cultural attractions',
  address = 'Koggal Lake, Ahangama, Galle District, Southern Province, Sri Lanka',
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
      {"name": "Koggal Lake", "distance": "0 km"},
      {"name": "Handunugoda Tea Estate", "distance": "12 km"},
      {"name": "Kathaluwa Temple", "distance": "6 km"}
    ]
  }',
  transport_options = '{
    "airport": {
      "name": "Bandaranaike International Airport", 
      "distance": "145 km", 
      "duration": "2.5 hours"
    },
    "train": {
      "station": "Galle Railway Station", 
      "distance": "15 km", 
      "duration": "30 minutes"
    },
    "taxi": {
      "availability": "24/7", 
      "notes": "Direct pickup available from Galle or Colombo"
    }
  }',
  contact_info = '{
    "phone": "+94 77 123 4567",
    "whatsapp": "+94 77 123 4567", 
    "email": "info@kolakevilla.com",
    "emergency": "+94 11 242 2222"
  }',
  updated_at = now()
WHERE id = '64e78144-3993-4dfa-9657-7a140d655ba7';
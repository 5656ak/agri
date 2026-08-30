import { LocationInfo } from '../types';

// Comprehensive Indian States and Top Agricultural Districts Database
export const ALL_INDIAN_STATES_DISTRICTS: Record<string, string[]> = {
  Jharkhand: [
    'Ranchi', 'Hazaribagh', 'Ramgarh', 'Dhanbad', 'Bokaro', 'East Singhbhum (Jamshedpur)',
    'West Singhbhum (Chaibasa)', 'Palamu', 'Garhwa', 'Deoghar', 'Dumka', 'Giridih',
    'Godda', 'Gumla', 'Jamtara', 'Khunti', 'Koderma', 'Latehar', 'Lohardaga',
    'Pakur', 'Sahibganj', 'Seraikela Kharsawan', 'Simdega', 'Chatra'
  ],
  Bihar: [
    'Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Nalanda (Bihar Sharif)', 'Rohtas (Sasaram)',
    'Vaishali (Hajipur)', 'Purnia', 'Samastipur', 'Darbhanga', 'Begusarai', 'Katihar',
    'Bhojpur (Ara)', 'Saran (Chhapra)', 'Siwan', 'Gopalganj', 'East Champaran (Motihari)',
    'West Champaran (Bettiah)', 'Sitamarhi', 'Madhubani', 'Saharsa', 'Supual', 'Madhepura',
    'Khagaria', 'Munger', 'Banka', 'Jamui', 'Lakhisarai', 'Sheikhpura', 'Nawada', 'Aurangabad',
    'Jehanabad', 'Arwal', 'Buxar', 'Kaimur (Bhabua)', 'Kishanganj', 'Araria'
  ],
  'Uttar Pradesh': [
    'Varanasi', 'Lucknow', 'Kanpur Nagar', 'Prayagraj (Allahabad)', 'Meerut', 'Gorakhpur',
    'Agra', 'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur', 'Ayodhya (Faizabad)', 'Jhansi',
    'Mathura', 'Muzaffarnagar', 'Bijnor', 'Bulandshahr', 'Ghaziabad', 'Gautam Buddha Nagar (Noida)',
    'Shahjahanpur', 'Rampur', 'Firozabad', 'Mainpuri', 'Etawah', 'Kannauj', 'Farrukhabad',
    'Hardoi', 'Sitapur', 'Lakhimpur Kheri', 'Unnao', 'Rae Bareli', 'Amethi', 'Sultanpur',
    'Barabanki', 'Bahraich', 'Shravasti', 'Balrampur', 'Gonda', 'Siddharthnagar', 'Basti',
    'Sant Kabir Nagar', 'Maharajganj', 'Kushinagar', 'Deoria', 'Azamgarh', 'Mau', 'Ballia',
    'Jaunpur', 'Ghazipur', 'Chandauli', 'Mirzapur', 'Sonbhadra', 'Banda', 'Chitrakoot',
    'Fatehpur', 'Hamirpur', 'Mahoba', 'Jalaun (Orai)', 'Lalitpur', 'Hathras', 'Kasganj', 'Etah',
    'Amroha', 'Budaun', 'Pilibhit', 'Sambhal', 'Hapur', 'Shamli', 'Baghpat', 'Bhadohi'
  ],
  Punjab: [
    'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Sangrur', 'Firozpur',
    'Gurdaspur', 'Hoshiarpur', 'Kapurthala', 'Mansa', 'Moga', 'Sri Muktsar Sahib', 'Pathankot',
    'Rupnagar (Ropar)', 'Sahibzada Ajit Singh Nagar (Mohali)', 'Shahid Bhagat Singh Nagar (Nawanshahr)',
    'Tarn Taran', 'Barnala', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka', 'Malerkotla'
  ],
  Haryana: [
    'Karnal', 'Kurukshetra', 'Hisar', 'Ambala', 'Rohtak', 'Sirsa', 'Panipat', 'Sonipat',
    'Yamunanagar', 'Fatehabad', 'Jind', 'Kaithal', 'Bhiwani', 'Charkhi Dadri', 'Gurugram',
    'Faridabad', 'Jhajjar', 'Mahendragarh (Narnaul)', 'Rewari', 'Palwal', 'Nuh (Mewat)', 'Panchkula'
  ],
  Rajasthan: [
    'Jaipur', 'Alwar', 'Kota', 'Jodhpur', 'Bikaner', 'Udaipur', 'Sriganganagar', 'Hanumangarh',
    'Bharatpur', 'Sikar', 'Jhunjhunu', 'Nagaur', 'Ajmer', 'Pali', 'Barmer', 'Jaisalmer',
    'Jalore', 'Sirohi', 'Bhilwara', 'Chittorgarh', 'Rajsamand', 'Banswara', 'Dungarpur',
    'Pratapgarh', 'Bundi', 'Baran', 'Jhalawar', 'Tonk', 'Dausa', 'Sawai Madhopur', 'Karauli', 'Dholpur'
  ],
  'Madhya Pradesh': [
    'Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Rewa', 'Satna', 'Hoshangabad (Narmadapuram)',
    'Sehore', 'Raisen', 'Vidisha', 'Betul', 'Harda', 'Chhindwara', 'Seoni', 'Balaghat', 'Mandla',
    'Dindori', 'Narsinghpur', 'Katni', 'Damoh', 'Panna', 'Tikamgarh', 'Chhatarpur', 'Niwari',
    'Datia', 'Shivpuri', 'Guna', 'Ashoknagar', 'Sheopur', 'Morena', 'Bhind', 'Mandsaur', 'Neemuch',
    'Ratlam', 'Dewas', 'Shajapur', 'Agar Malwa', 'Dhar', 'Jhabua', 'Alirajpur', 'Khargone (West Nimar)',
    'Barwani', 'Khandwa (East Nimar)', 'Burhanpur', 'Sidhi', 'Singrauli', 'Shahdol', 'Anuppur', 'Umaria'
  ],
  Maharashtra: [
    'Pune', 'Nagpur', 'Nashik', 'Chhatrapati Sambhajinagar (Aurangabad)', 'Kolhapur', 'Solapur',
    'Amravati', 'Nanded', 'Akola', 'Jalgaon', 'Ahmednagar', 'Satara', 'Sangli', 'Latur',
    'Dhule', 'Nandurbar', 'Beed', 'Parbhani', 'Jalna', 'Osmanabad (Dharashiv)', 'Hingoli',
    'Buldhana', 'Washim', 'Yavatmal', 'Wardha', 'Chandrapur', 'Bhandara', 'Gondia', 'Gadchiroli',
    'Raigad', 'Ratnagiri', 'Sindhudurg', 'Thane', 'Palghar'
  ],
  Gujarat: [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar',
    'Anand', 'Kheda (Nadiad)', 'Mehsana', 'Patan', 'Banaskantha (Palanpur)', 'Sabarkantha (Himmatnagar)',
    'Aravalli', 'Mahisagar', 'Panchmahal (Godhra)', 'Dahod', 'Vadodara', 'Chhota Udaipur', 'Bharuch',
    'Narmada (Rajpipla)', 'Navsari', 'Valsad', 'Tapi (Vyara)', 'Dang (Ahwa)', 'Kutch (Bhuj)',
    'Surendranagar', 'Morbi', 'Devbhumi Dwarka', 'Porbandar', 'Gir Somnath', 'Amreli', 'Botad'
  ],
  'West Bengal': [
    'Kolkata', 'North 24 Parganas', 'South 24 Parganas', 'Howrah', 'Hooghly', 'Purba Bardhaman',
    'Paschim Bardhaman', 'Nadia', 'Murshidabad', 'Birbhum', 'Bankura', 'Purulia',
    'Purba Medinipur', 'Paschim Medinipur', 'Jhargram', 'Malda', 'Uttar Dinajpur', 'Dakshin Dinajpur',
    'Jalpaiguri', 'Alipurduar', 'Cooch Behar', 'Darjeeling', 'Kalimpong'
  ],
  Odisha: [
    'Khordha (Bhubaneswar)', 'Cuttack', 'Puri', 'Balasore', 'Bhadrak', 'Ganjam', 'Sambalpur',
    'Bargarh', 'Bolangir', 'Kalahandi', 'Koraput', 'Rayagada', 'Nabarangpur', 'Malkangiri',
    'Mayurbhanj', 'Kendujhar (Keonjhar)', 'Sundargarh', 'Jharsuguda', 'Deogarh', 'Angul',
    'Dhenkanal', 'Jajpur', 'Kendrapara', 'Jagatsinghpur', 'Nayagarh', 'Gajapati', 'Kandhamal',
    'Boudh', 'Subarnapur (Sonepur)', 'Nuapada'
  ],
  Chhattisgarh: [
    'Raipur', 'Durg', 'Bilaspur', 'Rajnandgaon', 'Janjgir-Champa', 'Baloda Bazar', 'Korba',
    'Raigarh', 'Mahasamund', 'Dhamtari', 'Gariaband', 'Bemetara', 'Balod', 'Kawardha (Kabirdham)',
    'Mungeli', 'Gaurela-Pendra-Marwahi', 'Surguja (Ambikapur)', 'Surajpur', 'Balrampur',
    'Koriya', 'Manendragarh-Chirmiri-Bharatpur', 'Jashpur', 'Bastar (Jagdalpur)', 'Kondagaon',
    'Kanker (North Bastar)', 'Narayanpur', 'Dantewada (South Bastar)', 'Bijapur', 'Sukma'
  ],
  'Andhra Pradesh': [
    'Visakhapatnam', 'Vijayawada (NTR)', 'Guntur', 'Kurnool', 'Nellore (SPSR Nellore)',
    'Tirupati', 'East Godavari (Kakinada)', 'West Godavari (Eluru)', 'Krishna (Machilipatnam)',
    'Anantapur', 'Kadapa (YSR)', 'Chittoor', 'Prakasam (Ongole)', 'Srikakulam', 'Vizianagaram',
    'Bapatla', 'Palnadu', 'Konaseema', 'Kakinada', 'Annamayya', 'Sri Sathya Sai', 'Nandyal',
    'Alluri Sitharama Raju', 'Parvathipuram Manyam'
  ],
  Telangana: [
    'Hyderabad', 'Ranga Reddy', 'Medchal-Malkajgiri', 'Warangal', 'Hanamkonda', 'Karimnagar',
    'Khammam', 'Nizamabad', 'Nalgonda', 'Suryapet', 'Mahabubnagar', 'Nagarkurnool', 'Wanaparthy',
    'Jogulamba Gadwal', 'Narayanpet', 'Medak', 'Sangareddy', 'Siddipet', 'Jagtial', 'Peddapalli',
    'Rajanna Sircilla', 'Kamareddy', 'Bhadradri Kothagudem', 'Mahabubabad', 'Jangaon',
    'Jayashankar Bhupalpally', 'Mulugu', 'Adilabad', 'Mancherial', 'Nirmal', 'Kumuram Bheem Asifabad'
  ],
  'Tamil Nadu': [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli (Trichy)', 'Salem', 'Thanjavur',
    'Erode', 'Tiruppur', 'Vellore', 'Dindigul', 'Thoothukudi', 'Tirunelveli', 'Kanyakumari',
    'Cuddalore', 'Villupuram', 'Kanchipuram', 'Tiruvallur', 'Tiruvannamalai', 'Dharmapuri',
    'Krishnagiri', 'Namakkal', 'Karur', 'Perambalur', 'Ariyalur', 'Nagapattinam', 'Tiruvarur',
    'Mayiladuthurai', 'Pudukkottai', 'Sivaganga', 'Ramanathapuram', 'Virudhunagar', 'Tenkasi',
    'The Nilgiris', 'Theni', 'Ranipet', 'Tirupathur', 'Chengalpattu', 'Kallakurichi'
  ],
  Karnataka: [
    'Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Belagavi', 'Hubballi-Dharwad', 'Kalaburagi (Gulbarga)',
    'Mangaluru (Dakshina Kannada)', 'Ballari', 'Vijayapura (Bijapur)', 'Shivamogga (Shimoga)',
    'Tumakuru', 'Davangere', 'Hassan', 'Mandya', 'Udupi', 'Chikkamagaluru', 'Kodagu (Madikeri)',
    'Bagalkote', 'Bidar', 'Chamarajanagar', 'Chikkaballapur', 'Chitradurga', 'Gadag', 'Haveri',
    'Kolar', 'Koppal', 'Raichur', 'Ramanagara', 'Uttara Kannada (Karwar)', 'Yadgir', 'Vijayanagara'
  ],
  Kerala: [
    'Thiruvananthapuram', 'Kochi (Ernakulam)', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad',
    'Alappuzha', 'Kottayam', 'Kannur', 'Malappuram', 'Idukki', 'Wayanad', 'Kasaragod', 'Pathanamthitta'
  ],
  Assam: [
    'Guwahati (Kamrup Metro)', 'Kamrup', 'Dibrugarh', 'Silchar (Cachar)', 'Jorhat', 'Nagaon',
    'Tinsukia', 'Tezpur (Sonitpur)', 'Barpeta', 'Dhubri', 'Goalpara', 'Bongaigaon', 'Darrang',
    'Golaghat', 'Sivasagar', 'Lakhimpur', 'Dhemaji', 'Karbi Anglong', 'Dima Hasao', 'Kokrajhar',
    'Baksa', 'Chirang', 'Udalguri', 'Hojai', 'Biswanath', 'Charaideo', 'South Salmara-Mankachar',
    'Majuli', 'Bajali', 'Tamulpur'
  ],
  Uttarakhand: [
    'Dehradun', 'Haridwar', 'Nainital', 'Udham Singh Nagar (Rudrapur)', 'Almora', 'Pauri Garhwal',
    'Tehri Garhwal', 'Chamoli', 'Rudraprayag', 'Uttarkashi', 'Pithoragarh', 'Champawat', 'Bageshwar'
  ],
  'Himachal Pradesh': [
    'Shimla', 'Kangra (Dharamshala)', 'Mandi', 'Solan', 'Kullu', 'Sirmaur (Nahan)', 'Una',
    'Hamirpur', 'Bilaspur', 'Chamba', 'Kinnaur', 'Lahaul and Spiti'
  ]
};

// Known Coordinate Centroids for high-accuracy reverse matching
const DISTRICT_CENTROIDS: { state: string; district: string; lat: number; lon: number }[] = [
  { state: 'Jharkhand', district: 'Ranchi', lat: 23.3441, lon: 85.3096 },
  { state: 'Jharkhand', district: 'Hazaribagh', lat: 23.9925, lon: 85.3637 },
  { state: 'Jharkhand', district: 'Dhanbad', lat: 23.7957, lon: 86.4304 },
  { state: 'Jharkhand', district: 'East Singhbhum (Jamshedpur)', lat: 22.8046, lon: 86.2029 },
  { state: 'Bihar', district: 'Patna', lat: 25.5941, lon: 85.1376 },
  { state: 'Bihar', district: 'Gaya', lat: 24.7914, lon: 85.0002 },
  { state: 'Bihar', district: 'Muzaffarpur', lat: 26.1209, lon: 85.3647 },
  { state: 'Uttar Pradesh', district: 'Varanasi', lat: 25.3176, lon: 82.9739 },
  { state: 'Uttar Pradesh', district: 'Lucknow', lat: 26.8467, lon: 80.9462 },
  { state: 'Uttar Pradesh', district: 'Kanpur Nagar', lat: 26.4499, lon: 80.3319 },
  { state: 'Punjab', district: 'Ludhiana', lat: 30.9010, lon: 75.8573 },
  { state: 'Punjab', district: 'Amritsar', lat: 31.6340, lon: 74.8723 },
  { state: 'Haryana', district: 'Karnal', lat: 29.6857, lon: 76.9905 },
  { state: 'Rajasthan', district: 'Jaipur', lat: 26.9124, lon: 75.7873 },
  { state: 'Madhya Pradesh', district: 'Bhopal', lat: 23.2599, lon: 77.4126 },
  { state: 'Madhya Pradesh', district: 'Indore', lat: 22.7196, lon: 75.8577 },
  { state: 'Maharashtra', district: 'Pune', lat: 18.5204, lon: 73.8567 },
  { state: 'Maharashtra', district: 'Nagpur', lat: 21.1458, lon: 79.0882 },
  { state: 'Gujarat', district: 'Ahmedabad', lat: 23.0225, lon: 72.5714 },
  { state: 'West Bengal', district: 'Kolkata', lat: 22.5726, lon: 88.3639 },
  { state: 'Odisha', district: 'Khordha (Bhubaneswar)', lat: 20.2961, lon: 85.8245 },
  { state: 'Chhattisgarh', district: 'Raipur', lat: 21.2514, lon: 81.6296 },
  { state: 'Telangana', district: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
  { state: 'Andhra Pradesh', district: 'Vijayawada (NTR)', lat: 16.5062, lon: 80.6480 },
  { state: 'Tamil Nadu', district: 'Chennai', lat: 13.0827, lon: 80.2707 },
  { state: 'Karnataka', district: 'Bengaluru Urban', lat: 12.9716, lon: 77.5946 },
  { state: 'Kerala', district: 'Thiruvananthapuram', lat: 8.5241, lon: 76.9366 },
  { state: 'Assam', district: 'Guwahati (Kamrup Metro)', lat: 26.1445, lon: 91.7362 }
];

export interface AccurateLocationResult {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  state: string;
  district: string;
  block?: string;
  village?: string;
  pincode?: string;
  formattedAddress: string;
  source: 'GPS_HIGH_ACCURACY' | 'IP_GEOLOCATION' | 'MANUAL_SELECTION' | 'PINCODE_LOOKUP';
}

export const locationService = {
  // 1. High-Accuracy Hardware GPS with Real-time Reverse Geocoding
  async fetchCurrentGPSLocation(): Promise<AccurateLocationResult> {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const accuracy = Math.round(position.coords.accuracy || 10);

          try {
            // Attempt OpenStreetMap Nominatim Reverse Geocoding (Level 18 precision for village/tehsil)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4500);

            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
              {
                headers: { 'Accept-Language': 'en,hi' },
                signal: controller.signal
              }
            );
            clearTimeout(timeoutId);

            if (res.ok) {
              const data = await res.json();
              const addr = data.address || {};

              const state = addr.state || 'Jharkhand';
              const district = addr.state_district || addr.county || addr.district || addr.city || 'Ranchi';
              const block = addr.subdistrict || addr.taluk || addr.tehsil || addr.suburb || addr.municipality || 'Kanke';
              const village = addr.village || addr.hamlet || addr.neighbourhood || addr.residential || '';
              const pincode = addr.postcode || '';

              const formatted = [
                village,
                block,
                district,
                state
              ].filter(Boolean).join(', ');

              resolve({
                latitude: lat,
                longitude: lon,
                accuracyMeters: accuracy,
                state: this.normalizeStateName(state),
                district: this.normalizeDistrictName(district, state),
                block,
                village,
                pincode,
                formattedAddress: formatted || `${district}, ${state} (GPS ±${accuracy}m)`,
                source: 'GPS_HIGH_ACCURACY'
              });
              return;
            }
          } catch {
            // Fall through to Spatial Nearest-Neighbour Calculation
          }

          // Offline / Fallback Nearest-Centroid Match
          const nearest = locationService.findNearestDistrict(lat, lon);
          resolve({
            latitude: lat,
            longitude: lon,
            accuracyMeters: accuracy,
            state: nearest.state,
            district: nearest.district,
            block: 'Local Block',
            village: 'Farm Field Plot',
            formattedAddress: `${nearest.district}, ${nearest.state} (GPS ±${accuracy}m)`,
            source: 'GPS_HIGH_ACCURACY'
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 0
        }
      );
    });
  },

  // 2. High-speed 6-digit Indian PIN code Lookup
  async lookupPincode(pincode: string): Promise<{ state: string; district: string; block: string; village: string } | null> {
    const cleanPin = pincode.trim().replace(/\D/g, '');
    if (cleanPin.length !== 6) return null;

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
          const po = data[0].PostOffice[0];
          return {
            state: this.normalizeStateName(po.State),
            district: this.normalizeDistrictName(po.District, po.State),
            block: po.Block !== 'NA' ? po.Block : po.Taluk !== 'NA' ? po.Taluk : po.Name,
            village: po.Name
          };
        }
      }
    } catch {
      // Ignore network errors on PIN lookup
    }
    return null;
  },

  // 3. Fast Spatial Haversine Nearest District
  findNearestDistrict(lat: number, lon: number): { state: string; district: string; distanceKm: number } {
    let bestMatch = DISTRICT_CENTROIDS[0];
    let minDistance = Infinity;

    for (const d of DISTRICT_CENTROIDS) {
      const dist = this.calculateDistanceKm(lat, lon, d.lat, d.lon);
      if (dist < minDistance) {
        minDistance = dist;
        bestMatch = d;
      }
    }

    return {
      state: bestMatch.state,
      district: bestMatch.district,
      distanceKm: Math.round(minDistance)
    };
  },

  calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  normalizeStateName(rawState: string): string {
    const match = Object.keys(ALL_INDIAN_STATES_DISTRICTS).find(
      (s) => s.toLowerCase() === rawState.toLowerCase() || rawState.toLowerCase().includes(s.toLowerCase())
    );
    return match || rawState;
  },

  normalizeDistrictName(rawDistrict: string, state: string): string {
    const districts = ALL_INDIAN_STATES_DISTRICTS[state] || [];
    const clean = rawDistrict.replace(/district/gi, '').trim();
    const match = districts.find(
      (d) => d.toLowerCase().includes(clean.toLowerCase()) || clean.toLowerCase().includes(d.toLowerCase())
    );
    return match || clean;
  }
};

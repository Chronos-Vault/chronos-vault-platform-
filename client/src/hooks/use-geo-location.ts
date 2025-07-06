import { useState, useEffect } from 'react';

interface GeoLocationState {
  loading: boolean;
  error: string | null;
  country: string | null;
  city: string | null;
  region: string | null;
}

export function useGeoLocation() {
  const [state, setState] = useState<GeoLocationState>({
    loading: true,
    error: null,
    country: null,
    city: null,
    region: null
  });

  useEffect(() => {
    // Function to fetch location data
    const fetchLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }
        
        const data = await response.json();
        
        setState({
          loading: false,
          error: null,
          country: data.country_name,
          city: data.city,
          region: data.region
        });
      } catch (error) {
        console.error('Error fetching location:', error);
        setState({
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          country: null,
          city: null,
          region: null
        });
      }
    };

    fetchLocation();
  }, []);

  return state;
}
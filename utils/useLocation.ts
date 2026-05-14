import * as Location from 'expo-location';
import { useState } from 'react';

export function useLocation() {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [captured, setCaptured] = useState(false);
    const [loading, setLoading] = useState(false);

    const captureLocation = async () => {
        setLoading(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setLoading(false);
            return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        setLatitude(String(loc.coords.latitude));
        setLongitude(String(loc.coords.longitude));
        setCaptured(true);
        setLoading(false);
    };

    return { latitude, longitude, captured, loading, captureLocation };
}
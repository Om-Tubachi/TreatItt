import * as Location from 'expo-location';
import { useState } from 'react';
import { Alert } from 'react-native';

export const useCurrentLocation = () => {
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [isFetching, setIsFetching] = useState(false);

    const fetchLocation = async () => {
        setIsFetching(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Location permission is required to tag this listing.');
                return;
            }
            const pos = await Location.getCurrentPositionAsync({});
            setLatitude(pos.coords.latitude);
            setLongitude(pos.coords.longitude);
        } catch (e: any) {
            Alert.alert('Location Error', e.message || 'Could not fetch location');
        } finally {
            setIsFetching(false);
        }
    };

    // Allows hydration from an existing entity's stored lat/long in edit mode
    const setLocation = (lat?: number | null, lng?: number | null) => {
        setLatitude(lat ?? null);
        setLongitude(lng ?? null);
    };

    return { latitude, longitude, isFetching, fetchLocation, setLocation };
};

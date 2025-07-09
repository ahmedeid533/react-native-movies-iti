import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
        api_key: 'e0dd7fb1ec73d693e8c236644b38dc1f',
    },
});

// Add interceptor for React Native
axiosInstance.interceptors.request.use(async (config) => {
    try {
        // Try to get language from AsyncStorage
        const language = await AsyncStorage.getItem('app_language') || 'en';
        config.params = {...config.params, language: language};
    } catch (error) {
        // Fallback to English if AsyncStorage is not available
        config.params = {...config.params, language: 'en'};
    }
    return config;
});

export default axiosInstance;
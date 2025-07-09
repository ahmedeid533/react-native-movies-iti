import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {useDispatch} from 'react-redux';
import {addToWishlist, deleteAllFromWishlist} from '../store/slices/WishListSlice';

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        checkAuthState();
    }, []);

    const checkAuthState = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                await loadUserWishlist(parsedUser.email);
            }
        } catch (error) {
            console.error('Error checking auth state:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadUserWishlist = async (email) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/wishlist?email=${email}`);
            const data = await response.json();

            if (data.wishlist && Array.isArray(data.wishlist)) {
                data.wishlist.forEach((movie) => {
                    dispatch(addToWishlist({...movie, type: 'movie'}));
                });
            }
        } catch (error) {
            console.error('Error loading user wishlist:', error);
        }
    };

    const saveUserToDb = async (userData) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userData.email,
                    name: userData.name,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save user to database');
            }

            return await response.json();
        } catch (error) {
            console.error('Error saving user to database:', error);
            throw error;
        }
    };

    const signIn = async (userData) => {
        try {
            setIsLoading(true);

            // Save user to database
            await saveUserToDb(userData);

            // Save user to AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify(userData));

            // Set user in state
            setUser(userData);

            // Load user's wishlist
            await loadUserWishlist(userData.email);

            return {success: true};
        } catch (error) {
            console.error('Error signing in:', error);
            Alert.alert('Error', 'Failed to sign in. Please try again.');
            return {success: false, error: error.message};
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setIsLoading(true);

            // Clear AsyncStorage
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('app_language');

            // Clear Redux store
            dispatch(deleteAllFromWishlist());

            // Clear user state
            setUser(null);

            return {success: true};
        } catch (error) {
            console.error('Error signing out:', error);
            Alert.alert('Error', 'Failed to sign out. Please try again.');
            return {success: false, error: error.message};
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithGoogle = async () => {
        try {
            // This is a placeholder for Google Sign-In implementation
            // You would integrate with @react-native-google-signin/google-signin here
            Alert.alert('Google Sign-In', 'Google Sign-In functionality would be implemented here');

            // Mock user data for demonstration
            const mockUser = {
                email: 'demo@example.com',
                name: 'Demo User',
                image: 'https://via.placeholder.com/150'
            };

            return await signIn(mockUser);
        } catch (error) {
            console.error('Error signing in with Google:', error);
            return {success: false, error: error.message};
        }
    };

    const continueAsGuest = () => {
        setUser(null);
        setIsLoading(false);
    };

    const value = {
        user,
        isLoading,
        signIn,
        signOut,
        signInWithGoogle,
        continueAsGuest,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
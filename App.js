import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StatusBar} from 'expo-status-bar';
import {Provider} from 'react-redux';
import {View, Text, StyleSheet, Platform, SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

import store from './src/store/store';
import HomeScreen from './src/screens/HomeScreen';
import MoviesScreen from './src/screens/MoviesScreen';
import TVShowsScreen from './src/screens/TVShowsScreen';
import MovieDetailsScreen from './src/screens/MovieDetailsScreen';
import TVDetailsScreen from './src/screens/TVDetailsScreen';
import WishlistScreen from './src/screens/WishlistScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SearchScreen from './src/screens/SearchScreen';
import {AuthProvider, useAuth} from './src/context/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const {user} = useAuth();

    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = 'home';
                    } else if (route.name === 'Movies') {
                        iconName = 'movie';
                    } else if (route.name === 'TV Shows') {
                        iconName = 'tv';
                    } else if (route.name === 'Wishlist') {
                        iconName = 'favorite';
                    }

                    return <Icon name={iconName} size={size} color={color}/>;
                },
                tabBarActiveTintColor: '#ffe353',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: 'white',
                    borderTopWidth: 1,
                    borderTopColor: '#f0f0f0',
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen}/>
            <Tab.Screen name="Movies" component={MoviesScreen}/>
            <Tab.Screen name="TV Shows" component={TVShowsScreen}/>
            {user && (
                <Tab.Screen name="Wishlist" component={WishlistScreen}/>
            )}
        </Tab.Navigator>
    );
};

const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Welcome" component={WelcomeScreen}/>
            <Stack.Screen name="Login" component={LoginScreen}/>
        </Stack.Navigator>
    );
};

const MainStack = () => {
    const {user, isLoading} = useAuth();

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            {user ? (
                <>
                    <Stack.Screen name="Main" component={TabNavigator}/>
                    <Stack.Screen name="MovieDetails" component={MovieDetailsScreen}/>
                    <Stack.Screen name="TVDetails" component={TVDetailsScreen}/>
                    <Stack.Screen name="Search" component={SearchScreen}/>
                </>
            ) : (
                <>
                    <Stack.Screen name="Auth" component={AuthStack}/>
                    <Stack.Screen name="GuestMain" component={TabNavigator}/>
                    <Stack.Screen name="MovieDetails" component={MovieDetailsScreen}/>
                    <Stack.Screen name="TVDetails" component={TVDetailsScreen}/>
                    <Stack.Screen name="Search" component={SearchScreen}/>
                </>
            )}
        </Stack.Navigator>
    );
};

const AppContent = () => {
    return (
        <SafeAreaView style={styles.appContainer}>
            <StatusBar
                style="dark"
                backgroundColor="#ffffff"
            />
            <NavigationContainer>
                <MainStack/>
            </NavigationContainer>
        </SafeAreaView>
    );
};

export default function App() {
    return (
        <Provider store={store}>
            <AuthProvider>
                <AppContent/>
            </AuthProvider>
        </Provider>
    );
}

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    loadingText: {
        fontSize: 18,
        color: '#333',
    },
});
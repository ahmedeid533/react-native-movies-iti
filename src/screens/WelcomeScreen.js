import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image,
    Dimensions,
    StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../context/AuthContext';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width, height} = Dimensions.get('window');

const WelcomeScreen = () => {
    const navigation = useNavigation();
    const {continueAsGuest} = useAuth();
    const {language} = useSelector((state) => state.languages) || {language: 'en'};

    const handleSignIn = () => {
        navigation.navigate('Login');
    };

    const handleContinueAsGuest = () => {
        continueAsGuest();
        navigation.navigate('GuestMain');
    };

    // Translated text
    const welcomeText = language === 'ar'
        ? 'مرحبًا بك في تطبيق الأفلام'
        : 'Welcome to MovieApp';

    const subtitleText = language === 'ar'
        ? 'اكتشف آلاف الأفلام والمسلسلات من جميع أنحاء العالم'
        : 'Discover thousands of movies and TV shows from around the world';

    const signInText = language === 'ar' ? 'تسجيل الدخول' : 'Sign In';
    const guestText = language === 'ar' ? 'متابعة كضيف' : 'Continue as Guest';
    const guestNote = language === 'ar'
        ? 'ملاحظة: الضيوف لا يمكنهم حفظ المفضلات'
        : 'Note: Guests cannot save favorites';

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff"/>

            {/* Header with Logo */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Icon name="movie" size={60} color="#ffe353"/>
                    <Text style={[styles.appName, language === 'ar' && styles.rtl]}>
                        MovieApp
                    </Text>
                </View>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <View style={styles.heroSection}>
                    <Text style={[styles.welcomeTitle, language === 'ar' && styles.rtl]}>
                        {welcomeText}
                    </Text>
                    <Text style={[styles.subtitle, language === 'ar' && styles.rtl]}>
                        {subtitleText}
                    </Text>
                </View>

                {/* Features Preview */}
                <View style={styles.featuresPreview}>
                    <View style={styles.featureItem}>
                        <Icon name="movie-creation" size={40} color="#ffe353"/>
                        <Text style={[styles.featureText, language === 'ar' && styles.rtl]}>
                            {language === 'ar' ? 'آلاف الأفلام' : 'Thousands of Movies'}
                        </Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Icon name="tv" size={40} color="#ffe353"/>
                        <Text style={[styles.featureText, language === 'ar' && styles.rtl]}>
                            {language === 'ar' ? 'مسلسلات متنوعة' : 'TV Shows'}
                        </Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Icon name="favorite" size={40} color="#ffe353"/>
                        <Text style={[styles.featureText, language === 'ar' && styles.rtl]}>
                            {language === 'ar' ? 'قوائم مفضلة' : 'Wishlist'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={styles.signInButton}
                    onPress={handleSignIn}
                    activeOpacity={0.8}
                >
                    <Icon name="login" size={20} color="#1a1a1a" style={styles.buttonIcon}/>
                    <Text style={styles.signInButtonText}>{signInText}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.guestButton}
                    onPress={handleContinueAsGuest}
                    activeOpacity={0.8}
                >
                    <Icon name="person-outline" size={20} color="#ffe353" style={styles.buttonIcon}/>
                    <Text style={styles.guestButtonText}>{guestText}</Text>
                </TouchableOpacity>

                <Text style={[styles.guestNote, language === 'ar' && styles.rtl]}>
                    {guestNote}
                </Text>
            </View>

            {/* Decorative Elements */}
            <View style={styles.decorativeElements}>
                <View style={styles.circle1}/>
                <View style={styles.circle2}/>
                <View style={styles.circle3}/>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        paddingTop: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginTop: 10,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    welcomeTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: 15,
        lineHeight: 40,
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    featuresPreview: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 40,
    },
    featureItem: {
        alignItems: 'center',
        flex: 1,
    },
    featureText: {
        fontSize: 12,
        color: '#666666',
        textAlign: 'center',
        marginTop: 8,
        fontWeight: '500',
    },
    actionButtons: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    signInButton: {
        backgroundColor: '#ffe353',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    guestButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#ffe353',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 12,
        marginBottom: 10,
    },
    signInButtonText: {
        color: '#1a1a1a',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    guestButtonText: {
        color: '#ffe353',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    buttonIcon: {
        marginRight: 8,
    },
    guestNote: {
        fontSize: 12,
        color: '#888888',
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 5,
    },
    decorativeElements: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
    },
    circle1: {
        position: 'absolute',
        top: 100,
        right: -50,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 227, 83, 0.1)',
    },
    circle2: {
        position: 'absolute',
        top: 300,
        left: -30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 227, 83, 0.15)',
    },
    circle3: {
        position: 'absolute',
        bottom: 200,
        right: -20,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 227, 83, 0.08)',
    },
    rtl: {
        textAlign: 'right',
        writingDirection: 'rtl',
    },
});

export default WelcomeScreen;
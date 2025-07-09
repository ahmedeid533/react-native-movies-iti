import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image,
    Dimensions,
    StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {useAuth} from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width, height} = Dimensions.get('window');

const HomeScreen = () => {
    const {language} = useSelector((state) => state.languages) || {language: 'en'};
    const {user} = useAuth();
    const navigation = useNavigation();

    // Translated text
    const welcomeText = language === 'ar'
        ? 'اكتشف عالم السينما والترفيه'
        : 'Discover the World of Cinema & Entertainment';

    const heroSubtitle = language === 'ar'
        ? 'منصة شاملة لاستكشاف الأفلام والمسلسلات مع ميزات متقدمة لإدارة قوائم المشاهدة المفضلة'
        : 'Your comprehensive platform for discovering movies and TV shows with advanced features for managing your favorite watchlists';

    const featuresTitle = language === 'ar' ? 'لماذا تختار تطبيقنا؟' : 'Why Choose Our Platform?';
    const exploreMoviesText = language === 'ar' ? 'استكشف الأفلام' : 'Explore Movies';
    const exploreShowsText = language === 'ar' ? 'استكشف المسلسلات' : 'Explore TV Shows';
    const loginPromptText = language === 'ar' ? 'سجل الدخول لحفظ مفضلاتك' : 'Login to Save Your Favorites';

    const features = [
        {
            icon: '🎬',
            title: language === 'ar' ? 'مكتبة ضخمة' : 'Vast Library',
            description: language === 'ar'
                ? 'آلاف الأفلام والمسلسلات من جميع أنحاء العالم'
                : 'Thousands of movies and TV shows from around the world'
        },
        {
            icon: '⭐',
            title: language === 'ar' ? 'تقييمات موثوقة' : 'Trusted Ratings',
            description: language === 'ar'
                ? 'تقييمات دقيقة من مجتمع المشاهدين العالمي'
                : 'Accurate ratings from the global movie community'
        },
        {
            icon: '💾',
            title: language === 'ar' ? 'قوائم مخصصة' : 'Personal Watchlists',
            description: language === 'ar'
                ? 'احفظ مفضلاتك وشاركها مع الأصدقاء'
                : 'Save your favorites and share them with friends'
        },
        {
            icon: '🌐',
            title: language === 'ar' ? 'دعم متعدد اللغات' : 'Multi-language Support',
            description: language === 'ar'
                ? 'واجهة بعدة لغات لتجربة أفضل'
                : 'Interface in multiple languages for better experience'
        }
    ];

    const stats = [
        {
            number: '50K+',
            label: language === 'ar' ? 'الأفلام' : 'Movies'
        },
        {
            number: '10K+',
            label: language === 'ar' ? 'المسلسلات' : 'TV Shows'
        },
        {
            number: '1M+',
            label: language === 'ar' ? 'المستخدمين' : 'Users'
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff"/>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <View style={styles.heroContent}>
                        <Text style={[styles.heroTitle, language === 'ar' && styles.rtl]}>
                            {welcomeText}
                        </Text>
                        <Text style={[styles.heroSubtitle, language === 'ar' && styles.rtl]}>
                            {heroSubtitle}
                        </Text>

                        <View style={styles.heroActions}>
                            {!user && (
                                <View style={styles.loginPrompt}>
                                    <Text style={[styles.loginPromptText, language === 'ar' && styles.rtl]}>
                                        {loginPromptText}
                                    </Text>
                                </View>
                            )}

                            <View style={styles.actionButtons}>
                                <TouchableOpacity
                                    style={[styles.primaryButton, styles.heroBtn]}
                                    onPress={() => navigation.navigate('Movies')}
                                >
                                    <Icon name="movie" size={20} color="#1a1a1a" style={styles.buttonIcon}/>
                                    <Text style={styles.primaryButtonText}>
                                        {exploreMoviesText}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.secondaryButton, styles.heroBtn]}
                                    onPress={() => navigation.navigate('TV Shows')}
                                >
                                    <Icon name="tv" size={20} color="#ffe353" style={styles.buttonIcon}/>
                                    <Text style={styles.secondaryButtonText}>
                                        {exploreShowsText}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Floating Cards Visual */}
                    <View style={styles.heroVisual}>
                        <View style={styles.floatingCards}>
                            {[1, 2, 3].map((index) => (
                                <View key={index} style={[styles.movieCardFloat, styles[`card${index}`]]}>
                                    <View style={styles.cardContent}>
                                        <View style={styles.cardImage}>
                                            <Text style={styles.cardImageIcon}>🎬</Text>
                                        </View>
                                        <View style={styles.cardInfo}>
                                            <View style={styles.cardTitle}/>
                                            <View style={styles.cardRating}>
                                                {[...Array(5)].map((_, i) => (
                                                    <Icon key={i} name="star" size={12} color="#ffe353"/>
                                                ))}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Features Section */}
                <View style={styles.featuresSection}>
                    <Text style={[styles.sectionTitle, language === 'ar' && styles.rtl]}>
                        {featuresTitle}
                    </Text>
                    <View style={styles.featuresGrid}>
                        {features.map((feature, index) => (
                            <View key={index} style={styles.featureCard}>
                                <Text style={styles.featureIcon}>{feature.icon}</Text>
                                <Text style={[styles.featureTitle, language === 'ar' && styles.rtl]}>
                                    {feature.title}
                                </Text>
                                <Text style={[styles.featureDescription, language === 'ar' && styles.rtl]}>
                                    {feature.description}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Statistics Section */}
                <View style={styles.statsSection}>
                    <View style={styles.statsGrid}>
                        {stats.map((stat, index) => (
                            <View key={index} style={styles.statItem}>
                                <Text style={styles.statNumber}>{stat.number}</Text>
                                <Text style={[styles.statLabel, language === 'ar' && styles.rtl]}>
                                    {stat.label}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Call to Action Section */}
                <View style={styles.ctaSection}>
                    <Text style={[styles.ctaTitle, language === 'ar' && styles.rtl]}>
                        {language === 'ar'
                            ? 'ابدأ رحلتك السينمائية اليوم'
                            : 'Start Your Cinematic Journey Today'}
                    </Text>
                    <Text style={[styles.ctaDescription, language === 'ar' && styles.rtl]}>
                        {language === 'ar'
                            ? 'انضم إلى ملايين المستخدمين واكتشف أفضل الأفلام والمسلسلات'
                            : 'Join millions of users and discover the best movies and TV shows'}
                    </Text>
                    <View style={styles.ctaButtons}>
                        <TouchableOpacity
                            style={[styles.primaryButton, styles.ctaBtn]}
                            onPress={() => navigation.navigate('Movies')}
                        >
                            <Text style={styles.primaryButtonText}>
                                {language === 'ar' ? 'تصفح الأفلام' : 'Browse Movies'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.secondaryButton, styles.ctaBtn]}
                            onPress={() => navigation.navigate('TV Shows')}
                        >
                            <Text style={styles.secondaryButtonText}>
                                {language === 'ar' ? 'تصفح المسلسلات' : 'Browse TV Shows'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollView: {
        flex: 1,
    },
    heroSection: {
        backgroundColor: '#fff7e6',
        paddingHorizontal: 20,
        paddingVertical: 40,
        minHeight: height * 0.6,
    },
    heroContent: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 20,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 15,
        lineHeight: 40,
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 20,
        lineHeight: 24,
    },
    heroActions: {
        marginTop: 20,
    },
    loginPrompt: {
        marginBottom: 20,
    },
    loginPromptText: {
        fontSize: 16,
        color: '#888888',
        fontWeight: '500',
    },
    actionButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    heroBtn: {
        flex: 1,
        minWidth: 150,
    },
    primaryButton: {
        backgroundColor: '#ffe353',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#ffe353',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    primaryButtonText: {
        color: '#1a1a1a',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButtonText: {
        color: '#ffe353',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonIcon: {
        marginRight: 8,
    },
    heroVisual: {
        height: 200,
        position: 'relative',
    },
    floatingCards: {
        flex: 1,
        position: 'relative',
    },
    movieCardFloat: {
        position: 'absolute',
        width: 100,
        height: 150,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    card1: {
        top: 20,
        left: 20,
    },
    card2: {
        top: 10,
        right: 30,
    },
    card3: {
        bottom: 20,
        left: 60,
    },
    cardContent: {
        flex: 1,
    },
    cardImage: {
        height: 80,
        backgroundColor: '#f0f0f0',
        borderRadius: 6,
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardImageIcon: {
        fontSize: 24,
        opacity: 0.3,
    },
    cardInfo: {
        flex: 1,
    },
    cardTitle: {
        height: 8,
        backgroundColor: '#ddd',
        borderRadius: 4,
        marginBottom: 6,
    },
    cardRating: {
        flexDirection: 'row',
        gap: 2,
    },
    featuresSection: {
        padding: 20,
        backgroundColor: '#ffffff',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 20,
        textAlign: 'center',
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    featureCard: {
        width: '48%',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    featureIcon: {
        fontSize: 32,
        marginBottom: 10,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 8,
        textAlign: 'center',
    },
    featureDescription: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 20,
    },
    statsSection: {
        backgroundColor: '#ffe353',
        padding: 20,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 14,
        color: '#333333',
        fontWeight: '500',
        textTransform: 'uppercase',
    },
    ctaSection: {
        backgroundColor: '#1a1a1a',
        padding: 20,
        alignItems: 'center',
    },
    ctaTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 10,
        textAlign: 'center',
    },
    ctaDescription: {
        fontSize: 16,
        color: '#cccccc',
        marginBottom: 20,
        textAlign: 'center',
        lineHeight: 24,
    },
    ctaButtons: {
        flexDirection: 'row',
        gap: 10,
        width: '100%',
    },
    ctaBtn: {
        flex: 1,
    },
    rtl: {
        textAlign: 'right',
        writingDirection: 'rtl',
    },
});

export default HomeScreen;
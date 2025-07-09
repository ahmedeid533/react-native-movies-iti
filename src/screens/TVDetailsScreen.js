import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
    Alert,
    Dimensions,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import axiosInstance from '../apis/config';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width, height} = Dimensions.get('window');

const TVDetailsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const {showId} = route.params;
    const {language} = useSelector((state) => state.languages) || {language: 'en'};

    const [show, setShow] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTVShowDetails();
    }, [showId]);

    const fetchTVShowDetails = async () => {
        try {
            // Fetch TV show details
            const showResponse = await axiosInstance.get(`/tv/${showId}`);
            setShow(showResponse.data);

            // Fetch recommendations
            const recommendationsResponse = await axiosInstance.get(`/tv/${showId}/recommendations`);
            setRecommendations(recommendationsResponse.data.results || []);

        } catch (error) {
            console.error('Error fetching TV show details:', error);
            Alert.alert('Error', 'Failed to fetch TV show details');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
    };

    const getYearFromDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'N/A' : date.getFullYear().toString();
    };

    const handleRecommendationPress = (recommendedShowId) => {
        navigation.push('TVDetails', {showId: recommendedShowId});
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating / 2);
        const hasHalfStar = (rating / 2) % 1 !== 0;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<Icon key={i} name="star" size={16} color="#ffe353"/>);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<Icon key={i} name="star-half" size={16} color="#ffe353"/>);
            } else {
                stars.push(<Icon key={i} name="star-border" size={16} color="#ddd"/>);
            }
        }
        return stars;
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#1a1a1a"/>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#ffe353"/>
                    <Text style={styles.loadingText}>Loading TV show details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!show) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#ffffff"/>
                <View style={styles.errorContainer}>
                    <Icon name="error" size={60} color="#e0e0e0"/>
                    <Text style={styles.errorText}>TV show not found</Text>
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1a1a1a"/>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header with Backdrop */}
                <View style={styles.header}>
                    {show.backdrop_path && (
                        <Image
                            source={{uri: `https://image.tmdb.org/t/p/w780/${show.backdrop_path}`}}
                            style={styles.backdrop}
                            resizeMode="cover"
                        />
                    )}
                    <View style={styles.headerOverlay}/>

                    {/* Back Button */}
                    <TouchableOpacity
                        style={styles.backIconButton}
                        onPress={handleBack}
                        activeOpacity={0.7}
                    >
                        <Icon name="arrow-back" size={24} color="#ffffff"/>
                    </TouchableOpacity>

                    {/* Show Poster and Info */}
                    <View style={styles.showInfo}>
                        <View style={styles.posterContainer}>
                            <Image
                                source={{uri: `https://image.tmdb.org/t/p/w500/${show.poster_path}`}}
                                style={styles.poster}
                                resizeMode="cover"
                            />
                            <View style={styles.ratingBadge}>
                                <Text style={styles.ratingText}>
                                    {show.vote_average.toFixed(1)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.showDetails}>
                            <Text style={[styles.showTitle, language === 'ar' && styles.rtl]}>
                                {show.name}
                            </Text>
                            <Text style={[styles.showDate, language === 'ar' && styles.rtl]}>
                                {formatDate(show.first_air_date)}
                            </Text>

                            <View style={styles.ratingContainer}>
                                <View style={styles.stars}>
                                    {renderStars(show.vote_average)}
                                </View>
                                <Text style={styles.voteAverage}>
                                    {show.vote_average.toFixed(1)} / 10
                                </Text>
                            </View>

                            <View style={styles.showMeta}>
                                <Text style={styles.metaText}>
                                    {show.number_of_seasons} {language === 'ar' ? 'موسم' : 'Season'}{show.number_of_seasons > 1 ? 's' : ''} • {show.original_language?.toUpperCase()}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    {/* Genres */}
                    {show.genres && show.genres.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.genresContainer}>
                                {show.genres.map((genre) => (
                                    <View key={genre.id} style={styles.genreTag}>
                                        <Text style={styles.genreText}>{genre.name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Overview */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, language === 'ar' && styles.rtl]}>
                            {language === 'ar' ? 'نبذة' : 'Overview'}
                        </Text>
                        <Text style={[styles.overview, language === 'ar' && styles.rtl]}>
                            {show.overview || (language === 'ar' ? 'لا يوجد وصف متاح' : 'No overview available')}
                        </Text>
                    </View>

                    {/* Show Info */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, language === 'ar' && styles.rtl]}>
                            {language === 'ar' ? 'معلومات المسلسل' : 'Show Information'}
                        </Text>
                        <View style={styles.infoGrid}>
                            <View style={styles.infoItem}>
                                <Text style={[styles.infoLabel, language === 'ar' && styles.rtl]}>
                                    {language === 'ar' ? 'عدد الحلقات:' : 'Episodes:'}
                                </Text>
                                <Text style={[styles.infoValue, language === 'ar' && styles.rtl]}>
                                    {show.number_of_episodes || 'N/A'}
                                </Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={[styles.infoLabel, language === 'ar' && styles.rtl]}>
                                    {language === 'ar' ? 'عدد المواسم:' : 'Seasons:'}
                                </Text>
                                <Text style={[styles.infoValue, language === 'ar' && styles.rtl]}>
                                    {show.number_of_seasons || 'N/A'}
                                </Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={[styles.infoLabel, language === 'ar' && styles.rtl]}>
                                    {language === 'ar' ? 'اللغة:' : 'Language:'}
                                </Text>
                                <Text style={[styles.infoValue, language === 'ar' && styles.rtl]}>
                                    {show.original_language ? show.original_language.toUpperCase() : 'N/A'}
                                </Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={[styles.infoLabel, language === 'ar' && styles.rtl]}>
                                    {language === 'ar' ? 'الحالة:' : 'Status:'}
                                </Text>
                                <Text style={[styles.infoValue, language === 'ar' && styles.rtl]}>
                                    {show.status || 'N/A'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Production Companies */}
                    {show.production_companies && show.production_companies.length > 0 && (
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, language === 'ar' && styles.rtl]}>
                                {language === 'ar' ? 'شركات الإنتاج' : 'Production Companies'}
                            </Text>
                            <View style={styles.companiesContainer}>
                                {show.production_companies.slice(0, 4).map((company) => (
                                    company.logo_path && (
                                        <View key={company.id} style={styles.companyItem}>
                                            <Image
                                                source={{uri: `https://image.tmdb.org/t/p/w200/${company.logo_path}`}}
                                                style={styles.companyLogo}
                                                resizeMode="contain"
                                            />
                                            <Text style={[styles.companyName, language === 'ar' && styles.rtl]}>
                                                {company.name}
                                            </Text>
                                        </View>
                                    )
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Recommendations */}
                    {recommendations.length > 0 && (
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, language === 'ar' && styles.rtl]}>
                                {language === 'ar' ? 'اقتراحات' : 'Recommendations'}
                            </Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.recommendationsContainer}
                            >
                                {recommendations.slice(0, 10).map((rec) => (
                                    <TouchableOpacity
                                        key={rec.id}
                                        style={styles.recommendationCard}
                                        onPress={() => handleRecommendationPress(rec.id)}
                                        activeOpacity={0.8}
                                    >
                                        <Image
                                            source={{uri: `https://image.tmdb.org/t/p/w300/${rec.poster_path}`}}
                                            style={styles.recommendationPoster}
                                            resizeMode="cover"
                                        />
                                        <Text style={styles.recommendationTitle} numberOfLines={2}>
                                            {rec.name || 'Unknown Title'}
                                        </Text>
                                        <Text style={styles.recommendationYear}>
                                            {getYearFromDate(rec.first_air_date)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
    },
    loadingText: {
        color: '#ffffff',
        fontSize: 16,
        marginTop: 10,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    errorText: {
        fontSize: 18,
        color: '#666666',
        marginTop: 15,
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: '#ffe353',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#1a1a1a',
        fontSize: 16,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        height: height * 0.4,
        position: 'relative',
    },
    backdrop: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    headerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    backIconButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: 8,
        zIndex: 1,
    },
    showInfo: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
    },
    posterContainer: {
        position: 'relative',
        marginRight: 15,
    },
    poster: {
        width: 120,
        height: 180,
        borderRadius: 12,
    },
    ratingBadge: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: '#ffe353',
        borderRadius: 15,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    ratingText: {
        color: '#1a1a1a',
        fontSize: 12,
        fontWeight: 'bold',
    },
    showDetails: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    showTitle: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    showDate: {
        color: '#cccccc',
        fontSize: 16,
        marginBottom: 10,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    stars: {
        flexDirection: 'row',
        marginRight: 10,
    },
    voteAverage: {
        color: '#ffe353',
        fontSize: 16,
        fontWeight: 'bold',
    },
    showMeta: {
        marginTop: 5,
    },
    metaText: {
        color: '#cccccc',
        fontSize: 14,
    },
    content: {
        padding: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 15,
    },
    genresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    genreTag: {
        backgroundColor: '#ffe353',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    genreText: {
        color: '#1a1a1a',
        fontSize: 14,
        fontWeight: '600',
    },
    overview: {
        fontSize: 16,
        lineHeight: 24,
        color: '#444444',
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    infoItem: {
        width: '48%',
        marginBottom: 15,
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666666',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        color: '#333333',
        fontWeight: '500',
    },
    companiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
    },
    companyItem: {
        alignItems: 'center',
        width: 100,
    },
    companyLogo: {
        width: 80,
        height: 40,
        marginBottom: 8,
    },
    companyName: {
        fontSize: 12,
        color: '#666666',
        textAlign: 'center',
    },
    recommendationsContainer: {
        paddingLeft: 0,
    },
    recommendationCard: {
        width: 120,
        marginRight: 15,
    },
    recommendationPoster: {
        width: 120,
        height: 180,
        borderRadius: 12,
        marginBottom: 8,
    },
    recommendationTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 4,
    },
    recommendationYear: {
        fontSize: 12,
        color: '#666666',
    },
    rtl: {
        textAlign: 'right',
        writingDirection: 'rtl',
    },
});

export default TVDetailsScreen;
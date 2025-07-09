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

const MovieDetailsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const {movieId} = route.params;
    const {language} = useSelector((state) => state.languages) || {language: 'en'};

    const [movie, setMovie] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMovieDetails();
    }, [movieId]);

    const fetchMovieDetails = async () => {
        try {
            // Fetch movie details
            const movieResponse = await axiosInstance.get(`/movie/${movieId}`);
            setMovie(movieResponse.data);

            // Fetch recommendations
            const recommendationsResponse = await axiosInstance.get(`/movie/${movieId}/recommendations`);
            setRecommendations(recommendationsResponse.data.results || []);

            // Fetch reviews
            const reviewsResponse = await axiosInstance.get(`/movie/${movieId}/reviews`);
            setReviews(reviewsResponse.data.results || []);

        } catch (error) {
            console.error('Error fetching movie details:', error);
            Alert.alert('Error', 'Failed to fetch movie details');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
    };

    const formatRuntime = (minutes) => {
        if (!minutes) return 'N/A';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const handleRecommendationPress = (recommendedMovieId) => {
        navigation.push('MovieDetails', {movieId: recommendedMovieId});
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
                    <Text style={styles.loadingText}>Loading movie details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!movie) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#ffffff"/>
                <View style={styles.errorContainer}>
                    <Icon name="error" size={60} color="#e0e0e0"/>
                    <Text style={styles.errorText}>Movie not found</Text>
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
                    {movie.backdrop_path && (
                        <Image
                            source={{uri: `https://image.tmdb.org/t/p/w780/${movie.backdrop_path}`}}
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

                    {/* Movie Poster and Info */}
                    <View style={styles.movieInfo}>
                        <View style={styles.posterContainer}>
                            <Image
                                source={{uri: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`}}
                                style={styles.poster}
                                resizeMode="cover"
                            />
                            <View style={styles.ratingBadge}>
                                <Text style={styles.ratingText}>
                                    {movie.vote_average.toFixed(1)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.movieDetails}>
                            <Text style={[styles.movieTitle, language === 'ar' && styles.rtl]}>
                                {movie.title}
                            </Text>
                            <Text style={[styles.movieDate, language === 'ar' && styles.rtl]}>
                                {formatDate(movie.release_date)}
                            </Text>

                            <View style={styles.ratingContainer}>
                                <View style={styles.stars}>
                                    {renderStars(movie.vote_average)}
                                </View>
                                <Text style={styles.voteAverage}>
                                    {movie.vote_average.toFixed(1)} / 10
                                </Text>
                            </View>

                            <View style={styles.movieMeta}>
                                <Text style={styles.metaText}>
                                    {formatRuntime(movie.runtime)} • {movie.original_language?.toUpperCase()}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    {/* Genres */}
                    {movie.genres && movie.genres.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.genresContainer}>
                                {movie.genres.map((genre) => (
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
                            {movie.overview || (language === 'ar' ? 'لا يوجد وصف متاح' : 'No overview available')}
                        </Text>
                    </View>

                    {/* Production Companies */}
                    {movie.production_companies && movie.production_companies.length > 0 && (
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, language === 'ar' && styles.rtl]}>
                                {language === 'ar' ? 'شركات الإنتاج' : 'Production Companies'}
                            </Text>
                            <View style={styles.companiesContainer}>
                                {movie.production_companies.slice(0, 4).map((company) => (
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

                    {/* Reviews */}
                    {reviews.length > 0 && (
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, language === 'ar' && styles.rtl]}>
                                {language === 'ar' ? 'المراجعات' : 'Reviews'}
                            </Text>
                            {reviews.slice(0, 3).map((review) => (
                                <View key={review.id} style={styles.reviewCard}>
                                    <View style={styles.reviewHeader}>
                                        <View style={styles.reviewAvatar}>
                                            <Text style={styles.reviewAvatarText}>
                                                {review.author.charAt(0).toUpperCase()}
                                            </Text>
                                        </View>
                                        <View style={styles.reviewInfo}>
                                            <Text style={[styles.reviewAuthor, language === 'ar' && styles.rtl]}>
                                                {review.author}
                                            </Text>
                                            <Text style={[styles.reviewDate, language === 'ar' && styles.rtl]}>
                                                {formatDate(review.created_at)}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.reviewContent, language === 'ar' && styles.rtl]}
                                          numberOfLines={4}>
                                        {review.content}
                                    </Text>
                                </View>
                            ))}
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
                                            {rec.title}
                                        </Text>
                                        <Text style={styles.recommendationYear}>
                                            {rec.release_date ? new Date(rec.release_date).getFullYear() : 'N/A'}
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
    movieInfo: {
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
    movieDetails: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    movieTitle: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    movieDate: {
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
    movieMeta: {
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
    reviewCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    reviewAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ffe353',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    reviewAvatarText: {
        color: '#1a1a1a',
        fontSize: 18,
        fontWeight: 'bold',
    },
    reviewInfo: {
        flex: 1,
    },
    reviewAuthor: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
    },
    reviewDate: {
        fontSize: 14,
        color: '#666666',
        marginTop: 2,
    },
    reviewContent: {
        fontSize: 14,
        lineHeight: 20,
        color: '#555555',
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

export default MovieDetailsScreen;
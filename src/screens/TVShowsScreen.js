import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Alert,
    ActivityIndicator,
    Image,
    Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {useAuth} from '../context/AuthContext';
import axiosInstance from '../apis/config';
import {addToWishlist, removeFromWishlsit} from '../store/slices/WishListSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

// Custom Circular Progress Component for React Native
const CircularProgress = ({percentage}) => {
    return (
        <View style={styles.circularProgressContainer}>
            <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
        </View>
    );
};

const TVShowsScreen = () => {
    const {language} = useSelector((state) => state.languages) || {language: 'en'};
    const {user} = useAuth();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [tvShows, setTVShows] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const wishlist = useSelector((state) =>
        state.wishlist.value?.filter((item) => item.type === 'show') || []
    );

    useEffect(() => {
        fetchTVShows();
    }, [page]);

    const fetchTVShows = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/tv/popular', {
                params: {page}
            });
            setTVShows(response.data.results);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error('Error fetching TV shows', error);
            Alert.alert('Error', 'Failed to fetch TV shows. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (query.trim()) {
            navigation.navigate('Search', {query: query.trim(), type: 'tv'});
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        setPage(1);
        try {
            await fetchTVShows();
        } catch (error) {
            console.error('Error refreshing TV shows', error);
        } finally {
            setRefreshing(false);
        }
    };

    const handleLoadMore = () => {
        if (page < totalPages && !loading) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const addToDb = async (show) => {
        if (!user) return;

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/wishlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user.email,
                    movie: show,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add show to wishlist');
            }

            return await response.json();
        } catch (error) {
            console.error('Error adding show to wishlist:', error);
            Alert.alert('Error', 'Failed to add show to wishlist');
        }
    };

    const removeFromWishlsit_ = async (email, showId) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/wishlist`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    movieId: showId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to remove show from wishlist');
            }

            const data = await response.json();
            console.log('Show removed from wishlist:', data);
        } catch (error) {
            console.error('Error removing show from wishlist:', error);
            Alert.alert('Error', 'Failed to remove show from wishlist');
        }
    };

    const handleWishlistToggle = (show) => {
        if (!user) {
            Alert.alert('Login Required', 'Please login to add shows to your wishlist');
            return;
        }

        const isInWishlist = wishlist.find((item) => item.id === show.id);

        if (isInWishlist) {
            dispatch(removeFromWishlsit(show));
            removeFromWishlsit_(user.email, show.id);
        } else {
            dispatch(addToWishlist({...show, type: 'show'}));
            addToDb(show);
        }
    };

    const handleShowPress = (showId) => {
        navigation.navigate('TVDetails', {showId});
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        });
    };

    const renderTVShow = ({item}) => {
        const isInWishlist = wishlist.find((wishItem) => wishItem.id === item.id);

        return (
            <TouchableOpacity
                style={styles.showCard}
                onPress={() => handleShowPress(item.id)}
                activeOpacity={0.8}
            >
                <View style={styles.posterWrapper}>
                    <Image
                        source={{
                            uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
                        }}
                        style={styles.poster}
                        resizeMode="cover"
                    />

                    {/* Rating Circle */}
                    <View style={styles.ratingCircle}>
                        <Text style={styles.ratingText}>
                            {Math.round(item.vote_average * 10)}%
                        </Text>
                    </View>

                    {/* Heart Icon */}
                    {user && (
                        <TouchableOpacity
                            style={[styles.heartIcon, isInWishlist && styles.heartIconLiked]}
                            onPress={() => handleWishlistToggle(item)}
                            activeOpacity={0.7}
                        >
                            <Icon
                                name={isInWishlist ? 'favorite' : 'favorite-border'}
                                size={18}
                                color={isInWishlist ? '#ffe353' : '#999999'}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.showInfo}>
                    <Text style={styles.showTitle} numberOfLines={2}>
                        {item.name?.split(' ').slice(0, 3).join(' ') || 'Unknown Title'}
                    </Text>
                    <Text style={styles.showDate}>
                        {formatDate(item.first_air_date)}
                    </Text>

                    {/* Rating Stars */}
                    <View style={styles.ratingStars}>
                        {[...Array(5)].map((_, index) => (
                            <Icon
                                key={index}
                                name="star"
                                size={12}
                                color={index < Math.round(item.vote_average / 2) ? '#ffe353' : '#ddd'}
                            />
                        ))}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderFooter = () => {
        if (!loading || page === 1) return null;
        return (
            <View style={styles.loadingFooter}>
                <ActivityIndicator size="large" color="#ffe353"/>
                <Text style={styles.loadingText}>Loading more shows...</Text>
            </View>
        );
    };

    // Translated text
    const titleText = language === 'ar' ? 'المسلسلات' : 'TV Shows';
    const placeholderText = language === 'ar' ? 'ابحث عن مسلسل...' : 'Search for a TV show...';
    const searchButtonText = language === 'ar' ? 'بحث' : 'Search';
    const noShowsText = language === 'ar' ? 'لم يتم العثور على مسلسلات.' : 'No TV shows found.';

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff"/>

            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, language === 'ar' && styles.rtl]}>
                    {titleText}
                </Text>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={[styles.searchInput, language === 'ar' && styles.rtl]}
                        value={query}
                        onChangeText={setQuery}
                        placeholder={placeholderText}
                        placeholderTextColor="#888888"
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                    />
                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={handleSearch}
                    >
                        <Icon name="search" size={18} color="#1a1a1a"/>
                    </TouchableOpacity>
                </View>
            </View>

            {/* TV Shows List */}
            {loading && page === 1 ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#ffe353"/>
                    <Text style={styles.loadingText}>Loading TV shows...</Text>
                </View>
            ) : tvShows.length > 0 ? (
                <FlatList
                    data={tvShows}
                    renderItem={renderTVShow}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    contentContainerStyle={styles.showsList}
                    columnWrapperStyle={styles.showRow}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Icon name="tv-off" size={60} color="#ccc"/>
                    <Text style={[styles.emptyText, language === 'ar' && styles.rtl]}>
                        {noShowsText}
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 15,
    },
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: '#f8f9fa',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333333',
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    searchButton: {
        backgroundColor: '#ffe353',
        borderRadius: 18,
        paddingHorizontal: 12,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
    },
    showsList: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
    },
    showRow: {
        justifyContent: 'space-between',
    },
    showCard: {
        width: cardWidth,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 20,
    },
    posterWrapper: {
        position: 'relative',
        width: '100%',
        height: cardWidth * 1.5,
    },
    poster: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f0',
    },
    ratingCircle: {
        position: 'absolute',
        bottom: -18,
        left: 10,
        width: 36,
        height: 36,
        backgroundColor: '#333333',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    circularProgressContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#21d07a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    percentageText: {
        color: '#ffffff',
        fontSize: 8,
        fontWeight: 'bold',
    },
    heartIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 30,
        height: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    heartIconLiked: {
        backgroundColor: 'rgba(255, 227, 83, 0.2)',
    },
    showInfo: {
        padding: 12,
        paddingTop: 22, // Account for rating circle overlap
    },
    showTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 4,
        lineHeight: 18,
    },
    showDate: {
        fontSize: 12,
        color: '#666666',
        marginBottom: 6,
    },
    ratingStars: {
        flexDirection: 'row',
        gap: 2,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingFooter: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666666',
        marginTop: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginTop: 15,
    },
    rtl: {
        textAlign: 'right',
        writingDirection: 'rtl',
    },
});

export default TVShowsScreen;
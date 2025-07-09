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
    ActivityIndicator,
    Image,
    Dimensions,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import axiosInstance from '../apis/config';
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

const SearchScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const {query: initialQuery, type} = route.params || {};
    const {language} = useSelector((state) => state.languages) || {language: 'en'};

    const [results, setResults] = useState([]);
    const [query, setQuery] = useState(initialQuery || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialQuery) {
            performSearch(initialQuery);
        }
    }, [initialQuery]);

    const performSearch = async (searchQuery) => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        try {
            const movieResult = await axiosInstance.get('/search/movie', {
                params: {query: encodeURIComponent(searchQuery)},
            });

            const tvResult = await axiosInstance.get('/search/tv', {
                params: {query: encodeURIComponent(searchQuery)},
            });

            const transformMovies = movieResult.data.results.map((movie) => ({
                ...movie,
                media_type: 'movie',
            }));

            const transformTvShows = tvResult.data.results.map((show) => ({
                ...show,
                title: show.name,
                media_type: 'tvShow',
            }));

            const combinedResults = [...transformMovies, ...transformTvShows].sort(
                (a, b) => b.popularity - a.popularity
            );

            setResults(combinedResults);
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        performSearch(query);
    };

    const handleItemPress = (item) => {
        if (item.media_type === 'tvShow') {
            navigation.navigate('TVDetails', {showId: item.id});
        } else {
            navigation.navigate('MovieDetails', {movieId: item.id});
        }
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

    const renderSearchResult = ({item}) => {
        const title = item.title || item.name || 'Unknown Title';
        const releaseDate = item.release_date || item.first_air_date;

        return (
            <TouchableOpacity
                style={styles.resultCard}
                onPress={() => handleItemPress(item)}
                activeOpacity={0.8}
            >
                <View style={styles.posterWrapper}>
                    <Image
                        source={{
                            uri: item.poster_path
                                ? `https://image.tmdb.org/t/p/w500/${item.poster_path}`
                                : 'https://via.placeholder.com/300x450/f0f0f0/666?text=No+Image',
                        }}
                        style={styles.poster}
                        resizeMode="cover"
                    />

                    {/* Rating Circle */}
                    <View style={styles.ratingCircle}>
                        <CircularProgress percentage={(item.vote_average || 0) * 10}/>
                    </View>

                    {/* Media Type Badge */}
                    <View style={styles.mediaTypeBadge}>
                        <Icon
                            name={item.media_type === 'tvShow' ? 'tv' : 'movie'}
                            size={12}
                            color="#ffffff"
                        />
                    </View>
                </View>

                <View style={styles.resultInfo}>
                    <Text style={[styles.resultTitle, language === 'ar' && styles.rtl]} numberOfLines={2}>
                        {title.split(' ').slice(0, 3).join(' ')}
                    </Text>
                    <Text style={[styles.resultDate, language === 'ar' && styles.rtl]}>
                        {formatDate(releaseDate)}
                    </Text>

                    {/* Rating Stars */}
                    <View style={styles.ratingStars}>
                        {[...Array(5)].map((_, index) => (
                            <Icon
                                key={index}
                                name="star"
                                size={12}
                                color={index < Math.round((item.vote_average || 0) / 2) ? '#ffe353' : '#ddd'}
                            />
                        ))}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const handleBack = () => {
        navigation.goBack();
    };

    // Translated text
    const searchTitle = language === 'ar' ? 'البحث' : 'Search';
    const searchPlaceholder = language === 'ar' ? 'ابحث عن فيلم أو مسلسل...' : 'Search for movies or TV shows...';
    const noResultsText = language === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found';
    const searchButtonText = language === 'ar' ? 'بحث' : 'Search';

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff"/>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <Icon name="arrow-back" size={24} color="#333333"/>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, language === 'ar' && styles.rtl]}>
                    {searchTitle}
                </Text>
                <View style={styles.placeholder}/>
            </View>

            {/* Search Bar */}
            <View style={styles.searchSection}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={[styles.searchInput, language === 'ar' && styles.rtl]}
                        value={query}
                        onChangeText={setQuery}
                        placeholder={searchPlaceholder}
                        placeholderTextColor="#888888"
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                    />
                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={handleSearch}
                    >
                        <Icon name="search" size={20} color="#1a1a1a"/>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Results */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#ffe353"/>
                    <Text style={styles.loadingText}>
                        {language === 'ar' ? 'جاري البحث...' : 'Searching...'}
                    </Text>
                </View>
            ) : results.length > 0 ? (
                <FlatList
                    data={results}
                    renderItem={renderSearchResult}
                    keyExtractor={(item) => `${item.media_type}-${item.id}`}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.resultsList}
                    columnWrapperStyle={styles.resultsRow}
                />
            ) : query.trim() ? (
                <View style={styles.emptyContainer}>
                    <Icon name="search-off" size={60} color="#e0e0e0"/>
                    <Text style={[styles.emptyText, language === 'ar' && styles.rtl]}>
                        {noResultsText}
                    </Text>
                </View>
            ) : (
                <View style={styles.emptyContainer}>
                    <Icon name="search" size={60} color="#e0e0e0"/>
                    <Text style={[styles.emptyText, language === 'ar' && styles.rtl]}>
                        {language === 'ar' ? 'ابدأ بالبحث عن المحتوى' : 'Start searching for content'}
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    placeholder: {
        width: 34, // Same width as back button for centering
    },
    searchSection: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#f8f9fa',
    },
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 5,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
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
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
    },
    resultsList: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
    },
    resultsRow: {
        justifyContent: 'space-between',
    },
    resultCard: {
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
    mediaTypeBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 12,
        padding: 6,
    },
    resultInfo: {
        padding: 12,
        paddingTop: 22, // Account for rating circle overlap
    },
    resultTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 4,
        lineHeight: 18,
    },
    resultDate: {
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

export default SearchScreen;
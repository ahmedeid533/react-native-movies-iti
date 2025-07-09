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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import axiosInstance from '../apis/config';
import MovieCard from '../components/MovieCard/MovieCard';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MoviesScreen = () => {
    const {language} = useSelector((state) => state.languages) || {language: 'en'};
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        fetchMovies();
    }, [page]);

    const fetchMovies = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/movie/now_playing', {
                params: {page}
            });
            setMovies(response.data.results);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error('Error fetching now playing movies', error);
            Alert.alert('Error', 'Failed to fetch movies. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (query.trim()) {
            navigation.navigate('Search', {query: query.trim()});
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchMovies();
        } catch (error) {
            console.error('Error refreshing movies', error);
        } finally {
            setRefreshing(false);
        }
    };

    const handleLoadMore = () => {
        if (page < totalPages && !loading) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const renderMovie = ({item}) => (
        <View style={styles.movieItem}>
            <MovieCard movie={item}/>
        </View>
    );

    const renderFooter = () => {
        if (!loading || page === 1) return null;
        return (
            <View style={styles.loadingFooter}>
                <ActivityIndicator size="large" color="#ffe353"/>
                <Text style={styles.loadingText}>Loading more movies...</Text>
            </View>
        );
    };

    // Translated text
    const welcomeText = language === 'ar'
        ? 'مرحبًا بك في تطبيق الأفلام الخاص بنا'
        : 'Welcome to our movie app';
    const descriptionText = language === 'ar'
        ? 'ملايين الأفلام والبرامج التلفزيونية والأشخاص لاكتشافهم. استكشف الآن.'
        : 'Millions of movies, TV shows and people to discover. Explore now.';
    const sectionTitle = language === 'ar' ? 'يعرض الآن' : 'Now Playing';
    const placeholderText = language === 'ar' ? 'ابحث واكتشف...' : 'Search and explore...';
    const searchButtonText = language === 'ar' ? 'بحث' : 'Search';

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff"/>

            {/* Header Section */}
            <View style={styles.headerSection}>
                <Text style={[styles.welcomeText, language === 'ar' && styles.rtl]}>
                    {welcomeText}
                </Text>
                <Text style={[styles.descriptionText, language === 'ar' && styles.rtl]}>
                    {descriptionText}
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
                        <Icon name="search" size={20} color="#1a1a1a"/>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Movies Section */}
            <View style={styles.moviesSection}>
                <Text style={[styles.sectionTitle, language === 'ar' && styles.rtl]}>
                    {sectionTitle}
                </Text>

                {loading && page === 1 ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#ffe353"/>
                        <Text style={styles.loadingText}>Loading movies...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={movies}
                        renderItem={renderMovie}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={renderFooter}
                        contentContainerStyle={styles.moviesList}
                        columnWrapperStyle={styles.movieRow}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    headerSection: {
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 20,
        lineHeight: 22,
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
    moviesSection: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 15,
    },
    moviesList: {
        paddingBottom: 20,
    },
    movieRow: {
        justifyContent: 'space-between',
        paddingHorizontal: 5,
    },
    movieItem: {
        width: '48%',
        marginBottom: 20,
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
    rtl: {
        textAlign: 'right',
        writingDirection: 'rtl',
    },
});

export default MoviesScreen;
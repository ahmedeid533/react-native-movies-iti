import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {addToWishlist, removeFromWishlsit} from '../../store/slices/WishListSlice';
import {useAuth} from '../../context/AuthContext';

const {width} = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // Accounting for margins and padding

// Custom Circular Progress Component for React Native
const CircularProgress = ({percentage}) => {
    const radius = 18;
    const strokeWidth = 3;
    // In a proper SVG approach, you'd use circumference and strokeDasharray,
    // but for now, we'll just display the percentage with a colored background.
    // For simplicity, this component just shows a colored circle with the text.
    return (
        <View style={styles.circularProgressContainer}>
            <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
        </View>
    );
};

const MovieCard = ({movie}) => {
    const dispatch = useDispatch();
    const {user} = useAuth();
    const navigation = useNavigation();
    const wishlist = useSelector((state) => state.wishlist.value || []);
    const isLiked = wishlist.some((item) => item.id === movie.id);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        if (user) {
            setIsClient(true);
        }
    }, [user]);

    const addToDb = async (movie) => {
        if (!user) return;

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/wishlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user.email,
                    movie: movie,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add movie to wishlist');
            }

            return await response.json();
        } catch (error) {
            console.error('Error adding movie to wishlist:', error);
            Alert.alert('Error', 'Failed to add movie to wishlist');
        }
    };

    const removeFromWishlsit_ = async (email, movieId) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/wishlist`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    movieId: movieId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to remove movie from wishlist');
            }

            const data = await response.json();
            console.log('Movie removed from wishlist:', data);
        } catch (error) {
            console.error('Error removing movie from wishlist:', error);
            Alert.alert('Error', 'Failed to remove movie from wishlist');
        }
    };

    const handleLike = () => {
        if (!user) {
            Alert.alert('Login Required', 'Please login to add movies to your wishlist');
            return;
        }

        if (isLiked) {
            dispatch(removeFromWishlsit(movie));
            removeFromWishlsit_(user.email, movie.id);
        } else {
            dispatch(addToWishlist({...movie, type: 'movie'}));
            addToDb(movie);
        }
    };

    const handlePress = () => {
        navigation.navigate('MovieDetails', {movieId: movie.id});
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

    if (!movie || !movie.poster_path) {
        return null;
    }

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.8}>
            <View style={styles.posterWrapper}>
                <Image
                    source={{
                        uri: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
                    }}
                    style={styles.poster}
                    resizeMode="cover"
                />

                {/* Rating Circle */}
                <View style={styles.ratingCircle}>
                    <CircularProgress percentage={movie.vote_average * 10}/>
                </View>

                {/* Heart Icon */}
                {isClient && user && (
                    <TouchableOpacity
                        style={[styles.heartIcon, isLiked && styles.heartIconLiked]}
                        onPress={handleLike}
                        activeOpacity={0.7}
                    >
                        <Icon
                            name={isLiked ? 'favorite' : 'favorite-border'}
                            size={20}
                            color={isLiked ? '#ffe353' : '#999999'}
                        />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.cardBody}>
                <Text style={styles.title} numberOfLines={2}>
                    {movie.title || 'Unknown Title'}
                </Text>
                {isClient && (
                    <Text style={styles.date}>
                        {formatDate(movie.release_date)}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 10,
        width: cardWidth,
    },
    posterWrapper: {
        position: 'relative',
        width: '100%',
        height: cardWidth * 1.5, // Maintaining aspect ratio
    },
    poster: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f0',
    },
    ratingCircle: {
        position: 'absolute',
        bottom: -20,
        left: 10,
        width: 40,
        height: 40,
        backgroundColor: '#333333',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    circularProgressContainer: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#21d07a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    percentageText: {
        color: '#ffffff',
        fontSize: 9,
        fontWeight: 'bold',
    },
    heartIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 35,
        height: 35,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 17.5,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    heartIconLiked: {
        backgroundColor: 'rgba(255, 227, 83, 0.2)',
    },
    cardBody: {
        padding: 12,
        paddingTop: 25, // Account for rating circle overlap
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 5,
        lineHeight: 18,
    },
    date: {
        fontSize: 12,
        color: '#666666',
    },
});

export default MovieCard;
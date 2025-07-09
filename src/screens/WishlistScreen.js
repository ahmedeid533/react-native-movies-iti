import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	SafeAreaView,
	StatusBar,
	Image,
	Alert,
	ActivityIndicator,
	Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { removeFromWishlsit } from '../store/slices/WishListSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const WishlistScreen = () => {
	const { user } = useAuth();
	const { language } = useSelector((state) => state.languages) || { language: 'en' };
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const [wishlist, setWishlist] = useState([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		if (user) {
			fetchWishlist();
		}
	}, [user]);
	useEffect(() => {
		fetchWishlist();
	}, [language, navigation]);

	const fetchWishlist = async () => {
		if (!user) return;

		try {
			const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/wishlist?email=${user.email}`);
			const data = await response.json();
			setWishlist(data?.wishlist || []);
		} catch (error) {
			console.error('Error fetching wishlist:', error);
			Alert.alert('Error', 'Failed to fetch wishlist');
		} finally {
			setLoading(false);
		}
	};

	const removeFromWishlsit_ = async (movieId) => {
		try {
			const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/wishlist`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: user.email,
					movieId: movieId,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to remove movie from wishlist');
			}

			const data = await response.json();
			setWishlist(data?.wishlist || []);
		} catch (error) {
			console.error('Error removing movie from wishlist:', error);
			Alert.alert('Error', 'Failed to remove movie from wishlist');
		}
	};

	const handleRemoveFromWishlist = (item) => {
		Alert.alert(
			language === 'ar' ? 'تأكيد الحذف' : 'Confirm Remove',
			language === 'ar'
				? 'هل تريد حذف هذا العنصر من المفضلة؟'
				: 'Are you sure you want to remove this item from your wishlist?',
			[
				{
					text: language === 'ar' ? 'إلغاء' : 'Cancel',
					style: 'cancel',
				},
				{
					text: language === 'ar' ? 'حذف' : 'Remove',
					style: 'destructive',
					onPress: () => {
						dispatch(removeFromWishlsit(item));
						removeFromWishlsit_(item.id);
					},
				},
			]
		);
	};

	const handleItemPress = (item) => {
		if (item.type === 'show' || item.name) {
			navigation.navigate('TVDetails', { showId: item.id });
		} else {
			navigation.navigate('MovieDetails', { movieId: item.id });
		}
	};

	const handleRefresh = async () => {
		setRefreshing(true);
		await fetchWishlist();
		setRefreshing(false);
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

	const renderWishlistItem = ({ item }) => {
		const title = item.title || item.name || 'Unknown Title';
		const releaseDate = item.release_date || item.first_air_date;
		const isShow = item.type === 'show' || item.name;

		return (
			<TouchableOpacity
				style={styles.wishlistItem}
				onPress={() => handleItemPress(item)}
				activeOpacity={0.8}
			>
				<View style={styles.itemContainer}>
					<View style={styles.posterContainer}>
						<Image
							source={{
								uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
							}}
							style={styles.poster}
							resizeMode="cover"
						/>
						<View style={styles.typeIndicator}>
							<Icon
								name={isShow ? 'tv' : 'movie'}
								size={14}
								color="#ffffff"
							/>
						</View>
					</View>

					<View style={styles.itemInfo}>
						<Text style={[styles.itemTitle, language === 'ar' && styles.rtl]} numberOfLines={2}>
							{title}
						</Text>
						<Text style={[styles.itemDate, language === 'ar' && styles.rtl]}>
							{formatDate(releaseDate)}
						</Text>

						{/* Rating */}
						<View style={styles.ratingContainer}>
							<View style={styles.ratingStars}>
								{[...Array(5)].map((_, index) => (
									<Icon
										key={index}
										name="star"
										size={14}
										color={index < Math.round(item.vote_average / 2) ? '#ffe353' : '#ddd'}
									/>
								))}
							</View>
							<Text style={styles.voteCount}>
								{item.vote_count || 0}
							</Text>
						</View>

						<Text
							style={[styles.itemOverview, language === 'ar' && styles.rtl]}
							numberOfLines={3}
						>
							{item.overview || (language === 'ar' ? 'لا يوجد وصف متاح' : 'No description available')}
						</Text>
					</View>

					<TouchableOpacity
						style={styles.removeButton}
						onPress={() => handleRemoveFromWishlist(item)}
						activeOpacity={0.7}
					>
						<Icon name="favorite" size={24} color="#ffe353" />
					</TouchableOpacity>
				</View>
			</TouchableOpacity>
		);
	};

	const renderEmptyState = () => (
		<View style={styles.emptyContainer}>
			<Icon name="favorite-border" size={80} color="#e0e0e0" />
			<Text style={[styles.emptyTitle, language === 'ar' && styles.rtl]}>
				{language === 'ar' ? 'قائمة المفضلة فارغة' : 'Your Wishlist is Empty'}
			</Text>
			<Text style={[styles.emptySubtitle, language === 'ar' && styles.rtl]}>
				{language === 'ar'
					? 'ابدأ في إضافة الأفلام والمسلسلات المفضلة لديك'
					: 'Start adding your favorite movies and TV shows'}
			</Text>
			<TouchableOpacity
				style={styles.exploreButton}
				onPress={() => navigation.navigate('Movies')}
				activeOpacity={0.8}
			>
				<Icon name="explore" size={20} color="#1a1a1a" style={styles.buttonIcon} />
				<Text style={styles.exploreButtonText}>
					{language === 'ar' ? 'استكشف الأفلام' : 'Explore Movies'}
				</Text>
			</TouchableOpacity>
		</View>
	);

	// Translated text
	const titleText = language === 'ar' ? 'قائمة المفضلة' : 'My Wishlist';
	const loginRequiredText = language === 'ar' ? 'تسجيل الدخول مطلوب' : 'Login Required';
	const loginPromptText = language === 'ar'
		? 'يرجى تسجيل الدخول لعرض قائمة المفضلة'
		: 'Please login to view your wishlist';

	if (!user) {
		return (
			<SafeAreaView style={styles.container}>
				<StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
				<View style={styles.loginRequiredContainer}>
					<Icon name="lock" size={80} color="#e0e0e0" />
					<Text style={[styles.loginRequiredTitle, language === 'ar' && styles.rtl]}>
						{loginRequiredText}
					</Text>
					<Text style={[styles.loginRequiredSubtitle, language === 'ar' && styles.rtl]}>
						{loginPromptText}
					</Text>
					<TouchableOpacity
						style={styles.loginButton}
						onPress={() => navigation.navigate('Welcome')}
						activeOpacity={0.8}
					>
						<Icon name="login" size={20} color="#1a1a1a" style={styles.buttonIcon} />
						<Text style={styles.loginButtonText}>
							{language === 'ar' ? 'تسجيل الدخول' : 'Login'}
						</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		);
	}

	if (loading) {
		return (
			<SafeAreaView style={styles.container}>
				<StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#ffe353" />
					<Text style={styles.loadingText}>
						{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

			{/* Header */}
			<View style={styles.header}>
				<Text style={[styles.title, language === 'ar' && styles.rtl]}>
					{titleText}
				</Text>
				{wishlist.length > 0 && (
					<Text style={[styles.itemCount, language === 'ar' && styles.rtl]}>
						{wishlist.length} {language === 'ar' ? 'عنصر' : 'items'}
					</Text>
				)}
			</View>

			{/* Wishlist Content */}
			{wishlist.length === 0 ? (
				renderEmptyState()
			) : (
				<FlatList
					data={wishlist}
					renderItem={renderWishlistItem}
					keyExtractor={(item) => `${item.id}-${item.type || 'movie'}`}
					showsVerticalScrollIndicator={false}
					refreshing={refreshing}
					onRefresh={handleRefresh}
					contentContainerStyle={styles.listContainer}
				/>
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
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#1a1a1a',
	},
	itemCount: {
		fontSize: 16,
		color: '#666666',
		fontWeight: '500',
	},
	listContainer: {
		paddingHorizontal: 20,
		paddingVertical: 10,
	},
	wishlistItem: {
		marginBottom: 15,
	},
	itemContainer: {
		flexDirection: 'row',
		backgroundColor: '#ffffff',
		borderRadius: 12,
		padding: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 3,
		borderWidth: 1,
		borderColor: '#f0f0f0',
	},
	posterContainer: {
		position: 'relative',
		marginRight: 15,
	},
	poster: {
		width: 80,
		height: 120,
		borderRadius: 8,
		backgroundColor: '#f0f0f0',
	},
	typeIndicator: {
		position: 'absolute',
		top: 5,
		right: 5,
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
		borderRadius: 10,
		padding: 4,
	},
	itemInfo: {
		flex: 1,
		justifyContent: 'space-between',
	},
	itemTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333333',
		marginBottom: 5,
		lineHeight: 22,
	},
	itemDate: {
		fontSize: 14,
		color: '#666666',
		marginBottom: 8,
	},
	ratingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	ratingStars: {
		flexDirection: 'row',
		marginRight: 8,
	},
	voteCount: {
		fontSize: 12,
		color: '#666666',
	},
	itemOverview: {
		fontSize: 14,
		color: '#555555',
		lineHeight: 20,
		flex: 1,
	},
	removeButton: {
		padding: 8,
		marginLeft: 10,
		alignSelf: 'flex-start',
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 40,
	},
	emptyTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#333333',
		marginTop: 20,
		marginBottom: 10,
		textAlign: 'center',
	},
	emptySubtitle: {
		fontSize: 16,
		color: '#666666',
		textAlign: 'center',
		lineHeight: 24,
		marginBottom: 30,
	},
	exploreButton: {
		backgroundColor: '#ffe353',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 12,
	},
	exploreButtonText: {
		color: '#1a1a1a',
		fontSize: 16,
		fontWeight: '600',
	},
	buttonIcon: {
		marginRight: 8,
	},
	loginRequiredContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 40,
	},
	loginRequiredTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#333333',
		marginTop: 20,
		marginBottom: 10,
		textAlign: 'center',
	},
	loginRequiredSubtitle: {
		fontSize: 16,
		color: '#666666',
		textAlign: 'center',
		lineHeight: 24,
		marginBottom: 30,
	},
	loginButton: {
		backgroundColor: '#ffe353',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 12,
	},
	loginButtonText: {
		color: '#1a1a1a',
		fontSize: 16,
		fontWeight: '600',
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
	rtl: {
		textAlign: 'right',
		writingDirection: 'rtl',
	},
});

export default WishlistScreen;
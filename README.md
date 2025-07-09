# React Native Movie App

A comprehensive React Native application for discovering movies and TV shows, featuring authentication, wishlist
management, and multi-language support.

## Features

- 🎬 Browse movies and TV shows from TMDB API
- 🔐 Google Sign-In authentication
- 👤 Guest mode for browsing without authentication
- ❤️ Wishlist functionality (authenticated users only)
- 🌐 Multi-language support (English, Arabic, French, Chinese)
- 📱 Modern UI design matching the Next.js version
- 🔄 Redux state management
- 💾 MongoDB integration for user data and wishlist

## Architecture

The app follows the same design architecture as the Next.js version:

- **Authentication Context**: Manages user authentication state
- **Redux Store**: Handles wishlist and language state
- **Navigation**: Tab navigation for main screens, stack navigation for details
- **MongoDB Integration**: Stores user data and wishlist items
- **TMDB API**: Fetches movie and TV show data

## Prerequisites

- Node.js (v14 or higher)
- React Native development environment
- Expo CLI
- MongoDB database
- Google Cloud Console project (for Google Sign-In)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd react-native-movie-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Google Sign-In**
    - Create a project in [Google Cloud Console](https://console.cloud.google.com/)
    - Enable Google Sign-In API
    - Create OAuth 2.0 credentials
    - Update `src/context/AuthContext.js` with your `webClientId`

4. **Setup MongoDB**
    - Create a MongoDB database
    - Update the API endpoint URLs in `AuthContext.js` to point to your backend
    - The backend should implement the same API structure as the Next.js version:
        - `POST /api/user` - Save user data
        - `GET /api/wishlist?email=<email>` - Get user wishlist
        - `POST /api/wishlist` - Add to wishlist
        - `DELETE /api/wishlist` - Remove from wishlist

5. **Configure API endpoint**
    - Update `YOUR_API_BASE_URL` in `src/context/AuthContext.js` with your backend URL

6. **Setup assets**
    - Add Google icon image to `src/assets/google-icon.png`

## Project Structure

```
src/
├── components/
│   ├── MovieCard.js          # Reusable movie card component
│   └── Navbar.js             # Navigation bar with auth and language
├── config/
│   └── axiosConfig.js        # Axios configuration for TMDB API
├── context/
│   └── AuthContext.js        # Authentication context provider
├── screens/
│   ├── HomeScreen.js         # Main home screen
│   ├── LoginScreen.js        # Authentication screen
│   ├── MoviesScreen.js       # Movies listing screen
│   ├── TVShowsScreen.js      # TV shows listing screen
│   ├── WishlistScreen.js     # User's wishlist
│   ├── WelcomeScreen.js      # Welcome/onboarding screen
│   ├── MovieDetailsScreen.js # Movie details screen
│   └── TVDetailsScreen.js    # TV show details screen
└── store/
    ├── store.js              # Redux store configuration
    └── slices/
        ├── languageSlice.js  # Language state management
        └── WishListSlice.js  # Wishlist state management
```

## Authentication Flow

1. **Welcome Screen**: Users can choose to sign in or continue as guest
2. **Guest Mode**: Full access to browse movies/TV shows, no wishlist access
3. **Authenticated Mode**: Full access including wishlist functionality
4. **Persistent Auth**: User session is saved locally and restored on app restart

## Features by User Type

### Guest Users

- ✅ Browse movies and TV shows
- ✅ View movie/TV show details
- ✅ Search functionality
- ✅ Language switching
- ❌ Wishlist functionality

### Authenticated Users

- ✅ All guest features
- ✅ Add/remove items from wishlist
- ✅ Persistent wishlist across devices
- ✅ User profile in navbar

## API Integration

### TMDB API

- Movies: `/movie/now_playing`, `/movie/{id}`
- TV Shows: `/tv/popular`, `/tv/{id}`
- Search: `/search/movie`, `/search/tv`

### Backend API (MongoDB)

- User management: `/api/user`
- Wishlist management: `/api/wishlist`

## Redux State Management

### Language Slice

```javascript
{
  language: 'en' | 'ar' | 'fr' | 'zh'
}
```

### Wishlist Slice

```javascript
{
  value: [
    {
      id: number,
      title: string,
      type: 'movie' | 'show',
      // ... other movie/show properties
    }
  ]
}
```

## Running the App

1. **Start the development server**
   ```bash
   npm start
   ```

2. **Run on specific platform**
   ```bash
   npm run android  # For Android
   npm run ios      # For iOS
   npm run web      # For web (if supported)
   ```

## Building for Production

1. **Build the app**
   ```bash
   expo build:android  # For Android
   expo build:ios      # For iOS
   ```

## Environment Variables

Create a `.env` file (if using a config library):

```
TMDB_API_KEY=your_tmdb_api_key
MONGODB_URI=your_mongodb_connection_string
GOOGLE_SIGNIN_CLIENT_ID=your_google_client_id
API_BASE_URL=your_backend_url
```

## Troubleshooting

### Common Issues

1. **Google Sign-In not working**
    - Verify webClientId is correct
    - Check if Google Sign-In is enabled in Google Cloud Console
    - Ensure proper package name/bundle ID is configured

2. **API calls failing**
    - Check network connectivity
    - Verify API endpoints are accessible
    - Check TMDB API key validity

3. **Wishlist not syncing**
    - Verify backend API is running
    - Check MongoDB connection
    - Ensure user authentication is working

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [TMDB API](https://www.themoviedb.org/documentation/api) for movie and TV show data
- [React Navigation](https://reactnavigation.org/) for navigation
- [Redux Toolkit](https://redux-toolkit.js.org/) for state management
- [Google Sign-In](https://developers.google.com/identity/sign-in/android/start-integrating) for authentication

import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Async thunk to load language from AsyncStorage
export const loadLanguage = createAsyncThunk(
    'languages/loadLanguage',
    async () => {
        try {
            const savedLanguage = await AsyncStorage.getItem('app_language');
            return savedLanguage || 'en';
        } catch (error) {
            console.error('Error loading language from AsyncStorage:', error);
            return 'en';
        }
    }
);

// Async thunk to save language to AsyncStorage
export const saveLanguage = createAsyncThunk(
    'languages/saveLanguage',
    async (language) => {
        try {
            await AsyncStorage.setItem('app_language', language);
            return language;
        } catch (error) {
            console.error('Error saving language to AsyncStorage:', error);
            throw error;
        }
    }
);

const languageSlice = createSlice({
  name: "languages",
  initialState: {
    language: "en",
      isLoading: false,
      error: null,
  },
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
      clearError: (state) => {
          state.error = null;
      },
  },
    extraReducers: (builder) => {
        builder
            // Load language
            .addCase(loadLanguage.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loadLanguage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.language = action.payload;
            })
            .addCase(loadLanguage.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            // Save language
            .addCase(saveLanguage.pending, (state) => {
                state.error = null;
            })
            .addCase(saveLanguage.fulfilled, (state, action) => {
                state.language = action.payload;
            })
            .addCase(saveLanguage.rejected, (state, action) => {
                state.error = action.error.message;
            });
    },
});

export const {setLanguage, clearError} = languageSlice.actions;
export default languageSlice.reducer;

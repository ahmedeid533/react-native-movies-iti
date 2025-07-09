import React, {useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../context/AuthContext';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LoginScreen = () => {
    const navigation = useNavigation();
    const {signInWithGoogle, signIn} = useAuth();
    const {language} = useSelector((state) => state.languages) || {language: 'en'};
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const result = await signInWithGoogle();
            if (result.success) {
							navigation.navigate('Home');
            }
        } catch (error) {
            console.error('Google sign in error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        if (!email.trim() || !name.trim()) {
            Alert.alert(
                language === 'ar' ? 'خطأ' : 'Error',
                language === 'ar'
                    ? 'يرجى إدخال البريد الإلكتروني والاسم'
                    : 'Please enter both email and name'
            );
            return;
        }

        setLoading(true);
        try {
            const userData = {
                email: email.trim(),
                name: name.trim(),
                image: 'https://via.placeholder.com/150'
            };
            const result = await signIn(userData);
            if (result.success) {
                navigation.navigate('Main');
            }
        } catch (error) {
            console.error('Demo login error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    // Translated text
    const loginTitle = language === 'ar' ? 'تسجيل الدخول' : 'Sign In';
    const loginSubtitle = language === 'ar'
        ? 'سجل الدخول للوصول إلى جميع المميزات'
        : 'Sign in to access all features';
    const googleSignInText = language === 'ar'
        ? 'تسجيل الدخول باستخدام Google'
        : 'Sign in with Google';
    const orText = language === 'ar' ? 'أو' : 'OR';
    const demoLoginText = language === 'ar' ? 'تجربة مع حساب تجريبي' : 'Try with Demo Account';
    const emailPlaceholder = language === 'ar' ? 'البريد الإلكتروني' : 'Email Address';
    const namePlaceholder = language === 'ar' ? 'الاسم الكامل' : 'Full Name';
    const loginButtonText = language === 'ar' ? 'تسجيل الدخول' : 'Login';
    const backText = language === 'ar' ? 'العودة' : 'Back';

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff"/>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBack}
                    activeOpacity={0.7}
                >
                    <Icon name="arrow-back" size={24} color="#333333"/>
                    <Text style={[styles.backText, language === 'ar' && styles.rtl]}>
                        {backText}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.titleSection}>
                    <Text style={[styles.title, language === 'ar' && styles.rtl]}>
                        {loginTitle}
                    </Text>
                    <Text style={[styles.subtitle, language === 'ar' && styles.rtl]}>
                        {loginSubtitle}
                    </Text>
                </View>

                {/* Google Sign In Button */}
                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={handleGoogleSignIn}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    <View style={styles.googleIcon}>
                        <Icon name="login" size={20} color="#4285F4"/>
                    </View>
                    <Text style={styles.googleButtonText}>
                        {googleSignInText}
                    </Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.divider}>
                    <View style={styles.dividerLine}/>
                    <Text style={styles.dividerText}>{orText}</Text>
                    <View style={styles.dividerLine}/>
                </View>

                {/* Demo Login Section */}
                <View style={styles.demoSection}>
                    <Text style={[styles.demoTitle, language === 'ar' && styles.rtl]}>
                        {demoLoginText}
                    </Text>

                    <View style={styles.inputContainer}>
                        <Icon name="email" size={20} color="#666666" style={styles.inputIcon}/>
                        <TextInput
                            style={[styles.input, language === 'ar' && styles.rtl]}
                            placeholder={emailPlaceholder}
                            placeholderTextColor="#999999"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Icon name="person" size={20} color="#666666" style={styles.inputIcon}/>
                        <TextInput
                            style={[styles.input, language === 'ar' && styles.rtl]}
                            placeholder={namePlaceholder}
                            placeholderTextColor="#999999"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                            autoCorrect={false}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                        onPress={handleDemoLogin}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#1a1a1a"/>
                        ) : (
                            <>
                                <Icon name="login" size={20} color="#1a1a1a" style={styles.buttonIcon}/>
                                <Text style={styles.loginButtonText}>
                                    {loginButtonText}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Features List */}
                <View style={styles.featuresList}>
                    <Text style={[styles.featuresTitle, language === 'ar' && styles.rtl]}>
                        {language === 'ar' ? 'مميزات تسجيل الدخول:' : 'Sign in benefits:'}
                    </Text>
                    <View style={styles.featureItem}>
                        <Icon name="favorite" size={16} color="#ffe353"/>
                        <Text style={[styles.featureText, language === 'ar' && styles.rtl]}>
                            {language === 'ar' ? 'حفظ المفضلات' : 'Save your favorites'}
                        </Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Icon name="sync" size={16} color="#ffe353"/>
                        <Text style={[styles.featureText, language === 'ar' && styles.rtl]}>
                            {language === 'ar' ? 'مزامنة البيانات' : 'Sync across devices'}
                        </Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Icon name="recommend" size={16} color="#ffe353"/>
                        <Text style={[styles.featureText, language === 'ar' && styles.rtl]}>
                            {language === 'ar' ? 'اقتراحات شخصية' : 'Personalized recommendations'}
                        </Text>
                    </View>
                </View>
            </View>
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
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        fontSize: 16,
        color: '#333333',
        marginLeft: 8,
        fontWeight: '500',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    titleSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingVertical: 15,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    googleIcon: {
        marginRight: 12,
    },
    googleButtonText: {
        fontSize: 16,
        color: '#333333',
        fontWeight: '600',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e0e0e0',
    },
    dividerText: {
        fontSize: 14,
        color: '#666666',
        paddingHorizontal: 15,
        fontWeight: '500',
    },
    demoSection: {
        marginBottom: 30,
    },
    demoTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333333',
        paddingVertical: 15,
    },
    loginButton: {
        backgroundColor: '#ffe353',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 12,
        marginTop: 10,
    },
    loginButtonDisabled: {
        opacity: 0.6,
    },
    loginButtonText: {
        color: '#1a1a1a',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonIcon: {
        marginRight: 8,
    },
    featuresList: {
        marginTop: 20,
    },
    featuresTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 15,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    featureText: {
        fontSize: 14,
        color: '#666666',
        marginLeft: 10,
    },
    rtl: {
        textAlign: 'right',
        writingDirection: 'rtl',
    },
});

export default LoginScreen;
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Dimensions, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, ChevronRight, Github, Chrome, Apple, Activity } from 'lucide-react-native';

import { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'Login'>;

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }: Props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // In a real app, we'd validate here. For the demo, we'll just navigate.
        navigation.navigate('Main');
    };

    const handleRegister = () => {
        navigation.navigate('ProfileRegistration');
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Decorative Background Element */}
                    <View style={styles.bgDecoration} />

                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <View style={styles.logoIcon}>
                                <Activity size={20} color="#ffffff" />
                            </View>
                            <Text style={styles.logoText}>VITALS</Text>
                        </View>
                        <Text style={styles.welcomeText}>Precision Health Monitoring</Text>
                        <Text style={styles.subText}>Sign in to access your clinical dashboard and AI health insights.</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputWrapper}>
                            <Mail size={20} color="#94a3b8" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email Address"
                                placeholderTextColor="#94a3b8"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <Lock size={20} color="#94a3b8" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#94a3b8"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity style={styles.forgotBtn}>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                            <Text style={styles.loginBtnText}>Sign In</Text>
                            <View style={styles.loginBtnCircle}>
                                <ChevronRight size={18} color="#3713ec" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <View style={styles.socialGrid}>
                        <TouchableOpacity style={styles.socialBtn}>
                            <Chrome size={22} color="#0f172a" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialBtn}>
                            <Apple size={22} color="#0f172a" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialBtn}>
                            <Github size={22} color="#0f172a" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={handleRegister}>
                            <Text style={styles.registerText}>Get Started</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 32,
        paddingTop: height * 0.08,
        paddingBottom: 40,
    },
    bgDecoration: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#eff6ff',
        zIndex: -1,
    },
    header: {
        marginBottom: 48,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 24,
    },
    logoIcon: {
        backgroundColor: '#3713ec',
        padding: 6,
        borderRadius: 10,
        shadowColor: '#3713ec',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    logoText: {
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 2,
        color: '#0f172a',
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: -1,
        marginBottom: 12,
    },
    subText: {
        fontSize: 16,
        color: '#64748b',
        lineHeight: 24,
        fontWeight: '500',
    },
    form: {
        gap: 20,
        marginBottom: 40,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingHorizontal: 20,
        height: 64,
    },
    inputIcon: {
        marginRight: 16,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#0f172a',
        fontWeight: '600',
    },
    forgotBtn: {
        alignSelf: 'flex-end',
    },
    forgotText: {
        color: '#3713ec',
        fontSize: 14,
        fontWeight: '700',
    },
    loginBtn: {
        backgroundColor: '#3713ec',
        height: 72,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        gap: 12,
        shadowColor: '#3713ec',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 8,
    },
    loginBtnText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '800',
    },
    loginBtnCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 32,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#f1f5f9',
    },
    dividerText: {
        color: '#94a3b8',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    socialGrid: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 48,
    },
    socialBtn: {
        width: (width - 64 - 32) / 3,
        height: 64,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: '#64748b',
        fontSize: 15,
        fontWeight: '500',
    },
    registerText: {
        color: '#3713ec',
        fontSize: 15,
        fontWeight: '700',
    }
});

export default LoginScreen;

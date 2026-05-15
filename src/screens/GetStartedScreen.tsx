import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shield, Activity, Users, Settings as SettingsIcon, Bell, ChevronRight, CheckCircle2, QrCode, MonitorCheck, HeartPulse } from 'lucide-react-native';

import { RootStackScreenProps } from '../types/navigation';

const { width, height } = Dimensions.get('window');

const GetStartedScreen = ({ navigation }: RootStackScreenProps<'GetStarted'>) => {
    const pillars = [
        {
            title: 'Precision Data',
            desc: 'Clinical-grade tracking and real-time monitoring with sub-millisecond accuracy.',
            icon: HeartPulse,
            color: '#3b82f6'
        },
        {
            title: 'Specialist Access',
            desc: 'Direct, encrypted communication channels with top-tier health professionals worldwide.',
            icon: Users,
            color: '#8b5cf6'
        },
        {
            title: 'Holistic Recovery',
            desc: 'Data-driven recovery plans tailored to your unique lifestyle and biometrics.',
            icon: Activity,
            color: '#10b981'
        }
    ];

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <View style={styles.logoRow}>
                        <View style={styles.logoIcon}>
                            <Activity size={20} color="#ffffff" />
                        </View>
                        <Text style={styles.logoText}>VITALS</Text>
                    </View>

                    <Text style={styles.heroTag}>PREMIUM HEALTH ECOSYSTEM</Text>
                    <Text style={styles.heroTitle}>Your Health,{"\n"}<Text style={styles.textPrimary}>Refined.</Text></Text>
                    <Text style={styles.heroSubtitle}>
                        Experience a high-end ecosystem for recovery and proactive health monitoring with our sophisticated clinical-grade platform.
                    </Text>

                    <View style={styles.heroImageContainer}>
                        <View style={styles.heroGradient} />
                        <Image
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgz8N1gb9b9p_LjV0wIMUKeOfUIgo8cXzpqQgCHqbLkscS3bAblt6AMTMWqfHPDGWXBUuDqAe-crsCA4SSj6Wnx2Oyrg1Hrpdz2SHNQ7rBGmZernUxq2h5OF1n5mv7KV0NSydviUihli00okVLpEsBDq1uPjcOhegm0NLv7TpstlAZZoKEQWKHDaJuNm5ugzDTtOp4Oo3sXc8zt9TsjA5TV2w5Kp2fByXjCP1NNKYndETt7uDhk9OAUj5XJIseOiI1A7h9kk_vv3g' }}
                            style={styles.heroImage}
                            resizeMode="cover"
                        />
                    </View>
                </View>

                {/* Unified Ecosystem info */}
                <View style={styles.ecosystemSection}>
                    <View style={styles.ecosystemCardRow}>
                        <View style={styles.qrCard}>
                            <View style={styles.qrIconBox}>
                                <QrCode size={40} color="#3713ec" />
                            </View>
                            <Text style={styles.qrTitle}>Mobile Sync</Text>
                            <Text style={styles.qrText}>Scan to connect</Text>
                        </View>
                        <View style={styles.syncCard}>
                            <MonitorCheck size={32} color="#ffffff" />
                            <View>
                                <Text style={styles.syncTitle}>Syncing across 4 devices</Text>
                                <Text style={styles.syncStatus}>Live updates</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.ecosystemContent}>
                        <Text style={styles.sectionTitle}>Unified Ecosystem</Text>
                        <Text style={styles.sectionDesc}>
                            Your data moves with you. Seamlessly synchronize your clinical records, recovery metrics, and specialist consultations across desktop, tablet, and mobile.
                        </Text>

                        <View style={styles.featureList}>
                            {['Instant QR linking', 'End-to-end encrypted transfer', 'Real-time health telemetry'].map((item, idx) => (
                                <View key={idx} style={styles.featureItem}>
                                    <View style={styles.checkBtn}>
                                        <CheckCircle2 size={16} color="#3713ec" />
                                    </View>
                                    <Text style={styles.featureText}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Platform Pillars */}
                <View style={styles.pillarsSection}>
                    <Text style={styles.sectionTitleCenter}>Platform Pillars</Text>
                    <Text style={styles.sectionDescCenter}>
                        Our methodology combines clinical precision and sophisticated design.
                    </Text>

                    <View style={styles.pillarsGrid}>
                        {pillars.map((pillar, idx) => (
                            <View key={idx} style={styles.pillarCard}>
                                <View style={[styles.pillarIconBox, { backgroundColor: pillar.color + '10' }]}>
                                    <pillar.icon size={24} color={pillar.color} />
                                </View>
                                <Text style={styles.pillarTitle}>{pillar.title}</Text>
                                <Text style={styles.pillarDesc}>{pillar.desc}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Floating Bottom Action */}
            <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={styles.primaryBtnText}>Get Started</Text>
                <ChevronRight size={20} color="#ffffff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    heroSection: {
        paddingTop: 60,
        paddingHorizontal: 24,
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 40,
    },
    logoIcon: {
        backgroundColor: '#3713ec',
        padding: 6,
        borderRadius: 10,
    },
    logoText: {
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 2,
        color: '#0f172a',
    },
    heroTag: {
        fontSize: 10,
        fontWeight: '800',
        color: '#3713ec',
        letterSpacing: 2,
        backgroundColor: 'rgba(55, 19, 236, 0.05)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: 20,
    },
    heroTitle: {
        fontSize: 48,
        fontWeight: '900',
        color: '#0f172a',
        letterSpacing: -1,
        lineHeight: 54,
    },
    textPrimary: {
        color: '#3713ec',
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#64748b',
        lineHeight: 26,
        marginTop: 20,
        fontWeight: '500',
    },
    heroImageContainer: {
        marginTop: 40,
        height: 280,
        borderRadius: 52,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(55, 19, 236, 0.1)',
        zIndex: 1,
    },
    ecosystemSection: {
        marginTop: 60,
        paddingHorizontal: 24,
    },
    ecosystemCardRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 40,
    },
    qrCard: {
        flex: 1,
        backgroundColor: '#f8fafc',
        padding: 24,
        borderRadius: 82,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    qrIconBox: {
        padding: 12,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    qrTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#0f172a',
    },
    qrText: {
        fontSize: 10,
        color: '#94a3b8',
        marginTop: 2,
        fontWeight: '600',
    },
    syncCard: {
        flex: 1,
        backgroundColor: '#3713ec',
        padding: 24,
        borderRadius: 32,
        justifyContent: 'space-between',
        shadowColor: '#3713ec',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
    },
    syncTitle: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '800',
        lineHeight: 20,
    },
    syncStatus: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 11,
        marginTop: 4,
        fontWeight: '600',
    },
    ecosystemContent: {
        marginTop: 0,
    },
    sectionTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#0f172a',
    },
    sectionDesc: {
        fontSize: 16,
        color: '#64748b',
        lineHeight: 26,
        marginTop: 16,
        fontWeight: '500',
    },
    featureList: {
        marginTop: 24,
        gap: 16,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    checkBtn: {
        backgroundColor: 'rgba(55, 19, 236, 0.05)',
        padding: 4,
        borderRadius: 8,
    },
    featureText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#334155',
    },
    pillarsSection: {
        marginTop: 80,
        paddingHorizontal: 24,
    },
    sectionTitleCenter: {
        fontSize: 28,
        fontWeight: '800',
        color: '#0f172a',
        textAlign: 'center',
    },
    sectionDescCenter: {
        fontSize: 15,
        color: '#64748b',
        textAlign: 'center',
        marginTop: 12,
        paddingHorizontal: 20,
        fontWeight: '500',
    },
    pillarsGrid: {
        marginTop: 40,
        gap: 20,
    },
    pillarCard: {
        backgroundColor: '#ffffff',
        padding: 32,
        borderRadius: 52,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 15,
    },
    pillarIconBox: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    pillarTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: 8,
    },
    pillarDesc: {
        fontSize: 14,
        color: '#64748b',
        lineHeight: 22,
        fontWeight: '500',
    },
    primaryBtn: {
        position: 'absolute',
        bottom: 40,
        left: 24,
        right: 24,
        backgroundColor: '#3713ec',
        height: 64,
        borderRadius: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        shadowColor: '#3713ec',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    primaryBtnText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '800',
    },
});

export default GetStartedScreen;

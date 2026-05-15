import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, ChevronLeft, Zap, Activity, HeartPulse, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react-native';
import { RootStackScreenProps } from '../types/navigation';

const NotificationsScreen = ({ navigation }: RootStackScreenProps<'Notifications'>) => {
    const notifications = [
        {
            id: '1',
            title: 'Unusual Vital Spike',
            message: 'A spike in heart rate (115 bpm) was detected during your sleep. Review your data.',
            time: '2 hours ago',
            type: 'alert',
            icon: Activity,
            color: '#ef4444',
            unread: true,
        },
        {
            id: '2',
            title: 'Daily Medication',
            message: 'Time for your morning dosage of Vitamin D3 and Omega-3.',
            time: '4 hours ago',
            type: 'reminder',
            icon: HeartPulse,
            color: '#3713ec',
            unread: true,
        },
        {
            id: '3',
            title: 'Weekly Sync Complete',
            message: 'Your health ecosystem has been successfully synced with Apple Health.',
            time: 'Yesterday',
            type: 'sync',
            icon: Zap,
            color: '#f59e0b',
            unread: false,
        },
        {
            id: '4',
            title: 'Security Update',
            message: 'Your medical identity was successfully updated with new health parameters.',
            time: '2 days ago',
            type: 'info',
            icon: ShieldCheck,
            color: '#10b981',
            unread: false,
        },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <ChevronLeft size={24} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <TouchableOpacity style={styles.markReadBtn}>
                    <CheckCircle2 size={20} color="#3713ec" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent</Text>
                    <View style={styles.unreadBadge}>
                        <Text style={styles.unreadCount}>2 New</Text>
                    </View>
                </View>

                {notifications.map((item) => (
                    <TouchableOpacity key={item.id} style={[styles.notiCard, item.unread && styles.unreadCard]}>
                        <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                            <item.icon size={22} color={item.color} />
                        </View>
                        <View style={styles.notiInfo}>
                            <View style={styles.notiHeader}>
                                <Text style={styles.notiTitle}>{item.title}</Text>
                                <Text style={styles.notiTime}>{item.time}</Text>
                            </View>
                            <Text style={styles.notiMessage}>{item.message}</Text>
                        </View>
                        {item.unread && <View style={styles.unreadDot} />}
                    </TouchableOpacity>
                ))}

                <View style={styles.footer}>
                    <Clock size={16} color="#94a3b8" />
                    <Text style={styles.footerText}>No more recent notifications</Text>
                </View>
            </ScrollView>
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
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0f172a',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    markReadBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#eff6ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 24,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0f172a',
    },
    unreadBadge: {
        backgroundColor: '#3713ec',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    unreadCount: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    notiCard: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 24,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        alignItems: 'center',
        gap: 16,
    },
    unreadCard: {
        backgroundColor: '#f8fafc',
        borderColor: '#e2e8f0',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notiInfo: {
        flex: 1,
    },
    notiHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    notiTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0f172a',
    },
    notiTime: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '500',
    },
    notiMessage: {
        fontSize: 13,
        color: '#64748b',
        lineHeight: 18,
        fontWeight: '500',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#3713ec',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 32,
        marginBottom: 40,
    },
    footerText: {
        fontSize: 13,
        color: '#94a3b8',
        fontWeight: '600',
    },
});

export default NotificationsScreen;

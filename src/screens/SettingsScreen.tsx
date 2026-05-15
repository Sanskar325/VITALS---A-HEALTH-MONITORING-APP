import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Switch, Modal, TextInput, Platform, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Bell, Shield, Moon, CircleHelp, LogOut, ChevronRight, Camera, X, Plus, PlusCircle, Bluetooth, Trash2, Activity, HeartPulse } from 'lucide-react-native';
import { useUser } from '../context/UserContext';

const SettingsScreen = ({ navigation }: any) => {
    const { user, updateUserProfile } = useUser();

    // Identity Modal State
    const [showIdentityModal, setShowIdentityModal] = React.useState(false);
    const [editIdentityData, setEditIdentityData] = React.useState({ ...user });

    // Personal Details Modal State
    const [showPersonalModal, setShowPersonalModal] = React.useState(false);
    const [editPersonalData, setEditPersonalData] = React.useState({ ...user });

    // Bluetooth Scan Modal State
    const [showScanModal, setShowScanModal] = React.useState(false);
    const [isScanning, setIsScanning] = React.useState(false);
    const [foundDevices, setFoundDevices] = React.useState<any[]>([]);

    const [notifs, setNotifs] = React.useState({
        spikes: true,
        meds: false,
        sync: true
    });

    const handleOpenIdentityEdit = () => {
        setEditIdentityData({ ...user });
        setShowIdentityModal(true);
    };

    const handleSaveIdentity = () => {
        updateUserProfile(editIdentityData);
        setShowIdentityModal(false);
    };

    const handleOpenPersonalEdit = () => {
        setEditPersonalData({ ...user });
        setShowPersonalModal(true);
    };

    const handleSavePersonal = () => {
        updateUserProfile(editPersonalData);
        setShowPersonalModal(false);
    };

    const startBluetoothScan = () => {
        setIsScanning(true);
        setFoundDevices([]);
        setShowScanModal(true);

        // Simulate scanning
        setTimeout(() => {
            setFoundDevices([
                { id: '1', name: 'Stitch Pulse Oximeter', type: 'Health', battery: '85%' },
                { id: '2', name: 'Smart Glucose Meter', type: 'Medical', battery: '92%' }
            ]);
            setIsScanning(false);
        }, 3000);
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to permanently delete your account? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => navigation.reset({
                        index: 0,
                        routes: [{ name: 'GetStarted' }],
                    })
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={{ height: 24 }} />

                {/* Profile Card */}
                <View style={[styles.profileCard, { marginTop: 10 }]}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarMain}>
                            <User size={40} color="#3713ec" />
                        </View>
                        <TouchableOpacity style={styles.cameraBtn}>
                            <Camera size={14} color="#ffffff" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{user.firstName} {user.lastName}</Text>
                        <Text style={styles.profileEmail}>{user.email}</Text>
                        <Text style={styles.profileAbout} numberOfLines={2}>{user.aboutMe}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.editBtn}
                        onPress={handleOpenPersonalEdit}
                    >
                        <Text style={styles.editBtnText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* Device Sync Section (Screenshot 1) */}
                <View style={[styles.section, { marginBottom: 32 }]}>
                    <View style={styles.sectionHeaderRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <View style={styles.syncIconBox}>
                                <LogOut size={20} color="#3713ec" style={{ transform: [{ rotate: '90deg' }] }} />
                            </View>
                            <Text style={styles.sectionTitleText}>Device Sync</Text>
                        </View>
                        <View style={styles.activeBadge}>
                            <Text style={styles.activeBadgeText}>Active</Text>
                        </View>
                    </View>

                    <Text style={styles.subLabel}>Connected Devices</Text>

                    <View style={styles.deviceItem}>
                        <View style={styles.watchIconBox}>
                            <User size={24} color="#3713ec" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.deviceName}>Samsung Galaxy Watch</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <View style={styles.statusDot} />
                                <Text style={styles.deviceStatus}>Connected</Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.addNewDeviceBtn} onPress={startBluetoothScan}>
                        <Plus size={20} color="#3713ec" />
                        <Text style={styles.addNewDeviceText}>Add new device</Text>
                    </TouchableOpacity>
                </View>

                {/* Medical Identity Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitleText}>Medical Identity</Text>
                        <TouchableOpacity style={styles.editLinkBtn} onPress={handleOpenIdentityEdit}>
                            <Text style={styles.editLinkText}>Edit</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.healthInfoGrid}>
                        <View style={styles.healthInfoItem}>
                            <Text style={styles.healthValue}>{user.bloodGroup}</Text>
                            <Text style={styles.healthLabel}>Blood</Text>
                        </View>
                        <View style={styles.healthInfoItem}>
                            <Text style={styles.healthValue}>{user.height}cm</Text>
                            <Text style={styles.healthLabel}>Height</Text>
                        </View>
                        <View style={styles.healthInfoItem}>
                            <Text style={styles.healthValue}>{user.weight}kg</Text>
                            <Text style={styles.healthLabel}>Weight</Text>
                        </View>
                    </View>

                    <View style={styles.identityDetail}>
                        <Text style={styles.detailLabel}>Smoking Status</Text>
                        <Text style={styles.detailValue}>{user.smokerStatus}</Text>
                    </View>

                    <View style={styles.identityDetail}>
                        <Text style={styles.detailLabel}>Existing Health Issues</Text>
                        <Text style={styles.detailValue}>{user.existingIssues || 'None reported'}</Text>
                    </View>
                </View>

                {/* Notification Preferences (Screenshot 2) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitleText}>Notification Preferences</Text>
                    <View style={styles.preferencesList}>
                        <View style={styles.preferenceItem}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.prefTitle}>Health Spike Alerts</Text>
                                <Text style={styles.prefSubtitle}>Get notified when unusual spikes are detected in your vitals</Text>
                            </View>
                            <Switch
                                value={notifs.spikes}
                                onValueChange={(v) => setNotifs({ ...notifs, spikes: v })}
                                trackColor={{ false: '#334155', true: '#3713ec' }}
                                thumbColor="#fff"
                            />
                        </View>

                        <View style={styles.separator} />

                        <View style={styles.preferenceItem}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.prefTitle}>Medication Reminders</Text>
                                <Text style={styles.prefSubtitle}>Never miss a scheduled dose of medicine</Text>
                            </View>
                            <Switch
                                value={notifs.meds}
                                onValueChange={(v) => setNotifs({ ...notifs, meds: v })}
                                trackColor={{ false: '#334155', true: '#3713ec' }}
                                thumbColor="#fff"
                            />
                        </View>

                        <View style={styles.separator} />

                        <View style={styles.preferenceItem}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.prefTitle}>Weekly Ecosystem Sync</Text>
                                <Text style={styles.prefSubtitle}>Summary of your health progress and goals</Text>
                            </View>
                            <Switch
                                value={notifs.sync}
                                onValueChange={(v) => setNotifs({ ...notifs, sync: v })}
                                trackColor={{ false: '#334155', true: '#3713ec' }}
                                thumbColor="#fff"
                            />
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={() => navigation.reset({
                        index: 0,
                        routes: [{ name: 'GetStarted' }],
                    })}
                >
                    <LogOut size={20} color="#ef4444" />
                    <Text style={styles.logoutText}>Sign Out</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
                    <Trash2 size={20} color="#ef4444" />
                    <Text style={styles.deleteBtnText}>Delete Account</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.versionText}>Version 2.4.0 (Build 882)</Text>
                    <Text style={styles.copyrightText}>© 2024 Vitals Health Systems</Text>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Personal Details Edit Modal */}
            <Modal visible={showPersonalModal} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Personal Details</Text>
                            <TouchableOpacity onPress={() => setShowPersonalModal(false)}>
                                <X size={24} color="#0f172a" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                            <View style={styles.inputRow}>
                                <View style={{ flex: 1, marginRight: 12 }}>
                                    <Text style={styles.modalLabel}>First Name</Text>
                                    <TextInput
                                        style={styles.modalInput}
                                        value={editPersonalData.firstName}
                                        onChangeText={(t) => setEditPersonalData({ ...editPersonalData, firstName: t })}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.modalLabel}>Last Name</Text>
                                    <TextInput
                                        style={styles.modalInput}
                                        value={editPersonalData.lastName}
                                        onChangeText={(t) => setEditPersonalData({ ...editPersonalData, lastName: t })}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.modalLabel}>Age</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    value={editPersonalData.age}
                                    onChangeText={(t) => setEditPersonalData({ ...editPersonalData, age: t })}
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.modalLabel}>Gender</Text>
                                <View style={styles.choiceRow}>
                                    {['Male', 'Female', 'Other'].map((g) => (
                                        <TouchableOpacity
                                            key={g}
                                            style={[styles.choiceBtn, editPersonalData.gender === g && styles.activeChoice]}
                                            onPress={() => setEditPersonalData({ ...editPersonalData, gender: g })}
                                        >
                                            <Text style={[styles.choiceText, editPersonalData.gender === g && styles.activeChoiceText]}>{g}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.modalLabel}>About Me</Text>
                                <TextInput
                                    style={[styles.modalInput, { height: 100, textAlignVertical: 'top' }]}
                                    value={editPersonalData.aboutMe}
                                    onChangeText={(t) => setEditPersonalData({ ...editPersonalData, aboutMe: t })}
                                    multiline={true}
                                />
                            </View>

                            <TouchableOpacity style={styles.submitBtn} onPress={handleSavePersonal}>
                                <Text style={styles.submitBtnText}>Save Changes</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Medical Identity Edit Modal */}
            <Modal visible={showIdentityModal} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Medical Identity</Text>
                            <TouchableOpacity onPress={() => setShowIdentityModal(false)}>
                                <X size={24} color="#0f172a" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.modalLabel}>Blood Group</Text>
                                <View style={styles.bloodGrid}>
                                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                                        <TouchableOpacity
                                            key={bg}
                                            style={[styles.bloodItem, editIdentityData.bloodGroup === bg && styles.activeBlood]}
                                            onPress={() => setEditIdentityData({ ...editIdentityData, bloodGroup: bg })}
                                        >
                                            <Text style={[styles.bloodText, editIdentityData.bloodGroup === bg && styles.activeBloodText]}>{bg}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.inputRow}>
                                <View style={{ flex: 1, marginRight: 12 }}>
                                    <Text style={styles.modalLabel}>Height (cm)</Text>
                                    <TextInput
                                        style={styles.modalInput}
                                        value={editIdentityData.height}
                                        onChangeText={(t) => setEditIdentityData({ ...editIdentityData, height: t })}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.modalLabel}>Weight (kg)</Text>
                                    <TextInput
                                        style={styles.modalInput}
                                        value={editIdentityData.weight}
                                        onChangeText={(t) => setEditIdentityData({ ...editIdentityData, weight: t })}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.modalLabel}>Smoker Status</Text>
                                <View style={styles.choiceRow}>
                                    <TouchableOpacity
                                        style={[styles.choiceBtn, editIdentityData.smokerStatus === 'Smoker' && styles.activeChoice]}
                                        onPress={() => setEditIdentityData({ ...editIdentityData, smokerStatus: 'Smoker' })}
                                    >
                                        <Text style={[styles.choiceText, editIdentityData.smokerStatus === 'Smoker' && styles.activeChoiceText]}>Smoker</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.choiceBtn, editIdentityData.smokerStatus === 'Non-smoker' && styles.activeChoice]}
                                        onPress={() => setEditIdentityData({ ...editIdentityData, smokerStatus: 'Non-smoker' })}
                                    >
                                        <Text style={[styles.choiceText, editIdentityData.smokerStatus === 'Non-smoker' && styles.activeChoiceText]}>Non-smoker</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.modalLabel}>Existing Health Issues</Text>
                                <TextInput
                                    style={[styles.modalInput, { height: 100, textAlignVertical: 'top' }]}
                                    value={editIdentityData.existingIssues}
                                    onChangeText={(t) => setEditIdentityData({ ...editIdentityData, existingIssues: t })}
                                    multiline={true}
                                />
                            </View>

                            <TouchableOpacity style={styles.submitBtn} onPress={handleSaveIdentity}>
                                <Text style={styles.submitBtnText}>Save Changes</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Bluetooth Scan Modal */}
            <Modal visible={showScanModal} animationType="fade" transparent={true}>
                <View style={[styles.modalOverlay, { justifyContent: 'center', paddingHorizontal: 24 }]}>
                    <View style={[styles.modalContent, { borderRadius: 32, paddingBottom: 32, maxHeight: '70%', flex: 0 }]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Device Connector</Text>
                            <TouchableOpacity onPress={() => setShowScanModal(false)}>
                                <X size={24} color="#0f172a" />
                            </TouchableOpacity>
                        </View>

                        <View style={{ alignItems: 'center', marginBottom: 24 }}>
                            {isScanning ? (
                                <View style={styles.scanAnimationContainer}>
                                    <Animated.View style={styles.scanRing} />
                                    <Bluetooth size={40} color="#3713ec" />
                                </View>
                            ) : (
                                <View style={[styles.scanIconBox, { backgroundColor: '#ecfdf5' }]}>
                                    <Bluetooth size={32} color="#10b981" />
                                </View>
                            )}
                            <Text style={styles.scanStatusText}>
                                {isScanning ? 'Accessing Bluetooth & scanning...' : `${foundDevices.length} Devices Found`}
                            </Text>
                        </View>

                        <ScrollView style={{ marginBottom: 20 }}>
                            {foundDevices.map((dev) => (
                                <TouchableOpacity key={dev.id} style={styles.foundDeviceItem}>
                                    <View style={styles.deviceIconCircle}>
                                        <Activity size={20} color="#3713ec" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.foundDeviceName}>{dev.name}</Text>
                                        <Text style={styles.foundDeviceType}>{dev.type} Device • {dev.battery} Battery</Text>
                                    </View>
                                    <Text style={styles.connectText}>Connect</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            style={[styles.submitBtn, { height: 54 }]}
                            onPress={() => setShowScanModal(false)}
                        >
                            <Text style={styles.submitBtnText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    mainTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#3713ec',
        letterSpacing: -1,
        marginBottom: 24,
    },
    profileCard: {
        backgroundColor: '#f8fafc',
        borderRadius: 32,
        padding: 24,
        alignItems: 'center',
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatarMain: {
        width: 100,
        height: 100,
        borderRadius: 36,
        backgroundColor: '#eff6ff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#3713ec',
    },
    cameraBtn: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 32,
        height: 32,
        borderRadius: 12,
        backgroundColor: '#3713ec',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#f8fafc',
    },
    profileInfo: {
        alignItems: 'center',
        marginBottom: 24,
    },
    profileName: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
        marginBottom: 8,
    },
    profileAbout: {
        fontSize: 13,
        color: '#475569',
        textAlign: 'center',
        lineHeight: 18,
        paddingHorizontal: 12,
        fontWeight: '500',
    },
    editBtn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#ffffff',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    editBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0f172a',
    },
    section: {
        marginBottom: 32,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitleText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0f172a',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    syncIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#eff6ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeBadge: {
        backgroundColor: '#ecfdf5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    activeBadgeText: {
        color: '#10b981',
        fontSize: 11,
        fontWeight: '800',
    },
    subLabel: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '700',
        marginBottom: 12,
        marginLeft: 4,
    },
    deviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e1b4b', // Dark purple from screenshot
        padding: 16,
        borderRadius: 20,
        gap: 16,
        marginBottom: 16,
    },
    watchIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deviceName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10b981',
    },
    deviceStatus: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: '600',
    },
    addNewDeviceBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginLeft: 4,
    },
    addNewDeviceText: {
        color: '#3713ec',
        fontSize: 14,
        fontWeight: '700',
    },
    healthInfoGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    healthInfoItem: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 10,
        elevation: 2,
    },
    healthValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#3713ec',
        marginBottom: 2,
    },
    healthLabel: {
        fontSize: 11,
        color: '#94a3b8',
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    editLinkBtn: {
        paddingVertical: 4,
    },
    editLinkText: {
        color: '#3713ec',
        fontSize: 14,
        fontWeight: '800',
    },
    identityDetail: {
        backgroundColor: '#f8fafc',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    detailLabel: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '700',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    detailValue: {
        fontSize: 15,
        color: '#0f172a',
        fontWeight: '700',
    },
    preferencesList: {
        backgroundColor: '#1e1b4b', // Dark theme matching screenshot
        borderRadius: 24,
        padding: 24,
    },
    preferenceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
    },
    prefTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    prefSubtitle: {
        color: '#94a3b8',
        fontSize: 13,
        lineHeight: 18,
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginVertical: 20,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        paddingVertical: 20,
        borderRadius: 24,
        backgroundColor: '#fef2f2',
        marginBottom: 40,
    },
    logoutText: {
        color: '#ef4444',
        fontSize: 16,
        fontWeight: '800',
    },
    deleteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        paddingVertical: 20,
        borderRadius: 24,
        backgroundColor: '#fff1f2',
        marginBottom: 40,
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    deleteBtnText: {
        color: '#ef4444',
        fontSize: 16,
        fontWeight: '800',
    },
    footer: {
        alignItems: 'center',
        gap: 4,
    },
    versionText: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '600',
    },
    copyrightText: {
        fontSize: 10,
        color: '#cbd5e1',
        fontWeight: '500',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0f172a',
    },
    modalBody: {
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 24,
    },
    inputRow: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    modalLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 10,
        marginLeft: 4,
    },
    modalInput: {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#0f172a',
        fontWeight: '600',
    },
    submitBtn: {
        backgroundColor: '#3713ec',
        height: 64,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    submitBtnText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '800',
    },
    choiceRow: {
        flexDirection: 'row',
        gap: 12,
    },
    choiceBtn: {
        flex: 1,
        height: 54,
        borderRadius: 16,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeChoice: {
        backgroundColor: '#eff6ff',
        borderColor: '#3713ec',
    },
    choiceText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748b',
    },
    activeChoiceText: {
        color: '#3713ec',
    },
    bloodGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    bloodItem: {
        width: '23%',
        height: 48,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeBlood: {
        backgroundColor: '#3713ec',
        borderColor: '#3713ec',
    },
    bloodText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#64748b',
    },
    activeBloodText: {
        color: '#ffffff',
    },
    scanAnimationContainer: {
        width: 120,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    scanRing: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#3713ec',
        opacity: 0.3,
    },
    scanIconBox: {
        width: 80,
        height: 80,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    scanStatusText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
        marginTop: 12,
    },
    foundDeviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8fafc',
        borderRadius: 20,
        marginBottom: 12,
        gap: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    deviceIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#eff6ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    foundDeviceName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
    },
    foundDeviceType: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600',
    },
    connectText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#3713ec',
    },
});

export default SettingsScreen;

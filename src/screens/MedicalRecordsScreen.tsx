import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Dimensions, Platform, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    FileText,
    Download,
    Search,
    Eye,
    ChevronRight,
    Stethoscope,
    Pill,
    FlaskConical,
    Plus,
    Calendar,
    User,
    ChevronDown,
    FileDown,
    X,
    Clipboard,
    Activity,
    Check,
    Camera as CameraIcon
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const MedicalRecordsScreen = () => {
    const [activeTab, setActiveTab] = useState('History');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddResult, setShowAddResult] = useState(false);
    const [showAddPrescription, setShowAddPrescription] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);

    // Real-time states
    const [history, setHistory] = useState([
        { id: 1, date: 'Oct 24, 2024', type: 'Consultation', provider: 'Dr. Sarah Wilson', diagnosis: 'Routine Checkup', status: 'Completed', color: '#10b981' },
        { id: 2, date: 'Sep 12, 2024', type: 'Specialist Visit', provider: 'Dr. James Chen', diagnosis: 'Mild Hypertension', status: 'Completed', color: '#10b981' },
        { id: 3, date: 'Aug 05, 2024', type: 'Emergency', provider: 'City Hospital', diagnosis: 'Sprained Ankle', status: 'Follow-up Req', color: '#f59e0b' }
    ]);

    const [labResults, setLabResults] = useState([
        { id: 1, date: 'Oct 24, 2024', testName: 'Complete Blood Count', result: 'Normal', range: 'N/A', lab: 'Quest Diagnostics', resultColor: '#10b981' },
        { id: 2, date: 'Sep 12, 2024', testName: 'Lipid Panel', result: 'Elevated LDL', range: '< 100 mg/dL', lab: 'City Hospital Lab', resultColor: '#ef4444' },
        { id: 3, date: 'Jan 15, 2024', testName: 'Vitamin D', result: 'Low', range: '30-100 ng/mL', lab: 'Quest Diagnostics', resultColor: '#ef4444' }
    ]);

    const [prescriptions, setPrescriptions] = useState([
        { id: 1, name: 'Lisinopril', dosage: '10mg • Once daily', doctor: 'Dr. James Chen', refills: 2, status: 'Active' },
        { id: 2, name: 'Vitamin D3', dosage: '5000 IU • Once weekly', doctor: 'Dr. Sarah Wilson', refills: 5, status: 'Active' },
        { id: 3, name: 'Ibuprofen', dosage: '400mg • As needed', doctor: 'City Hospital', refills: 0, status: 'Expired' }
    ]);

    // Form states
    const [newResult, setNewResult] = useState({ test: '', lab: '', date: '' });
    const [newMed, setNewMed] = useState({ name: '', dosage: '', doctor: '', refills: '' });
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    const handleTakePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need camera permission to take a picture of your records.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setCapturedImage(result.assets[0].uri);
            Alert.alert('Success', 'Photo captured and attached to record!');
        }
    };

    const saveResult = () => {
        if (!newResult.test) return;

        const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        const entry = {
            id: Date.now(),
            date: dateStr,
            testName: newResult.test,
            result: 'Pending Analysis',
            range: 'N/A',
            lab: newResult.lab || 'Clinical Lab',
            resultColor: '#f59e0b'
        };

        setLabResults(prev => [entry, ...prev]);
        setHistory(prev => [{
            id: Date.now() + 1,
            date: dateStr,
            type: 'Lab Result',
            provider: entry.lab,
            diagnosis: `New: ${entry.testName}`,
            status: 'Uploaded',
            color: '#3713ec'
        }, ...prev]);

        setShowAddResult(false);
        setNewResult({ test: '', lab: '', date: '' });
        setCapturedImage(null);
    };

    const savePrescription = () => {
        if (!newMed.name) return;

        const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        const entry = {
            id: Date.now(),
            name: newMed.name,
            dosage: newMed.dosage || 'As prescribed',
            doctor: newMed.doctor || 'Self Uploaded',
            refills: parseInt(newMed.refills) || 0,
            status: 'Active'
        };

        setPrescriptions(prev => [entry, ...prev]);
        setHistory(prev => [{
            id: Date.now() + 1,
            date: dateStr,
            type: 'Prescription',
            provider: entry.doctor,
            diagnosis: `Added: ${entry.name}`,
            status: 'Active',
            color: '#3713ec'
        }, ...prev]);

        setShowAddPrescription(false);
        setNewMed({ name: '', dosage: '', doctor: '', refills: '' });
        setCapturedImage(null);
    };

    const handleDownloadPDF = (title: string) => {
        Alert.alert('Download Started', `Downloading PDF for "${title}"...`);
    };

    const handleViewDetails = (item: any) => {
        setSelectedRecord(item);
        setShowDetails(true);
    };

    const handleRefillRequest = (id: number) => {
        setPrescriptions(prev => prev.map(p =>
            p.id === id ? { ...p, status: 'Refill Sent' } : p
        ));
        Alert.alert('Success', 'Refill request sent to your provider.');
    };

    const renderTabs = () => (
        <View style={styles.tabWrapper}>
            <View style={styles.tabContainer}>
                {['History', 'Lab Results', 'Prescriptions'].map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={styles.tabButton}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                        {activeTab === tab && <View style={styles.activeIndicator} />}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderHistory = () => (
        <View style={styles.section}>
            {history.filter(i => (i.diagnosis || '').toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
                <TouchableOpacity key={`history-${item.id}`} style={styles.recordCard}>
                    <View style={styles.cardHeader}>
                        <View style={styles.cardTypeRow}>
                            <View style={styles.dateBox}>
                                <Text style={styles.dateText}>{(item.date || '').split(',')[0].toUpperCase()}</Text>
                            </View>
                            <View style={styles.typeBadge}>
                                <Text style={styles.typeText}>{item.type}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.detailsLink} onPress={() => handleViewDetails(item)}>
                            <Text style={styles.detailsLinkText}>Details</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.cardBody}>
                        <View style={styles.providerRow}>
                            <View style={styles.providerIcon}>
                                <User size={14} color="#64748b" />
                            </View>
                            <Text style={styles.providerName}>{item.provider}</Text>
                        </View>
                        <Text style={styles.diagnosisTitle}>{item.diagnosis}</Text>
                    </View>

                    <View style={styles.cardFooter}>
                        <View style={[styles.statusBadge, { backgroundColor: item.color + '10' }]}>
                            <View style={[styles.statusDot, { backgroundColor: item.color }]} />
                            <Text style={[styles.statusBadgeText, { color: item.color }]}>{item.status}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderLabResults = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Results</Text>
                <TouchableOpacity style={styles.addBtnSmall} onPress={() => setShowAddResult(true)}>
                    <Plus size={16} color="#fff" />
                    <Text style={styles.addBtnTextSmall}>Add Result</Text>
                </TouchableOpacity>
            </View>

            {labResults.filter(i => (i.testName || '').toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
                <View key={`lab-${item.id}`} style={styles.labCard}>
                    <View style={styles.labHeader}>
                        <Text style={styles.labDate}>{item.date}</Text>
                        <TouchableOpacity style={styles.pdfBtn} onPress={() => handleDownloadPDF(item.testName)}>
                            <FileDown size={18} color="#3713ec" />
                            <Text style={styles.pdfText}>PDF</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.testName}>{item.testName}</Text>

                    <View style={styles.labInfoGrid}>
                        <View style={styles.labInfoItem}>
                            <Text style={styles.labLabel}>RESULT</Text>
                            <Text style={[styles.labValue, { color: item.resultColor }]}>{item.result}</Text>
                        </View>
                        <View style={styles.labInfoItem}>
                            <Text style={styles.labLabel}>REF. RANGE</Text>
                            <Text style={styles.labValue}>{item.range}</Text>
                        </View>
                        <View style={styles.labInfoItem}>
                            <Text style={styles.labLabel}>LABORATORY</Text>
                            <Text style={styles.labValue}>{item.lab}</Text>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );

    const renderPrescriptions = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Active Medications</Text>
                <TouchableOpacity style={styles.addBtnSmall} onPress={() => setShowAddPrescription(true)}>
                    <Plus size={16} color="#fff" />
                    <Text style={styles.addBtnTextSmall}>Add Prescription</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.medicationGrid}>
                {prescriptions.filter(i => (i.name || '').toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
                    <View key={`med-${item.id}`} style={styles.medCard}>
                        <View style={styles.medHeader}>
                            <View style={styles.medIconBox}>
                                <Pill size={20} color="#3713ec" />
                            </View>
                            <View style={styles.medHeaderActions}>
                                <TouchableOpacity style={styles.prescPdfBtn} onPress={() => handleDownloadPDF(item.name)}>
                                    <FileDown size={18} color="#3713ec" />
                                </TouchableOpacity>
                                <View style={[styles.medStatusBadge, item.status === 'Expired' && styles.expiredBadge]}>
                                    <Text style={[styles.medStatusText, item.status === 'Expired' && styles.expiredText]}>{item.status}</Text>
                                </View>
                            </View>
                        </View>

                        <Text style={styles.medName}>{item.name}</Text>
                        <Text style={styles.medDosage}>{item.dosage}</Text>

                        <View style={styles.medFooter}>
                            <Text style={styles.prescribedBy}>Prescribed by</Text>
                            <Text style={styles.doctorName}>{item.doctor}</Text>
                            <View style={styles.refillRow}>
                                <Text style={styles.refillLabel}>Refills left</Text>
                                <Text style={styles.refillCount}>{item.refills}</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.refillBtn, (item.status === 'Expired' || item.status === 'Refill Sent') && styles.archivedBtn]}
                            disabled={item.status === 'Expired' || item.status === 'Refill Sent'}
                            onPress={() => handleRefillRequest(item.id)}
                        >
                            <Text style={[styles.refillBtnText, (item.status === 'Expired' || item.status === 'Refill Sent') && styles.archivedBtnText]}>
                                {item.status === 'Expired' ? 'Archived' : item.status === 'Refill Sent' ? 'Sent' : 'Request Refill'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'top']}>
            <View style={styles.mainHeader}>
                <Text style={styles.title}>Medical Records</Text>
                <Text style={styles.subtitle}>Access your complete medical history and documents</Text>
            </View>

            {renderTabs()}

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.searchSection}>
                    <View style={styles.searchBar}>
                        <TouchableOpacity onPress={searchQuery ? () => setSearchQuery('') : undefined}>
                            {searchQuery ? <X size={20} color="#3713ec" /> : <Search size={20} color="#94a3b8" />}
                        </TouchableOpacity>
                        <TextInput
                            placeholder={`Search records...`}
                            style={styles.searchInput}
                            placeholderTextColor="#94a3b8"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity style={styles.searchGoBtn} onPress={() => Alert.alert('Search', `Searching for "${searchQuery}" in ${activeTab}...`)}>
                                <Text style={styles.searchGoText}>Search</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {activeTab === 'History' && renderHistory()}
                {activeTab === 'Lab Results' && renderLabResults()}
                {activeTab === 'Prescriptions' && renderPrescriptions()}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Simulation Modals */}
            <Modal
                visible={showAddResult}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowAddResult(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add Lab Result</Text>
                            <TouchableOpacity onPress={() => setShowAddResult(false)}>
                                <X size={24} color="#0f172a" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalBody}>
                            <View style={styles.modalInputGroup}>
                                <Text style={styles.modalLabel}>Test Name</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="e.g. Complete Blood Count"
                                    placeholderTextColor="#94a3b8"
                                    value={newResult.test}
                                    onChangeText={(t) => setNewResult({ ...newResult, test: t })}
                                />
                            </View>
                            <View style={styles.modalInputGroup}>
                                <Text style={styles.modalLabel}>Laboratory</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="e.g. Quest Diagnostics"
                                    placeholderTextColor="#94a3b8"
                                    value={newResult.lab}
                                    onChangeText={(t) => setNewResult({ ...newResult, lab: t })}
                                />
                            </View>
                            <View style={styles.uploadOptions}>
                                <TouchableOpacity style={styles.uploadBtn} onPress={handleTakePhoto}>
                                    <CameraIcon size={20} color="#3713ec" />
                                    <Text style={styles.uploadBtnText}>Take Picture</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.uploadBtn}>
                                    <FileDown size={20} color="#3713ec" />
                                    <Text style={styles.uploadBtnText}>Upload PDF</Text>
                                </TouchableOpacity>
                            </View>
                            {capturedImage && (
                                <View style={styles.attachmentBadge}>
                                    <FileText size={16} color="#10b981" />
                                    <Text style={styles.attachmentText}>Photo attached</Text>
                                </View>
                            )}
                        </ScrollView>
                        <TouchableOpacity style={styles.submitBtn} onPress={saveResult}>
                            <Text style={styles.submitBtnText}>Save Result</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showAddPrescription}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowAddPrescription(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>New Prescription</Text>
                            <TouchableOpacity onPress={() => setShowAddPrescription(false)}>
                                <X size={24} color="#0f172a" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalBody}>
                            <View style={styles.modalInputGroup}>
                                <Text style={styles.modalLabel}>Medication Name</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="e.g. Amoxicillin"
                                    placeholderTextColor="#94a3b8"
                                    value={newMed.name}
                                    onChangeText={(t) => setNewMed({ ...newMed, name: t })}
                                />
                            </View>
                            <View style={styles.modalInputGroup}>
                                <Text style={styles.modalLabel}>Dosage & Frequency</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="e.g. 500mg • Twice daily"
                                    placeholderTextColor="#94a3b8"
                                    value={newMed.dosage}
                                    onChangeText={(t) => setNewMed({ ...newMed, dosage: t })}
                                />
                            </View>
                            <View style={styles.modalInputGroup}>
                                <Text style={styles.modalLabel}>Prescribed By</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="Doctor Name"
                                    placeholderTextColor="#94a3b8"
                                    value={newMed.doctor}
                                    onChangeText={(t) => setNewMed({ ...newMed, doctor: t })}
                                />
                            </View>
                            <View style={styles.modalInputGroup}>
                                <Text style={styles.modalLabel}>Refills</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    placeholderTextColor="#94a3b8"
                                    value={newMed.refills}
                                    onChangeText={(t) => setNewMed({ ...newMed, refills: t })}
                                />
                            </View>
                            <View style={styles.uploadOptions}>
                                <TouchableOpacity style={styles.uploadBtn} onPress={handleTakePhoto}>
                                    <CameraIcon size={20} color="#3713ec" />
                                    <Text style={styles.uploadBtnText}>Take Picture</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.uploadBtn}>
                                    <FileDown size={20} color="#3713ec" />
                                    <Text style={styles.uploadBtnText}>Attach PDF</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                        <TouchableOpacity style={styles.submitBtn} onPress={savePrescription}>
                            <Text style={styles.submitBtnText}>Add to Records</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* High-Fidelity Details Modal */}
            <Modal visible={showDetails} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Record Details</Text>
                            <TouchableOpacity onPress={() => setShowDetails(false)}>
                                <X size={24} color="#0f172a" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <View style={styles.lightDetailsCard}>
                                <View style={styles.detailsIconBox}>
                                    {selectedRecord?.type === 'Consultation' ? <Stethoscope size={30} color="#3713ec" /> :
                                        selectedRecord?.type === 'Prescription' || selectedRecord?.name ? <Pill size={30} color="#3713ec" /> :
                                            <FlaskConical size={30} color="#3713ec" />}
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.detailsDocName}>{selectedRecord?.diagnosis || selectedRecord?.testName || selectedRecord?.name}</Text>
                                    <Text style={styles.detailsDocSpec}>{selectedRecord?.type || (selectedRecord?.testName ? 'Lab Test' : 'Medication')}</Text>
                                </View>
                            </View>

                            <View style={styles.detailsMetaList}>
                                <View style={styles.detailsMetaItem}>
                                    <Calendar size={20} color="#3713ec" />
                                    <Text style={styles.lightDetailsMetaText}>{selectedRecord?.date || 'Today'}</Text>
                                </View>
                                <View style={styles.detailsMetaItem}>
                                    <User size={20} color="#3713ec" />
                                    <Text style={styles.lightDetailsMetaText}>{selectedRecord?.provider || selectedRecord?.lab || selectedRecord?.doctor || 'Clinical Provider'}</Text>
                                </View>
                                <View style={styles.detailsMetaItem}>
                                    <Check size={20} color="#10b981" />
                                    <Text style={[styles.lightDetailsMetaText, { color: '#10b981', fontWeight: '700' }]}>
                                        {selectedRecord?.status || 'Verified Clinical Record'}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.modalSeparator} />

                            <View style={styles.detailsActions}>
                                <TouchableOpacity style={styles.secondaryActionBtn} onPress={() => handleDownloadPDF(selectedRecord?.testName || selectedRecord?.name || 'Record')}>
                                    <Text style={styles.secondaryActionText}>Download PDF</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.primaryActionBtn} onPress={() => setShowDetails(false)}>
                                    <Text style={styles.primaryActionText}>Close View</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
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
    mainHeader: {
        paddingHorizontal: 24,
        paddingTop: 5,
        paddingBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#3713ec',
        letterSpacing: -1,
    },
    subtitle: {
        color: '#64748b',
        fontSize: 14,
        marginTop: 8,
        fontWeight: '500',
        lineHeight: 20,
    },
    tabWrapper: {
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        backgroundColor: '#fff',
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        gap: 32,
    },
    tabButton: {
        paddingVertical: 16,
        position: 'relative',
    },
    tabText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#64748b',
    },
    activeTabText: {
        color: '#3713ec',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: '#3713ec',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
    },
    content: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    searchSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    searchBar: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchInput: {
        marginLeft: 12,
        flex: 1,
        color: '#0f172a',
        fontSize: 15,
        fontWeight: '600',
    },
    searchGoBtn: {
        backgroundColor: '#3713ec',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginLeft: 8,
    },
    searchGoText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
    },
    section: {
        padding: 20,
        paddingTop: 10,
        gap: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0f172a',
    },
    addBtnSmall: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3713ec',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 8,
    },
    addBtnTextSmall: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
    },
    // High-Fidelity Details Modal Styles
    lightDetailsCard: {
        backgroundColor: '#f8fafc',
        padding: 16,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    detailsIconBox: {
        width: 60,
        height: 60,
        borderRadius: 16,
        backgroundColor: '#eff6ff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    detailsDocName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0f172a',
    },
    detailsDocSpec: {
        fontSize: 14,
        color: '#3713ec',
        fontWeight: '700',
        marginTop: 4,
    },
    detailsMetaList: {
        gap: 16,
        marginBottom: 32,
    },
    detailsMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    lightDetailsMetaText: {
        fontSize: 15,
        color: '#334155',
        fontWeight: '600',
    },
    modalSeparator: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 24,
    },
    detailsActions: {
        flexDirection: 'row',
        gap: 12,
    },
    primaryActionBtn: {
        flex: 1,
        backgroundColor: '#3713ec',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryActionText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 14,
    },
    secondaryActionBtn: {
        flex: 1,
        backgroundColor: 'transparent',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    secondaryActionText: {
        color: '#0f172a',
        fontWeight: '800',
        fontSize: 14,
    },
    // History Cards
    recordCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTypeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    dateBox: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    dateText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#475569',
        letterSpacing: 0.5,
    },
    typeBadge: {
        backgroundColor: '#eff6ff',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    typeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#3713ec',
    },
    detailsLink: {
        paddingVertical: 4,
    },
    detailsLinkText: {
        color: '#3713ec',
        fontSize: 13,
        fontWeight: '800',
    },
    cardBody: {
        marginBottom: 16,
    },
    providerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    providerIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    providerName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    diagnosisTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0f172a',
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusBadgeText: {
        fontSize: 12,
        fontWeight: '700',
    },
    // Lab Result Cards
    labCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    labHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    labDate: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0f172a',
    },
    pdfBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    pdfText: {
        color: '#3713ec',
        fontSize: 13,
        fontWeight: '800',
    },
    testName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: 16,
    },
    labInfoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    labInfoItem: {
        flex: 1,
    },
    labLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#94a3b8',
        marginBottom: 4,
    },
    labValue: {
        fontSize: 13,
        fontWeight: '700',
        color: '#475569',
    },
    // Prescription Cards
    medicationGrid: {
        gap: 16,
    },
    medCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    medHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    medIconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#f0f0ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    medStatusBadge: {
        backgroundColor: '#ecfdf5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    expiredBadge: {
        backgroundColor: '#f1f5f9',
    },
    medStatusText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#10b981',
    },
    expiredText: {
        color: '#94a3b8',
    },
    medName: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0f172a',
    },
    medDosage: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
        marginTop: 4,
        marginBottom: 16,
    },
    medFooter: {
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        marginBottom: 20,
    },
    prescribedBy: {
        fontSize: 11,
        color: '#94a3b8',
        fontWeight: '600',
    },
    doctorName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0f172a',
        marginTop: 2,
    },
    refillRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    refillLabel: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '600',
    },
    refillCount: {
        fontSize: 13,
        fontWeight: '800',
        color: '#0f172a',
    },
    refillBtn: {
        backgroundColor: '#3713ec',
        height: 54,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    refillBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '800',
    },
    archivedBtn: {
        backgroundColor: '#f1f5f9',
    },
    archivedBtnText: {
        color: '#94a3b8',
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
    modalInputGroup: {
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
    uploadBtnText: {
        color: '#3713ec',
        fontSize: 15,
        fontWeight: '700',
    },
    submitBtn: {
        backgroundColor: '#3713ec',
        height: 64,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3713ec',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    submitBtnText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '800',
    },
    medHeaderActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    prescPdfBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#f0f0ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadOptions: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    uploadBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eff6ff',
        borderWidth: 1,
        borderColor: '#3713ec',
        borderStyle: 'dashed',
        padding: 16,
        borderRadius: 16,
        gap: 8,
    },
    attachmentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ecfdf5',
        padding: 12,
        borderRadius: 12,
        gap: 8,
        borderWidth: 1,
        borderColor: '#10b981',
    },
    attachmentText: {
        color: '#10b981',
        fontSize: 13,
        fontWeight: '700',
    },
});

export default MedicalRecordsScreen;

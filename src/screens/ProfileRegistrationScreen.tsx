import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Switch, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, ChevronLeft, Check, Info, User, Activity, FileText } from 'lucide-react-native';
import { useUser } from '../context/UserContext';

import { RootStackScreenProps } from '../types/navigation';

const ProfileRegistrationScreen = ({ navigation }: RootStackScreenProps<'ProfileRegistration'>) => {
    const { updateUserProfile } = useUser();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        age: '',
        gender: '',
        weight: '',
        height: '',
        bloodGroup: '',
        smokerStatus: 'Non-smoker',
        existingIssues: '',
        about: ''
    });

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
        else {
            updateUserProfile(formData);
            navigation.navigate('Main');
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else navigation.goBack();
    };

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const steps = [
        { title: 'Personal Details', icon: User },
        { title: 'Body Metrics', icon: Activity },
        { title: 'Medical History', icon: FileText }
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with Progress */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <ChevronLeft size={24} color="#0f172a" />
                </TouchableOpacity>
                <View style={styles.progressContainer}>
                    {steps.map((s, i) => (
                        <React.Fragment key={i}>
                            <View style={[styles.progressStep, step >= i + 1 && styles.progressStepActive]}>
                                {step > i + 1 ? <Check size={12} color="#ffffff" /> : <Text style={[styles.progressText, step >= i + 1 && styles.progressTextActive]}>{i + 1}</Text>}
                            </View>
                            {i < 2 && <View style={[styles.progressLine, step > i + 1 && styles.progressLineActive]} />}
                        </React.Fragment>
                    ))}
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.stepTitle}>{steps[step - 1].title}</Text>
                <Text style={styles.stepSubtitle}>Please provide accurate information for clinical analysis.</Text>

                {step === 1 && (
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>First Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter first name"
                                value={formData.firstName}
                                onChangeText={(val) => updateField('firstName', val)}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Last Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter last name"
                                value={formData.lastName}
                                onChangeText={(val) => updateField('lastName', val)}
                            />
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Age</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Years"
                                    keyboardType="numeric"
                                    value={formData.age}
                                    onChangeText={(val) => updateField('age', val)}
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 16 }]}>
                                <Text style={styles.label}>Gender</Text>
                                <View style={styles.dropdown}>
                                    <Text style={styles.dropdownText}>{formData.gender || 'Select'}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>About Me</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Tell us about yourself (Add emojis! 🧘‍♂️✨)"
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                                value={formData.about}
                                onChangeText={(val) => updateField('about', val)}
                            />
                        </View>
                    </View>
                )}

                {step === 2 && (
                    <View style={styles.form}>
                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Weight (kg)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="75"
                                    keyboardType="numeric"
                                    value={formData.weight}
                                    onChangeText={(val) => updateField('weight', val)}
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 16 }]}>
                                <Text style={styles.label}>Height (cm)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="175"
                                    keyboardType="numeric"
                                    value={formData.height}
                                    onChangeText={(val) => updateField('height', val)}
                                />
                            </View>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Blood Group</Text>
                            <View style={styles.bloodGrid}>
                                {['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map(bg => (
                                    <TouchableOpacity
                                        key={bg}
                                        style={[styles.bloodBtn, formData.bloodGroup === bg && styles.bloodBtnActive]}
                                        onPress={() => updateField('bloodGroup', bg)}
                                    >
                                        <Text style={[styles.bloodBtnText, formData.bloodGroup === bg && styles.bloodBtnTextActive]}>{bg}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>
                )}

                {step === 3 && (
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Smoker Status</Text>
                            <View style={styles.switchRow}>
                                <Text style={styles.switchLabel}>Are you a smoker?</Text>
                                <Switch
                                    value={formData.smokerStatus === 'Smoker'}
                                    onValueChange={(val) => updateField('smokerStatus', val ? 'Smoker' : 'Non-smoker')}
                                    trackColor={{ false: '#e2e8f0', true: '#3713ec' }}
                                />
                            </View>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Existing Medical Issues</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="List any chronic conditions, allergies, or past surgeries..."
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                value={formData.existingIssues}
                                onChangeText={(val) => updateField('existingIssues', val)}
                            />
                        </View>
                        <View style={styles.infoBox}>
                            <Info size={16} color="#3713ec" />
                            <Text style={styles.infoText}>This data is used to calibrate your personalized recovery score.</Text>
                        </View>
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Persistent Footer Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
                    <Text style={styles.primaryButtonText}>
                        {step === 3 ? 'Complete Registration' : 'Next Step'}
                    </Text>
                    {step < 3 && <ChevronRight size={20} color="#ffffff" />}
                </TouchableOpacity>
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
        paddingHorizontal: 24,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: -40, // offset back button
    },
    progressStep: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#e2e8f0',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    },
    progressStepActive: {
        borderColor: '#3713ec',
        backgroundColor: '#3713ec',
    },
    progressText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#94a3b8',
    },
    progressTextActive: {
        color: '#ffffff',
    },
    progressLine: {
        width: 32,
        height: 2,
        backgroundColor: '#e2e8f0',
        marginHorizontal: 4,
    },
    progressLineActive: {
        backgroundColor: '#3713ec',
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 32,
    },
    stepTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: -0.5,
    },
    stepSubtitle: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 8,
        lineHeight: 22,
        marginBottom: 32,
    },
    form: {
        gap: 24,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0f172a',
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#0f172a',
    },
    textArea: {
        height: 120,
        paddingTop: 16,
    },
    row: {
        flexDirection: 'row',
    },
    dropdown: {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        justifyContent: 'center',
    },
    dropdownText: {
        fontSize: 16,
        color: '#94a3b8',
    },
    bloodGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 8,
    },
    bloodBtn: {
        width: (Dimensions.get('window').width - 48 - 36) / 4,
        height: 50,
        borderRadius: 16,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bloodBtnActive: {
        backgroundColor: '#3713ec',
        borderColor: '#3713ec',
    },
    bloodBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748b',
    },
    bloodBtnTextActive: {
        color: '#ffffff',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    switchLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0f172a',
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#eff6ff',
        padding: 16,
        borderRadius: 16,
        gap: 12,
        alignItems: 'center',
    },
    infoText: {
        flex: 1,
        fontSize: 12,
        color: '#1e40af',
        fontWeight: '500',
        lineHeight: 18,
    },
    footer: {
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        backgroundColor: '#ffffff',
    },
    primaryButton: {
        backgroundColor: '#3713ec',
        borderRadius: 20,
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#3713ec',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '800',
    }
});

export default ProfileRegistrationScreen;

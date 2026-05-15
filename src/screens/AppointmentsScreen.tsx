import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, User, FileText, ChevronLeft, ChevronRight, X, Check } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const AppointmentsScreen = () => {
    const [appointments, setAppointments] = useState([
        {
            id: 1,
            doctor: 'Dr. Sarah Wilson',
            specialty: 'Cardiologist',
            date: 'FEB 13',
            time: '09:30 AM',
            location: 'Heart Institute, Rm 302',
            status: 'Upcoming',
            color: '#3713ec'
        },
        {
            id: 2,
            doctor: 'Dr. James Chen',
            specialty: 'General Practitioner',
            date: 'FEB 14',
            time: '10:00 AM',
            location: 'City Clinic, Suite 100',
            status: 'Confirmed',
            color: '#10b981'
        },
        {
            id: 3,
            doctor: 'Dr. Emily White',
            specialty: 'Dermatologist',
            date: 'FEB 28',
            time: '02:15 PM',
            location: 'Skin Care Center',
            status: 'Pending',
            color: '#f59e0b'
        }
    ]);

    const [showNewApt, setShowNewApt] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [showReschedule, setShowReschedule] = useState(false);
    const [selectedApt, setSelectedApt] = useState<any>(null);
    const [newApt, setNewApt] = useState({ doctor: '', specialty: '', location: '' });
    const [newAptDate, setNewAptDate] = useState(new Date());
    const [rescheduleData, setRescheduleData] = useState({ date: new Date() });

    const [showPicker, setShowPicker] = useState(false);
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
    const [pickerTarget, setPickerTarget] = useState<'new' | 'reschedule'>('new');

    const [selectedDay, setSelectedDay] = useState(20);
    const [viewDate, setViewDate] = useState(new Date(2026, 1, 1)); // February 2026

    const handleDaySelect = (day: number) => {
        setSelectedDay(day);
        const monthStr = formatMonthShort(viewDate);
        const fullDateStr = `${monthStr} ${day}`;

        const hasApt = appointments.some(a => a.date.includes(fullDateStr));
        if (!hasApt) {
            Alert.alert(`${monthStr} ${day}`, 'No appointments scheduled for this day.');
        } else {
            const apt = appointments.find(a => a.date.includes(fullDateStr));
            Alert.alert(`Appointment found!`, `You have a visit with ${apt?.doctor} on ${fullDateStr}.`);
        }
    };

    const formatDateShort = (date: Date) => {
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}`;
    };

    const formatTimeShort = (date: Date) => {
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    };

    const formatMonthLong = (date: Date) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    const formatMonthShort = (date: Date) => {
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return months[date.getMonth()];
    };

    const changeMonth = (offset: number) => {
        const next = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
        setViewDate(next);
        setSelectedDay(0); // Reset selection when month changes
    };

    const onPickerChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowPicker(false);
        }

        if (event.type === 'set' && selectedDate) {
            if (pickerTarget === 'new') {
                setNewAptDate(selectedDate);
            } else {
                setRescheduleData({ ...rescheduleData, date: selectedDate });
            }
        } else if (Platform.OS === 'ios') {
            // iOS keeps the picker open, we just update the live state
            const currentDate = selectedDate || (pickerTarget === 'new' ? newAptDate : rescheduleData.date);
            if (pickerTarget === 'new') {
                setNewAptDate(currentDate);
            } else {
                setRescheduleData({ ...rescheduleData, date: currentDate });
            }
        }
    };

    const openPicker = (mode: 'date' | 'time', target: 'new' | 'reschedule') => {
        setPickerMode(mode);
        setPickerTarget(target);
        setShowPicker(true);
    };

    const handleNewAppointment = () => {
        if (!newApt.doctor) {
            Alert.alert('Error', 'Please fill in the doctor name.');
            return;
        }

        const dateStr = formatDateShort(newAptDate);
        const timeStr = formatTimeShort(newAptDate);

        const entry = {
            id: Date.now(),
            doctor: newApt.doctor,
            specialty: newApt.specialty || 'General Practitioner',
            date: dateStr,
            time: timeStr,
            location: newApt.location || 'Stitch Health Center',
            status: 'Upcoming',
            color: '#3713ec'
        };

        setAppointments(prev => [entry, ...prev]);
        setShowNewApt(false);
        setNewApt({ doctor: '', specialty: '', location: '' });
        setNewAptDate(new Date());
        Alert.alert('Success', 'Appointment scheduled successfully!');
    };

    const handleReschedulePress = (apt: any) => {
        setSelectedApt(apt);
        // Try to parse existing date/time if possible, otherwise default to now
        setRescheduleData({ date: new Date() });
        setShowReschedule(true);
    };

    const handleUpdateSchedule = () => {
        if (!selectedApt) return;

        const dateStr = formatDateShort(rescheduleData.date);
        const timeStr = formatTimeShort(rescheduleData.date);

        setAppointments(prev => prev.map(a =>
            a.id === selectedApt.id ? { ...a, date: dateStr, time: timeStr, status: 'Rescheduled' } : a
        ));
        setShowReschedule(false);
        Alert.alert('Success', 'Schedule updated successfully!');
    };

    const handleViewDetails = (apt: any) => {
        setSelectedApt(apt);
        setShowDetails(true);
    };


    const renderCalendar = () => {
        const monthName = formatMonthLong(viewDate);
        const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
        const startDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

        const daySlots = [];
        for (let i = 0; i < startDay; i++) {
            daySlots.push(<View key={`empty-${i}`} style={styles.dayCell} />);
        }
        for (let d = 1; d <= daysInMonth; d++) {
            daySlots.push(
                <TouchableOpacity
                    key={`day-${d}`}
                    style={[styles.dayCell, d === selectedDay && styles.activeDayCell]}
                    onPress={() => handleDaySelect(d)}
                >
                    <Text style={[styles.dayText, d === selectedDay && styles.activeDayText]}>{d}</Text>
                </TouchableOpacity>
            );
        }

        return (
            <View style={styles.calendarCard}>
                <View style={styles.calendarHeader}>
                    <Text style={styles.calendarTitle}>{monthName}</Text>
                    <View style={styles.calendarNav}>
                        <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navBtn}>
                            <ChevronLeft size={20} color="#3713ec" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navBtn}>
                            <ChevronRight size={20} color="#3713ec" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.daysHeader}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <Text key={day} style={styles.dayHeaderText}>{day}</Text>
                    ))}
                </View>

                <View style={styles.daysGrid}>
                    {daySlots}
                </View>

                <View style={styles.categoriesSection}>
                    <Text style={styles.categoriesTitle}>Categories</Text>
                    <View style={styles.categoryRow}>
                        <View style={[styles.catDot, { backgroundColor: '#3713ec' }]} /><Text style={styles.catText}>Consultation</Text>
                    </View>
                    <View style={styles.categoryRow}>
                        <View style={[styles.catDot, { backgroundColor: '#10b981' }]} /><Text style={styles.catText}>Checkup</Text>
                    </View>
                    <View style={styles.categoryRow}>
                        <View style={[styles.catDot, { backgroundColor: '#f59e0b' }]} /><Text style={styles.catText}>Therapy</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View style={{ flex: 1, marginRight: 16 }}>
                    <Text style={styles.title} numberOfLines={1}>Appointments</Text>
                    <Text style={styles.subtitle} numberOfLines={1}>Manage your visits and schedule</Text>
                </View>
                <TouchableOpacity style={styles.newAptBtn} onPress={() => setShowNewApt(true)}>
                    <Plus size={20} color="#fff" />
                    <Text style={styles.newAptBtnText}>New</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.mainScroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.layoutContainer}>
                    {/* Calendar Summary (Now First) */}
                    {renderCalendar()}

                    {/* Upcoming Visits (Now Second) */}
                    <View style={styles.visitsSection}>
                        <Text style={styles.sectionHeading}>Upcoming Visits</Text>
                        {appointments.map(item => (
                            <View key={item.id} style={styles.aptCard}>
                                <View style={styles.cardHeader}>
                                    <View style={[styles.statusDot, { backgroundColor: item.color }]} />
                                    <Text style={[styles.statusTag, { color: item.color }]}>{item.status}</Text>
                                    <View style={{ flex: 1 }} />
                                    <TouchableOpacity style={styles.rescheduleBtn} onPress={() => handleReschedulePress(item)}>
                                        <Text style={styles.rescheduleBtnText}>Reschedule</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity style={styles.cardBody} onPress={() => handleViewDetails(item)}>
                                    <View style={styles.dateBox}>
                                        <Text style={styles.dateMonth}>{item.date.split(' ')[0]}</Text>
                                        <Text style={styles.dateDay}>{item.date.split(' ')[1]}</Text>
                                    </View>

                                    <View style={styles.aptInfo}>
                                        <Text style={styles.docName}>{item.doctor}</Text>
                                        <Text style={styles.docSpecialty}>{item.specialty}</Text>

                                        <View style={styles.aptMeta}>
                                            <View style={styles.metaItem}>
                                                <Clock size={14} color="#94a3b8" />
                                                <Text style={styles.metaText}>{item.time}</Text>
                                            </View>
                                            <View style={styles.metaItem}>
                                                <MapPin size={14} color="#94a3b8" />
                                                <Text style={styles.metaText}>{item.location}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* New Appointment Modal (Light Theme) */}
            <Modal visible={showNewApt} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>New Appointment</Text>
                            <TouchableOpacity onPress={() => setShowNewApt(false)}>
                                <X size={24} color="#0f172a" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <Text style={styles.inputLabel}>Doctor Name</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="e.g. Dr. Robert Fox"
                                placeholderTextColor="#64748b"
                                value={newApt.doctor}
                                onChangeText={(t) => setNewApt({ ...newApt, doctor: t })}
                            />

                            <Text style={styles.inputLabel}>Specialty</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="e.g. Neurologist"
                                placeholderTextColor="#64748b"
                                value={newApt.specialty}
                                onChangeText={(t) => setNewApt({ ...newApt, specialty: t })}
                            />

                            <View style={styles.inputRow}>
                                <TouchableOpacity style={{ flex: 1 }} onPress={() => openPicker('time', 'new')}>
                                    <Text style={styles.inputLabel}>Time</Text>
                                    <View style={styles.pickerTrigger}>
                                        <Text style={styles.pickerTriggerText}>
                                            {formatTimeShort(newAptDate)}
                                        </Text>
                                        <Clock size={18} color="#3713ec" />
                                    </View>
                                </TouchableOpacity>
                                <View style={{ flex: 1, marginLeft: 16 }}>
                                    <Text style={styles.inputLabel}>Location</Text>
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="Suite 102"
                                        placeholderTextColor="#64748b"
                                        value={newApt.location}
                                        onChangeText={(t) => setNewApt({ ...newApt, location: t })}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity style={styles.submitBtn} onPress={handleNewAppointment}>
                                <Text style={styles.submitBtnText}>Confirm Appointment</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Reschedule Modal (Light Theme) */}
            <Modal visible={showReschedule} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Reschedule</Text>
                            <TouchableOpacity onPress={() => setShowReschedule(false)}>
                                <X size={24} color="#0f172a" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <Text style={[styles.modalSubtitle, { marginBottom: 20 }]}>
                                Updating appointment with <Text style={{ fontWeight: '800', color: '#3713ec' }}>{selectedApt?.doctor}</Text>
                            </Text>

                            <View style={styles.inputRow}>
                                <TouchableOpacity style={{ flex: 1 }} onPress={() => openPicker('date', 'reschedule')}>
                                    <Text style={styles.inputLabel}>NEW DATE</Text>
                                    <View style={styles.pickerTrigger}>
                                        <Text style={styles.pickerTriggerText}>
                                            {rescheduleData.date.toDateString()}
                                        </Text>
                                        <CalendarIcon size={18} color="#3713ec" />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flex: 1, marginLeft: 16 }} onPress={() => openPicker('time', 'reschedule')}>
                                    <Text style={styles.inputLabel}>NEW TIME</Text>
                                    <View style={styles.pickerTrigger}>
                                        <Text style={styles.pickerTriggerText}>
                                            {formatTimeShort(rescheduleData.date)}
                                        </Text>
                                        <Clock size={18} color="#3713ec" />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.submitBtn} onPress={handleUpdateSchedule}>
                                <Text style={styles.submitBtnText}>Update Schedule</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Appointment Details Modal (Light Theme) */}
            <Modal visible={showDetails} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Details</Text>
                            <TouchableOpacity onPress={() => setShowDetails(false)}>
                                <X size={24} color="#0f172a" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <View style={styles.lightDetailsCard}>
                                <Image
                                    source={{ uri: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop' }}
                                    style={styles.detailsAvatar}
                                />
                                <View>
                                    <Text style={styles.detailsDocName}>{selectedApt?.doctor}</Text>
                                    <Text style={styles.detailsDocSpec}>{selectedApt?.specialty}</Text>
                                </View>
                            </View>

                            <View style={styles.detailsMetaList}>
                                <View style={styles.detailsMetaItem}>
                                    <CalendarIcon size={20} color="#3713ec" />
                                    <Text style={styles.lightDetailsMetaText}>{selectedApt?.date} at {selectedApt?.time}</Text>
                                </View>
                                <View style={styles.detailsMetaItem}>
                                    <MapPin size={20} color="#3713ec" />
                                    <Text style={styles.lightDetailsMetaText}>{selectedApt?.location}</Text>
                                </View>
                                <View style={styles.detailsMetaItem}>
                                    <Check size={20} color="#10b981" />
                                    <Text style={[styles.lightDetailsMetaText, { color: '#10b981', fontWeight: '700' }]}>Clinical Consultation</Text>
                                </View>
                            </View>

                            <View style={styles.detailsActions}>
                                <TouchableOpacity style={styles.secondaryActionBtn}>
                                    <Text style={styles.secondaryActionText}>Download Prep Doc</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.primaryActionBtn}>
                                    <Text style={styles.primaryActionText}>Join Virtual Room</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            {showPicker && (
                <DateTimePicker
                    value={pickerTarget === 'new' ? newAptDate : rescheduleData.date}
                    mode={pickerMode}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onPickerChange}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff', // Clean white background
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 5,
        paddingBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#3713ec', // Brand blue
        letterSpacing: -1,
    },
    subtitle: {
        color: '#64748b',
        fontSize: 14,
        marginTop: 4,
    },
    newAptBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3713ec',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 14,
        gap: 8,
    },
    newAptBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    mainScroll: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 120,
    },
    layoutContainer: {
        paddingHorizontal: 10,
    },
    visitsSection: {
        flex: 1,
        marginBottom: 32,
    },
    sectionHeading: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: 20,
    },
    aptCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20, // Adjusted for a better balance
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        minHeight: 140, // Increased to accommodate the new vertical layout
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    cardBody: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    dateBox: {
        width: 70, // Increased size
        height: 70, // Increased size
        backgroundColor: '#f1f5f9',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateMonth: {
        fontSize: 10,
        fontWeight: '800',
        color: '#64748b',
        marginBottom: 2,
    },
    dateDay: {
        fontSize: 20,
        fontWeight: '900',
        color: '#0f172a',
    },
    aptInfo: {
        flex: 1,
        marginLeft: 20, // Increased margin
    },
    docName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0f172a',
    },
    docSpecialty: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 2,
        fontWeight: '600',
    },
    aptMeta: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600',
    },
    aptActions: {
        display: 'none', // Removed this container in favor of cardHeader
    },
    statusTag: {
        fontSize: 12,
        fontWeight: '800',
    },
    rescheduleBtn: {
        backgroundColor: '#3713ec',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        shadowColor: '#3713ec',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    rescheduleBtnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '800',
    },
    // Calendar Card Styles
    calendarCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    calendarTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#0f172a',
    },
    calendarNav: {
        flexDirection: 'row',
        gap: 12,
    },
    navBtn: {
        padding: 4,
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
    },
    daysHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    dayHeaderText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '700',
        color: '#94a3b8',
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: '14.28%',
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
    },
    activeDayCell: {
        backgroundColor: '#3713ec',
    },
    dayText: {
        color: '#475569',
        fontSize: 14,
        fontWeight: '600',
    },
    activeDayText: {
        color: '#fff',
        fontWeight: '800',
    },
    categoriesSection: {
        marginTop: 32,
        paddingTop: 32,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    categoriesTitle: {
        fontSize: 14,
        fontWeight: '900',
        color: '#0f172a',
        marginBottom: 16,
    },
    categoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    catDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    catText: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '600',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#0f172a',
    },
    modalBody: {},
    inputLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 8,
        marginLeft: 4,
    },
    modalInput: {
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        padding: 16,
        color: '#0f172a',
        fontSize: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    inputRow: {
        flexDirection: 'row',
    },
    submitBtn: {
        backgroundColor: '#3713ec',
        height: 64,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
    modalSubtitle: {
        fontSize: 15,
        color: '#64748b',
        lineHeight: 22,
    },
    pickerTrigger: {
        backgroundColor: '#f1f5f9',
        height: 56,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    pickerTriggerText: {
        fontSize: 16,
        color: '#0f172a',
        fontWeight: '600',
    },
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
    detailsAvatar: {
        width: 60,
        height: 60,
        borderRadius: 16,
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
});

export default AppointmentsScreen;

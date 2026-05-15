import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Image, KeyboardAvoidingView, Platform, Dimensions, Modal, Alert, StatusBar, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Send, Plus, Phone, Video, ChevronLeft, MessageCircle, Paperclip, X, Mic, Camera, Image as ImageIcon, Plus as PlusIcon, FileText } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const MessagesScreen = ({ navigation }: any) => {
    const [isOnboarded, setIsOnboarded] = useState(false);
    const [onboardingStep, setOnboardingStep] = useState(1);
    const [activeChat, setActiveChat] = useState<number | null>(null);
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [countryCode, setCountryCode] = useState({ code: '+91', flag: '🇮🇳', name: 'India' });
    const [showContactsModal, setShowContactsModal] = useState(false);
    const [messageInput, setMessageInput] = useState('');

    // Feature States
    const [callModal, setCallModal] = useState<{ visible: boolean; type: 'audio' | 'video'; user: string } | null>(null);
    const [mediaModal, setMediaModal] = useState(false);

    const scrollViewRef = useRef<ScrollView>(null);

    // Navigation logic to hide/show tab bar
    useLayoutEffect(() => {
        if (activeChat !== null) {
            navigation.setOptions({
                tabBarStyle: { display: 'none' }
            });
        } else {
            navigation.setOptions({
                tabBarStyle: undefined
            });
        }
    }, [navigation, activeChat]);

    // Android Back Handler to follow "walkthrough" logic
    useEffect(() => {
        const backAction = () => {
            if (activeChat !== null) {
                setActiveChat(null);
                return true;
            }
            if (!isOnboarded && onboardingStep > 1) {
                setOnboardingStep(onboardingStep - 1);
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, [activeChat, isOnboarded, onboardingStep]);

    const [conversations, setConversations] = useState([
        { id: 1, name: 'Dr. Sarah Wilson', role: 'Cardiologist', lastMessage: 'Your readings look stable. Great work!', time: '10:30 AM', unread: 2, online: true, avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&h=200&auto=format&fit=crop' },
        { id: 2, name: 'Dr. James Chen', role: 'GP', lastMessage: 'Schedule a follow-up for next week.', time: 'Yesterday', unread: 0, online: false, avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&h=200&auto=format&fit=crop' }
    ]);

    const [chatMessages, setChatMessages] = useState<{ [key: number]: any[] }>({
        1: [
            { id: 1, text: 'Good morning, Elena. I reviewed your recent vitals.', time: '10:25 AM', sender: 'them' },
            { id: 2, text: 'Your heart rate variability has improved significantly.', time: '10:25 AM', sender: 'them' },
            { id: 3, text: 'That is great to hear, Dr. Wilson! I have been sticking to the cardio routine.', time: '10:28 AM', sender: 'me' },
            { id: 4, text: 'It shows! Keep up the good work. Your latest heart rate readings look stable.', time: '10:30 AM', sender: 'them' }
        ],
        2: [
            { id: 1, text: 'Hello Dr. Chen, I have some questions about my prescription.', time: 'Yesterday', sender: 'me' },
            { id: 2, text: 'Schedule a follow-up for next week.', time: 'Yesterday', sender: 'them' }
        ]
    });

    const dummyContacts = [
        { id: 101, name: 'Ankita Sharma', phone: '+91 98765 43210' },
        { id: 102, name: 'Rahul Verma', phone: '+91 87654 32109' },
        { id: 103, name: 'John Doe', phone: '+1 234 567 890' },
        { id: 104, name: 'Priya Patel', phone: '+91 99988 77766' },
    ];

    const handleSend = () => {
        if (!messageInput.trim() || activeChat === null) return;

        const newMessage = {
            id: Date.now(),
            text: messageInput.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: 'me'
        };

        setChatMessages(prev => ({
            ...prev,
            [activeChat]: [...(prev[activeChat] || []), newMessage]
        }));

        setConversations(prev => prev.map(conv =>
            conv.id === activeChat
                ? { ...conv, lastMessage: messageInput.trim(), time: 'Just now' }
                : conv
        ));

        setMessageInput('');
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    };

    const handleAddContact = (contact: any) => {
        if (conversations.find(c => c.id === contact.id)) {
            Alert.alert('Info', 'Contact already in your messages.');
            return;
        }

        const newConversation = {
            id: contact.id,
            name: contact.name,
            role: 'Contact',
            lastMessage: 'Tap to start chatting',
            time: 'Just now',
            unread: 0,
            online: false,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=random`
        };

        setConversations(prev => [newConversation, ...prev]);
        setChatMessages(prev => ({ ...prev, [contact.id]: [] }));
        setShowContactsModal(false);
    };

    const countryCodes = [
        { code: '+91', flag: '🇮🇳', name: 'India' },
        { code: '+1', flag: '🇺🇸', name: 'USA' },
        { code: '+44', flag: '🇬🇧', name: 'UK' },
    ];

    // --- Sub-components (Modals) ---

    const CallModalScreen = () => {
        if (!callModal) return null;
        return (
            <Modal visible={callModal.visible} animationType="slide" presentationStyle="fullScreen">
                <View style={styles.callModalContainer}>
                    <StatusBar barStyle="light-content" />
                    {callModal.type === 'video' ? (
                        <Image source={{ uri: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?q=80&w=500&auto=format&fit=crop' }} style={StyleSheet.absoluteFill} />
                    ) : (
                        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#3713ec' }]} />
                    )}
                    <View style={styles.callContent}>
                        <View style={styles.callHeader}>
                            <Text style={styles.callStatus}>{callModal.type === 'video' ? 'VIDEO CALL' : 'AUDIO CALL'}</Text>
                            <Text style={styles.callName}>{callModal.user}</Text>
                            <Text style={styles.callTimer}>00:12</Text>
                        </View>
                        <View style={styles.callFooter}>
                            <View style={styles.callActionsRow}>
                                <TouchableOpacity style={styles.callActionBtn}><Mic size={24} color="#fff" /></TouchableOpacity>
                                <TouchableOpacity style={[styles.callActionBtn, { backgroundColor: '#ef4444' }]} onPress={() => setCallModal(null)}><Phone size={24} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} /></TouchableOpacity>
                                <TouchableOpacity style={styles.callActionBtn}><Video size={24} color="#fff" /></TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    const MediaPickerModal = () => (
        <Modal visible={mediaModal} animationType="fade" transparent={true}>
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setMediaModal(false)}>
                <View style={styles.mediaPickerContent}>
                    <Text style={styles.mediaTitle}>Share Media</Text>
                    <View style={styles.mediaGrid}>
                        <TouchableOpacity style={styles.mediaItem} onPress={() => { Alert.alert('Camera', 'Simulating Camera access...'); setMediaModal(false); }}>
                            <View style={[styles.mediaIcon, { backgroundColor: '#ec4899' }]}><Camera size={24} color="#fff" /></View>
                            <Text style={styles.mediaLabel}>Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.mediaItem} onPress={() => { Alert.alert('Gallery', 'Simulating Gallery access...'); setMediaModal(false); }}>
                            <View style={[styles.mediaIcon, { backgroundColor: '#3b82f6' }]}><ImageIcon size={24} color="#fff" /></View>
                            <Text style={styles.mediaLabel}>Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.mediaItem} onPress={() => { Alert.alert('Document', 'Simulating Document access...'); setMediaModal(false); }}>
                            <View style={[styles.mediaIcon, { backgroundColor: '#8b5cf6' }]}><FileText size={24} color="#fff" /></View>
                            <Text style={styles.mediaLabel}>File</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );

    if (!isOnboarded) {
        return (
            <SafeAreaView style={styles.container} edges={['bottom', 'top']}>
                <View style={styles.onboardingContainer}>
                    <View style={styles.onboardingHeader}>
                        <View style={styles.onboardingIcon}>
                            <MessageCircle size={32} color="#3713ec" />
                        </View>
                        <Text style={styles.onboardingTitle}>
                            {onboardingStep === 1 ? 'Welcome to Messages' : onboardingStep === 2 ? 'Check your messages' : 'Create your profile'}
                        </Text>
                        <Text style={styles.onboardingSubtitle}>
                            {onboardingStep === 1 ? 'Enter your phone number to get started' : onboardingStep === 2 ? 'We sent a 6-digit code to your phone' : 'Tell us a bit about yourself'}
                        </Text>
                    </View>

                    {onboardingStep === 1 && (
                        <View style={styles.onboardingForm}>
                            <View style={styles.phoneInput}>
                                <TouchableOpacity style={styles.countryCodeBtn} onPress={() => setShowCountryPicker(true)}>
                                    <Text style={[styles.bold, { fontSize: 16 }]}>{countryCode.flag} {countryCode.code}</Text>
                                </TouchableOpacity>
                                <TextInput style={styles.inputField} placeholder="Phone Number" keyboardType="phone-pad" />
                            </View>

                            <Modal visible={showCountryPicker} animationType="slide" transparent={true}>
                                <View style={styles.modalOverlay}>
                                    <View style={[styles.modalContent, { maxHeight: '50%' }]}>
                                        <View style={styles.modalHeader}>
                                            <Text style={styles.modalTitle}>Select Country</Text>
                                            <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                                                <X size={24} color="#0f172a" />
                                            </TouchableOpacity>
                                        </View>
                                        <ScrollView>
                                            {countryCodes.map(c => (
                                                <TouchableOpacity key={c.code} style={styles.countryOption} onPress={() => { setCountryCode(c); setShowCountryPicker(false); }}>
                                                    <Text style={styles.countryOptionText}>{c.flag} {c.name} ({c.code})</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                </View>
                            </Modal>

                            <TouchableOpacity style={styles.primaryButton} onPress={() => setOnboardingStep(2)}>
                                <Text style={styles.primaryButtonText}>Send Verification</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {onboardingStep === 2 && (
                        <View style={styles.onboardingForm}>
                            <View style={styles.otpContainer}>
                                {[1, 2, 3, 4, 5, 6].map(i => <View key={i} style={styles.otpBox}><TextInput style={styles.otpInput} keyboardType="numeric" maxLength={1} /></View>)}
                            </View>
                            <TouchableOpacity style={styles.primaryButton} onPress={() => setOnboardingStep(3)}>
                                <Text style={styles.primaryButtonText}>Verify & Continue</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.secondaryBtn} onPress={() => setOnboardingStep(1)}>
                                <Text style={styles.secondaryBtnText}>Edit Phone Number</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {onboardingStep === 3 && (
                        <View style={styles.onboardingForm}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.formLabel}>Full Name</Text>
                                <TextInput style={styles.inputField} placeholder="Enter your name" />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.formLabel}>About Me</Text>
                                <TextInput style={[styles.inputField, styles.bioInput]} placeholder="Tell us about yourself (Add emojis! 🧘‍♂️✨)" multiline numberOfLines={3} textAlignVertical="top" />
                            </View>
                            <TouchableOpacity style={styles.primaryButton} onPress={() => setIsOnboarded(true)}>
                                <Text style={styles.primaryButtonText}>Complete Setup</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.secondaryBtn} onPress={() => setOnboardingStep(2)}>
                                <Text style={styles.secondaryBtnText}>Back to Verification</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </SafeAreaView>
        );
    }

    if (activeChat) {
        const chat = conversations.find(c => c.id === activeChat);
        const messages = chatMessages[activeChat] || [];
        if (!chat) return null;
        return (
            <SafeAreaView style={styles.container} edges={['bottom', 'top']}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "padding"}
                    style={styles.container}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 80}
                >
                    <View style={styles.chatHeader}>
                        <TouchableOpacity onPress={() => setActiveChat(null)} style={styles.backBtn}>
                            <ChevronLeft size={24} color="#0f172a" />
                        </TouchableOpacity>
                        <Image source={{ uri: chat.avatar }} style={styles.chatAvatar} />
                        <View style={styles.chatHeaderInfo}>
                            <Text style={styles.chatHeaderName}>{chat.name}</Text>
                            <Text style={styles.chatHeaderStatus}>{chat.online ? 'Online' : 'Offline'}</Text>
                        </View>
                        <View style={styles.chatHeaderActions}>
                            <TouchableOpacity style={styles.iconBtn} onPress={() => setCallModal({ visible: true, type: 'audio', user: chat.name })}>
                                <Phone size={20} color="#64748b" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconBtn} onPress={() => setCallModal({ visible: true, type: 'video', user: chat.name })}>
                                <Video size={20} color="#64748b" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView ref={scrollViewRef} style={styles.messagesList} contentContainerStyle={{ padding: 20 }} onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
                        <View style={styles.dateDivider}><Text style={styles.dateDividerText}>TODAY</Text></View>
                        {messages.map((msg: any) => (
                            <View key={msg.id} style={[styles.messageRow, msg.sender === 'me' ? styles.messageRowMe : styles.messageRowThem]}>
                                <View style={[styles.bubble, msg.sender === 'me' ? styles.bubbleMe : styles.bubbleThem]}>
                                    <Text style={[styles.messageText, msg.sender === 'me' ? styles.messageTextMe : styles.messageTextThem]}>{msg.text}</Text>
                                    <Text style={styles.messageTime}>{msg.time}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    <View style={styles.inputArea}>
                        <TouchableOpacity style={styles.attachBtn} onPress={() => setMediaModal(true)} activeOpacity={0.7}>
                            <Paperclip size={24} color="#3713ec" />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Type your message..."
                            value={messageInput}
                            onChangeText={setMessageInput}
                            onSubmitEditing={handleSend}
                            placeholderTextColor="#94a3b8"
                            onFocus={() => setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 300)}
                        />
                        <TouchableOpacity
                            style={[styles.sendBtn, !messageInput.trim() && { opacity: 0.5, backgroundColor: '#cbd5e1' }]}
                            onPress={handleSend}
                            disabled={!messageInput.trim()}
                            activeOpacity={0.8}
                        >
                            <Send size={20} color="#ffffff" />
                        </TouchableOpacity>
                    </View>
                    <CallModalScreen />
                    <MediaPickerModal />
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'top']}>
            <View style={styles.listHeader}>
                <Text style={styles.listTitle}>Messages</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => setShowContactsModal(true)}>
                    <PlusIcon size={24} color="#3713ec" />
                </TouchableOpacity>
            </View>

            <Modal visible={showContactsModal} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Mobile Contacts</Text>
                            <TouchableOpacity onPress={() => setShowContactsModal(false)}>
                                <X size={24} color="#0f172a" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.contactsListScroll} showsVerticalScrollIndicator={false}>
                            {dummyContacts.map(contact => (
                                <View key={contact.id} style={styles.contactItem}>
                                    <View>
                                        <Text style={styles.contactName}>{contact.name}</Text>
                                        <Text style={styles.contactPhone}>{contact.phone}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.inviteBtn} onPress={() => handleAddContact(contact)}>
                                        <Text style={styles.inviteBtnText}>Add</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <View style={styles.searchContainer}>
                <Search size={20} color="#94a3b8" />
                <TextInput style={styles.searchField} placeholder="Search messages..." />
            </View>

            <ScrollView style={styles.conversationsList}>
                {conversations.map(chat => (
                    <TouchableOpacity key={chat.id} style={styles.chatItem} onPress={() => { setActiveChat(chat.id); setConversations(prev => prev.map(c => c.id === chat.id ? { ...c, unread: 0 } : c)); }}>
                        <View style={styles.avatarWrapper}>
                            <Image source={{ uri: chat.avatar }} style={styles.avatar} />
                            {chat.online && <View style={styles.onlineDot} />}
                        </View>
                        <View style={styles.chatContent}>
                            <View style={styles.chatInfoRow}>
                                <Text style={styles.chatName}>{chat.name}</Text>
                                <Text style={styles.chatTime}>{chat.time}</Text>
                            </View>
                            <View style={styles.chatMsgRow}>
                                <Text style={[styles.chatMsg, chat.unread > 0 && styles.chatMsgUnread]} numberOfLines={1}>{chat.lastMessage}</Text>
                                {chat.unread > 0 && <View style={styles.unreadBadge}><Text style={styles.unreadText}>{chat.unread}</Text></View>}
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff' },
    bold: { fontWeight: '800' },
    onboardingContainer: { flex: 1, padding: 32, justifyContent: 'center' },
    onboardingHeader: { alignItems: 'center', marginBottom: 40 },
    onboardingIcon: { width: 80, height: 80, borderRadius: 24, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
    onboardingTitle: { fontSize: 28, fontWeight: '800', color: '#3713ec', textAlign: 'center', marginBottom: 12, letterSpacing: -0.5 },
    onboardingSubtitle: { fontSize: 15, color: '#64748b', textAlign: 'center', lineHeight: 22 },
    onboardingForm: { width: '100%', gap: 20 },
    inputGroup: { gap: 8 },
    formLabel: { fontSize: 14, fontWeight: '700', color: '#0f172a', marginLeft: 4 },
    phoneInput: { flexDirection: 'row', height: 64, backgroundColor: '#f8fafc', borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden' },
    countryCodeBtn: { width: 90, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#e2e8f0', backgroundColor: '#f1f5f9' },
    inputField: { flex: 1, paddingHorizontal: 20, fontSize: 16, fontWeight: '600', backgroundColor: '#f8fafc', height: 64, borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0', color: '#0f172a' },
    bioInput: { height: 120, paddingTop: 16, lineHeight: 24 },
    countryOption: { padding: 18, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', flexDirection: 'row', alignItems: 'center' },
    countryOptionText: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
    primaryButton: { height: 64, backgroundColor: '#3713ec', borderRadius: 20, alignItems: 'center', justifyContent: 'center', shadowColor: '#3713ec', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 8, marginTop: 12 },
    primaryButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
    otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    otpBox: { width: 44, height: 56, backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
    otpInput: { fontSize: 20, fontWeight: '800', textAlign: 'center', width: '100%' },
    listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 20 },
    listTitle: { fontSize: 28, fontWeight: '800', color: '#3713ec' },
    addBtn: { width: 44, height: 44, backgroundColor: '#f0f0ff', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', marginHorizontal: 24, paddingHorizontal: 16, height: 48, borderRadius: 16, marginBottom: 20 },
    searchField: { flex: 1, marginLeft: 12, fontSize: 15, fontWeight: '500' },
    chatItem: { flexDirection: 'row', paddingHorizontal: 24, paddingVertical: 16, gap: 16 },
    avatarWrapper: { position: 'relative' },
    avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#f1f5f9' },
    onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderRadius: 7, backgroundColor: '#10b981', borderWidth: 2, borderColor: '#ffffff' },
    chatContent: { flex: 1, justifyContent: 'center' },
    chatInfoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    chatName: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
    chatTime: { fontSize: 12, color: '#94a3b8', fontWeight: '500' },
    chatMsgRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    chatMsg: { fontSize: 14, color: '#64748b', fontWeight: '500', flex: 1 },
    chatMsgUnread: { color: '#0f172a', fontWeight: '800' },
    unreadBadge: { backgroundColor: '#3713ec', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
    unreadText: { color: '#ffffff', fontSize: 10, fontWeight: '800' },
    chatHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    chatAvatar: { width: 40, height: 40, borderRadius: 20, marginLeft: 8 },
    chatHeaderInfo: { flex: 1, marginLeft: 12 },
    chatHeaderName: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
    chatHeaderStatus: { fontSize: 11, color: '#10b981', fontWeight: '600' },
    chatHeaderActions: { flexDirection: 'row', gap: 4 },
    iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
    messagesList: { flex: 1, backgroundColor: '#f8fafc' },
    dateDivider: { alignItems: 'center', marginVertical: 20 },
    dateDividerText: { fontSize: 10, fontWeight: '800', color: '#94a3b8', letterSpacing: 1 },
    messageRow: { marginBottom: 16, flexDirection: 'row' },
    messageRowMe: { justifyContent: 'flex-end' },
    messageRowThem: { justifyContent: 'flex-start' },
    bubble: { maxWidth: '80%', padding: 16, borderRadius: 24 },
    bubbleMe: { backgroundColor: '#3713ec', borderBottomRightRadius: 4 },
    bubbleThem: { backgroundColor: '#ffffff', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#e2e8f0' },
    messageText: { fontSize: 15, lineHeight: 22, fontWeight: '500' },
    messageTextMe: { color: '#ffffff' },
    messageTextThem: { color: '#0f172a' },
    messageTime: { fontSize: 9, marginTop: 4, alignSelf: 'flex-end', opacity: 0.7, color: '#94a3b8' },
    inputArea: { flexDirection: 'row', alignItems: 'center', padding: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9', gap: 12, backgroundColor: '#ffffff', zIndex: 1000 },
    attachBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    textInput: { flex: 1, backgroundColor: '#f8fafc', height: 48, borderRadius: 24, paddingHorizontal: 20, fontSize: 15, fontWeight: '500', borderWidth: 1, borderColor: '#e2e8f0' },
    sendBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#3713ec', alignItems: 'center', justifyContent: 'center' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#ffffff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: '85%', shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 20 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    modalTitle: { fontSize: 24, fontWeight: '800', color: '#0f172a' },
    closeModalText: { color: '#3713ec', fontWeight: '700', fontSize: 16 },
    contactsListScroll: { marginBottom: 20 },
    contactItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    contactName: { fontSize: 17, fontWeight: '700', color: '#0f172a' },
    contactPhone: { fontSize: 13, color: '#64748b', marginTop: 2 },
    inviteBtn: { backgroundColor: '#3713ec', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
    inviteBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
    // Call Styles
    callModalContainer: { flex: 1, backgroundColor: '#000' },
    callContent: { flex: 1, justifyContent: 'space-between', paddingVertical: 60, alignItems: 'center' },
    callHeader: { alignItems: 'center' },
    callStatus: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '800', letterSpacing: 2, marginBottom: 12 },
    callName: { color: '#fff', fontSize: 32, fontWeight: '800', marginBottom: 8 },
    callTimer: { color: '#fff', fontSize: 18, opacity: 0.8 },
    callFooter: { width: '100%', alignItems: 'center' },
    callActionsRow: { flexDirection: 'row', gap: 30, alignItems: 'center' },
    callActionBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    // Media Picker Styles
    mediaPickerContent: { backgroundColor: '#fff', padding: 24, borderTopLeftRadius: 32, borderTopRightRadius: 32, width: '100%' },
    mediaTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginBottom: 24, textAlign: 'center' },
    mediaGrid: { flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 20 },
    mediaItem: { alignItems: 'center', gap: 8 },
    mediaIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
    mediaLabel: { fontSize: 12, fontWeight: '700', color: '#64748b' },
    conversationsList: { flex: 1 },
    secondaryBtn: { height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
    secondaryBtnText: { color: '#64748b', fontSize: 14, fontWeight: '700' },
});

export default MessagesScreen;

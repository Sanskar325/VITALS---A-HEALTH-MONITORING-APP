import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Animated, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Activity, Heart, Thermometer, Droplets, Bell, ChevronRight, Search, User, Calendar, Zap, TrendingUp, Footprints, Flame, Timer, Pill, Stethoscope, MessageSquare, Clock, ShieldCheck, Brain, Sparkles, Moon, Apple, Utensils } from 'lucide-react-native';
import { useUser } from '../context/UserContext';
import { BarChart, LineChart, StackedBarChart } from 'react-native-chart-kit';
import Svg, { Defs, LinearGradient as SvgGradient, Stop, Rect, G, Circle, Path, RadialGradient } from 'react-native-svg';
import React, { useEffect, useRef } from 'react';

const { width } = Dimensions.get('window');

// Precise Chart Dimension Constants for Premium Layout
const ROW_PADDING = 40; // content paddingHorizontal: 20 -> 40 total
const ROW_GAP = 12; // synthesisRow gap: 12
const CARD_PADDING = 40; // diagCard padding: 20 -> 40 total internal
const HALF_CARD_WIDTH = (width - ROW_PADDING - ROW_GAP) / 2;
const HALF_CHART_WIDTH = HALF_CARD_WIDTH - CARD_PADDING;
const FULL_CHART_WIDTH = width - ROW_PADDING - CARD_PADDING;

const PremiumGradient = ({ children, colors, style }: any) => (
    <View style={style}>
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
            <Defs>
                <SvgGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor={colors[0]} />
                    <Stop offset="100%" stopColor={colors[1]} />
                </SvgGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
        </Svg>
        {children}
    </View>
);

// --- STABLE 3D PERSPECTIVE COMPONENTS (STANDARD ANIMATED) ---

const PerspectiveContext = React.createContext<Animated.ValueXY | null>(null);

const PerspectiveWrapper = ({ children, style }: any) => {
    const rotate = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
    const breath = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(breath, { toValue: 1.015, duration: 3500, useNativeDriver: true }),
                Animated.timing(breath, { toValue: 1, duration: 3500, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                // Only hijack if it's a significant movement (drag), not a tap
                return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
            },
            onPanResponderMove: (evt, gestureState) => {
                rotate.setValue({
                    x: Math.max(-100, Math.min(100, gestureState.dy)),
                    y: Math.max(-100, Math.min(100, gestureState.dx))
                });
            },
            onPanResponderRelease: () => {
                Animated.spring(rotate, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: true,
                    friction: 7,
                    tension: 40
                }).start();
            },
        })
    ).current;

    const rotateX = rotate.x.interpolate({
        inputRange: [-100, 100],
        outputRange: ['10deg', '-10deg'],
    });

    const rotateY = rotate.y.interpolate({
        inputRange: [-100, 100],
        outputRange: ['-10deg', '10deg'],
    });

    return (
        <PerspectiveContext.Provider value={rotate}>
            <View {...panResponder.panHandlers} style={[style, { alignItems: 'center', justifyContent: 'center' }]}>
                <Animated.View style={{
                    width: '100%',
                    alignItems: 'center',
                    transform: [
                        { perspective: 1000 },
                        { rotateX },
                        { rotateY },
                        { scale: breath }
                    ],
                }}>
                    {children}
                </Animated.View>
            </View>
        </PerspectiveContext.Provider>
    );
};

const PerspectiveItem = ({ children, translateZ = 0, style }: any) => {
    const rotate = React.useContext(PerspectiveContext);

    // Parallax logic: items shift based on card tilt
    const translateY = rotate ? rotate.x.interpolate({
        inputRange: [-100, 100],
        outputRange: [-translateZ / 10, translateZ / 10],
    }) : 0;

    const translateX = rotate ? rotate.y.interpolate({
        inputRange: [-100, 100],
        outputRange: [translateZ / 10, -translateZ / 10],
    }) : 0;

    const scale = rotate ? rotate.x.interpolate({
        inputRange: [-100, 100],
        outputRange: [1, 1.05],
        extrapolate: 'clamp'
    }) : 1;

    return (
        <Animated.View style={[style, {
            transform: [
                { translateY },
                { translateX },
                { scale },
            ],
        }]}>
            {children}
        </Animated.View>
    );
};

const MiniActivitySynthesis = ({ steps, calories, exercise }: any) => {
    const goals = { steps: 10000, calories: 2200, exercise: 45 };
    const ringData = [
        { progress: steps / goals.steps, color: '#e11d48', radius: 24 },
        { progress: calories / goals.calories, color: '#10b981', radius: 16 },
        { progress: exercise / goals.exercise, color: '#3713ec', radius: 8 },
    ];
    const center = 32;
    const strokeWidth = 5;

    return (
        <View style={styles.miniRingContainer}>
            <Svg width={64} height={64}>
                {ringData.map((ring, i) => {
                    const circumference = 2 * Math.PI * ring.radius;
                    const offset = circumference - (circumference * Math.min(ring.progress, 0.99));
                    return (
                        <G key={i} rotation="-90" origin={`${center}, ${center}`}>
                            <Circle cx={center} cy={center} r={ring.radius} stroke={ring.color + '20'} strokeWidth={strokeWidth} fill="none" />
                            <Circle
                                cx={center} cy={center} r={ring.radius}
                                stroke={ring.color} strokeWidth={strokeWidth}
                                fill="none"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                            />
                        </G>
                    );
                })}
            </Svg>
            <View style={styles.miniRingStats}>
                <View style={styles.miniStatRow}><Footprints size={10} color="#e11d48" /><Text style={styles.miniStatText}>{Math.round((steps / goals.steps) * 100)}%</Text></View>
                <View style={styles.miniStatRow}><Flame size={10} color="#10b981" /><Text style={styles.miniStatText}>{Math.round((calories / goals.calories) * 100)}%</Text></View>
            </View>
        </View>
    );
};

const ReadinessWidget = ({ score }: { score: number }) => {
    const color = score > 70 ? '#10b981' : score > 40 ? '#f59e0b' : '#ef4444';
    return (
        <View style={styles.readinessCard}>
            <Text style={styles.readinessLabel}>Readiness</Text>
            <View style={styles.readinessRow}>
                <Text style={[styles.readinessScore, { color }]}>{score}</Text>
                <Zap size={14} color={color} fill={color} />
            </View>
            <View style={styles.readinessTrack}>
                <View style={[styles.readinessFill, { width: `${score}%`, backgroundColor: color }]} />
            </View>
        </View>
    );
};

const MedicationPulse = ({ meds }: { meds: any[] }) => (
    <View style={styles.pulseCard}>
        <View style={styles.pulseHeader}>
            <Pill size={16} color="#3713ec" />
            <Text style={styles.pulseTitle}>Clinical Pulse</Text>
        </View>
        <View style={styles.medList}>
            {meds.map((med, i) => (
                <View key={i} style={styles.medItem}>
                    <View style={styles.medDot} />
                    <Text style={styles.medName}>{med.name}</Text>
                    <Text style={styles.medTime}>{med.time}</Text>
                </View>
            ))}
        </View>
    </View>
);

const DiagnosticChart = ({ title, icon: Icon, color, children, subValue }: any) => (
    <View style={styles.diagCard}>
        <View style={styles.diagHeader}>
            <View style={[styles.diagIconBox, { backgroundColor: color + '15' }]}>
                <Icon size={18} color={color} />
            </View>
            <View>
                <Text style={styles.diagTitle}>{title}</Text>
                {subValue && <Text style={styles.diagSub}>{subValue}</Text>}
            </View>
        </View>
        <View style={styles.diagContent}>
            {children}
        </View>
    </View>
);

const SynthesizedIdentityCard = ({ user, navigation }: { user: any; navigation: any }) => (
    <PerspectiveWrapper style={styles.identityCard}>
        <PerspectiveItem translateZ={60} style={styles.avatarContainer}>
            <View style={styles.avatarBox}>
                <User size={48} color="#f59e0b" />
            </View>
        </PerspectiveItem>

        <PerspectiveItem translateZ={40} style={{ alignItems: 'center', width: '100%' }}>
            <Text style={styles.identitySub}>{user?.gender?.toUpperCase()}, {user?.age} • ACTIVE</Text>
            <Text style={styles.identityName}>{user?.firstName} {user?.lastName}</Text>
        </PerspectiveItem>

        <PerspectiveItem translateZ={30} style={styles.badgeRow}>
            <View style={styles.identityBadge}>
                <Text style={styles.badgeText}>{user?.bloodGroup}</Text>
            </View>
            <View style={styles.identityBadge}>
                <Text style={styles.badgeText}>{user?.smokerStatus?.toUpperCase()}</Text>
            </View>
        </PerspectiveItem>

        <PerspectiveItem translateZ={50} style={styles.identityMetrics}>
            <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>HEIGHT</Text>
                <Text style={styles.metricVal}>{user?.height} cm</Text>
            </View>
            <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>WEIGHT</Text>
                <Text style={styles.metricVal}>{user?.weight} kg</Text>
            </View>
        </PerspectiveItem>

        <View style={styles.identityDivider} />

        <PerspectiveItem translateZ={40} style={[styles.identityAptSection, { alignItems: 'center' }]}>
            <View style={styles.aptHeaderRow}>
                <Text style={styles.aptSectionTitle}>Next Appointment</Text>
                <View style={styles.liveDot} />
            </View>

            <View style={styles.aptCardMini}>
                <View style={styles.aptIconBox}>
                    <Calendar size={18} color="#3713ec" />
                </View>
                <View style={[styles.aptInfoMini, { alignItems: 'center' }]}>
                    <Text style={styles.aptDoctorMini}>Dr. Sarah Connor</Text>
                    <Text style={styles.aptTimeMini}>Tue, 15 Feb • 10:30 AM</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.rescheduleBtn} onPress={() => navigation.navigate('Appointments')}>
                <Text style={styles.rescheduleText}>RESCHEDULE</Text>
            </TouchableOpacity>
        </PerspectiveItem>
    </PerspectiveWrapper>
);

const PixeyAIIntelligence = () => {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.2, duration: 2000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <View style={[styles.aiCoreContainer, { width: width - 40 }]}>
            <View style={StyleSheet.absoluteFill}>
                <Svg height="100%" width="100%">
                    <Defs>
                        <SvgGradient id="gradBase" x1="0%" y1="0%" x2="100%" y2="100%">
                            <Stop offset="0%" stopColor="#1e1b4b" />
                            <Stop offset="100%" stopColor="#312e81" />
                        </SvgGradient>
                        <RadialGradient id="aura" cx="50%" cy="40%" rx="60%" ry="60%" fx="50%" fy="40%">
                            <Stop offset="0%" stopColor="#3713ec" stopOpacity="0.4" />
                            <Stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
                        </RadialGradient>
                    </Defs>
                    <Rect x="0" y="0" width="100%" height="100%" fill="url(#gradBase)" rx={24} />
                    <Rect x="0" y="0" width="100%" height="100%" fill="url(#aura)" rx={24} />
                </Svg>
            </View>

            <View style={styles.aiCoreHeader}>
                <View style={styles.aiPersona}>
                    <Animated.View style={[styles.aiPulse, { transform: [{ scale: pulseAnim }] }]} />
                    <Brain size={24} color="#ffffff" />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={styles.aiStatusRow}>
                        <Text style={styles.aiCoreTitle}>Pixey Intelligence</Text>
                        <View style={styles.liveIndicator}>
                            <View style={styles.liveDotSmall} />
                            <Text style={styles.liveText}>ANALYZING</Text>
                        </View>
                    </View>
                    <Text numberOfLines={2} style={styles.aiClinicalFinding}>Sympathetic dominance detected (HRV: 68ms). Recovery trending up.</Text>
                </View>
            </View>

            <View style={styles.aiDividerLight} />

            <View style={styles.aiInsightBox}>
                <View style={styles.aiInsightRow}>
                    <Sparkles size={14} color="#f59e0b" />
                    <Text style={styles.aiInsightTitle}>Actionable Insight</Text>
                </View>
                <Text style={styles.aiInsightText}>
                    Execute a 2-minute "Box Breath" session now to reset autonomic balance and improve clinical recovery by 14%.
                </Text>
            </View>

            <View style={styles.aiMetaRow}>
                <View style={styles.aiMetaBadge}>
                    <Heart size={10} color="#ef4444" />
                    <Text style={styles.aiMetaText}>HRV: 68ms</Text>
                </View>
                <View style={styles.aiMetaBadge}>
                    <Activity size={10} color="#3b82f6" />
                    <Text style={styles.aiMetaText}>Stability: 94%</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.aiDeepBtn}>
                <Text style={styles.aiDeepText}>DEEP ANALYSIS</Text>
                <ChevronRight size={16} color="#ffffff" />
            </TouchableOpacity>
        </View>
    );
};

const DashboardScreen = ({ navigation }: any) => {
    const { user } = useUser();

    const healthStats = [
        { title: 'Heart Rate', value: '72', unit: 'bpm', icon: Heart, color: '#ef4444', bg: '#fef2f2' },
        { title: 'Oxygen', value: '98', unit: '%', icon: Activity, color: '#0ea5e9', bg: '#f0f9ff' },
        { title: 'B.P.', value: '120/80', unit: 'mmHg', icon: ShieldCheck, color: '#10b981', bg: '#ecfdf5' },
        { title: 'Glucose', value: '95', unit: 'mg/dL', icon: Droplets, color: '#f59e0b', bg: '#fffbeb' }
    ];

    const medications = [
        { name: 'Lisinopril', time: '08:00 AM' },
        { name: 'Metformin', time: '12:30 PM' }
    ];

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        if (hour < 21) return "Good Evening";
        return "Good Night";
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.content} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Personalized Greeting Header */}
                <View style={[styles.greetingSection, { width: '100%' }]}>
                    <Text style={styles.greetingText}>{getGreeting()}, {user?.firstName}!</Text>
                    <Text style={styles.greetingSub}>Here is your daily health insights summary.</Text>
                </View>

                {/* Refined Identity Synthesis */}
                <View style={{ width: '100%', alignItems: 'center', marginBottom: 32 }}>
                    <SynthesizedIdentityCard user={user} navigation={navigation} />
                </View>

                {/* Synthesis Grid Row 1 */}
                <View style={styles.synthesisRow}>
                    <TouchableOpacity style={{ flex: 1.2 }} onPress={() => navigation.navigate('Ecosystem')}>
                        <ReadinessWidget score={82} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1.8 }} onPress={() => navigation.navigate('Records')}>
                        <MedicationPulse meds={medications} />
                    </TouchableOpacity>
                </View>

                {/* Dashboard Clinical Highlights */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Vital Ecosystem</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Ecosystem')}>
                        <Text style={styles.sectionAction}>Full Report</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.statsGrid}>
                    {healthStats.map((stat, index) => (
                        <TouchableOpacity key={index} style={styles.statCard} onPress={() => navigation.navigate('Ecosystem')}>
                            <View style={[styles.statIconContainer, { backgroundColor: stat.bg }]}>
                                <stat.icon size={20} color={stat.color} />
                            </View>
                            <View>
                                <Text style={styles.statTitle}>{stat.title}</Text>
                                <View style={styles.statValueContainer}>
                                    <Text style={styles.statValue}>{stat.value}</Text>
                                    <Text style={styles.statUnit}>{stat.unit}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* AI Dynamic Intelligence (Remade) */}
                <PixeyAIIntelligence />

                <View style={styles.synthesisRow}>
                    {/* Schedule Widget */}
                    <TouchableOpacity style={styles.scheduleWidget} onPress={() => navigation.navigate('Appointments')}>
                        <View style={styles.widgetHeader}>
                            <Calendar size={16} color="#3713ec" />
                            <Text style={styles.widgetTitle}>Upcoming</Text>
                        </View>
                        <View style={styles.appointmentSmall}>
                            <Text style={styles.aptTime}>Tomorrow, 10:00 AM</Text>
                            <Text style={styles.aptTitle}>Cardiology Review</Text>
                            <View style={styles.aptVenueRow}>
                                <Clock size={12} color="#94a3b8" />
                                <Text style={styles.aptVenue}>St. Jude's Hospital</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Care Team Widget */}
                    <TouchableOpacity style={styles.careTeamWidget} onPress={() => navigation.navigate('Messages')}>
                        <View style={styles.widgetHeader}>
                            <MessageSquare size={16} color="#3713ec" />
                            <Text style={styles.widgetTitle}>Care Team</Text>
                        </View>
                        <View style={styles.teamAvatars}>
                            {[1, 2, 3].map(i => (
                                <View key={i} style={[styles.teamAvatar, { marginLeft: i === 0 ? 0 : -8, zIndex: 10 - i }]}>
                                    <Stethoscope size={12} color="#3713ec" />
                                </View>
                            ))}
                        </View>
                        <Text style={styles.careMessage}>2 unread updates</Text>
                    </TouchableOpacity>
                </View>

                {/* Diagnostic Deep Dive Section */}
                <View style={[styles.sectionHeader, { marginTop: 32 }]}>
                    <Text style={styles.sectionTitle}>Diagnostic Analytics</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Ecosystem')}>
                        <Text style={styles.sectionAction}>View Trends</Text>
                    </TouchableOpacity>
                </View>

                {/* Heart Rate Analytics */}
                <DiagnosticChart title="Cardiovascular Rhythm" icon={Heart} color="#ef4444" subValue="Avg: 72 BPM • Stable">
                    <LineChart
                        data={{
                            labels: ['1am', '5am', '9am', '1pm', '5pm', '9pm'],
                            datasets: [{
                                data: [62, 58, 75, 82, 78, 70],
                                color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
                                strokeWidth: 3
                            }]
                        }}
                        width={FULL_CHART_WIDTH}
                        height={160}
                        yAxisLabel=""
                        yAxisSuffix=""
                        chartConfig={{
                            backgroundColor: '#ffffff',
                            backgroundGradientFrom: '#ffffff',
                            backgroundGradientTo: '#ffffff',
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                            propsForDots: { r: "4", strokeWidth: "2", stroke: "#ef4444" },
                            propsForBackgroundLines: { strokeDasharray: "5 5", stroke: "#f1f5f9" }
                        }}
                        bezier
                        style={{ borderRadius: 16, marginTop: 8 }}
                    />
                </DiagnosticChart>

                <View style={styles.synthesisRow}>
                    {/* Sleep Architecture */}
                    <View style={[styles.diagCard, { flex: 1, marginRight: 0 }]}>
                        <View style={styles.diagHeader}>
                            <View style={[styles.diagIconBox, { backgroundColor: '#3713ec15' }]}>
                                <Moon size={16} color="#3713ec" />
                            </View>
                            <Text style={styles.diagTitleSmall}>Sleep</Text>
                        </View>
                        <StackedBarChart
                            data={{
                                labels: ['D', 'R', 'L'],
                                data: [[2, 1.5, 4]],
                                barColors: ['#1e1b4b', '#3713ec', '#a5b4fc'],
                                legend: ['Deep', 'REM', 'Light']
                            }}
                            width={HALF_CHART_WIDTH}
                            height={120}
                            yAxisLabel=""
                            yAxisSuffix="h"
                            chartConfig={{
                                backgroundColor: '#ffffff',
                                backgroundGradientFrom: '#ffffff',
                                backgroundGradientTo: '#ffffff',
                                color: (opacity = 1) => `rgba(55, 19, 236, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                                style: { borderRadius: 16 }
                            }}
                            hideLegend={true}
                            style={{
                                marginTop: 8,
                                paddingRight: 0,
                                marginLeft: -16 // Shift left to offset chart-kit internal padding
                            }}
                        />
                        <Text style={styles.diagMetaMini}>7h 32m Total</Text>
                    </View>

                    {/* Nutritional Synthesis */}
                    <View style={[styles.diagCard, { flex: 1, marginLeft: 0 }]}>
                        <View style={styles.diagHeader}>
                            <View style={[styles.diagIconBox, { backgroundColor: '#f59e0b15' }]}>
                                <Apple size={16} color="#f59e0b" />
                            </View>
                            <Text style={styles.diagTitleSmall}>Meals</Text>
                        </View>
                        <BarChart
                            data={{
                                labels: ['C', 'P', 'F'],
                                datasets: [{ data: [180, 110, 65] }]
                            }}
                            width={HALF_CHART_WIDTH}
                            height={120}
                            yAxisLabel=""
                            yAxisSuffix="g"
                            chartConfig={{
                                backgroundColor: '#ffffff',
                                backgroundGradientFrom: '#ffffff',
                                backgroundGradientTo: '#ffffff',
                                color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                                barPercentage: 0.6,
                            }}
                            style={{
                                marginTop: 8,
                                paddingRight: 0,
                                marginLeft: -16
                            }}
                            fromZero
                        />
                        <Text style={styles.diagMetaMini}>1,850 kcal</Text>
                    </View>
                </View>

                {/* Analytical Trend Overlay */}
                <View style={[styles.sectionHeader, { marginTop: 16 }]}>
                    <Text style={styles.sectionTitle}>Physiological Velocity</Text>
                    <View style={styles.trendBadgeVast}>
                        <TrendingUp size={12} color="#10b981" />
                        <Text style={styles.trendBadgeTextVast}>Stable</Text>
                    </View>
                </View>

                <View style={styles.chartCardVast}>
                    <PremiumGradient colors={['#3713ec', '#6d28d9']} style={[StyleSheet.absoluteFill, { borderRadius: 28 }]} />
                    <BarChart
                        data={{
                            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
                            datasets: [{ data: [120, 118, 122, 119, 104, 121, 120] }]
                        }}
                        width={width - 60}
                        height={160}
                        yAxisLabel=""
                        yAxisSuffix=""
                        chartConfig={{
                            backgroundColor: 'transparent',
                            backgroundGradientFrom: '#3713ec',
                            backgroundGradientTo: '#6d28d9',
                            backgroundGradientFromOpacity: 0,
                            backgroundGradientToOpacity: 0,
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.7})`,
                            propsForBackgroundLines: { strokeDasharray: '', stroke: 'rgba(255,255,255,0.1)' }
                        }}
                        style={{ borderRadius: 24, paddingRight: 0, marginLeft: -10 }}
                        fromZero
                    />
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
    content: {
        paddingHorizontal: 20,
        paddingTop: 20
    },
    vastHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 24,
        marginTop: 8,
    },
    welcomeText: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    userName: {
        fontSize: 28,
        fontWeight: '900',
        color: '#1e1b4b',
        marginTop: 2,
    },
    identityCard: {
        backgroundColor: '#120f3d',
        borderRadius: 32,
        padding: 24,
        width: width - 40,
        alignSelf: 'center',
        alignItems: 'center',
        shadowColor: '#3713ec',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.4,
        shadowRadius: 32,
        elevation: 20,
    },
    avatarContainer: {
        width: 120,
        height: 120,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    avatarBox: {
        width: 100,
        height: 100,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    identitySub: {
        fontSize: 12,
        fontWeight: '700',
        color: '#3b82f6',
        letterSpacing: 1,
        marginBottom: 4,
        textAlign: 'center',
    },
    identityName: {
        fontSize: 26,
        fontWeight: '900',
        color: '#ffffff',
        marginBottom: 16,
        textAlign: 'center',
    },
    badgeRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 20,
    },
    identityBadge: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    badgeText: {
        color: '#ffffff',
        fontSize: 11,
        fontWeight: '800',
    },
    identityMetrics: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    metricItem: {
        alignItems: 'center',
    },
    metricLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#94a3b8',
        marginBottom: 4,
    },
    metricVal: {
        fontSize: 22,
        fontWeight: '900',
        color: '#ffffff',
    },
    identityDivider: {
        width: '100%',
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginBottom: 24,
    },
    identityAptSection: {
        width: '100%',
    },
    aptHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        gap: 8,
    },
    aptSectionTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#ffffff',
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ef4444',
    },
    aptCardMini: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    aptIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(55, 19, 236, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    aptInfoMini: {
        gap: 2,
        alignItems: 'center',
    },
    aptDoctorMini: {
        fontSize: 15,
        fontWeight: '900',
        color: '#ffffff',
        textAlign: 'center',
    },
    aptTimeMini: {
        fontSize: 12,
        fontWeight: '600',
        color: '#94a3b8',
        textAlign: 'center',
    },
    rescheduleBtn: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    rescheduleText: {
        color: '#94a3b8',
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 1,
    },
    miniRingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        padding: 8,
        borderRadius: 20,
        gap: 8,
    },
    miniRingStats: {
        gap: 2,
    },
    miniStatRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    miniStatText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#64748b',
    },
    synthesisRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
        marginBottom: 24,
    },
    readinessCard: {
        flex: 1.2,
        backgroundColor: '#f8fafc',
        borderRadius: 24,
        padding: 26,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    readinessLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#64748b',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    readinessRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
        marginBottom: 12,
    },
    readinessScore: {
        fontSize: 28,
        fontWeight: '900',
    },
    readinessTrack: {
        height: 6,
        backgroundColor: '#e2e8f0',
        borderRadius: 3,
        overflow: 'hidden',
    },
    readinessFill: {
        height: '100%',
        borderRadius: 3,
    },
    pulseCard: {
        flex: 1.8,
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 16,
        borderWidth: 1,
        borderColor: '#3713ec10',
        shadowColor: '#3713ec',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    pulseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    pulseTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#1e1b4b',
    },
    medList: {
        gap: 18,
    },
    medItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    medDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#3713ec',
        marginRight: 8,
    },
    medName: {
        flex: 1,
        fontSize: 12,
        fontWeight: '700',
        color: '#475569',
    },
    medTime: {
        fontSize: 10,
        fontWeight: '600',
        color: '#94a3b8',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1e1b4b',
    },
    sectionAction: {
        fontSize: 13,
        fontWeight: '700',
        color: '#3713ec',
    },
    diagCard: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    diagHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    diagIconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    diagTitle: {
        fontSize: 14,
        fontWeight: '900',
        color: '#1e1b4b',
    },
    diagSub: {
        fontSize: 11,
        fontWeight: '600',
        color: '#64748b',
    },
    diagContent: {
        alignItems: 'center',
    },
    diagTitleSmall: {
        fontSize: 13,
        fontWeight: '800',
        color: '#1e1b4b',
    },
    diagMetaMini: {
        fontSize: 10,
        fontWeight: '700',
        color: '#94a3b8',
        marginTop: 8,
        textAlign: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        width: (width - 40 - 12) / 2,
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    statIconContainer: {
        width: 30,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: '#64748b',
    },
    statValueContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1e1b4b',
    },
    statUnit: {
        fontSize: 10,
        color: '#94a3b8',
        fontWeight: '600',
    },
    aiCoreContainer: {
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        overflow: 'hidden',
        minHeight: 280,
    },
    aiCoreHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 20,
    },
    aiPersona: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    aiPulse: {
        position: 'absolute',
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    aiStatusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    aiCoreTitle: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '900',
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 6,
    },
    liveDotSmall: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10b981',
    },
    liveText: {
        color: '#10b981',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    aiClinicalFinding: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
        fontWeight: '600',
    },
    aiDividerLight: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginBottom: 20,
    },
    aiInsightBox: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
    },
    aiInsightRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    aiInsightTitle: {
        color: '#f59e0b',
        fontSize: 12,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    aiInsightText: {
        color: '#ffffff',
        fontSize: 13,
        lineHeight: 20,
        fontWeight: '500',
    },
    aiDeepBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 12,
        borderRadius: 14,
        gap: 8,
    },
    aiDeepText: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '800',
    },
    aiMetaRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    aiMetaBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    aiMetaText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: '800',
    },
    scheduleWidget: {
        flex: 1.1,
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    careTeamWidget: {
        flex: 0.9,
        backgroundColor: '#3713ec05',
        borderRadius: 24,
        padding: 16,
        borderWidth: 1,
        borderColor: '#3713ec10',
    },
    widgetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    widgetTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: '#64748b',
        textTransform: 'uppercase',
    },
    appointmentSmall: {
        gap: 2,
    },
    aptTime: {
        fontSize: 10,
        fontWeight: '800',
        color: '#3713ec',
    },
    aptTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#1e1b4b',
    },
    aptVenueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    aptVenue: {
        fontSize: 10,
        fontWeight: '600',
        color: '#94a3b8',
    },
    teamAvatars: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    teamAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#3713ec20',
        alignItems: 'center',
        justifyContent: 'center',
    },
    careMessage: {
        fontSize: 11,
        fontWeight: '700',
        color: '#3713ec',
    },
    trendBadgeVast: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ecfdf5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    trendBadgeTextVast: {
        color: '#10b981',
        fontSize: 11,
        fontWeight: '800',
    },
    chartCardVast: {
        width: width - 40,
        borderRadius: 28,
        paddingVertical: 16,
        paddingHorizontal: 8,
        alignItems: 'center',
        shadowColor: '#3713ec',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
        overflow: 'hidden',
        backgroundColor: '#3713ec',
    },
    greetingSection: {
        paddingVertical: 20,
        paddingBottom: 24,
    },
    greetingText: {
        fontSize: 40,
        fontWeight: '900',
        color: '#1e1b4b',
        letterSpacing: -0.5,
        textAlign: 'left',
    },
    greetingSub: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '600',
        marginTop: 5,
        marginRight: 50,
        textAlign: 'left',
    },
});

export default DashboardScreen;

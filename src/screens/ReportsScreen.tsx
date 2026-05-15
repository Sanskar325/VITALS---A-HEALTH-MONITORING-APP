import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Animated, Easing, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Heart, Activity, Zap, Download, TrendingUp, Footprints, Flame, Timer, Moon, Battery, Laptop,
    Smartphone, Watch, Apple, Plus, X, Clock, Wind, Play, Sunrise, Waves, Gauge, Scale
} from 'lucide-react-native';
import Svg, { Circle, Path, Defs, RadialGradient, Stop, Line, Polygon, G } from 'react-native-svg';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { MainTabScreenProps } from '../types/navigation';

const { width } = Dimensions.get('window');

// --- Multi-Timeframe Static Data ---
const DATA = {
    Daily: {
        heartRate: {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
            data: [62, 58, 72, 85, 78, 70, 65]
        },
        sleep: {
            labels: ['Rest', 'Deep', 'REM', 'Light'],
            data: [2, 4, 1.5, 0.5],
            advanced: [15, 25, 45, 15]
        },
        activity: {
            steps: 8432,
            calories: 450,
            exercise: 32,
            goals: { steps: 10000, calories: 600, exercise: 45 }
        },
        bp: {
            labels: ['06AM', '10AM', '02PM', '06PM', '10PM'],
            sys: [120, 125, 118, 122, 119],
            dia: [80, 82, 78, 81, 79]
        },
        glucose: {
            labels: ['Fast', 'B-fast', 'Lunch', 'Dinner'],
            data: [92, 115, 108, 120]
        },
        nutrition: {
            calories: 1840,
            goal: 2200,
            macros: { protein: 120, carbs: 210, fat: 65 },
            meals: [
                { name: 'Oatmeal & Berries', kcal: 320, time: '08:15 AM' },
                { name: 'Salmon & Quinoa', kcal: 540, time: '12:45 PM' },
                { name: 'Greek Yogurt', kcal: 180, time: '04:30 PM' },
                { name: 'Steak & Veggies', kcal: 800, time: '07:45 PM' }
            ]
        },
        cycle: { day: 14, phase: 'Ovulation', status: 'High Fertility', percent: 50, nextPeriod: '14 Days' },
        stress: 24,
        respiratory: 14,
        vo2Max: 48,
        bodyComp: { muscle: 45.2, fat: 18.5, bone: 12.1, water: 24.2 }
    },
    Weekly: {
        heartRate: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [72, 68, 75, 82, 74, 65, 70]
        },
        sleep: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [7.2, 6.5, 8.0, 7.5, 6.8, 8.5, 7.8],
            advanced: [10, 20, 50, 20]
        },
        activity: {
            steps: 58240,
            calories: 3150,
            exercise: 250,
            goals: { steps: 70000, calories: 4200, exercise: 315 }
        },
        nutrition: {
            calories: 12880,
            goal: 15400,
            macros: { protein: 840, carbs: 1470, fat: 455 },
            average: 1840
        },
        bp: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            sys: [118, 122, 120, 125, 121, 119, 120],
            dia: [78, 82, 80, 85, 79, 77, 80]
        },
        glucose: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [95, 102, 98, 115, 105, 92, 99]
        },
        cycle: { day: 14, phase: 'Ovulation', status: 'High Fertility', percent: 50, nextPeriod: '14 Days' },
        stress: 32,
        respiratory: 16,
        vo2Max: 47.5,
        bodyComp: { muscle: 45.0, fat: 18.7, bone: 12.1, water: 24.2 }
    },
    Monthly: {
        heartRate: {
            labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
            data: [70, 74, 72, 75]
        },
        sleep: {
            labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
            data: [52, 48, 55, 50],
            advanced: [12, 18, 52, 18]
        },
        activity: {
            steps: 245000,
            calories: 14200,
            exercise: 1100,
            goals: { steps: 300000, calories: 18000, exercise: 1350 }
        },
        nutrition: {
            calories: 55200,
            goal: 66000,
            macros: { protein: 3600, carbs: 6300, fat: 1950 },
            average: 1840
        },
        bp: {
            labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
            sys: [122, 120, 119, 121],
            dia: [81, 80, 78, 79]
        },
        glucose: {
            labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
            data: [102, 98, 105, 100]
        },
        cycle: { day: 14, phase: 'Ovulation', status: 'High Fertility', percent: 50, nextPeriod: '14 Days' },
        stress: 28,
        respiratory: 15,
        vo2Max: 48.2,
        bodyComp: { muscle: 45.4, fat: 18.3, bone: 12.1, water: 24.2 }
    }
};

const radarData = [0.8, 0.65, 0.85, 0.7, 0.9, 0.6];
const radarLabels = ['Cardio', 'Sleep', 'Activity', 'Nutrition', 'Recovery', 'Stress'];

// --- Animated SVG Components ---

const PremiumHeartDiagram = ({ bpm }: { bpm: number }) => {
    const pulseAnim = React.useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
        const duration = (60 / (bpm || 72)) * 1000;
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.15, duration: duration * 0.4, useNativeDriver: true, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
                Animated.timing(pulseAnim, { toValue: 1, duration: duration * 0.6, useNativeDriver: true, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [bpm]);

    return (
        <View style={styles.diagramCard}>
            <View style={styles.diagramGlow} />
            <Animated.View style={[styles.diagramMain, { transform: [{ scale: pulseAnim }] }]}>
                <Svg viewBox="0 0 200 200" width={180} height={180}>
                    <Defs>
                        <RadialGradient id="heartGrad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                            <Stop offset="0%" stopColor="#fb7185" />
                            <Stop offset="100%" stopColor="#e11d48" />
                        </RadialGradient>
                    </Defs>
                    <Path
                        d="M100 170c-2-2-42-41-42-70 0-20 15-32 32-32 10 0 16 5 20 10 4-5 10-10 20-10 17 0 32 12 32 32 0 29-40 68-42 70z"
                        fill="url(#heartGrad)"
                    />
                </Svg>
                <View style={styles.diagramOverlay}>
                    <Text style={styles.diagramValue}>{bpm}</Text>
                    <Text style={styles.diagramUnit}>BPM</Text>
                </View>
            </Animated.View>
            <View style={styles.diagramInfo}>
                <Text style={styles.diagramLabel}>Cardiac Pulse</Text>
                <View style={styles.syncRow}>
                    <View style={styles.syncDot} />
                    <Text style={styles.syncText}>REAL-TIME SYNC</Text>
                </View>
            </View>
        </View>
    );
};

const OxygenDiagram = ({ level }: { level: number }) => (
    <View style={styles.diagramCard}>
        <View style={[styles.diagramGlow, { backgroundColor: 'rgba(14, 165, 233, 0.1)' }]} />
        <View style={styles.diagramMain}>
            <Svg width={180} height={180} viewBox="0 0 180 180">
                <Circle cx="90" cy="90" r="80" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                <Circle
                    cx="90" cy="90" r="80"
                    stroke="#0ea5e9" strokeWidth="12"
                    fill="none"
                    strokeDasharray={502}
                    strokeDashoffset={502 - (502 * level) / 100}
                    strokeLinecap="round"
                    transform="rotate(-90 90 90)"
                />
            </Svg>
            <View style={styles.diagramOverlay}>
                <Text style={styles.diagramValue}>{level}%</Text>
                <Text style={[styles.diagramUnit, { color: '#0ea5e9' }]}>SPO2</Text>
            </View>
        </View>
        <View style={styles.diagramInfo}>
            <Text style={styles.diagramLabel}>Oxygen Saturation</Text>
            <Text style={styles.syncText}>HEALTHY RANGE</Text>
        </View>
    </View>
);

const WaterGlassDiagram = ({ intake, goal }: { intake: number; goal: number }) => {
    const fillPercent = Math.min((intake / goal) * 100, 100);
    return (
        <View style={styles.diagramCard}>
            <View style={styles.diagramMain}>
                <View style={styles.glassContainer}>
                    <View style={[styles.waterFill, { height: `${fillPercent}%` }]}>
                        <View style={styles.waterTop} />
                    </View>
                </View>
                <View style={styles.diagramOverlay}>
                    <Text style={styles.diagramValue}>{intake}</Text>
                    <Text style={styles.diagramUnit}>ML</Text>
                </View>
            </View>
            <View style={styles.diagramInfo}>
                <Text style={styles.diagramLabel}>Hydration</Text>
                <Text style={styles.syncText}>GOAL: {goal}ML</Text>
            </View>
        </View>
    );
};

const GlucoseDiagram = ({ value }: { value: number }) => (
    <View style={styles.diagramCard}>
        <View style={[styles.diagramGlow, { backgroundColor: 'rgba(245, 158, 11, 0.05)' }]} />
        <View style={styles.diagramMain}>
            <View style={styles.sugarContainer}>
                <View style={[styles.sugarFill, { height: `${(value / 200) * 100}%` }]} />
            </View>
            <View style={styles.diagramOverlay}>
                <Text style={styles.diagramValue}>{value}</Text>
                <Text style={[styles.diagramUnit, { color: '#f59e0b' }]}>MG/DL</Text>
            </View>
        </View>
        <View style={styles.diagramInfo}>
            <Text style={styles.diagramLabel}>Blood Sugar</Text>
            <Text style={styles.syncText}>OPTIMAL FASTING</Text>
        </View>
    </View>
);

const BloodPressureGauge = ({ sys, dia }: { sys: number; dia: number }) => (
    <View style={[styles.diagramCard, { minHeight: 420, width: width - 48 }]}>
        <View style={[styles.diagramGlow, { backgroundColor: 'rgba(16, 185, 129, 0.05)' }]} />
        <View style={styles.bpGrid}>
            <View style={styles.bpCircle}>
                <Svg width={120} height={120} viewBox="0 0 120 120">
                    <Circle cx="60" cy="60" r="50" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                    <Circle
                        cx="60" cy="60" r="50"
                        stroke="#10b981" strokeWidth="8"
                        fill="none"
                        strokeDasharray={314}
                        strokeDashoffset={314 - (314 * sys) / 200}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                    />
                </Svg>
                <View style={styles.diagramOverlay}>
                    <Text style={styles.diagramValueSmall}>{sys}</Text>
                    <Text style={styles.diagramUnitSmall}>SYS</Text>
                </View>
            </View>
            <View style={styles.bpCircle}>
                <Svg width={120} height={120} viewBox="0 0 120 120">
                    <Circle cx="60" cy="60" r="50" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                    <Circle
                        cx="60" cy="60" r="50"
                        stroke="#3b82f6" strokeWidth="8"
                        fill="none"
                        strokeDasharray={314}
                        strokeDashoffset={314 - (314 * dia) / 120}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                    />
                </Svg>
                <View style={styles.diagramOverlay}>
                    <Text style={styles.diagramValueSmall}>{dia}</Text>
                    <Text style={styles.diagramUnitSmall}>DIA</Text>
                </View>
            </View>
        </View>
        <View style={styles.diagramInfo}>
            <Text style={styles.diagramLabel}>Blood Pressure</Text>
            <Text style={[styles.syncText, { color: '#10b981' }]}>PERFECT RANGE</Text>
        </View>
    </View>
);

const PremiumRadarChart = ({ data, labels, secondData, secondColor }: { data: number[]; labels: string[]; secondData?: number[]; secondColor?: string }) => {
    const size = width - 80;
    const center = size / 2;
    const radius = center - 40;
    const angleStep = (Math.PI * 2) / data.length;

    const getPoints = (d: number[]) => d.map((val, i) => {
        const x = center + radius * val * Math.cos(i * angleStep - Math.PI / 2);
        const y = center + radius * val * Math.sin(i * angleStep - Math.PI / 2);
        return `${x},${y}`;
    }).join(' ');

    const points = getPoints(data);
    const gridLevels = [0.2, 0.4, 0.6, 0.8, 1];

    return (
        <Svg width={size} height={size}>
            {gridLevels.map((lvl, i) => {
                const polyPoints = Array.from({ length: labels.length }).map((_, j) => {
                    const x = center + radius * lvl * Math.cos(j * angleStep - Math.PI / 2);
                    const y = center + radius * lvl * Math.sin(j * angleStep - Math.PI / 2);
                    return `${x},${y}`;
                }).join(' ');
                return <Polygon key={i} points={polyPoints} fill="none" stroke="#f1f5f9" strokeWidth="1" />;
            })}
            {labels.map((label, i) => (
                <Line
                    key={i}
                    x1={center} y1={center}
                    x2={center + radius * Math.cos(i * angleStep - Math.PI / 2)}
                    y2={center + radius * Math.sin(i * angleStep - Math.PI / 2)}
                    stroke="#f1f5f9"
                />
            ))}
            {secondData && (
                <Polygon points={getPoints(secondData)} fill={secondColor ? secondColor + '10' : 'rgba(148, 163, 184, 0.1)'} stroke={secondColor || "#94a3b8"} strokeWidth="1" strokeDasharray="4 4" />
            )}
            <Polygon points={points} fill="rgba(55, 19, 236, 0.2)" stroke="#3713ec" strokeWidth="3" />
        </Svg>
    );
};

const ActivityRingsDiagram = ({ steps, calories, exercise, goals }: any) => {
    const size = 140;
    const center = size / 2;
    const strokeWidth = 12;

    const ringData = [
        { progress: steps / goals.steps, color: '#e11d48', icon: Footprints, radius: 58 },
        { progress: calories / goals.calories, color: '#10b981', icon: Flame, radius: 44 },
        { progress: exercise / goals.exercise, color: '#3713ec', icon: Timer, radius: 30 },
    ];

    return (
        <View style={styles.activityCard}>
            <View style={styles.activityMain}>
                <Svg width={size} height={size}>
                    {ringData.map((ring, i) => {
                        const circumference = 2 * Math.PI * ring.radius;
                        const offset = circumference - (circumference * Math.min(ring.progress, 0.99));
                        return (
                            <G key={i} rotation="-90" origin={`${center}, ${center}`}>
                                <Circle
                                    cx={center} cy={center} r={ring.radius}
                                    stroke={ring.color + '20'} strokeWidth={strokeWidth} fill="none"
                                />
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
                <View style={[styles.activityIconsOverlay, { width: size, height: size }]}>
                    {ringData.map((ring, i) => (
                        <View key={i} style={[styles.activityIconCircle, {
                            position: 'absolute',
                            top: center - ring.radius - 6,
                            left: center - 6
                        }]}>
                            <ring.icon size={8} color="#fff" />
                        </View>
                    ))}
                </View>
            </View>
            <View style={styles.activityLegend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendIconBox, { backgroundColor: '#e11d4820' }]}>
                        <Footprints size={14} color="#e11d48" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.legendVal}>{steps.toLocaleString()}</Text>
                        <Text style={styles.legendLabel}>Steps</Text>
                    </View>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendIconBox, { backgroundColor: '#10b98120' }]}>
                        <Flame size={14} color="#10b981" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.legendVal}>{calories}</Text>
                        <Text style={styles.legendLabel}>Kcal</Text>
                    </View>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendIconBox, { backgroundColor: '#3713ec20' }]}>
                        <Timer size={14} color="#3713ec" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.legendVal}>{exercise}m</Text>
                        <Text style={styles.legendLabel}>Active</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const SleepStagesDiagram = ({ data, onAdd }: { data: number[]; onAdd?: () => void }) => {
    const colors = ['#f8fafc', '#818cf8', '#6366f1', '#3713ec'];
    const labels = ['Awake', 'REM', 'Light', 'Deep'];
    const totalMinutes = 480; // 8 hours baseline

    return (
        <View style={styles.sleepStageCard}>
            <View style={styles.sleepHeaderRow}>
                <View>
                    <Text style={styles.sleepStageTitle}>Sleep Architecture</Text>
                    <Text style={styles.sleepDurationSubText}>8h 12m Total Sleep</Text>
                </View>
                <TouchableOpacity style={styles.addSleepBtn} onPress={onAdd}>
                    <Plus size={18} color="#ffffff" />
                </TouchableOpacity>
            </View>
            <View style={styles.sleepBarContainer}>
                {data.map((percent, i) => (
                    <View key={i} style={[styles.sleepSegment, { flex: percent, backgroundColor: colors[i] }]} />
                ))}
            </View>
            <View style={styles.sleepLegendRow}>
                {labels.map((label, i) => {
                    const mins = Math.round((data[i] / 100) * totalMinutes);
                    const hours = Math.floor(mins / 60);
                    const remainingMins = mins % 60;
                    const durationStr = hours > 0 ? `${hours}h ${remainingMins}m` : `${remainingMins}m`;

                    return (
                        <View key={i} style={styles.sleepLegendItem}>
                            <View style={[styles.sleepLegendDot, { backgroundColor: colors[i], borderWidth: i === 0 ? 1 : 0, borderColor: '#e2e8f0' }]} />
                            <View>
                                <Text style={styles.sleepLegendText}>{label}</Text>
                                <Text style={styles.sleepDurationText}>{durationStr}</Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const AddSleepModal = ({ visible, onClose, onAdd }: { visible: boolean; onClose: () => void; onAdd: (log: any) => void }) => {
    const [fromTime, setFromTime] = useState('11:00 PM');
    const [toTime, setToTime] = useState('07:00 AM');
    const [quality, setQuality] = useState('85');

    const handleAdd = () => {
        onAdd({ from: fromTime, to: toTime, quality: parseInt(quality) });
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.mealModalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Log Sleep Session</Text>
                        <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
                            <X size={20} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputRow}>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.inputLabel}>Bedtime</Text>
                            <View style={styles.timeInputWrapper}>
                                <Moon size={16} color="#3713ec" style={{ marginRight: 8 }} />
                                <TextInput
                                    style={[styles.modalInput, { borderBottomWidth: 0, paddingBottom: 0, marginTop: 0 }]}
                                    value={fromTime}
                                    onChangeText={setFromTime}
                                />
                            </View>
                        </View>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.inputLabel}>Wake-up</Text>
                            <View style={styles.timeInputWrapper}>
                                <Sunrise size={16} color="#f59e0b" style={{ marginRight: 8 }} />
                                <TextInput
                                    style={[styles.modalInput, { borderBottomWidth: 0, paddingBottom: 0, marginTop: 0 }]}
                                    value={toTime}
                                    onChangeText={setToTime}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Sleep Quality (%)</Text>
                        <TextInput
                            style={styles.modalInput}
                            keyboardType="numeric"
                            value={quality}
                            onChangeText={setQuality}
                        />
                    </View>

                    <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleAdd}>
                        <Text style={styles.modalSubmitText}>Save Sleep Data</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const DeviceStatusBar = () => (
    <View style={styles.deviceStatusBanner}>
        <View style={styles.deviceInfoBatch}>
            <Watch size={14} color="#3713ec" />
            <Text style={styles.deviceStatusTitle}>Samsung Galaxy Watch</Text>
        </View>
        <View style={styles.deviceMetaRow}>

            <View style={styles.deviceDivider} />
            <Text style={styles.syncStatusText}>Live Synced</Text>
            <View style={styles.livePulse} />
        </View>
    </View>
);

const CalorieBurnDiagram = ({ active, metabolic }: { active: number; metabolic: number }) => (
    <View style={styles.calorieCard}>
        <View style={styles.calorieHeader}>
            <Flame size={20} color="#e11d48" />
            <Text style={styles.calorieTitle}>Energy Expenditure</Text>
        </View>
        <View style={styles.calorieGrid}>
            <View style={styles.calorieItem}>
                <Text style={styles.calorieVal}>{active}</Text>
                <Text style={styles.calorieLabel}>Active Burn</Text>
            </View>
            <View style={styles.calorieDivider} />
            <View style={styles.calorieItem}>
                <Text style={styles.calorieVal}>{metabolic}</Text>
                <Text style={styles.calorieLabel}>Basal (BMR)</Text>
            </View>
        </View>
        <View style={styles.totalBurnRow}>
            <Text style={styles.totalBurnText}>Daily Intensity: Moderate</Text>
            <TrendingUp size={14} color="#10b981" />
        </View>
    </View>
);

const StressReadinessDiagram = ({ stress }: { stress: number }) => {
    const readiness = 100 - stress;
    const color = readiness > 70 ? '#10b981' : readiness > 40 ? '#f59e0b' : '#ef4444';
    return (
        <View style={styles.metricCardSmall}>
            <View style={styles.metricHeaderSmall}>
                <Zap size={18} color="#f59e0b" />
                <Text style={styles.metricTitleSmall}>Daily Readiness</Text>
            </View>
            <View style={styles.gaugeContainerOuter}>
                <View style={styles.gaugeContainer}>
                    <Svg height="80" width="120">
                        <Path d="M 20 70 A 45 45 0 0 1 100 70" fill="none" stroke="#f1f5f9" strokeWidth="10" strokeLinecap="round" />
                        <Path d="M 20 70 A 45 45 0 0 1 100 70" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(readiness / 100) * 125.6}, 125.6`} />
                    </Svg>
                    <Text style={[styles.gaugeVal, { color }]}>{readiness}%</Text>
                </View>
            </View>
            <Text style={styles.metricSubSmall}>{readiness > 60 ? 'Optimal Recovery' : 'Rest Advised'}</Text>
        </View>
    );
};

const RespiratoryRateDiagram = ({ rate }: { rate: number }) => (
    <View style={styles.metricCardSmall}>
        <View style={styles.metricHeaderSmall}>
            <Waves size={18} color="#0ea5e9" />
            <Text style={styles.metricTitleSmall}>Respiration</Text>
        </View>
        <View style={styles.waveContainer}>
            <Svg height="30" width="100">
                <Path d="M0 15 Q 12 0, 25 15 T 50 15 T 75 15 T 100 15" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
            </Svg>
            <View style={styles.waveTextRow}>
                <Text style={styles.waveVal}>{rate}</Text>
                <Text style={styles.waveLabel}>br/min</Text>
            </View>
        </View>
        <Text style={styles.metricSubSmall}>Stable Rhythm</Text>
    </View>
);

const MetabolicAnalysisDiagram = ({ vo2Max }: { vo2Max: number }) => (
    <View style={styles.metricCardLong}>
        <View style={styles.metricHeaderSmall}>
            <Gauge size={18} color="#6366f1" />
            <Text style={styles.metricTitleSmall}>Metabolic Capacity (VO2 Max)</Text>
        </View>
        <View style={styles.metabolicRow}>
            <View style={styles.metabolicInfo}>
                <Text style={styles.metabolicVal}>{vo2Max}</Text>
                <Text style={styles.metabolicLabel}>Superior</Text>
            </View>
            <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${(vo2Max / 60) * 100}%`, backgroundColor: '#6366f1' }]} />
            </View>
        </View>
    </View>
);

const BodyCompositionDiagram = ({ data }: { data: any }) => (
    <View style={styles.metricCardLong}>
        <View style={styles.metricHeaderSmall}>
            <Scale size={18} color="#3713ec" />
            <Text style={styles.metricTitleSmall}>Segmented Body Composition</Text>
        </View>
        <View style={styles.compBarContainer}>
            <View style={[styles.compSegment, { flex: data.muscle, backgroundColor: '#3713ec' }]} />
            <View style={[styles.compSegment, { flex: data.fat, backgroundColor: '#f14e4e' }]} />
            <View style={[styles.compSegment, { flex: data.bone, backgroundColor: '#94a3b8' }]} />
            <View style={[styles.compSegment, { flex: data.water, backgroundColor: '#0ea5e9' }]} />
        </View>
        <View style={styles.compLegend}>
            <View style={styles.compLegendItem}><View style={[styles.compDot, { backgroundColor: '#3713ec' }]} /><Text style={styles.compLegendText}>Muscle: {Math.round(data.muscle)}%</Text></View>
            <View style={styles.compLegendItem}><View style={[styles.compDot, { backgroundColor: '#f14e4e' }]} /><Text style={styles.compLegendText}>Fat: {Math.round(data.fat)}%</Text></View>
        </View>
    </View>
);

const AddMealModal = ({ visible, onClose, onAdd }: { visible: boolean; onClose: () => void; onAdd: (meal: any) => void }) => {
    const [name, setName] = useState('');
    const [kcal, setKcal] = useState('');
    const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    const handleAdd = () => {
        if (!name || !kcal) return;
        onAdd({ name, kcal: parseInt(kcal), time });
        setName('');
        setKcal('');
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.mealModalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Log Nutritional Intake</Text>
                        <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
                            <X size={20} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Food/Meal Name</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="e.g. Avocado Toast"
                            placeholderTextColor="#94a3b8"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.inputRow}>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.inputLabel}>Calories (kcal)</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="450"
                                placeholderTextColor="#94a3b8"
                                keyboardType="numeric"
                                value={kcal}
                                onChangeText={setKcal}
                            />
                        </View>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.inputLabel}>Time</Text>
                            <View style={styles.timeInputWrapper}>
                                <Clock size={16} color="#3713ec" style={{ marginRight: 8 }} />
                                <TextInput
                                    style={[styles.modalInput, { borderBottomWidth: 0, paddingBottom: 0, marginTop: 0 }]}
                                    value={time}
                                    onChangeText={setTime}
                                />
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleAdd}>
                        <Text style={styles.modalSubmitText}>Add to Daily Log</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const NutritionSynthesis = ({ nutrition, onAddMeal }: { nutrition: any; onAddMeal: () => void }) => {
    const macros = [
        { label: 'Protein', val: nutrition.macros.protein, goal: 150, color: '#3713ec' },
        { label: 'Carbs', val: nutrition.macros.carbs, goal: 250, color: '#10b981' },
        { label: 'Fat', val: nutrition.macros.fat, goal: 70, color: '#f59e0b' },
    ];

    return (
        <View style={styles.nutritionCard}>
            <View style={styles.nutritionHeader}>
                <View>
                    <Text style={styles.nutritionTitle}>Nutritional Synthesis</Text>
                    <Text style={styles.nutritionSub}>{nutrition.calories} / {nutrition.goal} kcal</Text>
                </View>
                <TouchableOpacity style={styles.addMealIconBtn} onPress={onAddMeal}>
                    <Plus size={18} color="#ffffff" />
                </TouchableOpacity>
            </View>

            <View style={styles.macroGrid}>
                {macros.map((m, i) => (
                    <View key={i} style={styles.macroItem}>
                        <View style={styles.macroTop}>
                            <Text style={styles.macroLabel}>{m.label}</Text>
                            <Text style={styles.macroVal}>{m.val}g</Text>
                        </View>
                        <View style={styles.macroBarBg}>
                            <View style={[styles.macroBarFill, { width: `${(m.val / m.goal) * 100}%`, backgroundColor: m.color }]} />
                        </View>
                    </View>
                ))}
            </View>

            {nutrition.meals && (
                <View style={styles.mealsSection}>
                    {nutrition.meals.map((meal: any, i: number) => (
                        <View key={i} style={styles.mealRow}>
                            <View style={styles.mealInfo}>
                                <Text style={styles.mealName}>{meal.name}</Text>
                                <Text style={styles.mealTime}>{meal.time}</Text>
                            </View>
                            <Text style={styles.mealKcal}>{meal.kcal} kcal</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

const CycleConfigModal = ({ visible, onClose, onSave }: { visible: boolean; onClose: () => void; onSave: (data: any) => void }) => {
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [length, setLength] = useState('28');
    const [duration, setDuration] = useState('5');

    const handleSave = () => {
        onSave({ startDate, length: parseInt(length), duration: parseInt(duration) });
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.mealModalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Cycle Configuration</Text>
                        <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
                            <X size={20} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Last Period Start Date</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="YYYY-MM-DD"
                            placeholderTextColor="#94a3b8"
                            value={startDate}
                            onChangeText={setStartDate}
                        />
                    </View>

                    <View style={styles.inputRow}>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.inputLabel}>Cycle Length (Days)</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="28"
                                placeholderTextColor="#94a3b8"
                                keyboardType="numeric"
                                value={length}
                                onChangeText={setLength}
                            />
                        </View>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.inputLabel}>Period Duration</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="5"
                                placeholderTextColor="#94a3b8"
                                keyboardType="numeric"
                                value={duration}
                                onChangeText={setDuration}
                            />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleSave}>
                        <Text style={styles.modalSubmitText}>Save Cycle Settings</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const MenstrualCycleTracker = ({ cycle, onConfig, onShowTips }: { cycle: any; onConfig: () => void; onShowTips: () => void }) => {
    if (!cycle) return null;

    return (
        <View style={styles.cycleCard}>
            <View style={styles.cycleHeader}>
                <View style={styles.cycleIconBox}>
                    <Moon size={20} color="#e11d48" fill="#e11d4820" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.cycleTitle}>Cycle Analytics</Text>
                    <Text style={styles.cyclePhaseText}>{cycle.phase} • Day {cycle.day}</Text>
                </View>
                <TouchableOpacity style={styles.cycleConfigBtn} onPress={onConfig}>
                    <Plus size={18} color="#ffffff" />
                </TouchableOpacity>
            </View>

            <View style={styles.cycleVisualContainer}>
                <View style={styles.cycleTrack}>
                    <View style={[styles.cycleProgress, { width: `${cycle.percent}%` }]} />
                    <View style={[styles.cycleIndicator, { left: `${cycle.percent}%` }]} />
                </View>
                <View style={styles.cycleLabels}>
                    <Text style={styles.cycleLabel}>Period</Text>
                    <Text style={styles.cycleLabel}>Follicular</Text>
                    <Text style={styles.cycleLabel}>Ovulation</Text>
                    <Text style={styles.cycleLabel}>Luteal</Text>
                </View>
            </View>

            <View style={styles.cycleMetaRow}>
                <View style={styles.cycleMetaItem}>
                    <Text style={styles.cycleMetaVal}>{cycle.status}</Text>
                    <Text style={styles.cycleMetaLabel}>Conception Chance</Text>
                </View>
                <View style={styles.cycleDivider} />
                <View style={styles.cycleMetaItem}>
                    <Text style={styles.cycleMetaVal}>{cycle.nextPeriod}</Text>
                    <Text style={styles.cycleMetaLabel}>Next Period</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.cycleTipsTrigger} onPress={onShowTips}>
                <Activity size={14} color="#e11d48" />
                <Text style={styles.cycleTipsText}>View Cycle Tips & Insights</Text>
            </TouchableOpacity>
        </View>
    );
};

const CycleTipsModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    const tips = [
        { title: 'Menstrual Phase', content: 'Focus on iron-rich foods and light movement like yoga. Resting is essential.', icon: <Zap size={14} color="#e11d48" /> },
        { title: 'Follicular Phase', content: 'Energy levels are rising. Great time for high-intensity workouts and trying new things.', icon: <Activity size={14} color="#10b981" /> },
        { title: 'Ovulation Phase', content: 'Peak fertility. You may feel more social and energetic.', icon: <Heart size={14} color="#f59e0b" /> },
        { title: 'Luteal Phase', content: 'Progesterone rises. Opt for complex carbs and focus on stress management.', icon: <Moon size={14} color="#1e1b4b" /> },
    ];

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.tipsOverlay}>
                <View style={styles.tipsContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Cycle Insights</Text>
                        <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
                            <X size={20} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={{ maxHeight: 400 }}>
                        {tips.map((tip, i) => (
                            <View key={i} style={styles.tipCard}>
                                <View style={styles.tipHeader}>
                                    {tip.icon}
                                    <Text style={styles.tipTitle}>{tip.title}</Text>
                                </View>
                                <Text style={styles.tipContent}>{tip.content}</Text>
                            </View>
                        ))}
                        <View style={styles.helpGuide}>
                            <Text style={styles.helpTitle}>How its calculated?</Text>
                            <Text style={styles.helpText}>
                                We use the standard calendar method. By tracking your last period start and typical cycle length (avg. 28 days), we project your fertility windows and next period start.
                            </Text>
                        </View>
                    </ScrollView>

                    <TouchableOpacity style={[styles.modalSubmitBtn, { marginTop: 20 }]} onPress={onClose}>
                        <Text style={styles.modalSubmitText}>Understood</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const BreathingSection = ({ onStart }: { onStart: () => void }) => (
    <TouchableOpacity activeOpacity={0.9} onPress={onStart} style={styles.breathingCard}>
        <View style={styles.breathingHeader}>
            <View style={styles.breathingIconBox}>
                <Wind size={22} color="#0ea5e9" />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.breathingTitle}>Mindful Recovery</Text>
                <Text style={styles.breathingSub}>Tap to start box breathing session</Text>
            </View>
            <View style={styles.startBreathingBtn}>
                <Play size={16} color="#ffffff" fill="#ffffff" />
            </View>
        </View>
        <View style={styles.breathingVisualHint}>
            <View style={[styles.pulseCircle, { width: 40, height: 40, opacity: 0.1 }]} />
            <View style={[styles.pulseCircle, { width: 30, height: 30, opacity: 0.2 }]} />
            <Text style={styles.breathingVisualText}>4-2-4-2 Box Breathing Technique</Text>
        </View>
    </TouchableOpacity>
);

const BreathingExerciseModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    const [isActive, setIsActive] = useState(false);
    const [duration, setDuration] = useState(60);
    const [timeLeft, setTimeLeft] = useState(60);
    const [phase, setPhase] = useState<'In' | 'Hold' | 'Out'>('In');
    const anim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const runCycle = useCallback(() => {
        if (!isActive) return;

        // Multi-layered animation
        Animated.parallel([
            Animated.sequence([
                Animated.timing(anim, { toValue: 1.8, duration: 4000, easing: Easing.bezier(0.42, 0, 0.58, 1), useNativeDriver: true }),
                Animated.delay(2000),
                Animated.timing(anim, { toValue: 1, duration: 4000, easing: Easing.bezier(0.42, 0, 0.58, 1), useNativeDriver: true }),
                Animated.delay(2000)
            ]),
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
                ])
            )
        ]).start(({ finished }) => {
            if (finished && isActive) runCycle();
        });
    }, [isActive]);

    useEffect(() => {
        let timer: any;
        if (isActive && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
            runCycle();
        } else if (timeLeft === 0) {
            setIsActive(false);
        }
        return () => {
            clearInterval(timer);
            anim.stopAnimation();
            pulseAnim.stopAnimation();
        };
    }, [isActive, timeLeft]);

    useEffect(() => {
        let phaseTimer: any;
        if (isActive) {
            let count = 0;
            phaseTimer = setInterval(() => {
                count = (count + 1) % 12;
                if (count < 4) setPhase('In');
                else if (count < 6) setPhase('Hold');
                else if (count < 10) setPhase('Out');
                else setPhase('Hold');
            }, 1000);
        }
        return () => clearInterval(phaseTimer);
    }, [isActive]);

    const handleStart = () => { setTimeLeft(duration); setIsActive(true); };
    const handleStop = () => { setIsActive(false); anim.setValue(1); pulseAnim.setValue(1); };
    const handleClose = () => { handleStop(); onClose(); };

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View style={styles.breathingOverlay}>
                <View style={styles.breathingModalContent}>
                    <TouchableOpacity onPress={handleClose} style={styles.modalCloseBtnAbs}>
                        <X size={20} color="#64748b" />
                    </TouchableOpacity>

                    {!isActive ? (
                        <View style={{ alignItems: 'center', width: '100%' }}>
                            <View style={styles.prepCircle}>
                                <Wind size={32} color="#0ea5e9" />
                            </View>
                            <Text style={styles.modalTitle}>Mindful Recovery</Text>
                            <Text style={styles.modalSubText}>Prepare your mind and body</Text>

                            <View style={styles.durationRow}>
                                {[30, 60, 120].map(d => (
                                    <TouchableOpacity
                                        key={d}
                                        style={[styles.durationBtn, duration === d && styles.durationBtnActive]}
                                        onPress={() => { setDuration(d); setTimeLeft(d); }}
                                    >
                                        <Text style={[styles.durationText, duration === d && styles.durationTextActive]}>
                                            {d < 60 ? `${d}s` : `${d / 60}m`}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <TouchableOpacity onPress={handleStart} style={[styles.modalSubmitBtn, { width: '100%', marginTop: 32 }]}>
                                <Text style={styles.modalSubmitText}>Start Session</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{ alignItems: 'center', width: '100%' }}>
                            <Text style={styles.timerTextSmall}>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</Text>
                            <View style={styles.visualizerContainerSmall}>
                                <Animated.View style={[styles.outerPulse, { transform: [{ scale: pulseAnim }], opacity: 0.3, width: 140, height: 140, borderRadius: 70 }]} />
                                <Animated.View style={[styles.breathingCircle, { transform: [{ scale: anim }], width: 100, height: 100, borderRadius: 50 }]}>
                                    <View style={[styles.innerCircle, { width: 50, height: 50, borderRadius: 25 }]} />
                                </Animated.View>
                            </View>
                            <View style={styles.phaseContainerSmall}>
                                <Text style={styles.phaseText}>
                                    {phase === 'In' ? 'Breathe In' : phase === 'Hold' ? 'Hold' : 'Release'}
                                </Text>
                                <Text style={styles.phaseInfo}>Focus on the center point</Text>
                            </View>
                            <TouchableOpacity style={[styles.modalSubmitBtn, { backgroundColor: '#ef444415', marginTop: 32, width: '100%', borderWidth: 1, borderColor: '#ef4444' }]} onPress={handleStop}>
                                <Text style={[styles.modalSubmitText, { color: '#ef4444' }]}>End Session</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const ReportsScreen = ({ navigation }: MainTabScreenProps<'Ecosystem'>) => {
    const [timeRange, setTimeRange] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');
    const [vitals, setVitals] = useState({
        bpm: 72,
        oxygen: 98,
        water: 2100,
        sys: 120,
        dia: 80,
        sugar: 95,
        steps: DATA.Daily.activity.steps,
        calories: DATA.Daily.activity.calories
    });
    const [dailyMeals, setDailyMeals] = useState<any[]>(DATA.Daily.nutrition.meals);
    const [showMealModal, setShowMealModal] = useState(false);
    const [showBreathingModal, setShowBreathingModal] = useState(false);

    // Cycle State
    const [cycleSettings, setCycleSettings] = useState({
        startDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 12 days ago
        length: 28,
        duration: 5
    });
    const [showCycleModal, setShowCycleModal] = useState(false);
    const [showTipsModal, setShowTipsModal] = useState(false);
    const [showSleepModal, setShowSleepModal] = useState(false);

    const handleAddSleep = (log: any) => {
        console.log('Sleep Log Added:', log);
        // Simulation: in a real app, this would update a database or complex state
    };

    const currentData = useMemo(() => {
        const base = JSON.parse(JSON.stringify(DATA[timeRange])); // Deep copy to avoid mutating base

        // Dynamic Nutrition Sync (Real-Time Contribution)
        const totalKcalAdded = dailyMeals.reduce((acc, m) => acc + m.kcal, 0);
        const addedProtein = Math.floor((totalKcalAdded * 0.25) / 4);
        const addedCarbs = Math.floor((totalKcalAdded * 0.50) / 4);
        const addedFat = Math.floor((totalKcalAdded * 0.25) / 9);

        if (timeRange === 'Daily') {
            base.nutrition.meals = dailyMeals;
            base.nutrition.calories = totalKcalAdded;
        } else {
            base.nutrition.calories += (totalKcalAdded - DATA.Daily.nutrition.calories);
        }

        base.nutrition.macros.protein += (addedProtein - Math.floor((DATA.Daily.nutrition.calories * 0.25) / 4));
        base.nutrition.macros.carbs += (addedCarbs - Math.floor((DATA.Daily.nutrition.calories * 0.50) / 4));
        base.nutrition.macros.fat += (addedFat - Math.floor((DATA.Daily.nutrition.calories * 0.25) / 9));

        // Dynamic Cycle Logic
        if (base.cycle) {
            const start = new Date(cycleSettings.startDate);
            const today = new Date();
            const diffDays = Math.floor((today.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
            const currentDay = (diffDays % cycleSettings.length) + 1;

            let phase = 'Follicular';
            let status = 'Medium';
            let percent = 0;

            if (currentDay <= cycleSettings.duration) {
                phase = 'Menstrual (Period)';
                status = 'Low';
                percent = (currentDay / cycleSettings.duration) * 15;
            } else if (currentDay <= 14) {
                phase = 'Follicular';
                status = 'Medium';
                percent = 15 + ((currentDay - cycleSettings.duration) / (14 - cycleSettings.duration)) * 30;
            } else if (currentDay <= 17) {
                phase = 'Ovulation';
                status = 'High (Peak)';
                percent = 45 + ((currentDay - 14) / 3) * 20;
            } else {
                phase = 'Luteal';
                status = 'Low';
                percent = 65 + ((currentDay - 17) / (cycleSettings.length - 17)) * 35;
            }

            const nextPeriod = new Date(start.getTime() + cycleSettings.length * 24 * 60 * 60 * 1000);
            if (nextPeriod < today) nextPeriod.setTime(nextPeriod.getTime() + cycleSettings.length * 24 * 60 * 60 * 1000);

            base.cycle = {
                ...base.cycle,
                day: currentDay,
                phase: phase,
                status: status,
                percent: Math.min(percent, 100),
                nextPeriod: `In ${Math.ceil((nextPeriod.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))} Days`
            };
        }
        return base;
    }, [timeRange, dailyMeals, cycleSettings]);

    const handleAddMeal = (meal: any) => setDailyMeals(prev => [...prev, meal]);
    const handleSaveCycle = (data: any) => setCycleSettings(data);

    useEffect(() => {
        const interval = setInterval(() => {
            setVitals(p => ({
                ...p,
                bpm: 68 + Math.floor(Math.random() * 12),
                sugar: 92 + Math.floor(Math.random() * 6),
                steps: p.steps + Math.floor(Math.random() * 2),
                calories: p.calories + (Math.random() > 0.7 ? 1 : 0)
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const chartConfig = {
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(55, 19, 236, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
        style: { borderRadius: 16 },
        propsForDots: { r: '6', strokeWidth: '2', stroke: '#ffffff' },
        propsForBackgroundLines: { strokeDasharray: '', stroke: '#f1f5f9' }
    };

    const radarLabels = ['Heart', 'Activity', 'Sleep', 'Nutrition', 'Oxygen', 'Glucose'];
    const radarData = [0.85, 0.72, 0.65, 0.90, 0.98, 0.88];

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={styles.headerSection}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.pageTitleHeader}>Health</Text>
                        <Text style={styles.pageTitleSub}>Ecosystem</Text>
                    </View>
                    <DeviceStatusBar />
                    <View style={styles.timeSelectorRow}>
                        {(['Daily', 'Weekly', 'Monthly'] as const).map(r => (
                            <TouchableOpacity key={r} style={[styles.timeBtn, timeRange === r && styles.timeBtnActive]} onPress={() => setTimeRange(r)}>
                                <Text style={[styles.timeBtnText, timeRange === r && styles.timeBtnTextActive]}>{r}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={[styles.sectionHeader, { marginBottom: 16 }]}>
                    <Text style={styles.sectionTitle}>Activity Summary</Text>
                </View>

                <ActivityRingsDiagram steps={vitals.steps} calories={vitals.calories} exercise={currentData.activity.exercise} goals={currentData.activity.goals} />

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                    <PremiumHeartDiagram bpm={vitals.bpm} />
                    <OxygenDiagram level={vitals.oxygen} />
                    <WaterGlassDiagram intake={vitals.water} goal={timeRange === 'Daily' ? 3000 : timeRange === 'Weekly' ? 21000 : 90000} />
                    <GlucoseDiagram value={vitals.sugar} />
                </ScrollView>

                <View style={styles.wellnessSection}>
                    <Text style={styles.sectionTitle}>Mindful Recovery</Text>
                    <BreathingSection onStart={() => setShowBreathingModal(true)} />
                </View>

                <View style={styles.wellnessSection}>
                    <Text style={styles.sectionTitle}>Performance Metrics</Text>
                    <View style={styles.metricsGrid}>
                        <CalorieBurnDiagram active={currentData.activity.calories} metabolic={1850} />
                        <SleepStagesDiagram data={currentData.sleep.advanced} onAdd={() => setShowSleepModal(true)} />
                    </View>
                </View>

                <View style={styles.wellnessSection}>
                    <Text style={styles.sectionTitle}>Advanced Physiological Insights</Text>
                    <View style={styles.metricsGrid}>
                        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                            <StressReadinessDiagram stress={currentData.stress} />
                            <RespiratoryRateDiagram rate={currentData.respiratory} />
                        </View>
                        <MetabolicAnalysisDiagram vo2Max={currentData.vo2Max} />
                        <BodyCompositionDiagram data={currentData.bodyComp} />
                    </View>
                </View>

                <View style={styles.wellnessSection}>
                    <Text style={styles.sectionTitle}>Clinical Overview</Text>
                    <View style={styles.radarCard}>
                        <PremiumRadarChart data={radarData} labels={radarLabels} secondData={[0.7, 0.7, 0.7, 0.7, 0.7, 0.7]} secondColor="#94a3b8" />
                        <View style={styles.radarLegend}>
                            <View style={styles.radarLegendItem}><View style={[styles.radarDot, { backgroundColor: '#3713ec' }]} /><Text style={styles.radarLegendText}>Your Synthesis</Text></View>
                            <View style={styles.radarLegendItem}><View style={[styles.radarDot, { backgroundColor: '#94a3b8', borderWidth: 1, borderColor: '#e2e8f0' }]} /><Text style={styles.radarLegendText}>Clinical Baseline</Text></View>
                        </View>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Vascular Health</Text>
                <BloodPressureGauge sys={vitals.sys} dia={vitals.dia} />

                <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Analytical Projections</Text></View>
                <View style={styles.chartCard}>
                    <View style={styles.chartHeader}><TrendingUp size={20} color="#e11d48" /><Text style={styles.chartTitle}>Heart Rate Tendency</Text></View>
                    <LineChart data={{ labels: currentData.heartRate.labels, datasets: [{ data: currentData.heartRate.data }] }} width={width - 48} height={220} chartConfig={{ ...chartConfig, color: (opacity = 1) => `rgba(225, 29, 72, ${opacity})` }} bezier style={styles.chart} withVerticalLines={false} />
                </View>

                <View style={styles.chartCard}>
                    <View style={styles.chartHeader}><Activity size={20} color="#6366f1" /><Text style={styles.chartTitle}>Sleep Consistency</Text></View>
                    <BarChart data={{ labels: currentData.sleep.labels, datasets: [{ data: currentData.sleep.data }] }} width={width - 80} height={220} yAxisLabel="" yAxisSuffix="h" chartConfig={{ ...chartConfig, color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})` }} style={styles.chart} flatColor={true} withInnerLines={false} fromZero />
                </View>

                <View style={styles.wellnessSection}>
                    <Text style={styles.sectionTitle}>Nutritional Analysis</Text>
                    <View style={styles.metricsGrid}><NutritionSynthesis nutrition={currentData.nutrition} onAddMeal={() => setShowMealModal(true)} /></View>
                </View>


                {currentData.cycle && (
                    <View style={styles.wellnessSection}>
                        <Text style={styles.sectionTitle}>Cycle Tracking</Text>
                        <MenstrualCycleTracker cycle={currentData.cycle} onConfig={() => setShowCycleModal(true)} onShowTips={() => setShowTipsModal(true)} />
                    </View>
                )}

                <View style={styles.neuroCard}>
                    <View style={styles.neuroIcon}><Zap size={24} color="#ffffff" fill="#ffffff" /></View>
                    <View style={styles.neuroContent}>
                        <Text style={styles.neuroTitle}>Ecosystem Insights</Text>
                        <Text style={styles.neuroText}>
                            {timeRange === 'Daily' ? "Your activity rings are 72% complete. Cardiovascular recovery is projected to be optimal." : timeRange === 'Weekly' ? "Weekly activity volume is up by 14%. Your sleep architecture suggests improved deep sleep." : "Monthly health synthesis: Sustained aerobic improvements detected."}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.downloadBtn}><Download size={20} color="#ffffff" /><Text style={styles.downloadBtnText}>Generate Comprehensive PDF</Text></TouchableOpacity>

                <AddMealModal visible={showMealModal} onClose={() => setShowMealModal(false)} onAdd={handleAddMeal} />
                <CycleConfigModal visible={showCycleModal} onClose={() => setShowCycleModal(false)} onSave={handleSaveCycle} />
                <CycleTipsModal visible={showTipsModal} onClose={() => setShowTipsModal(false)} />
                <BreathingExerciseModal visible={showBreathingModal} onClose={() => setShowBreathingModal(false)} />
                <AddSleepModal visible={showSleepModal} onClose={() => setShowSleepModal(false)} onAdd={handleAddSleep} />
                <View style={{ height: 40 }} />
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
        flex: 1,
        paddingHorizontal: 24,
    },
    headerSection: {
        marginTop: 24,
        marginBottom: 32,
    },
    titleContainer: {
        marginBottom: 20,
    },
    pageTitleHeader: {
        fontSize: 46,
        paddingTop: 24,
        fontWeight: '900',
        color: '#1e1b4b',
        letterSpacing: -1,
        lineHeight: 38,
    },
    pageTitleSub: {
        fontSize: 35,
        fontWeight: '900',
        color: '#3713ec',
        letterSpacing: -1,
        lineHeight: 38,
    },
    timeSelectorRow: {
        flexDirection: 'row',
        backgroundColor: '#f1f5f9',
        padding: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    timeSelector: {
        flexDirection: 'row',
        backgroundColor: '#f1f5f9',
        padding: 4,
        borderRadius: 12,
    },
    timeBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    timeBtnActive: {
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    timeBtnText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#94a3b8',
        textTransform: 'uppercase',
    },
    timeBtnTextActive: {
        color: '#1e1b4b',
    },
    diagramsGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    diagramCard: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 40,
        padding: 24,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300,
        marginRight: 16,
    },
    diagramGlow: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: 'rgba(244, 63, 94, 0.05)',
        borderRadius: 100,
        opacity: 0.5,
    },
    diagramMain: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    diagramOverlay: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    diagramValue: {
        fontSize: 32,
        fontWeight: '900',
        color: '#0f172a',
    },
    diagramUnit: {
        fontSize: 10,
        fontWeight: '800',
        color: '#64748b',
        textTransform: 'uppercase',
        marginTop: -4,
    },
    diagramInfo: {
        alignItems: 'center',
    },
    diagramLabel: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1e1b4b',
        marginBottom: 4,
    },
    syncRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    syncDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#ef4444',
    },
    syncText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#94a3b8',
        letterSpacing: 1,
    },
    horizontalScroll: {
        paddingRight: 24,
        marginBottom: 32,
    },
    glassContainer: {
        width: 70,
        height: 110,
        borderWidth: 3,
        borderColor: '#f1f5f9',
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: 'rgba(241, 245, 249, 0.5)',
    },
    waterFill: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#3b82f6',
    },
    waterTop: {
        height: 4,
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    sugarContainer: {
        width: 60,
        height: 110,
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#f1f5f9',
    },
    sugarFill: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#f59e0b',
    },
    bpGrid: {
        flexDirection: 'row',
        gap: 24,
        marginBottom: 24,
    },
    bpCircle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    diagramValueSmall: {
        fontSize: 24,
        fontWeight: '900',
        color: '#0f172a',
    },
    diagramUnitSmall: {
        fontSize: 8,
        fontWeight: '800',
        color: '#64748b',
        textTransform: 'uppercase',
        marginTop: -2,
    },
    wellnessSection: {
        marginBottom: 32,
    },
    radarCard: {
        backgroundColor: '#ffffff',
        borderRadius: 40,
        padding: 20,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        marginTop: 16,
        alignItems: 'center',
    },
    sectionHeader: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1e1b4b',
        letterSpacing: -0.5,
    },
    chartCard: {
        backgroundColor: '#ffffff',
        borderRadius: 32,
        padding: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        marginBottom: 20,
        alignItems: 'center',
    },
    chartHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
        width: '100%',
        paddingHorizontal: 12,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0f172a',
    },
    chart: {
        borderRadius: 16,
        marginVertical: 8,
    },
    neuroCard: {
        backgroundColor: '#1e1b4b',
        borderRadius: 32,
        padding: 24,
        flexDirection: 'row',
        gap: 20,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    neuroIcon: {
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: '#3713ec',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    neuroContent: {
        flex: 1,
    },
    neuroTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 8,
    },
    neuroText: {
        color: '#94a3b8',
        fontSize: 14,
        lineHeight: 22,
        fontWeight: '500',
    },
    downloadBtn: {
        backgroundColor: '#3713ec',
        borderRadius: 24,
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        shadowColor: '#3713ec',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
    },
    downloadBtnText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '800',
    },
    // --- New Ecosystem Styles ---
    deviceStatusBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8fafc',
        padding: 12,
        borderRadius: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    deviceInfoBatch: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    deviceStatusTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1e1b4b',
    },
    deviceMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    deviceMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    deviceMetaText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#10b981',
    },
    deviceDivider: {
        width: 1,
        height: 12,
        backgroundColor: '#cbd5e1',
    },
    syncStatusText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#64748b',
    },
    livePulse: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10b981',
    },
    activityCard: {
        backgroundColor: '#ffffff',
        borderRadius: 32,
        padding: 24,
        flexDirection: 'row',
        gap: 24,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        marginBottom: 24,
        alignItems: 'center',
    },
    activityMain: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityIconsOverlay: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityIconCircle: {
        position: 'absolute',
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityLegend: {
        flex: 1,
        gap: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    legendIconBox: {
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    legendVal: {
        fontSize: 18,
        fontWeight: '900',
        color: '#0f172a',
    },
    legendLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#94a3b8',
        textTransform: 'uppercase',
    },
    metricsGrid: {
        flexDirection: 'column',
        gap: 16,
        marginTop: 16,
    },
    calorieCard: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        flex: 1,
    },
    calorieHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    calorieTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#0f172a',
    },
    calorieGrid: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    calorieItem: {
        flex: 1,
        alignItems: 'center',
    },
    calorieVal: {
        fontSize: 20,
        fontWeight: '900',
        color: '#0f172a',
    },
    calorieLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#94a3b8',
        marginTop: 2,
    },
    calorieDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#f1f5f9',
    },
    totalBurnRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    totalBurnText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
    },
    sleepStageCard: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        flex: 1,
    },
    sleepStageTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: 16,
    },
    sleepBarContainer: {
        height: 12,
        borderRadius: 6,
        flexDirection: 'row',
        overflow: 'hidden',
        marginBottom: 16,
        backgroundColor: '#f1f5f9',
    },
    sleepSegment: {
        height: '100%',
    },
    sleepLegendRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    sleepLegendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    sleepLegendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    sleepLegendText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#64748b',
    },
    sleepHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    sleepDurationText: {
        fontSize: 9,
        fontWeight: '600',
        color: '#94a3b8',
        marginTop: 1,
    },
    sleepDurationSubText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#64748b',
        marginTop: 2,
    },
    addSleepBtn: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#3713ec',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radarLegend: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 20,
        justifyContent: 'center',
        width: '100%',
    },
    radarLegendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    radarDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    radarLegendText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#64748b',
    },
    nutritionCard: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    nutritionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    nutritionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0f172a',
    },
    nutritionSub: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
        marginTop: 2,
    },
    macroGrid: {
        flexDirection: 'column',
        gap: 12,
        marginBottom: 20,
    },
    macroItem: {},
    macroTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    macroLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#94a3b8',
        textTransform: 'uppercase',
    },
    macroVal: {
        fontSize: 11,
        fontWeight: '800',
        color: '#0f172a',
    },
    macroBarBg: {
        height: 6,
        backgroundColor: '#f1f5f9',
        borderRadius: 3,
        overflow: 'hidden',
    },
    macroBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    mealsSection: {
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 16,
        gap: 12,
    },
    mealRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mealInfo: {
        gap: 2,
    },
    mealName: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1e1b4b',
    },
    mealTime: {
        fontSize: 10,
        fontWeight: '600',
        color: '#94a3b8',
    },
    mealKcal: {
        fontSize: 12,
        fontWeight: '800',
        color: '#3713ec',
    },
    cycleCard: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    cycleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    cycleIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#fff1f2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cycleTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#0f172a',
    },
    cyclePhaseText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#e11d48',
        marginTop: 2,
    },
    cycleVisualContainer: {
        marginBottom: 20,
    },
    cycleTrack: {
        height: 8,
        backgroundColor: '#f1f5f9',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 12,
    },
    cycleProgress: {
        height: '100%',
        backgroundColor: '#e11d48',
        borderRadius: 4,
    },
    cycleIndicator: {
        position: 'absolute',
        top: -4,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        borderWidth: 3,
        borderColor: '#e11d48',
        marginLeft: -8,
    },
    cycleLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cycleLabel: {
        fontSize: 9,
        fontWeight: '700',
        color: '#cad5e1',
        textTransform: 'uppercase',
    },
    cycleMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    cycleMetaItem: {
        flex: 1,
        alignItems: 'center',
    },
    cycleMetaVal: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1e1b4b',
    },
    cycleMetaLabel: {
        fontSize: 9,
        fontWeight: '600',
        color: '#94a3b8',
        marginTop: 2,
    },
    cycleDivider: {
        width: 1,
        height: 20,
        backgroundColor: '#f1f5f9',
    },
    cycleConfigBtn: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#e11d48',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cycleTipsTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        justifyContent: 'center',
    },
    cycleTipsText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#e11d48',
    },
    tipsOverlay: {
        flex: 1,
        backgroundColor: 'rgba(30, 27, 75, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    tipsContent: {
        backgroundColor: '#ffffff',
        borderRadius: 32,
        padding: 24,
        width: '100%',
        maxHeight: '80%',
        shadowColor: '#1e1b4b',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    tipCard: {
        backgroundColor: '#f8fafc',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
    },
    tipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    tipTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1e1b4b',
    },
    tipContent: {
        fontSize: 12,
        fontWeight: '500',
        color: '#64748b',
        lineHeight: 18,
    },
    helpGuide: {
        marginTop: 12,
        padding: 16,
        backgroundColor: '#f1f5f9',
        borderRadius: 20,
    },
    helpTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#1e1b4b',
        marginBottom: 8,
    },
    helpText: {
        fontSize: 11,
        fontWeight: '500',
        color: '#94a3b8',
        lineHeight: 16,
    },
    // --- Shared Modal & Input Styles (Essential for Nutrition & Cycle) ---
    addMealIconBtn: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#3713ec',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mealsSectionTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: '#94a3b8',
        textTransform: 'uppercase',
        marginBottom: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(30, 27, 75, 0.6)',
        justifyContent: 'flex-end',
    },
    mealModalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 32,
        paddingBottom: 48,
        shadowColor: '#1e1b4b',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1e1b4b',
        letterSpacing: -0.5,
    },
    modalCloseBtn: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputGroup: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: '#94a3b8',
        textTransform: 'uppercase',
        marginBottom: 12,
    },
    modalInput: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e1b4b',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        paddingBottom: 12,
    },
    inputRow: {
        flexDirection: 'row',
        gap: 24,
        marginBottom: 32,
    },
    timeInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        paddingBottom: 12,
    },
    modalSubmitBtn: {
        backgroundColor: '#3713ec',
        borderRadius: 20,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3713ec',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
    },
    modalSubmitText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '800',
    },
    // --- Breathing Styles ---
    breathingCard: {
        backgroundColor: '#ffffff',
        borderRadius: 32,
        padding: 24,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#0ea5e9',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 5,
    },
    breathingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    breathingIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#e0f2fe',
        alignItems: 'center',
        justifyContent: 'center',
    },
    breathingTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#0c4a6e',
    },
    breathingSub: {
        fontSize: 11,
        fontWeight: '600',
        color: '#0ea5e9',
        marginTop: 2,
    },
    startBreathingBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#0ea5e9',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0ea5e9',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    breathingVisualHint: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f9ff',
        padding: 12,
        borderRadius: 16,
        overflow: 'hidden',
    },
    pulseCircle: {
        borderRadius: 20,
        backgroundColor: '#0ea5e9',
        position: 'absolute',
        left: 10,
    },
    breathingVisualText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#0ea5e9',
        marginLeft: 45,
    },
    breathingBenefitRow: {
        flexDirection: 'row',
        gap: 16,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    benefitText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#0ea5e9',
        textTransform: 'uppercase',
    },
    breathingOverlay: {
        flex: 1,
        backgroundColor: 'rgba(30, 27, 75, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    breathingModalContent: {
        backgroundColor: '#ffffff',
        borderRadius: 32,
        padding: 24,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#1e1b4b',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.2,
        shadowRadius: 30,
        elevation: 15,
    },
    modalCloseBtnAbs: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    durationRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    durationBtn: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 16,
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    durationBtnActive: {
        backgroundColor: '#0ea5e9',
        borderColor: '#0ea5e9',
    },
    prepCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f0f9ff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    modalSubText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#64748b',
        marginTop: 4,
        marginBottom: 32,
    },
    outerPulse: {
        position: 'absolute',
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: '#0ea5e9',
    },
    phaseContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    phaseInfo: {
        fontSize: 12,
        fontWeight: '500',
        color: '#94a3b8',
        marginTop: 8,
    },
    durationText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748b',
    },
    durationTextActive: {
        color: '#ffffff',
    },
    timerText: {
        fontSize: 48,
        fontWeight: '900',
        color: '#1e1b4b',
        marginBottom: 40,
    },
    timerTextSmall: {
        fontSize: 40,
        fontWeight: '900',
        color: '#1e1b4b',
        marginBottom: 24,
    },
    visualizerContainer: {
        width: 200,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    visualizerContainerSmall: {
        width: 160,
        height: 160,
        alignItems: 'center',
        justifyContent: 'center',
    },
    phaseContainerSmall: {
        alignItems: 'center',
        marginTop: 32,
    },
    breathingCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#0ea5e9',
        shadowColor: '#0ea5e9',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    phaseText: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0ea5e9',
        marginTop: 40,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    metricCardSmall: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    metricHeaderSmall: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    metricTitleSmall: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1e1b4b',
    },
    gaugeContainerOuter: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 70,
    },
    gaugeContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gaugeVal: {
        position: 'absolute',
        bottom: 5,
        fontSize: 18,
        fontWeight: '800',
    },
    metricSubSmall: {
        fontSize: 11,
        fontWeight: '600',
        color: '#64748b',
        textAlign: 'center',
        marginTop: 4,
    },
    waveContainer: {
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    waveTextRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
        marginTop: 8,
    },
    waveVal: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0ea5e9',
    },
    waveLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#94a3b8',
    },
    metricCardLong: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 20,
        marginBottom: 12,
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    metabolicRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    metabolicInfo: {
        alignItems: 'center',
    },
    metabolicVal: {
        fontSize: 24,
        fontWeight: '800',
        color: '#6366f1',
    },
    metabolicLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#94a3b8',
        textTransform: 'uppercase',
    },
    progressTrack: {
        flex: 1,
        height: 8,
        backgroundColor: '#f1f5f9',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    compBarContainer: {
        flexDirection: 'row',
        height: 12,
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 16,
    },
    compSegment: {
        height: '100%',
    },
    compLegend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    compLegendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    compDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    compLegendText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
    },
});

export default ReportsScreen;

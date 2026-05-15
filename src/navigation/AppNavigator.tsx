import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LayoutDashboard, Calendar, FileText, MessageCircle, Settings, Bell, Activity, Zap } from 'lucide-react-native';

import GetStartedScreen from '../screens/GetStartedScreen';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import MedicalRecordsScreen from '../screens/MedicalRecordsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileRegistrationScreen from '../screens/ProfileRegistrationScreen';
import ReportsScreen from '../screens/ReportsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

import { RootStackParamList, MainTabParamList, RootStackScreenProps } from '../types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TAB_ICONS: Record<string, any> = {
    Ecosystem: Zap,
    Appointments: Calendar,
    Dashboard: LayoutDashboard,
    Records: FileText,
    Messages: MessageCircle,
};

const TAB_COLORS: Record<string, string> = {
    Ecosystem: '#f59e0b',
    Appointments: '#10b981',
    Dashboard: '#3713ec',
    Records: '#0ea5e9',
    Messages: '#8b5cf6',
};


// Floating Glass Collapsible Tab Bar
const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const [expanded, setExpanded] = useState(false);

    // Active tab info
    const activeRoute = state.routes[state.index];
    const { options } = descriptors[activeRoute.key];

    // Check if tab bar should be hidden
    if ((options.tabBarStyle as any)?.display === 'none') {
        return null;
    }

    const ActiveIcon = TAB_ICONS[activeRoute.name] || LayoutDashboard;
    const activeColor = TAB_COLORS[activeRoute.name] || '#3713ec';

    const handleCollapsedPress = () => {
        setExpanded(true);
    };

    const handleTabPress = (route: any, isFocused: boolean) => {
        const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
        });
        if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
        }
        setExpanded(false);
    };

    if (!expanded) {
        // COLLAPSED: active tab icon in a floating pill
        return (
            <View style={tabStyles.floatingWrapper}>
                <View style={tabStyles.collapsedBar}>
                    <TouchableOpacity
                        onPress={handleCollapsedPress}
                        activeOpacity={0.8}
                    >
                        <View style={[tabStyles.activeCircle, { backgroundColor: activeColor }]}>
                            <ActiveIcon size={24} color="#ffffff" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // EXPANDED: all 5 tabs
    return (
        <View style={tabStyles.floatingWrapper}>
            <View style={tabStyles.expandedBar}>
                {state.routes.map((route: any, index: number) => {
                    const { options } = descriptors[route.key];
                    const label = options.tabBarLabel ?? route.name;
                    const isFocused = state.index === index;
                    const IconComp = TAB_ICONS[route.name] || LayoutDashboard;
                    const iconColor = TAB_COLORS[route.name] || '#3713ec';

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={() => handleTabPress(route, isFocused)}
                            style={tabStyles.tabItem}
                            activeOpacity={0.7}
                        >
                            <View style={[
                                tabStyles.iconWrap,
                                isFocused && [tabStyles.iconWrapActive, { backgroundColor: iconColor + '30' }],
                            ]}>
                                <IconComp
                                    size={20}
                                    color={isFocused ? iconColor : 'rgba(255,255,255,0.5)'}
                                />
                            </View>
                            <Text style={[
                                tabStyles.label,
                                isFocused && [tabStyles.labelActive, { color: iconColor }],
                            ]}>{label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const TabNavigator = ({ navigation }: RootStackScreenProps<'Main'>) => {
    return (
        <View style={{ flex: 1, backgroundColor: '#ffffff', paddingTop: Platform.OS === 'ios' ? 110 : 70 }}>
            <Tab.Navigator
                initialRouteName="Dashboard"
                tabBar={(props) => <CustomTabBar {...props} />}
                backBehavior="history"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Tab.Screen
                    name="Ecosystem"
                    component={ReportsScreen}
                    options={{ tabBarLabel: 'Ecosystem' }}
                />
                <Tab.Screen
                    name="Appointments"
                    component={AppointmentsScreen}
                    options={{ tabBarLabel: 'Appts' }}
                />
                <Tab.Screen
                    name="Dashboard"
                    component={DashboardScreen}
                    options={{ tabBarLabel: 'Home' }}
                />
                <Tab.Screen
                    name="Records"
                    component={MedicalRecordsScreen}
                    options={{ tabBarLabel: 'Records' }}
                />
                <Tab.Screen
                    name="Messages"
                    component={MessagesScreen}
                    options={{ tabBarLabel: 'Messages' }}
                />
            </Tab.Navigator>
            {/* Floating notch — logo + bell + settings */}
            <View style={headerStyles.floatingNotchWrapper}>
                <View style={headerStyles.notch}>
                    <View style={headerStyles.logoIcon}>
                        <Activity size={16} color="#ffffff" />
                    </View>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity
                        style={headerStyles.notchBtn}
                        onPress={() => navigation.navigate('Notifications')}
                    >
                        <Bell size={16} color="#64748b" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={headerStyles.notchBtn}
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <Settings size={16} color="#64748b" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const AppNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="GetStarted" component={GetStartedScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ProfileRegistration" component={ProfileRegistrationScreen} />
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: true, headerTitle: 'Settings' }} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

const headerStyles = StyleSheet.create({
    floatingNotchWrapper: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 66 : 32,
        right: 16,
        zIndex: 100,
    },
    notch: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.92)',
        borderRadius: 26,
        paddingVertical: 6,
        paddingHorizontal: 12,
        minWidth: 330,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    logoIcon: {
        backgroundColor: '#3713ec',
        padding: 6,
        borderRadius: 10,
    },
    divider: {
        width: 1,
        height: 20,
        backgroundColor: '#e2e8f0',
        marginHorizontal: 4,
    },
    notchBtn: {
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const tabStyles = StyleSheet.create({
    floatingWrapper: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 28 : 12,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 100,
    },
    collapsedBar: {
        backgroundColor: 'rgba(15, 8, 50, 0.92)',
        borderRadius: 30,
        padding: 5,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 15,
    },
    activeCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    expandedBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(15, 8, 50, 0.92)',
        borderRadius: 28,
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginHorizontal: 16,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 15,
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingVertical: 2,
    },
    iconWrap: {
        width: 36,
        height: 30,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapActive: {
        // backgroundColor set dynamically
    },
    label: {
        fontSize: 8,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.4)',
        marginTop: 2,
    },
    labelActive: {
        fontWeight: '800',
        // color set dynamically
    },
});

export default AppNavigator;

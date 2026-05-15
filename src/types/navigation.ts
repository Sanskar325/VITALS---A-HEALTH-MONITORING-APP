import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
    GetStarted: undefined;
    Login: undefined;
    ProfileRegistration: undefined;
    Main: undefined;
    Settings: undefined;
    Notifications: undefined;
};

export type MainTabParamList = {
    Ecosystem: undefined;
    Appointments: undefined;
    Dashboard: undefined;
    Records: undefined;
    Messages: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
    BottomTabScreenProps<MainTabParamList, T>;

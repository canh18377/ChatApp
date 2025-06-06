import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import { IconButton, Avatar } from 'react-native-paper';
import {
    createAgoraRtcEngine,
    ChannelProfileType,
    ClientRoleType,
} from 'react-native-agora';
import { useSelector } from 'react-redux';
const APP_ID = 'ab39965c3627442e8d8bf38a47c911d2';
import { useAppTheme } from '../context/ThemeContext';


const AudioCallScreen = ({ navigation, route }) => {
    const { theme } = useAppTheme();
    const { token, channelName, uid } = route.params.tokenCall;
    const receiverName = route.params.tokenCall.receiverName;
    const receiverAvatar = route.params.tokenCall.receiverAvatar;
    const callerName = route.params.tokenCall.callerName;
    const callerAvatar = route.params.tokenCall.callerAvatar;
    const [engine, setEngine] = useState(null);
    const [callStatus, setCallStatus] = useState('waiting'); // 'waiting' | 'inCall' | 'ended'
    const [remoteJoined, setRemoteJoined] = useState(false);
    const me = useSelector((state) => state.userReducer.me);
    useEffect(() => {
        const init = async () => {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
            }

            const rtcEngine = createAgoraRtcEngine();
            rtcEngine.initialize({
                appId: APP_ID,
                channelProfile: ChannelProfileType.ChannelProfileCommunication,
            });

            rtcEngine.registerEventHandler({
                onJoinChannelSuccess: () => {
                    console.log('Local user joined channel');
                },
                onUserJoined: (connection, remoteUid) => {
                    console.log('Remote user joined:', remoteUid);
                    setRemoteJoined(true);
                    setCallStatus('inCall');
                },
                onUserOffline: (connection, remoteUid, reason) => {
                    console.log('UserOffline', remoteUid);
                    handleEndCall();
                },
                onLeaveChannel: () => {
                    console.log('Left channel');
                },
            });

            rtcEngine.joinChannelWithUserAccount(token, channelName, uid, {
                clientRoleType: ClientRoleType.ClientRoleBroadcaster,
            });

            setEngine(rtcEngine);
        };

        init();

        return () => {
            if (engine) {
                engine.leaveChannel();
                engine.release();
            }
        };
    }, []);

    const handleEndCall = () => {
        setCallStatus('ended');
        engine?.leaveChannel();
        engine?.release();
        navigation.goBack();
    };

    const renderAvatar = () => {
        const avatarText = callerAvatar || receiverAvatar || 'U';
        const nameText = callerName || receiverName;

        return (
            <>
                <Avatar.Text size={100} label={avatarText.substring(0, 2)} style={styles.avatar} />
                <Text style={[styles.username, { color: theme.colors.onBackground }]}>{nameText}</Text>
            </>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {callStatus === 'waiting' && (
                <>
                    {renderAvatar()}
                    <Text style={[styles.statusText, { color: theme.colors.onBackground }]}>Đang kết nối...</Text>
                </>
            )}

            {callStatus === 'inCall' && (
                <>
                    {renderAvatar()}
                    <Text style={[styles.statusText, { color: theme.colors.onBackground }]}>Đang trong cuộc gọi với {callerName || receiverName}</Text>
                </>
            )}
            {callStatus === 'ended' && (
                <Text style={[styles.statusText, { color: theme.colors.onBackground }]}>Cuộc gọi đã kết thúc</Text>
            )}

            <View style={{ display: "flex" }}>
                {callStatus !== 'ended' && (
                    <IconButton
                        icon="phone-hangup"
                        size={50}
                        onPress={handleEndCall}
                        color="red"
                        style={styles.hangupButton}
                    />
                )}
                {uid !== me.idUser && callStatus !== 'ended' && (
                    <IconButton
                        icon="phone"
                        size={50}
                        onPress={handleEndCall}
                        color="red"
                        style={styles.hangonButton}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    avatar: { backgroundColor: '#2196F3', marginBottom: 20 },
    username: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
    statusText: { fontSize: 18, marginBottom: 30 },
    hangupButton: { backgroundColor: '#f44336', borderRadius: 50 },
    hangonButton: { backgroundColor: 'green', borderRadius: 50 },
});

export default AudioCallScreen;

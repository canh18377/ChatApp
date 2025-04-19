import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import { IconButton, Avatar } from 'react-native-paper';
import {
    createAgoraRtcEngine,
    ChannelProfileType,
    ClientRoleType,
} from 'react-native-agora';

const APP_ID = 'ab39965c3627442e8d8bf38a47c911d2';

const AudioCallScreen = ({ navigation, route }) => {
    const { token, channelName, uid } = route.params.tokenCall;
    const receiverName = route.params.tokenCall.receiverName
    const receiverAvatar = route.params.tokenCall.receiverAvatar
    const callerName = route.params.tokenCall.callerName
    const callerAvatar = route.params.tokenCall.callerAvatar
    const [engine, setEngine] = useState(null);
    const [callStatus, setCallStatus] = useState('calling');
    console.log(route.params.tokenCall);

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
                onJoinChannelSuccess: (connection, elapsed) => {
                    console.log('Joined channel successfully');
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

            rtcEngine.joinChannel(token, channelName, uid, {
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

    return (
        <View style={styles.container}>
            <View style={styles.container}>
                <Avatar.Text size={100} label={callerAvatar || receiverAvatar} style={styles.avatar} />
                <Text style={styles.username}>{callerName || receiverName}</Text>
            </View>
            <Text style={styles.statusText}>
                {callStatus === 'calling' ? 'Đang kết nối...' : callStatus === 'inCall' ? 'Đang gọi...' : 'Cuộc gọi kết thúc'}
            </Text>
            {callStatus !== 'ended' && (
                <IconButton icon="phone-hangup" size={50} onPress={handleEndCall} color="red" />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    statusText: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
});

export default AudioCallScreen;

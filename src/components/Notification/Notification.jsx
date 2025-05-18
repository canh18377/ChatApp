import React from 'react';
import { View } from 'react-native';
import { Snackbar } from 'react-native-paper';

export default function Notification({ message }) {
    return (
        <View style={{ flex: 1 }}>
            <Snackbar
                visible={true} // You may want to control visibility based on state
                duration={2000} // Duration of the Snackbar
            >
                {message}
            </Snackbar>
        </View>
    );
}

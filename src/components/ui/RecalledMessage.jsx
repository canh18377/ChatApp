import { View, Text, StyleSheet } from 'react-native';

export default function RecalledMessage({ css }) {
    return (
        <View style={[styles.container, css]}>
            <Text style={styles.text}>Tin nhắn đã được thu hồi</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f2f2f2',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderWidth: 1,
        alignSelf: "flex-end",
        borderColor: '#ddd',
    },
    text: {
        fontStyle: 'italic',
        color: '#888',
    },
});

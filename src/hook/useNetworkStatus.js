// hooks/useNetworkStatus.ts
import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

const useNetworkStatus = () => {
    const [isConnected, setIsConnected] = useState(null);

    useEffect(() => {
        NetInfo.fetch().then(state => {
            setIsConnected(state.isConnected);
        });

        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        // Hủy listener khi component unmount
        return () => {
            unsubscribe();
        };
    }, []);

    return isConnected;
};

export default useNetworkStatus;

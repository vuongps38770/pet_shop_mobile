import { useState, useEffect } from 'react';

export const useSplashScreen = (duration: number = 2000) => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsReady(true);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    return isReady;
}; 
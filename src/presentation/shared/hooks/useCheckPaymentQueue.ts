import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/presentation/store/store";
import { checkOrder } from "src/presentation/store/slices/check-payment.slice";
import { storageHelper } from "app/config/storage";
import { useBadgeContext } from "shared/context/BadgeContext";

export const useCheckPaymentQueue = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { paymentStatus } = useSelector((state: RootState) => state.global.checkPaymentReducer);
    const badgeContext = useBadgeContext();

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const currentIdRef = useRef<string | null>(null);
    const [hasQueue, setHasQueue] = useState<boolean>(false);
    // badgeContext.removeBadgeTab('SearchTab');
    useEffect(() => {
        const checkQueue = async () => {
            const newId = await storageHelper.getPaymentQueue();
            // console.log(newId);

            if (!newId) {
                setHasQueue(false); 
                currentIdRef.current = null;
                if (intervalRef.current) clearInterval(intervalRef.current);
                return;
            }
            setHasQueue(true);

            if (newId !== currentIdRef.current) {
                currentIdRef.current = newId;

                if (intervalRef.current) clearInterval(intervalRef.current);

                dispatch(checkOrder(newId));

                intervalRef.current = setInterval(() => {
                    dispatch(checkOrder(newId));
                }, 20000);
            }
        };

        const watch = setInterval(checkQueue, 1000);

        return () => {
            clearInterval(watch);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);


    useEffect(() => {
        if (!paymentStatus) return;

        const { return_code } = paymentStatus;

        if ([1, 2, 4].includes(return_code)) {
            storageHelper.clearPaymentQueue();

            if (intervalRef.current) clearInterval(intervalRef.current);
            currentIdRef.current = null;
            badgeContext.removeBadgeTab('SearchTab');
        }


        if (return_code === 3) {
            badgeContext.addBadgeTab('SearchTab');
        }
    }, [paymentStatus]);


    useEffect(() => {
        if (hasQueue) {
            badgeContext.addBadgeTab("SearchTab");
        } else {
            badgeContext.removeBadgeTab("SearchTab");
        }
    }, [hasQueue]);
};

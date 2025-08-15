import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from "src/presentation/store/slices/user-info.slice";
import { AppDispatch, RootState } from "src/presentation/store/store";

export const useUserInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading, error } = useSelector((state: RootState) => state.global.userInfoReducer);

  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch]);

  const fetchUserInfo = useCallback(() => {
    return dispatch(getUserInfo());
  }, [dispatch]);

  return { user: data, isLoading, error,refetch: fetchUserInfo  };
};
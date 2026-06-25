import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './auth.slice';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';

export const rootReducer = combineReducers({ auth: authReducer });

const store = configureStore({ reducer: rootReducer });

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;

import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import { authSlice, taskSlice } from './slice';

export const rootReducer = combineReducers({
  auth: authSlice.reducer,
  tasks: taskSlice.reducer,
});

const store = configureStore({ reducer: rootReducer });

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { store, useAppDispatch, useAppSelector };

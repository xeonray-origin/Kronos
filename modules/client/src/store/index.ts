import { store, useAppDispatch, useAppSelector } from './store';
import { taskSlice, authSlice } from './slice';

const taskActions = taskSlice.actions;
const authActions = authSlice.actions;

export { authActions, taskActions };

export { store, useAppDispatch, useAppSelector };

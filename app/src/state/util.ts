import { Draft } from 'immer';
import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit/dist/createAsyncThunk';
import { RootState } from './index';

type ReducerType<StateSlice, Payload = void> = (state: Draft<StateSlice>, payload: Payload) => void;

type PayloadActionCreator<Payload> = (payload: Payload) => { type: string; payload: Payload };
export type ActionWithReducers<StateSlice, Payload> = PayloadActionCreator<Payload> & {
  reducer: ReducerType<StateSlice, Payload>;
  type: string;
};
export type AsyncActionWithReducers<StateSlice, Returned, ThunkArg> = AsyncThunk<
  Returned,
  ThunkArg,
  Record<string, never>
> & {
  reducers: { [x: string]: ReducerType<StateSlice, Returned | Error | void> };
};

/**
 * This function creates a special type that is both an action creator and contains the corresponding reducer for these actions.
 * This combines two otherwise separate parts. First the action creator which is called with the options for this action and returns
 * an action object which can then be passed into the redux dispatch function. Secondly the reducer which takes an action created by
 * this action creator and modifies the state based on it.
 *
 * Traditionally in redux projects those two would be separate, however we found that it makes more sense to structure our
 * code in a way where action creator and reducer are close to each other. This helper function enables nicer syntax and reduces boilerplate.
 *
 * @param type the string uniquely identifying the action
 * @param reducer the reducer associated with this action
 */
export function createActionWithReducer<StateSlice, Payload = void>(
  type: string,
  reducer: ReducerType<StateSlice, Payload>
): ActionWithReducers<StateSlice, Payload> {
  const actionCreator: PayloadActionCreator<Payload> = (payload) => ({ type, payload });
  return Object.assign(actionCreator, { reducer, type });
}

/**
 * this function works analogous to the way the `createActionReducerPair` function works. the difference is that this
 * function also gets an async thunk function as a argument, so it behaves like an async thunk. the
 * `thunk.rejected`, `thunk.fulfilled`, and `thunk.pending` actions can be handled in the reducer object and are thus
 * called after the thunk code.
 * Beware: Even if you theoretically can dispatch other actions and get the full state in your thunk code, this is a
 * potential foot-gun as you could violate atomicity guarantees in a non-obvious way.
 *
 * @param type the string uniquely identifying the action
 * @param payloadCreator the async function creating the action
 * @param reducer the reducer associated with this action
 */
export function createAsyncActionWithReducer<StateSlice, ThunkArg = void, Returned = void>(
  type: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, { state: RootState }>,
  reducer?: {
    pending?: ReducerType<StateSlice>;
    rejected?: (state: Draft<StateSlice>, error: Error) => void;
    fulfilled?: ReducerType<StateSlice, Returned>;
  }
): AsyncActionWithReducers<StateSlice, Returned, ThunkArg> {
  const thunk = createAsyncThunk<Returned, ThunkArg>(type, payloadCreator);
  const reducers: { [x: string]: ReducerType<StateSlice, Returned | Error | void> } = {};

  if (reducer?.pending) reducers[thunk.pending.type] = reducer.pending;
  if (reducer?.rejected) reducers[thunk.rejected.type] = reducer.rejected;
  if (reducer?.fulfilled) reducers[thunk.fulfilled.type] = reducer.fulfilled;

  return Object.assign(thunk, { reducers });
}

import { createContext, useContext } from "react";

// ! the context object
export const StateContext = createContext();

// !custom hook that wraps useContext
export const useGlobalState = useContext(StateContext);

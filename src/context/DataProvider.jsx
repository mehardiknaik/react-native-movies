import React, { createContext, useContext, useEffect, useReducer } from "react";
import initialState from "./initialState";
import reducer from "./reducer";

const data = createContext();

export const DataProvider = ({ children }) => {
  const [value, dispatch] = useReducer(reducer, initialState);
  return (
    <data.Provider value={{ ...value, dispatch }}>{children}</data.Provider>
  );
};

export const useData = () => useContext(data);

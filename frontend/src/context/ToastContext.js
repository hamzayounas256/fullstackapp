"use client"

import { createContext, useContext, useReducer } from "react"

const ToastContext = createContext()

const initialState = {
  toasts: [],
}

const toastReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [...state.toasts, { ...action.payload, id: Date.now() }],
      }
    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.payload),
      }
    default:
      return state
  }
}

export const ToastProvider = ({ children }) => {
  const [state, dispatch] = useReducer(toastReducer, initialState)

  const addToast = (message, type = "info") => {
    dispatch({
      type: "ADD_TOAST",
      payload: { message, type },
    })
  }

  const removeToast = (id) => {
    dispatch({
      type: "REMOVE_TOAST",
      payload: id,
    })
  }

  const showSuccess = (message) => addToast(message, "success")
  const showError = (message) => addToast(message, "error")
  const showWarning = (message) => addToast(message, "warning")
  const showInfo = (message) => addToast(message, "info")

  const value = {
    toasts: state.toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

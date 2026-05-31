"use client";

import * as React from "react";

const TOAST_LIMIT = 4;
const DEFAULT_DURATION = 5500;

type ToastVariant = "default" | "success" | "destructive" | "info";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  createdAt: number;
}

type Action =
  | { type: "ADD"; toast: Toast }
  | { type: "DISMISS"; toastId: string }
  | { type: "REMOVE"; toastId: string };

interface State {
  toasts: Toast[];
}

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };
const timeouts = new Map<string, ReturnType<typeof setTimeout>>();

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };
    case "DISMISS":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    case "REMOVE":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
}

function scheduleRemove(id: string, duration: number) {
  if (timeouts.has(id)) clearTimeout(timeouts.get(id));
  const timeout = setTimeout(() => {
    dispatch({ type: "REMOVE", toastId: id });
    timeouts.delete(id);
  }, duration);
  timeouts.set(id, timeout);
}

export function toast({
  title,
  description,
  variant = "default",
  duration = DEFAULT_DURATION,
}: Omit<Toast, "id" | "createdAt">) {
  const id = crypto.randomUUID();
  dispatch({
    type: "ADD",
    toast: {
      id,
      title,
      description,
      variant,
      duration,
      createdAt: Date.now(),
    },
  });
  scheduleRemove(id, duration);
  return id;
}

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return {
    toasts: state.toasts,
    toast,
    dismiss: (toastId: string) => {
      if (timeouts.has(toastId)) {
        clearTimeout(timeouts.get(toastId));
        timeouts.delete(toastId);
      }
      dispatch({ type: "DISMISS", toastId });
    },
  };
}

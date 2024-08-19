import { create } from "zustand";

// set method로 상태 변경 가능
export const useMakingStore = create((set) => ({
  route: {
    startPosition: [],
    finishPosition: [],
    json: null,
    routeName: "",
    startImage: null,
    finishImage: null,
    type: "running",
  },
  setRouteName: (name) =>
    set((state) => ({ route: { ...state.route, routeName: name } })),
  setStartImage: (image) =>
    set((state) => ({ route: { ...state.route, startImage: image } })),
  setJson: (json) =>
    set((state) => ({ route: { ...state.route, json: json } })),
  setFinishImage: (image) =>
    set((state) => ({ route: { ...state.route, finishImage: image } })),
  setStartPosition: (position) =>
    set((state) => ({ route: { ...state.route, startPosition: position } })),
  setFinishPosition: (position) =>
    set((state) => ({ route: { ...state.route, finishPosition: position } })),
  setType: (type) =>
    set((state) => ({ route: { ...state.route, type: type } })),
}));

export const useStepStore = create((set) => ({
  step: "startPhoto",
  setStep: (input) => set(() => ({ step: input })),
}));

export const useCurrentMarkerStore = create((set) => ({
  currentMarker: undefined,
  setCurrentMarker: (marker) => set(() => ({ currentMarker: marker })),
}));

export const useStartMarkerStore = create((set) => ({
  startMarker: undefined,
  setStartMarker: (marker) => set(() => ({ startMarker: marker })),
}));

export const useMapStore = create((set) => ({
  map: undefined,
  setMap: (map) => set(() => ({ map: map })),
}));

export const useRecordingStore = create((set) => ({
  recording: false,
  setRecording: (bool) => set(() => ({ recording: bool })),
}));

export const useTimeStore = create((set) => ({
  startTime: 0,
  finishTime: 0,
  setStartTime: (time) => set(() => ({ startTime: time })),
  setFinishTime: (time) => set(() => ({ finishTime: time })),
  resetTime: () => set(() => ({ startTime: 0, finishTime: 0 })),
}));

import { create } from "zustand";

interface StepState {
	currentStep: number;
	setCurrentStep: (step: number) => void;
	coinId: string;
	setCoinId: (coinId: string) => void;
}

export const useStepStore = create<StepState>((set) => ({
	currentStep: 0,
	setCurrentStep: (step: number) => set({ currentStep: step }),
	coinId: "",
	setCoinId: (coinId: string) => set({ coinId }),
}));

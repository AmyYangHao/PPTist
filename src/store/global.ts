import { defineStore } from "pinia";

interface StoreProps {
  selectPoetInfo: API.PoetryListItemProps | null;
  isDisableTopWidget: boolean;
  customPageUrl: string;
}

interface ActionProps {
  increment: () => void;
  decrement: () => void;
}

export const useGlobalStore = defineStore<string, StoreProps, any, ActionProps>("appStore", {
  state: () => ({ selectPoetInfo: null, isDisableTopWidget: false, customPageUrl: "" }),
  actions: {
    increment() {
      console.log("__increment__");
    },
    decrement() {
      console.log("__decrement__");
    },
  },
});

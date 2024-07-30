import { create } from "zustand";
import { persist } from "zustand/middleware";

const usePaymentStore = create(
  persist(
    (set) => ({
      tid: null,
      pgToken: null,
      setTid: (tid) => set({ tid }),
      setPgToken: (pgToken) => set({ pgToken }),
    }),
    {
      name: "payment-store", // 스토리지 키 이름
      getStorage: () => sessionStorage, // 상태를 세션 스토리지에 저장
    },
  ),
);

export default usePaymentStore;

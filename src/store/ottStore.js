import { create } from 'zustand';
import { getOttById } from '../api/ott/ottApi.js';

const useOttStore = create((set) => ({
  ottInfo: null,
  setOttInfo: (ottId) => {
    getOttById(ottId)
      .then(response => {
        set({ ottInfo: response.data });
      })
      .catch(error => {
        console.error("Error fetching OTT data: ", error);
      });
  },
  resetOttInfo: () => set({ ottInfo: null })
}));

export default useOttStore;

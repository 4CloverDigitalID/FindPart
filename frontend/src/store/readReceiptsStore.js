import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useReadReceiptsStore = create(
  persist(
    (set) => ({
      readTimestamps: {},
      markAsRead: (matchId) => set((state) => ({
        readTimestamps: {
          ...state.readTimestamps,
          [matchId]: new Date().toISOString()
        }
      }))
    }),
    {
      name: 'findpart-read-receipts',
    }
  )
)

import { create } from 'zustand'

export const useAuthStore =  create((set) => ({
    auth: {
        email: ''
    },
    setEmail :  (name) => set((state) => ({ auth : {...state.auth, email : name }}))
}))
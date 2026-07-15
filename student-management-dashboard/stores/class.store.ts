import { defineStore } from 'pinia'
import type { ClassFormData } from '~/services/class.service';
import type { Class } from "~/types"

interface ClassState {
    classes: Class[],
    loading: boolean,
    error: string | null
}
export const useClassStore = defineStore("classes" , {
    state: (): ClassState => ({
        classes: [],
        loading: false,
        error: null
    }),

    actions: {
        async fetchClasses() {
            this.loading = true;
            this.error = null;
            try {
                const response = await classService.getAll();
                if(response.success) {
                    this.classes = response.content;
                }
            }catch (e: any) {
                console.log("Failed to load classes: " , e.message);
                this.error = "Fialed to laod classes.";
            }finally {
                this.loading = false;
            }
        },

        async createClass(req: ClassFormData) {
            this.loading = true
            this.error = null

            try {
                const response = await classService.create(req)
                if(response.success) {
                    this.classes.unshift(response.data)
                }
            }catch(e: any) {
                console.log("Failed to create classs: " , e.message)
                this.error = e.message ?? "Failed to create classs"
            }finally {
                this.loading = false
            }
        },

        async updateClass(id: string, req: ClassFormData) {
            this.loading = true
            this.error = null

            try {
                const response = await classService.update(id , req)
                if(response.success) {
                    const updated = response.data
                    const index = this.classes.findIndex((clazz) => clazz.id === id)
                    if(index !== -1) {
                        this.classes[index] = updated
                    }
                }
            }catch(e: any) {
                console.log("Failed to create class: " , e.message)
                this.error = e.message ?? "Failed to create class"
            }finally {
                this.loading = false
            }
        
        }
    }
});
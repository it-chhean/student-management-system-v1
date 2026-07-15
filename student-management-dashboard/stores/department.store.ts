import { de } from "date-fns/locale";
import type { DepartmentFormData } from "~/services/department.service";
import type { Department } from "~/types"

interface DepartmentState {
    departments: Department[];
    selectedDepartment: Department | null;
    loading: boolean;
    error: null | any;   
}

export const useDepartmentStore = defineStore("departments" , {
    state: (): DepartmentState => ({
        departments: [],
        selectedDepartment: null,
        loading: false,
        error: null
    }),
    actions: {
        async fetchById(id: string) {
            this.loading = true;
            this.error = null;
            try {
                const response = await departmentService.getById(id);
                if(response.success) {
                    this.selectedDepartment = response.data;
                }
            }catch(e: any) {
                this.error = e.message || "Failed to load department";
            }finally {
                this.loading = false;
            }
        },
        async fetchDepartment() {
            this.loading = true;
            this.error = null;
            try {
                const response = await departmentService.getAll();
                if(response.success) {
                    this.departments = response.data;
                }
            }catch(e: any) {
                console.log("Failed to load department: " , e.message);
                this.error = e.message || "Failed to load department";
            }finally {
                this.loading = false;
            }
        },

        async createDepartment(req: DepartmentFormData) {
            this.loading = true
            this.error = null
            try {
                const response = await departmentService.create(req);
                if(response.success) {
                    this.departments.unshift(response.data)
                }
            }catch(e: any) {
                console.log("Fail to create department: " , e.message)
                this.error = e.message || "Fail to create department: "
            }finally {
                this.loading = false
            }
        },

        async updateDepartment(id: number, req: DepartmentFormData) {
            this.loading = true
            this.error = null
            try {
                const response = await departmentService.update(id , req)
                if(response.success) {
                    const updated = response.data
                    const index = this.departments.findIndex((department) => department.id === id)
                    if(index !== -1) {
                        this.departments[index] = updated
                    }
                }
            }catch(e: any) {
                this.error = e.message || "Failed to update department";
                console.log(e.message)
            }finally {
                this.loading = false
            }
        }
    }
})
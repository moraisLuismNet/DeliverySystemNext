export interface ICategory {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
}
export interface ICreateCategory {
  name: string;
  description?: string;
}
export interface IUpdateCategory {
  name: string;
  description?: string;
  isActive: boolean;
}

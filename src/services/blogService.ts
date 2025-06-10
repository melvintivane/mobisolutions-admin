// services/vacancyService.ts
import { BlogPost, BlogPostApiResponse } from "../types/blog";
import { API_ENDPOINTS } from "../config/api";


export interface BlogCreateDto {
  title: string;
  description: string;
  companyId: string;
  type: string;
  status: string;
  cityId: number;
  yearsOfExperience: number;
  careerLevel: string;
  educationRequired: string;
  minSalary: number;
  maxSalary: number;
  applicationDeadline: string;
  degreeRequired: string;
  requiredSkillIds: number[];
}


export const createBlog = async ( blogData: BlogCreateDto ): Promise<BlogPost> => {

  const response = await fetch(`${API_ENDPOINTS.BLOGS}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blogData),
  });

  if (!response.ok) {
    throw new Error("Failed to create vacancy");
  }

  return response.json();
};


export const getAllBlogPosts = async (page: number = 0, limit: number = 10): Promise<BlogPostApiResponse> => {

  const response = await fetch(
    `${API_ENDPOINTS.BLOGS}?page=${page}&limit=${limit}`,
  );

  return response.json();
};


export const getVacancyById = async (blogId: string): Promise<BlogPost> => {

  const response = await fetch(`${API_ENDPOINTS.BLOGS}/${blogId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch blog with ID: ${blogId}`);
  }

  return response.json();
};


export const updateVacancy = async ({ id, data }: { id: string; data: BlogPost;}): Promise<BlogPost> => {

  const response = await fetch(`${API_ENDPOINTS.BLOGS}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update blog");
  }

  return response.json();
};

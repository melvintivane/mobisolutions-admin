// Base types for nested objects

export interface BlogPost {
  _id: string;
  authorProfileImg: string;
  blogTitle: string;
  thumb: string;
  status: string;
  authorName: string;
  authorResume: string;
  date: string;
  mainText: string;
  quoteText: string;
  btnText: string;
  btnIcon: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BlogPostApiResponse {
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  posts: BlogPost[];
}

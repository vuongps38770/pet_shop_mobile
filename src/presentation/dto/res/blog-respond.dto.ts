export interface BlogRespondDto {
  _id: string;
  title: string;
  content: string;
  summary: string;
  author: string;
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BlogPaginationRespondDto<T> {
  blogs: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

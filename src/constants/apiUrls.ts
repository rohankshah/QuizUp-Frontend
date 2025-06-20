export const apiUrls = {
  getUser: (id: string) => `/api/auth/users/${id}`,
  getPosts: "/api/posts",
  getPost: (id: string) => `/api/auth/${id}`,
  login: "/api/auth/login",
  getProfile: "/api/auth/profile",

  quiz_categories: "/api/game/categories",
};

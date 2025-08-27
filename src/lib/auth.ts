const API_TOKEN = process.env.API_TOKEN;

export const verifyToken = (token: string) => {
  if (!token || token !== API_TOKEN) {
    throw new Error("Unauthorized");
  }
};

import { api } from "@/lib/api";

export const getAllIndustries = () =>
  api.get('/industries').then(r => r.data.data);
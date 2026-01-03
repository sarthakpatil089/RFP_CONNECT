import axios, { AxiosRequestConfig } from "axios";

const API_BASE_URL = "http://localhost:8080";

export class BaseCrudService {

  private static getAuthConfig(config?: AxiosRequestConfig): AxiosRequestConfig {
    const token =
      localStorage.getItem("auth_token")

    return {
      ...config,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    };
  }


  static async create<T>(entity: string, data: T, config?: AxiosRequestConfig): Promise<any> {
    const url = `${API_BASE_URL}/${entity}`;
    const authConfig = this.getAuthConfig(config);
    const response = await axios.post(url, data, authConfig);
    return response.data as any;
  }

  static async getAll<T>(entity: string, config?: AxiosRequestConfig): Promise<T> {
    const url = `${API_BASE_URL}/${entity}`;
    const authConfig = this.getAuthConfig(config);
    const response = await axios.get(url, authConfig);
    return response.data as T;
  }

  static async getById<T>(entity: string, id: string, config?: AxiosRequestConfig): Promise<T> {
    const url = `${API_BASE_URL}/${entity}/${id}`;
    const authConfig = this.getAuthConfig(config);
    const response = await axios.get(url, authConfig);
    return response.data as T;
  }

  static async update<T>(entity: string, id: string, data: Partial<T>, config?: AxiosRequestConfig): Promise<T> {
    const url = `${API_BASE_URL}/${entity}/${id}`;
    const authConfig = this.getAuthConfig(config);
    const response = await axios.put(url, data, authConfig);
    return response.data as T;
  }

  static async remove(entity: string, id: string, config?: AxiosRequestConfig): Promise<any> {
    const url = `${API_BASE_URL}/${entity}/${id}`;
    const authConfig = this.getAuthConfig(config);
    const response = await axios.delete(url, authConfig);
    return response.data;
  }
}

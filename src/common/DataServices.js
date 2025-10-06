import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import BaseService from "./BaseService";
import httpClient from "../config/AxiosConfig";
import { message } from "antd";

export default class DataService extends BaseService {
  // ==================== COLLECTIONS ====================
  
  useGetCollections = (params = {}) => {
    const { limit, page, published_status } = params;
    const queryClient = useQueryClient();
    
    return useQuery({
      queryKey: ["collections", limit, page, published_status],
      queryFn: async () => {
        try {
          const cache = queryClient.getQueryData(["collections", limit, page, published_status]);
          if (cache) return cache;

          const queryParams = new URLSearchParams();
          if (limit) queryParams.append('limit', limit);
          if (page) queryParams.append('page', page);
          if (published_status) queryParams.append('published_status', published_status);

          const response = await httpClient.get(`/api/data/collections${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
          return this.toResult(response);
        } catch (error) {
          const handleError = this.toResultError(error);
          message.error(handleError?.errorMessage || "Có lỗi xảy ra khi lấy danh sách collections");
          throw error;
        }
      },
      select: (response) => {
        if (response.data) return response.data;
        return response.data;
      },
    });
  };

  useGetCollection = (id) => {
    const queryClient = useQueryClient();
    
    return useQuery({
      queryKey: ["collection", id],
      queryFn: async () => {
        try {
          const cache = queryClient.getQueryData(["collection", id]);
          if (cache) return cache;

          const response = await httpClient.get(`/api/data/collections/${id}`);
          return this.toResult(response);
        } catch (error) {
          const handleError = this.toResultError(error);
          message.error(handleError?.errorMessage || "Có lỗi xảy ra khi lấy thông tin collection");
          throw error;
        }
      },
      select: (response) => {
        if (response.data) return response.data;
        return response.data;
      },
      enabled: !!id, // Only run query if id exists
    });
  };

  useCreateCollection = () => {
    const queryClient = useQueryClient(); 
    
    return useMutation({
      mutationFn: async (variables) => {
        try {
          const response = await httpClient.post(`/api/data/collections`, JSON.stringify(variables));
          return this.toResult(response);
        } catch (error) {
          const handleError = this.toResultError(error);
          message.error(handleError?.errorMessage || "Có lỗi xảy ra, vui lòng thử lại");
          throw error;
        }
      },
      onSuccess: (newData) => {
        if (!newData) return;
        message.success("Tạo collection thành công");
      },
      onError: () => {
        message.error("Có lỗi xảy ra, vui lòng thử lại");
      },
      onSettled: () => {
        queryClient.invalidateQueries(["collections"]);
      }
    });
  };

  useUpdateCollection = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async (variables) => {
        try {
          const { id, ...data } = variables;
          const response = await httpClient.put(`/api/data/collections/${id}`, JSON.stringify(data));
          return this.toResult(response);
        } catch (error) {
          const handleError = this.toResultError(error);
          message.error(handleError?.errorMessage || "Có lỗi xảy ra khi cập nhật collection");
          throw error;
        }
      },
      onSuccess: (newData, variables) => {
        if (!newData) return;
        message.success("Cập nhật collection thành công");
        queryClient.invalidateQueries(["collection", variables.id]);
      },
      onError: () => {
        message.error("Có lỗi xảy ra, vui lòng thử lại");
      },
      onSettled: () => {
        queryClient.invalidateQueries(["collections"]);
      }
    });
  };

  useDeleteCollection = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async (variables) => {
        try {
          const { id } = variables;
          const response = await httpClient.delete(`/api/data/collections/${id}`);
          return this.toResult(response);
        } catch (error) {
          const handleError = this.toResultError(error);
          message.error(handleError?.errorMessage || "Có lỗi xảy ra khi xóa collection");
          throw error;
        }
      },
      onSuccess: () => {
        message.success("Xóa collection thành công");
      },
      onError: () => {
        message.error("Có lỗi xảy ra, vui lòng thử lại");
      },
      onSettled: () => {
        queryClient.invalidateQueries(["collections"]);
      }
    });
  };

  // ==================== PRODUCTS ====================
  
  useGetProducts = (params = {}) => {
    const { limit, page, published_status, collection_id } = params;
    const queryClient = useQueryClient();
    
    return useQuery({
      queryKey: ["products", limit, page, published_status, collection_id],
      queryFn: async () => {
        try {
          const cache = queryClient.getQueryData(["products", limit, page, published_status, collection_id]);
          if (cache) return cache;

          const queryParams = new URLSearchParams();
          if (limit) queryParams.append('limit', limit);
          if (page) queryParams.append('page', page);
          if (published_status) queryParams.append('published_status', published_status);
          if (collection_id) queryParams.append('collection_id', collection_id);

          const response = await httpClient.get(`/api/data/products${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
          return this.toResult(response);
        } catch (error) {
          const handleError = this.toResultError(error);
          message.error(handleError?.errorMessage || "Có lỗi xảy ra khi lấy danh sách sản phẩm");
          throw error;
        }
      },
      select: (response) => {
        if (response.data) return response.data;
        return response.data;
      },
    });
  };

  useGetProduct = (id) => {
    const queryClient = useQueryClient();
    
    return useQuery({
      queryKey: ["product", id],
      queryFn: async () => {
        try {
          const cache = queryClient.getQueryData(["product", id]);
          if (cache) return cache;

          const response = await httpClient.get(`/api/data/products/${id}`);
          return this.toResult(response);
        } catch (error) {
          const handleError = this.toResultError(error);
          message.error(handleError?.errorMessage || "Có lỗi xảy ra khi lấy thông tin sản phẩm");
          throw error;
        }
      },
      select: (response) => {
        if (response.data) return response.data;
        return response.data;
      },
      enabled: !!id, // Only run query if id exists
    });
  };

  useCreateProduct = () => {
    const queryClient = useQueryClient(); 
    
    return useMutation({
      mutationFn: async (variables) => {
        try {
          const response = await httpClient.post(`/api/data/products`, JSON.stringify(variables));
          return this.toResult(response);
        } catch (error) {
          const handleError = this.toResultError(error);
          message.error(handleError?.errorMessage || "Có lỗi xảy ra, vui lòng thử lại");
          throw error;
        }
      },
      onSuccess: (newData) => {
        if (!newData) return;
        message.success("Tạo sản phẩm thành công");
      },
      onError: () => {
        message.error("Có lỗi xảy ra, vui lòng thử lại");
      },
      onSettled: () => {
        queryClient.invalidateQueries(["products"]);
      }
    });
  };

  useUpdateProduct = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async (variables) => {
        try {
          const { id, ...data } = variables;
          const response = await httpClient.put(`/api/data/products/${id}`, JSON.stringify(data));
          return this.toResult(response);
        } catch (error) {
          const handleError = this.toResultError(error);
          message.error(handleError?.errorMessage || "Có lỗi xảy ra khi cập nhật sản phẩm");
          throw error;
        }
      },
      onSuccess: (newData, variables) => {
        if (!newData) return;
        message.success("Cập nhật sản phẩm thành công");
        queryClient.invalidateQueries(["product", variables.id]);
      },
      onError: () => {
        message.error("Có lỗi xảy ra, vui lòng thử lại");
      },
      onSettled: () => {
        queryClient.invalidateQueries(["products"]);
      }
    });
  };

  useDeleteProduct = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async (variables) => {
        try {
          const { id } = variables;
          const response = await httpClient.delete(`/api/data/products/${id}`);
          return this.toResult(response);
        } catch (error) {
          const handleError = this.toResultError(error);
          message.error(handleError?.errorMessage || "Có lỗi xảy ra khi xóa sản phẩm");
          throw error;
        }
      },
      onSuccess: () => {
        message.success("Xóa sản phẩm thành công");
      },
      onError: () => {
        message.error("Có lỗi xảy ra, vui lòng thử lại");
      },
      onSettled: () => {
        queryClient.invalidateQueries(["products"]);
      }
    });
  };
}

export const dataService = new DataService();

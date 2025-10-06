import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import BaseService from "./BaseService";
import httpClient from "../config/AxiosConfig";
import { message } from "antd";

export default class MetafieldsService extends BaseService {
  useGetShop = ({ type, orgid }) => {
    const queryClient = useQueryClient();
    return useQuery({
      queryKey: ["shop", orgid],
      queryFn: async () => {
        try {
          const cache = queryClient.getQueryData(["shop", orgid]);
          if (cache) return cache;

          const response = await httpClient.get(`/api/metafields/shop?type=${type}`); /* prettier-ignore */
          return this.toResult(response);
        } catch (error) {
          const handleError = this.toResultError(error);
          message.error(handleError?.errorMessage).then(() => {
            if (handleError.status == "401") window.location.href = `/install/grandservice?orgid=${orgid}`;
          });
        }
      },
      select: (response) => {
        if (response.data) return response.data;
        return response.data;
      },
    });
  };

  useGetMetafields = (data) => {
    const { type, namespace, objectid } = data;
    const queryClient = useQueryClient();
    return useQuery({
      queryKey: ["metafields", type, namespace, objectid],
      queryFn: async () => {
        try {
          const cache = queryClient.getQueryData(["metafields", type, namespace, objectid]);
          if (cache) return cache;

          const response = await httpClient.get(`/api/metafields?type=${type}&namespace=${namespace}&objectid=${objectid}`); /* prettier-ignore */
          return this.toResult(response);
        } catch (error) {
          const handleError = this.toResultError(error);
          message.error(String(handleError.errorMessage));
          throw error;
        }
      },
      select: (response) => {
        if (response.data) return response.data;
        return response.data;
      },
      staleTime: 5 * 60 * 1000, // Data fresh trong 5 phút
      cacheTime: 10 * 60 * 1000, // Giữ cache 10 phút
      refetchOnWindowFocus: false, // Không refetch khi focus window
      refetchOnMount: false, // Không refetch khi mount nếu có cache
    });
  };

  useCreateField = () => {
    const queryClient = useQueryClient(); 
    return useMutation({
      mutationFn: async (variables) => {
        try {
          const response = await httpClient.post(`/api/metafields`, JSON.stringify(variables));
          return this.toResult(response);
        } catch (error) {
          const handleError = this.toResultError(error);
          message.error("Có lỗi xảy ra, vui lòng thử lại");
        }
      },
      onSuccess: (newData, variables) => {
        if (!newData) return;
        const cache = queryClient.getQueryData(["metafields", variables.type, variables.namespace, variables.objectid]);
        if (!cache) return;
        queryClient.setQueryData(["metafields", variables.type, variables.namespace, variables.objectid], (oddData) => {
          oddData.data.push(newData.data);
          return oddData;
        });
      },
      onError: () => {
        message.error("Có lỗi xảy ra, vui lòng thử lại");
      },
      onSettled: (_data, _error, variables) => {
        // Don't show message here, let the component handle it
        queryClient.invalidateQueries({ queryKey: ["metafields", variables.type, variables.namespace, variables.objectid] });
      }
    });
  };

  useUpdateField = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (variables) => {
        try {
          const response = await httpClient.put(`/api/metafields`, JSON.stringify(variables));
          return this.toResult(response);
        } catch (error) {
          const handleError = this.toResultError(error);
          message.error(String(handleError.errorMessage));
          throw error;
        }
      },
      onSuccess: (newData, variables) => {
        if (!newData) return;
        const cache = queryClient.getQueryData(["metafields", variables.type, variables.namespace, variables.objectid]);
        if (!cache) return;
        queryClient.setQueryData(["metafields", variables.type, variables.namespace, variables.objectid], (oddData) => {
          const findOldMetafield = oddData.data.find((metafield) => metafield.id === variables.metafieldid);
          if (findOldMetafield) {
            // Remove cái cũ, append cái mới
            oddData.data = oddData.data.filter((metafield) => metafield.id !== variables.metafieldid);
            oddData.data.push(newData.data);
          }
          return oddData;
        });
      },
      onError: () => {
        message.error("Có lỗi xảy ra, vui lòng thử lại");
      },
      onSettled: (_data, _error, variables) => {
        // Don't show message here, let the component handle it
        queryClient.invalidateQueries({ queryKey: ["metafields", variables.type, variables.namespace, variables.objectid] });
      }
    });
  };

  useDeleteField = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (variables) => {
        try {
          const response = await httpClient.delete(`/api/metafields?metafieldid=${variables.metafieldid}`);
          return this.toResult(response);
        } catch (error) {
          const handleError = this.toResultError(error);
          message.error(String(handleError.errorMessage));
          throw error;
        }
      },
      onSuccess: (newData, variables) => {
        if (!newData) return;
        const cache = queryClient.getQueryData(["metafields", variables.type, variables.namespace, variables.objectid]);
        if (!cache) return;
        queryClient.setQueryData(["metafields", variables.type, variables.namespace, variables.objectid], (oddData) => {
          const findOldMetafield = oddData.data.find((metafield) => metafield.id === variables.metafieldid);
          if (findOldMetafield) {
            // Remove cái cũ
            oddData.data = oddData.data.filter((metafield) => metafield.id !== variables.metafieldid);
          }
          return oddData;
        });
      },
      onError: () => {
        message.error("Có lỗi xảy ra, vui lòng thử lại");
      },
      onSettled: (_data, _error, variables) => {
        message.success("Xóa Field thành công");
        queryClient.invalidateQueries({ queryKey: ["metafields", variables.type, variables.namespace, variables.objectid] });
      }
    });
  };
}

export const metafieldsService = new MetafieldsService();

export default class BaseService {
  toResult(response) {
    switch (response.status) {
      case 200: {
        return {
          success: true,
          status: response.status,
          data: response.data.data ? response.data.data : null,
          errorCode: response.data.errorCode ? response.data.errorCode : "",
          errorMessage: response.data.errorMessage
            ? response.data.errorMessage
            : "",
        };
      }
      case 201: {
        return {
          success: true,
          status: response.status,
          data: response.data.data ? response.data.data : null,
          errorCode: response.data.errorCode ? response.data.errorCode : "",
          errorMessage: response.data.errorMessage
            ? response.data.errorMessage
            : "",
        };
      }
      case 502: {
        return {
          success: false,
          status: response.status,
          data: null,
          errorCode: "",
          errorMessage: "Không kết nối được server",
        };
      }
      default: {
        return {
          success: false,
          data: null,
          status: response.status,
          errorCode: response.data.errorCode,
          errorMessage: response.data.errorMessage,
        };
      }
    }
  }

  toResultError(error) {
    const response = {
      success: false,
      status: 400,
      data: null,
      errorCode: null,
      errorMessage: null,
    };
    if (error.response) {
      response.errorMessage = error.response.data.errorMessage;
      response.errorCode = error.response.data.errorCode;
      response.status = error.response.status;

      switch (response.status) {
        case 401:
          response.errorMessage = "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại";
          response.errorCode = "Unauthorized";
          break;
        case 400:
          response.errorMessage = "Dữ liệu không hợp lệ";
          response.errorCode = "BadRequest";
          break;
        case 408:
          response.errorMessage = "Đường truyền mạng không ổn định";
          response.errorCode = "RequestTimeout";
          break;
        case 502:
          response.errorMessage = "502 Bad Gateway";
          response.errorCode = "BadGateway";
          break;
        case 503:
          response.errorMessage = "Không tìm thấy thông tin máy chủ";
          response.errorCode = "ServiceUnavailable";
          break;
        case 504:
          response.errorMessage = "Không nhận được phản hồi từ máy chủ";
          response.errorCode = "GatewayTimeout";
          break;
        default:
          break;
      }
    } else {
      response.data = null;
      response.errorCode = null;
      response.errorMessage = null;
    }

    return response;
  }
}

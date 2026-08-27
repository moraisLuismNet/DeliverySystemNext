export type ApiResponseDTO<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
};

export function createOkResponse<T>(data: T, message: string = "Success"): ApiResponseDTO<T> {
  return { success: true, data, message } as ApiResponseDTO<T>;
}

export function createFailResponse<T>(message: string, errors?: string[]): ApiResponseDTO<T> {
  return { success: false, message, errors } as ApiResponseDTO<T>;
}

import { fetchApi } from "../utils/fetch-api";
import { IApiResponse } from "../interfaces/api-response.interface";
import { IWhatsAppMessage, IEmailMessage } from "../interfaces/message.interface";

export const messageService = {
  getWhatsAppMessages: () =>
    fetchApi.get<IApiResponse<IWhatsAppMessage[]>>("messages/whatsapp"),

  getEmailMessages: () =>
    fetchApi.get<IApiResponse<IEmailMessage[]>>("messages/emails"),

  getQrImage: () =>
    fetchApi.get<IApiResponse<{ status: string; qrImage?: string; phone?: string }>>("auth/session/qr"),

  getSessionStatus: () =>
    fetchApi.get<IApiResponse<{ status: string; phone: string | null }>>("auth/session/status"),
};

import { NextResponse } from "next/server";
import { ApiResponse } from "./ApiResponse";

export class ResponseHelper {
  static success<T>(message: string, data?: T, statusCode: number = 200) {
    const response: ApiResponse<T> = { success: true, message, data, statusCode };
    return NextResponse.json(response, { status: statusCode });
  }

  static error(message: string, error?: string, statusCode: number = 500) {
    const response: ApiResponse = { success: false, message, errors: error ? [error] : [], statusCode };
    return NextResponse.json(response, { status: statusCode });
  }

  static noContent() {
    return new NextResponse(null, { status: 204 });
  }

  static created<T>(message: string, data: T) {
    return NextResponse.json({ success: true, message, data, statusCode: 201 }, { status: 201 });
  }

  static badRequest(message: string, errors?: string[]) {
    return NextResponse.json({ success: false, message, errors: errors || [], statusCode: 400 }, { status: 400 });
  }

  static unauthorized(message: string = "Unauthorized") {
    return NextResponse.json({ success: false, message, statusCode: 401 }, { status: 401 });
  }

  static forbidden(message: string = "Forbidden") {
    return NextResponse.json({ success: false, message, statusCode: 403 }, { status: 403 });
  }

  static notFound(message: string = "Resource not found") {
    return NextResponse.json({ success: false, message, statusCode: 404 }, { status: 404 });
  }
}

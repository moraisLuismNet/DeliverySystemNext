import { NextRequest } from "next/server";
import { setupAssociations } from "@/lib/db/models/associations";
import { ResponseHelper } from "@/lib/helpers/ResponseHelper";
import { verifyAuth } from "@/lib/middleware/auth";
import categoryService from "@/lib/services/categoryService";

let initialized = false;
function ensureDb() {
  if (!initialized) { setupAssociations(); initialized = true; }
}

export async function GET(request: NextRequest) {
  try {
    ensureDb();
    const categories = await categoryService.getAllAsync();
    return ResponseHelper.success("Categories retrieved successfully", categories);
  } catch (error: any) {
    return ResponseHelper.error(error.message);
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureDb();
    const user = await verifyAuth(request);
    if (user.role !== "Admin") return ResponseHelper.forbidden();

    const body = await request.json();
    const created = await categoryService.createAsync(body);
    return ResponseHelper.created("Category created successfully", created);
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.badRequest(error.message);
  }
}

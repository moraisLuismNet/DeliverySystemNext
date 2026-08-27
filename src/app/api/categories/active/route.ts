import { NextRequest } from "next/server";
import { setupAssociations } from "@/lib/db/models/associations";
import { ResponseHelper } from "@/lib/helpers/ResponseHelper";
import categoryService from "@/lib/services/categoryService";

let initialized = false;
function ensureDb() {
  if (!initialized) { setupAssociations(); initialized = true; }
}

export async function GET(request: NextRequest) {
  try {
    ensureDb();
    const categories = await categoryService.getActiveAsync();
    return ResponseHelper.success("Active categories retrieved successfully", categories);
  } catch (error: any) {
    return ResponseHelper.error(error.message);
  }
}

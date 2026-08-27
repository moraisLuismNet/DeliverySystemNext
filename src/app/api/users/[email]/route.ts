import { NextRequest } from "next/server";
import { setupAssociations } from "@/lib/db/models/associations";
import { ResponseHelper } from "@/lib/helpers/ResponseHelper";
import { verifyAuth } from "@/lib/middleware/auth";
import userService from "@/lib/services/userService";

let initialized = false;
function ensureDb() {
  if (!initialized) { setupAssociations(); initialized = true; }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ email: string }> }) {
  try {
    ensureDb();
    const user = await verifyAuth(request);
    if (user.role !== "Admin") return ResponseHelper.forbidden();

    const { email } = await params;
    const found = await userService.getByIdAsync(email);
    if (!found) return ResponseHelper.notFound("User not found");
    return ResponseHelper.success("User retrieved successfully", found);
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.error(error.message);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ email: string }> }) {
  try {
    ensureDb();
    const user = await verifyAuth(request);
    if (user.role !== "Admin") return ResponseHelper.forbidden();

    const { email } = await params;
    const body = await request.json();
    const updated = await userService.updateAsync(email, body);
    return ResponseHelper.success("User updated successfully", updated);
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.error(error.message);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ email: string }> }) {
  try {
    ensureDb();
    const user = await verifyAuth(request);
    if (user.role !== "Admin") return ResponseHelper.forbidden();

    const { email } = await params;
    await userService.deleteAsync(email);
    return ResponseHelper.success("User deactivated successfully");
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.error(error.message);
  }
}

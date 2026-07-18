import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user.id) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");
  if (user.role !== "ADMIN") redirect("/");
  return user;
}

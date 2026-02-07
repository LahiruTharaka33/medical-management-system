import AdminSidebar from "@/components/AdminSidebar";
import UsersView from "@/components/UsersView";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getUsers() {
    const users = await prisma.user.findMany({
        where: {
            role: "USER",
        },
        select: {
            id: true,
            name: true,
            email: true,
        },
        orderBy: {
            name: "asc",
        },
    });
    return users;
}

export default async function AdminUsersPage() {
    const users = await getUsers();

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <AdminSidebar />
            {/* Main Content Wrapper - Shifted by sidebar width on desktop */}
            <div className="flex-1 transition-all duration-300 md:ml-64">
                <UsersView initialUsers={users} />
            </div>
        </div>
    );
}

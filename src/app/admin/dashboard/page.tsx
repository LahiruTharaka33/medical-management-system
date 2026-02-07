import AdminSidebar from "@/components/AdminSidebar";
import AccessGroupsView from "@/components/AccessGroupsView";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getAccessGroups() {
  const groups = await prisma.accessGroup.findMany({
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      groupId: 'asc',
    },
  });
  return groups;
}

export default async function AdminDashboardPage() {
  const accessGroups = await getAccessGroups();

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <AdminSidebar />
      {/* Main Content Wrapper - Shifted by sidebar width on desktop */}
      <div className="flex-1 transition-all duration-300 md:ml-64">
        <AccessGroupsView initialAccessGroups={accessGroups} />
      </div>
    </div>
  );
}

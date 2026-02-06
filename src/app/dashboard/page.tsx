import { auth, signOut } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">
        Welcome, {session?.user?.name || session?.user?.email}!
      </p>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button className="flex h-10 items-center justify-center rounded-lg bg-red-500 px-4 text-sm font-medium text-white transition-colors hover:bg-red-400">
          Sign Out
        </button>
      </form>
    </div>
  );
}
// test comment

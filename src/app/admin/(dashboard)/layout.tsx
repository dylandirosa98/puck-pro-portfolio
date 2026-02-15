import AdminNav from "@/components/admin/AdminNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <AdminNav />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </div>
    </div>
  );
}

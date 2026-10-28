import Provider from "@/app/QueryClientProvider";
import { Toaster } from "@/components/ui/sonner";
import AuthGuard from "./AuthGuard";
import LoginRequiredHeader from "./LoginRequiredHeader";

// 管理ページ共通のレイアウト（サイドバー＋本文）
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider>
      <AuthGuard>
        <div className="flex min-h-svh flex-col bg-background text-sm text-foreground md:flex-row">
          <LoginRequiredHeader />
          <main className="flex min-w-0 flex-1 flex-col gap-6 px-4 pt-6 pb-12 md:px-10 md:pt-8 md:pb-16">
            {children}
          </main>
        </div>
      </AuthGuard>
      <Toaster position="bottom-right" />
    </Provider>
  );
};

export default Layout;

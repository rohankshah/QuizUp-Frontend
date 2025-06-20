import { Suspense } from "react";
import Navbar from "../components/Navbar/Navbar";
import Loading from "../components/Loading/page";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Suspense fallback={<Loading />}>
        <main className="h-[calc(100vh-52px)] bg-[#F5F6FA] overflow-y-auto relative px-4 py-3 flex justify-center">
          {children}
        </main>
      </Suspense>
    </div>
  );
};

export default MainLayout;

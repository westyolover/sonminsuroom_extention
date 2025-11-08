import React, { useState } from "react";
import Header from "./components/Header.jsx";
import VideoPage from "./pages/VideoPage.jsx";
import MyPage from "./pages/MyPage.jsx";

const App = () => {
  const [currentPage, setCurrentPage] = useState("main"); // 'main' | 'mypage'

  return (
    <div className="max-w-7xl mx-auto bg-white min-h-screen shadow-lg">
      <Header onNavigate={setCurrentPage} />
      <main className="p-4 sm:p-6 lg:p-8">
        {currentPage === "main" ? <VideoPage /> : <MyPage />}
      </main>
    </div>
  );
};

export default App;
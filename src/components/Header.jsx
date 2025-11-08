import React from "react";

const Header = ({ onNavigate }) => {
  return (
    <header className="border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-between items-center">
        {/* 로고 */}
        <button
          type="button"
          onClick={() => onNavigate("main")}
          className="text-3xl font-bold text-gray-900 cursor-pointer"
        >
          SonMinsoo Room
        </button>

        {/* 네비게이션 */}
        <div className="flex items-center space-x-8 pr-[20px]">
          <button
            type="button"
            onClick={() => onNavigate("mypage")}
            className="text-xl font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
          >
            MY PAGE
          </button>
          <button
            type="button"
            className="text-xl font-medium text-gray-700 hover:text-gray-900"
          >
            LOGIN
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
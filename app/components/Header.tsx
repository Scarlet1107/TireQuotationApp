import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <header className="flex flex-col items-center space-x-8 space-y-4 bg-gray-100 p-4 shadow-md md:flex-row md:space-y-0">
      <Image
        src="/TakeuchiPartLogo.jpg"
        alt="ロゴ"
        width={300}
        height={88}
        className="rounded-lg"
      />
      <h1 className="text-center text-3xl font-bold text-gray-800 md:text-4xl">
        タイヤ見積りアプリ
      </h1>
    </header>
  );
};

export default Header;

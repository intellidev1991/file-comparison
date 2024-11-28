import React, { PropsWithChildren } from "react";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-xl">File Comparison Tool</h1>
      </header>
      <main className="flex-grow p-4">{children}</main>
      <footer className="bg-blue-500 text-white p-4">
        <p>By @ Hamed Taheri</p>
      </footer>
    </div>
  );
};

export default Layout;

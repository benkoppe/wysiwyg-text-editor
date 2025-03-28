"use client";

import dynamic from "next/dynamic";

const EditorComponent = dynamic(() => import("./editor-x/component"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full h-[80vh] p-8">
        <EditorComponent />
      </div>
    </div>
  );
}

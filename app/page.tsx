"use client";

import { useState } from "react";

import dynamic from "next/dynamic";

import { SerializedEditorState } from "lexical";

const Editor = dynamic(
  () => import("@/components/blocks/editor-x/editor").then((mod) => mod.Editor),
  { ssr: false },
);

const initialValue = {
  root: {
    children: [
      {
        detail: 0,
        format: 0,
        style: "",
        text: "Hello World",
        type: "text",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "paragraph",
    version: 1,
  },
  direction: "ltr",
  format: "",
  indent: 0,
  type: "root",
  version: 1,
} as unknown as SerializedEditorState;

export default function Home() {
  const [editorState, setEditorState] =
    useState<SerializedEditorState>(initialValue);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full h-[80vh] p-8">
        <Editor
          editorSerializedState={editorState}
          onSerializedChange={(value) => setEditorState(value)}
        />
      </div>
    </div>
  );
}

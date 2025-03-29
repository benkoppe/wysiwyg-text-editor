import { useState } from "react";
import { SerializedEditorState } from "lexical";
import { Editor } from "@/components/blocks/editor-x/editor";

export default function EditorComponent({
  defaultValue = "",
  placeholder = "",
  onValueChange,
  maxLength = -1,
}: {
  defaultValue?: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
  maxLength?: number;
}) {
  const initialValue = {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: defaultValue,
              type: "text",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "left",
          indent: 0,
          type: "paragraph",
          version: 1,
        },
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  } as unknown as SerializedEditorState;

  const [editorState, setEditorState] =
    useState<SerializedEditorState>(initialValue);

  const handleValueChange = (value: SerializedEditorState) => {
    setEditorState(value);
    if (onValueChange) {
      // handle value change
      const stringified = JSON.stringify(value);
      onValueChange(stringified);
    }
  };

  return (
    <Editor
      editorSerializedState={editorState}
      onSerializedChange={handleValueChange}
      placeholder={placeholder}
      maxLength={maxLength}
    />
  );
}

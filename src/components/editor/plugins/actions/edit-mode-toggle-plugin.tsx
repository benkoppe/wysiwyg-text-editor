import { useState } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LockIcon, UnlockIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function EditModeTogglePlugin() {
    const [editor] = useLexicalComposerContext();
    const [isEditable, setIsEditable] = useState(() => editor.isEditable());

    return (
        <Button
            variant={isEditable ? "outline" : "default"}
            onClick={() => {
                editor.setEditable(!editor.isEditable());
                setIsEditable(editor.isEditable());
            }}
            title="Read-Only Mode"
            aria-label={`${!isEditable ? "Unlock" : "Lock"} read-only mode`}
            size={"sm"}
            className=""
        >
            {isEditable ? (
                <LockIcon className="size-4" />
            ) : (
                <UnlockIcon className="size-4" />
            )}
            {isEditable ? "Lock" : "Unlock"}
        </Button>
    );
}

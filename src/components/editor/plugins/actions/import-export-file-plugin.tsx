import { exportFile, importFile } from "@lexical/file";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { DownloadIcon, FileTextIcon, UploadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ImportExportPlugin() {
    const [editor] = useLexicalComposerContext();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size={"sm"} variant={"outline"} className="p-2">
                    <FileTextIcon className="size-4" />
                    File
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>.lexical File</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onClick={() => importFile(editor)}
                        title="Import"
                        aria-label="Import editor state from JSON"
                    >
                        <DownloadIcon className="size-4" />
                        <span>Import</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => exportFile(editor)}
                        title="Export"
                        aria-label="Export editor state to JSON"
                    >
                        <UploadIcon className="size-4" />
                        <span>Export</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

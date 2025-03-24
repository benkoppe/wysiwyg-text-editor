import { JSX, useState, useEffect } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes } from "@lexical/html";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { FileTextIcon, NotebookPenIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formatHTML = (html: string): string => {
    const div = document.createElement("div");
    div.innerHTML = html.trim();

    const prettify = (node: Element, level: number): Element => {
        const indentBefore = "  ".repeat(level);
        const indentAfter = "  ".repeat(level - 1);
        let textNode;

        // add indentation before each child and recursively format children
        for (let i = 0; i < node.children.length; i++) {
            // Only add newline if it's not the first child of the root div
            if (!(level === 1 && i === 0)) {
                textNode = document.createTextNode("\n" + indentBefore);
                node.insertBefore(textNode, node.children[i]);
            } else {
                // For the first child at level 1, just add indentation without newline
                textNode = document.createTextNode(indentBefore);
                node.insertBefore(textNode, node.children[i]);
            }

            prettify(node.children[i], level + 1);

            // add indentation after the last child
            if (node.lastElementChild === node.children[i]) {
                textNode = document.createTextNode("\n" + indentAfter);
                node.appendChild(textNode);
            }
        }
        return node;
    };
    return prettify(div, 1).innerHTML;
};

export function ExportHtmlMarkdownPlugin(): JSX.Element {
    const [editor] = useLexicalComposerContext();
    const [htmlContent, setHtmlContent] = useState<string>("");
    const [markdownContent, setMarkdownContent] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        if (open) {
            editor.update(() => {
                // export HTML
                const htmlExport = $generateHtmlFromNodes(editor);
                setHtmlContent(formatHTML(htmlExport));

                const markdownExport = $convertToMarkdownString(TRANSFORMERS);
                setMarkdownContent(markdownExport);
            });
        }
    }, [open, editor]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size={"sm"} variant={"outline"} className="p-2">
                    <FileTextIcon className="h-4 w-4" />
                    Export
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[70vw]">
                <DialogHeader>
                    <DialogTitle>Export</DialogTitle>
                </DialogHeader>
                <div className="flex w-full">
                    <Tabs defaultValue="html" className="w-full">
                        <TabsList>
                            <TabsTrigger value="html">HTML</TabsTrigger>
                            <TabsTrigger value="markdown">Markdown</TabsTrigger>
                        </TabsList>
                        <TabsContent value="html">
                            <div className="h-[70vh] rounded-md border p-4 overflow-auto">
                                <pre className="text-sm whitespace-pre-wrap font-mono break-all">
                                    {htmlContent}
                                </pre>
                            </div>
                        </TabsContent>
                        <TabsContent value="markdown">
                            <ScrollArea className="h-[70vh] rounded-md border p-4 overflow-auto">
                                <pre className="text-sm whitespace-pre-wrap font-mono break-all">
                                    {markdownContent}
                                </pre>
                                <ScrollBar />
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}

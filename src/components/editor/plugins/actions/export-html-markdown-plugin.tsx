import { JSX, useState, useEffect } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes } from "@lexical/html";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import {
  CircleCheckIcon,
  CopyIcon,
  DownloadIcon,
  FileTextIcon,
} from "lucide-react";

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
import { useDebounce } from "../../editor-hooks/use-debounce";

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

function TextArea(props: { text: string; exportFile: string }): JSX.Element {
  const [isCopyCompleted, setCopyCompleted] = useState<boolean>(false);

  const removeCopySuccessIcon = useDebounce(() => {
    setCopyCompleted(false);
  }, 1000);

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(props.text);
      setCopyCompleted(true);
      removeCopySuccessIcon();
    } catch (err) {
      console.error("failed to copy: ", err);
    }
  }

  function handleDownload() {
    const blob = new Blob([props.text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = props.exportFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <ScrollArea className="h-[70vh] rounded-md border p-4 overflow-auto">
      <div className="absolute top-2 right-2 flex gap-2 z-10">
        <button
          className="flex shrink-0 cursor-pointer items-center rounded border border-transparent bg-none p-1 uppercase text-foreground/50"
          onClick={handleCopy}
          title="Copy to clipboard"
        >
          {isCopyCompleted ? (
            <CircleCheckIcon className="size-4" />
          ) : (
            <CopyIcon className="size-4" />
          )}
        </button>
        <button
          className="flex shrink-0 cursor-pointer items-center rounded border border-transparent bg-none p-1 uppercase text-foreground/50"
          onClick={handleDownload}
          title="Save as file"
        >
          <DownloadIcon className="size-4" />
        </button>
      </div>
      <pre className="text-sm whitespace-pre-wrap font-mono break-all">
        {props.text}
      </pre>
      <ScrollBar />
    </ScrollArea>
  );
}

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
              <TextArea text={htmlContent} exportFile="content.html" />
            </TabsContent>
            <TabsContent value="markdown">
              <TextArea text={markdownContent} exportFile="content.md" />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}


"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
  Unlink,
} from "lucide-react";
import { useEffect } from "react";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Image.configure({
        allowBase64: false,
        HTMLAttributes: {
          class: "news-editor-image",
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing your story here...",
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none min-h-[320px] px-5 py-4 text-sm leading-7 outline-none focus:outline-none",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="min-h-[360px] animate-pulse rounded-xl border border-slate-200 bg-slate-50" />
    );
  }

  const buttonClass = (active = false) =>
    `inline-flex h-9 w-9 items-center justify-center rounded-lg transition ${
      active
        ? "bg-[#7A1F3D] text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-[#7A1F3D]"
    }`;

  function addLink() {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter the link URL:", previousUrl ?? "https://");

    if (url === null) return;

    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    try {
      const parsed = new URL(url.trim());

      if (!["http:", "https:", "mailto:"].includes(parsed.protocol)) {
        window.alert("Please use a valid HTTP, HTTPS, or mailto link.");
        return;
      }
    } catch {
      window.alert("Please enter a valid link URL.");
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url.trim() })
      .run();
  }

  function addImage() {
    const url = window.prompt("Enter the image URL (HTTPS recommended):");

    if (!url?.trim()) return;

    try {
      const parsed = new URL(url.trim());

      if (!["http:", "https:"].includes(parsed.protocol)) {
        window.alert("Please use an HTTP or HTTPS image URL.");
        return;
      }
    } catch {
      window.alert("Please enter a valid image URL.");
      return;
    }

    const alt = window.prompt("Enter alternative text for accessibility:") ?? "";

    editor.chain().focus().setImage({ src: url.trim(), alt }).run();
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2">
        <button type="button" title="Bold" aria-label="Bold"
          className={buttonClass(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={17} />
        </button>

        <button type="button" title="Italic" aria-label="Italic"
          className={buttonClass(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={17} />
        </button>

        <button type="button" title="Strikethrough" aria-label="Strikethrough"
          className={buttonClass(editor.isActive("strike"))}
          onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough size={17} />
        </button>

        <span className="mx-1 h-6 w-px bg-slate-200" />

        <button type="button" title="Heading 2" aria-label="Heading 2"
          className={buttonClass(editor.isActive("heading", { level: 2 }))}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={17} />
        </button>

        <button type="button" title="Heading 3" aria-label="Heading 3"
          className={buttonClass(editor.isActive("heading", { level: 3 }))}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 size={17} />
        </button>

        <button type="button" title="Bullet list" aria-label="Bullet list"
          className={buttonClass(editor.isActive("bulletList"))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={17} />
        </button>

        <button type="button" title="Numbered list" aria-label="Numbered list"
          className={buttonClass(editor.isActive("orderedList"))}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={17} />
        </button>

        <button type="button" title="Blockquote" aria-label="Blockquote"
          className={buttonClass(editor.isActive("blockquote"))}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={17} />
        </button>

        <span className="mx-1 h-6 w-px bg-slate-200" />

        <button type="button" title="Add link" aria-label="Add link"
          className={buttonClass(editor.isActive("link"))}
          onClick={addLink}>
          <LinkIcon size={17} />
        </button>

        <button type="button" title="Remove link" aria-label="Remove link"
          className={buttonClass()}
          onClick={() => editor.chain().focus().unsetLink().run()}>
          <Unlink size={17} />
        </button>

        <button type="button" title="Insert image by URL" aria-label="Insert image"
          className={buttonClass()}
          onClick={addImage}>
          <ImagePlus size={17} />
        </button>

        <span className="mx-1 h-6 w-px bg-slate-200" />

        <button type="button" title="Undo" aria-label="Undo"
          className={buttonClass()}
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 size={17} />
        </button>

        <button type="button" title="Redo" aria-label="Redo"
          className={buttonClass()}
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 size={17} />
        </button>
      </div>

      <EditorContent editor={editor} />

      <div className="border-t border-slate-100 px-4 py-2 text-xs text-slate-400">
        Use headings to organize the story. Images are currently inserted by URL.
      </div>

      <style jsx global>{`
        .news-editor-image {
          display: block;
          max-width: 100%;
          height: auto;
          margin: 1.25rem auto;
          border-radius: 0.75rem;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #94a3b8;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .ProseMirror h3 {
          font-size: 1.2rem;
          font-weight: 700;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #7a1f3d;
          margin: 1rem 0;
          padding-left: 1rem;
          color: #475569;
        }
        .ProseMirror ul {
          list-style: disc;
          padding-left: 1.5rem;
        }
        .ProseMirror ol {
          list-style: decimal;
          padding-left: 1.5rem;
        }
        .ProseMirror a {
          color: #2457c5;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

import { useRef, forwardRef, useImperativeHandle } from "react";
import { Editor } from "@tinymce/tinymce-react";

const TinyEditor = forwardRef(({ initialValue, onEditorChange, readonly = false }, ref) => {
  const editorRef = useRef(null);

  // Expose setContent method to parent
  useImperativeHandle(ref, () => ({
    setContent: (content) => {
      if (editorRef.current) {
        editorRef.current.setContent(content);
      }
    },
    getContent: () => {
      return editorRef.current ? editorRef.current.getContent() : '';
    }
  }));

  return (
    <Editor
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      onInit={(evt, editor) => (editorRef.current = editor)}
      initialValue={initialValue}
      disabled={readonly}
      init={{
        height: 500,
        menubar: "file edit",
        readonly: readonly ? 1 : 0,
        toolbar: "accordion accordionremove | blocks fontsize | bold italic underline strikethrough | align numlist bullist | outdent indent| link table hr charmap forecolor backcolor removeformat code",
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
        ],
        content_style: readonly ? "body { background-color: #f3f4f6; cursor: not-allowed; }" : "",
        branding: false,
        paste_preprocess: (plugin, args) => {
          args.content = args.content.replace(/<img[^>]*>/gi, '');
        },
        paste_data_images: false
      }}
      onEditorChange={onEditorChange}
    />
  );
});

TinyEditor.displayName = 'TinyEditor';

export default TinyEditor;

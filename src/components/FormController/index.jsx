import { Input, Stack, Skeleton } from "@chakra-ui/react";
import _ from "lodash";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { MantineProvider } from "@mantine/core";
import { RichTextEditor, Link } from "@mantine/tiptap";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import { useEditor } from "@tiptap/react";
import "@mantine/tiptap/styles.css";

export function TextFieldController({
  name,
  defaultValue,
  formatValue = (value) => value,
  formatPreOnChange = (value) => value,
  ...restProps
}) {
  const { control, watch } = useFormContext();
  // console.log("name", name);
  // console.log("auto_cancel_cod_after 2", watch(["auto_cancel_cod_after"]));
  // console.log(name + "1", watch([name]));

  return (
    <Controller
      name={name}
      defaultValue={defaultValue} // Add defaultValue prop
      control={control}
      render={({ field, fieldState }) => {
        return (
          <Input
            {...restProps}
            value={formatValue(field.value)}
            onChange={(e) => {
              const formatedValue = formatPreOnChange(e.target.value);
              field.onChange(formatedValue);
            }}
            error={fieldState.error ? fieldState.error.message : false}
          />
        );
      }}
    />
  );
}

export function RichTextEditorController(props) {
  const { description, setDescription } = props;
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: description,
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
  });

  return (
    <MantineProvider>
      <RichTextEditor
        editor={editor}
        onUpdate={({ editor }) => setDescription(editor.getHTML())}
      >
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Undo />
            <RichTextEditor.Redo />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>
    </MantineProvider>
  );
}

export function SkeletonRowComponent() {
  const row = 3;
  return (
    <Stack>
      {[...Array(row).keys()].map(() => {
        return <Skeleton height={"20px"} />;
      })}
    </Stack>
  );
}

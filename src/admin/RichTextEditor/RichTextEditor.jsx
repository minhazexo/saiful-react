import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useTranslation } from '../../context/LanguageContext';
import './RichTextEditor.css';

const MenuButton = ({ onClick, active, label, title, children }) => (
  <button
    type="button"
    className={`rte-btn ${active ? 'rte-btn-active' : ''}`}
    onClick={onClick}
    title={title}
    aria-label={label}
    aria-pressed={active}
  >
    {children}
  </button>
);

export default function RichTextEditor({ value, onChange, id = 'rte-editor' }) {
  const t = useTranslation();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: t('admin.rte.placeholder') || 'Start writing…' }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        id,
        class: 'rte-content',
        'aria-label': t('admin.rte.contentLabel') || 'Content editor',
      },
    },
  });

  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt(t('admin.rte.imagePrompt') || 'Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt(t('admin.rte.linkPrompt') || 'Enter URL:', previousUrl || '');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="rte-wrapper" role="group" aria-label={t('admin.rte.groupLabel') || 'Editor toolbar'}>
      <div className="rte-toolbar">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          label={t('admin.rte.bold') || 'Bold'}
          title={t('admin.rte.bold') || 'Bold'}
        >
          <strong>B</strong>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          label={t('admin.rte.italic') || 'Italic'}
          title={t('admin.rte.italic') || 'Italic'}
        >
          <em>I</em>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          label={t('admin.rte.strike') || 'Strikethrough'}
          title={t('admin.rte.strike') || 'Strikethrough'}
        >
          <s>S</s>
        </MenuButton>
        <span className="rte-separator" aria-hidden="true" />
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          label={t('admin.rte.h1') || 'Heading 1'}
          title={t('admin.rte.h1') || 'Heading 1'}
        >
          H1
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          label={t('admin.rte.h2') || 'Heading 2'}
          title={t('admin.rte.h2') || 'Heading 2'}
        >
          H2
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          label={t('admin.rte.h3') || 'Heading 3'}
          title={t('admin.rte.h3') || 'Heading 3'}
        >
          H3
        </MenuButton>
        <span className="rte-separator" aria-hidden="true" />
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          label={t('admin.rte.bulletList') || 'Bullet list'}
          title={t('admin.rte.bulletList') || 'Bullet list'}
        >
          •≡
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          label={t('admin.rte.orderedList') || 'Ordered list'}
          title={t('admin.rte.orderedList') || 'Ordered list'}
        >
          1.
        </MenuButton>
        <span className="rte-separator" aria-hidden="true" />
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          label={t('admin.rte.blockquote') || 'Blockquote'}
          title={t('admin.rte.blockquote') || 'Blockquote'}
        >
          ❝
        </MenuButton>
        <MenuButton
          onClick={setLink}
          active={editor.isActive('link')}
          label={t('admin.rte.link') || 'Link'}
          title={t('admin.rte.link') || 'Link'}
        >
          🔗
        </MenuButton>
        <MenuButton
          onClick={addImage}
          active={editor.isActive('image')}
          label={t('admin.rte.image') || 'Image'}
          title={t('admin.rte.image') || 'Image'}
        >
          🖼
        </MenuButton>
        <span className="rte-separator" aria-hidden="true" />
        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          active={false}
          label={t('admin.rte.undo') || 'Undo'}
          title={t('admin.rte.undo') || 'Undo'}
        >
          ↶
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          active={false}
          label={t('admin.rte.redo') || 'Redo'}
          title={t('admin.rte.redo') || 'Redo'}
        >
          ↷
        </MenuButton>
      </div>
      <EditorContent editor={editor} className="rte-editor-content" />
    </div>
  );
}

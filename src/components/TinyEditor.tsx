import React, { useEffect, useRef, useState } from 'react';
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Link as LinkIcon, Code, Eye, Code2 } from 'lucide-react';
import './TinyEditor.css';

declare global {
  interface Window {
    tinymce?: any;
  }
}

interface TinyEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export const TinyEditor: React.FC<TinyEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your structured article content here...',
  minHeight = 360
}) => {
  const editorIdRef = useRef(`tinymce-editor-${Math.random().toString(36).substring(2, 9)}`);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [editorReady, setEditorReady] = useState(false);
  const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');
  const [loadingCdn, setLoadingCdn] = useState(true);
  const editorInstanceRef = useRef<any>(null);

  // Load TinyMCE script from CDN if not already on window
  useEffect(() => {
    if (window.tinymce) {
      setLoadingCdn(false);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.3/tinymce.min.js';
    script.referrerPolicy = 'origin';
    script.async = true;

    script.onload = () => {
      setLoadingCdn(false);
    };

    script.onerror = () => {
      console.warn('Could not load TinyMCE from cdnjs, falling back to local visual toolbar');
      setLoadingCdn(false);
    };

    document.head.appendChild(script);
  }, []);

  // Initialize TinyMCE when script is ready and viewMode is visual
  useEffect(() => {
    if (loadingCdn || !window.tinymce || viewMode !== 'visual') {
      return;
    }

    const id = editorIdRef.current;
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    // Remove any previous instance with this ID
    if (window.tinymce.get(id)) {
      window.tinymce.remove(`#${id}`);
    }

    window.tinymce.init({
      selector: `#${id}`,
      height: minHeight,
      menubar: false,
      branding: false,
      promotion: false,
      plugins: 'link lists table code wordcount autolink',
      toolbar:
        'undo redo | blocks | bold italic underline strikethrough | forecolor backcolor | bullist numlist | alignleft aligncenter alignright alignjustify | link table | blockquote code | removeformat',
      content_style: `
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 15px;
          line-height: 1.65;
          padding: 12px 16px;
          color: ${isDark ? '#e2e8f0' : '#1e293b'};
          background-color: ${isDark ? '#0f172a' : '#ffffff'};
        }
        h2 { font-size: 1.5rem; font-weight: 700; margin-top: 1.2rem; margin-bottom: 0.5rem; color: ${isDark ? '#f8fafc' : '#0f172a'}; }
        h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.4rem; color: ${isDark ? '#f1f5f9' : '#1e293b'}; }
        h4 { font-size: 1.1rem; font-weight: 600; margin-top: 0.8rem; margin-bottom: 0.3rem; }
        p { margin-bottom: 1rem; }
        ul, ol { padding-left: 1.5rem; margin-bottom: 1rem; }
        li { margin-bottom: 0.35rem; }
        blockquote { border-left: 3px solid #1994E2; margin: 1rem 0; padding-left: 1rem; font-style: italic; opacity: 0.9; }
        table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
        th, td { border: 1px solid ${isDark ? '#334155' : '#cbd5e1'}; padding: 8px 12px; }
      `,
      skin: isDark ? 'oxide-dark' : 'oxide',
      content_css: isDark ? 'dark' : 'default',
      placeholder,
      setup: (editor: any) => {
        editorInstanceRef.current = editor;

        editor.on('init', () => {
          editor.setContent(value || '');
          setEditorReady(true);
        });

        editor.on('input change keyup undo redo', () => {
          const content = editor.getContent();
          onChange(content);
        });
      }
    });

    return () => {
      if (window.tinymce && window.tinymce.get(id)) {
        window.tinymce.remove(`#${id}`);
      }
      editorInstanceRef.current = null;
      setEditorReady(false);
    };
  }, [loadingCdn, viewMode, minHeight]);

  // Sync external value changes when switching modes
  const handleToggleMode = () => {
    if (viewMode === 'visual') {
      if (editorInstanceRef.current) {
        const currentContent = editorInstanceRef.current.getContent();
        onChange(currentContent);
      }
      setViewMode('code');
    } else {
      setViewMode('visual');
    }
  };

  // Helper for quick formatting when in code mode
  const applyCodeFormat = (prefix: string, suffix: string = '') => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;
    const updated = value.substring(0, start) + replacement + value.substring(end);
    onChange(updated);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + (selected ? selected.length : 4));
    }, 10);
  };

  return (
    <div className="tiny-editor-wrapper">
      <div className="tiny-editor-top-bar">
        <div className="tiny-editor-badge">
          <span className="tiny-pulse-indicator"></span>
          <strong>Tiny Visual Editor</strong>
          <span className="tiny-version-tag">WYSIWYG 6.8</span>
        </div>

        <div className="tiny-mode-switcher">
          <button
            type="button"
            className={`tiny-switch-btn ${viewMode === 'visual' ? 'active' : ''}`}
            onClick={() => viewMode !== 'visual' && handleToggleMode()}
          >
            <Eye size={13} /> Visual Editor
          </button>
          <button
            type="button"
            className={`tiny-switch-btn ${viewMode === 'code' ? 'active' : ''}`}
            onClick={() => viewMode !== 'code' && handleToggleMode()}
          >
            <Code2 size={13} /> HTML / Markdown Source
          </button>
        </div>
      </div>

      {viewMode === 'code' && (
        <div className="tiny-quick-toolbar">
          <button type="button" title="H2 Heading" onClick={() => applyCodeFormat('## ')}>
            <Heading2 size={14} /> H2
          </button>
          <button type="button" title="H3 Heading" onClick={() => applyCodeFormat('### ')}>
            <Heading3 size={14} /> H3
          </button>
          <button type="button" title="Bold" onClick={() => applyCodeFormat('**', '**')}>
            <Bold size={14} />
          </button>
          <button type="button" title="Italic" onClick={() => applyCodeFormat('*', '*')}>
            <Italic size={14} />
          </button>
          <button type="button" title="Bullet List" onClick={() => applyCodeFormat('- ')}>
            <List size={14} />
          </button>
          <button type="button" title="Numbered List" onClick={() => applyCodeFormat('1. ')}>
            <ListOrdered size={14} />
          </button>
          <button type="button" title="Link" onClick={() => applyCodeFormat('[Link text](', ')')}>
            <LinkIcon size={14} />
          </button>
          <button type="button" title="Code Block" onClick={() => applyCodeFormat('```\n', '\n```')}>
            <Code size={14} />
          </button>
        </div>
      )}

      <div className="tiny-editor-container">
        {viewMode === 'visual' ? (
          <div>
            {loadingCdn && !editorReady && (
              <div className="tiny-loading-skeleton" style={{ height: minHeight }}>
                <div className="tiny-spinner"></div>
                <span>Initializing Tiny Editor...</span>
              </div>
            )}
            <textarea
              id={editorIdRef.current}
              defaultValue={value}
              style={{ display: loadingCdn ? 'none' : 'block', width: '100%', minHeight }}
            />
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            rows={14}
            className="tiny-raw-textarea"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </div>

      <div className="tiny-editor-status-bar">
        <span>Words: {value.trim() ? value.trim().split(/\s+/).length : 0}</span>
        <span>Characters: {value.length}</span>
        <span>Mode: {viewMode === 'visual' ? 'Rich Visual WYSIWYG' : 'Raw HTML/Markdown'}</span>
      </div>
    </div>
  );
};

export default TinyEditor;

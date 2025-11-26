'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { SFSymbol } from '../icons/SFSymbol';

interface ContractEditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
  readOnly?: boolean;
}

export const ContractEditor: React.FC<ContractEditorProps> = ({
  initialContent = '',
  onChange,
  readOnly = false,
}) => {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onChange(newContent);
  };

  const applyFormat = (format: string) => {
    const textarea = document.getElementById('contract-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let newText = '';
    let cursorOffset = 0;

    switch (format) {
      case 'bold':
        newText = `**${selectedText}**`;
        cursorOffset = 2;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        cursorOffset = 1;
        break;
      case 'heading':
        newText = `\n## ${selectedText}\n`;
        cursorOffset = 4;
        break;
      case 'bullet':
        newText = `\n- ${selectedText}`;
        cursorOffset = 3;
        break;
      default:
        return;
    }

    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);
    onChange(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + cursorOffset, start + cursorOffset + selectedText.length);
    }, 0);
  };

  return (
    <div className="bg-white rounded-apple-lg border border-apple-gray-200 overflow-hidden">
      {!readOnly && (
        <div className="border-b border-apple-gray-200 p-3 flex items-center gap-2 bg-apple-gray-50">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => applyFormat('bold')}
            title="Bold"
          >
            <span className="font-bold">B</span>
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => applyFormat('italic')}
            title="Italic"
          >
            <span className="italic">I</span>
          </Button>
          <div className="w-px h-6 bg-apple-gray-300 mx-1" />
          <Button
            size="sm"
            variant="secondary"
            onClick={() => applyFormat('heading')}
            icon="square.and.pencil"
            title="Heading"
          />
          <Button
            size="sm"
            variant="secondary"
            onClick={() => applyFormat('bullet')}
            title="Bullet list"
          >
            •
          </Button>
        </div>
      )}

      <textarea
        id="contract-editor"
        value={content}
        onChange={handleChange}
        readOnly={readOnly}
        className="w-full h-[600px] p-8 font-sans text-apple-gray-900 focus:outline-none resize-none"
        placeholder="Start typing your contract..."
        style={{
          lineHeight: '1.75',
          fontSize: '16px',
        }}
      />
    </div>
  );
};

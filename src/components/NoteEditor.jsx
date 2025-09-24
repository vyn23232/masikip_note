import { useState, useEffect, useRef } from 'react';
import '../styles/NoteEditor.css';
import NotesLogo from '../assets/Notes.png';

function NoteEditor({ note, onUpdateNote, onTogglePin, onDeleteNote, onRestoreNote }) {
  const [content, setContent] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    if (note) {
      setContent(note.content);
    }
  }, [note]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (note && !note.isDeleted) {
      onUpdateNote(note.id, newContent);
    }
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      
      // TODO: Backend Integration - Add tag to blockchain transaction
      // When backend is ready, this should update the note's tags in the blockchain
      
      if (note && !note.tags.includes(newTag)) {
        const updatedNote = {
          ...note,
          tags: [...note.tags, newTag]
        };
        // For now, just update content to trigger a re-render
        // In a full implementation, this would be a separate onUpdateTags function
      }
      
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    // TODO: Backend Integration - Remove tag from blockchain transaction
    if (note) {
      const updatedNote = {
        ...note,
        tags: note.tags.filter(tag => tag !== tagToRemove)
      };
      // In a full implementation, this would be a separate onUpdateTags function
    }
  };

  const handleTogglePin = () => {
    if (note && onTogglePin) {
      onTogglePin(note.id);
    }
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (note && onDeleteNote) {
      onDeleteNote(note.id);
    }
    setShowMenu(false);
  };

  const handleRestore = () => {
    if (note && onRestoreNote) {
      onRestoreNote(note.id);
    }
    setShowMenu(false);
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  if (!note) {
    return (
      <div className="note-editor">
        <div className="no-note-selected">
          <div className="welcome-message">
            <img src={NotesLogo} alt="Masikip Notes" className="welcome-logo" />
            <h2>Welcome to Masikip Notes</h2>
            <p>Select a note to view it here, or create a new note.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="note-editor">
      <div className="note-header">
        <div className="note-info">
          <span className="note-date">{note.date}</span>
          <span className="note-time">{note.time}</span>
        </div>
        <div className="note-actions">
          <button className="action-btn" title="Share">
            <span>↗️</span>
          </button>
          {!note.isDeleted ? (
            <button className="action-btn" title="Delete note" onClick={handleDelete}>
              <span>🗑️</span>
            </button>
          ) : (
            <button className="action-btn" title="Restore note" onClick={handleRestore}>
              <span>♻️</span>
            </button>
          )}
          <div className="menu-container" ref={menuRef}>
            <button className="action-btn" title="More options" onClick={toggleMenu}>
              <span>⋯</span>
            </button>
            {showMenu && (
              <div className="dropdown-menu">
                <button className="menu-item" onClick={handleTogglePin} disabled={note.isDeleted}>
                  {note.isPinned ? (
                    <>
                      <span className="menu-icon">📌</span>
                      <span>Unpin from top</span>
                    </>
                  ) : (
                    <>
                      <span className="menu-icon">📌</span>
                      <span>Pin to top</span>
                    </>
                  )}
                </button>
                <button className="menu-item" onClick={handleDelete} disabled={note.isDeleted}>
                  <span className="menu-icon">🗑️</span>
                  <span>{note.isDeleted ? 'Deleted' : 'Delete note'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {note.isDeleted && (
        <div className="deleted-banner" title={note.deletedAt ? new Date(note.deletedAt).toLocaleString() : ''}>
          This note was deleted and is read-only.
        </div>
      )}

      {/* Tags Section */}
      <div className="tags-section">
        <div className="tags-container">
          {note.tags && note.tags.length > 0 && (
            <div className="tags-list">
              {note.tags.map((tag, index) => (
                <span key={index} className="tag">
                  <span className="tag-text">#{tag}</span>
                  <button 
                    className="tag-remove" 
                    onClick={() => removeTag(tag)}
                    title="Remove tag"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <input
            type="text"
            value={tagInput}
            onChange={handleTagInputChange}
            onKeyPress={handleTagKeyPress}
            placeholder="Add tags (press Enter)"
            className="tag-input"
          />
        </div>
      </div>
      
      <div className="note-content">
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Start typing your note..."
          className="note-textarea"
          readOnly={!!note.isDeleted}
          autoFocus
        />
      </div>
    </div>
  );
}

export default NoteEditor;
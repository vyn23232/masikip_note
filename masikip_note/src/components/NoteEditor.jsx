import { useState, useEffect, useRef } from 'react';
import '../styles/NoteEditor.css';
import NotesLogo from '../assets/Notes.png';

// Pass onDeleteNote as a prop
function NoteEditor({ note, onUpdateNote, onTogglePin, onDeleteNote }) {
  const [content, setContent] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setContent(note ? note.content : '');
  }, [note]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (note) {
      // Use the correct property: note.noteId
      onUpdateNote(note.noteId, newContent);
    }
  };

  const handleTogglePin = () => {
    if (note && onTogglePin) {
      // Use the correct property: note.noteId
      onTogglePin(note.noteId);
    }
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (note && onDeleteNote) {
       // Use the correct property: note.noteId
      onDeleteNote(note.noteId);
    }
    setShowMenu(false);
  }

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
          {/* You can format and display dates from the backend later */}
          <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
        </div>
        <div className="note-actions">
           <button className="action-btn" title="Delete note" onClick={handleDelete}>
            <span>🗑️</span>
          </button>
          <div className="menu-container" ref={menuRef}>
            <button className="action-btn" title="More options" onClick={toggleMenu}>
              <span>⋯</span>
            </button>
            {showMenu && (
              <div className="dropdown-menu">
                <button className="menu-item" onClick={handleTogglePin}>
                  <span className="menu-icon">📌</span>
                  <span>{note.priority === 'High' ? 'Unpin from top' : 'Pin to top'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="note-content">
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Start typing your note..."
          className="note-textarea"
          autoFocus
        />
      </div>
    </div>
  );
}

export default NoteEditor;
import { useState } from 'react';
import '../styles/Sidebar.css';
import NotesLogo from '../assets/Notes.png';

function Sidebar({ notes, onCreateNote, onSelectNote, selectedNoteId }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // FIX 1: State to manage which sections are open independently.
  const [sections, setSections] = useState({
    pinned: true,
    notes: true,
  });

  // FIX 2: New function to toggle individual sections without closing others.
  const toggleSection = (sectionName) => {
    setSections(prevSections => ({
      ...prevSections,
      [sectionName]: !prevSections[sectionName],
    }));
  };

  const filteredNotes = notes.filter(note => {
    const title = (note.title || '').toLowerCase();
    const content = (note.content || '').toLowerCase();
    return title.includes(searchTerm.toLowerCase()) || content.includes(searchTerm.toLowerCase());
  });

  // FIX 3: Ensure we are filtering based on the 'priority' field from the backend.
  const pinnedNotes = filteredNotes.filter(note => note.priority === 'High');
  const regularNotes = filteredNotes.filter(note => note.priority !== 'High');

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <img src={NotesLogo} alt="Masikip Notes" className="app-logo" />
          <span>Masikip Notes</span>
        </div>
        <div className="sidebar-actions">
           <button className="action-btn new-note-btn" onClick={onCreateNote} title="New Note">
            <span>📝</span>
          </button>
        </div>
      </div>

      <div className="search-container">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search all notes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="sidebar-content">
        {/* Pinned Notes Section */}
        <div className="notes-section">
          <div className="section-header" onClick={() => toggleSection('pinned')}>
            <span className={`section-arrow ${sections.pinned ? 'expanded' : ''}`}>▼</span>
            <span className="section-title">Pinned</span>
          </div>
          {sections.pinned && (
            <div className="notes-list">
              {pinnedNotes.length > 0 ? (
                pinnedNotes.map(note => (
                  <div
                    key={note.noteId}
                    className={`note-item ${selectedNoteId === note.noteId ? 'selected' : ''}`}
                    onClick={() => onSelectNote(note.noteId)}
                  >
                    <div className="note-title">📌 {note.title}</div>
                    <div className="note-preview">{note.content ? note.content.substring(0, 100) : 'No content'}</div>
                  </div>
                ))
              ) : (
                <div className="no-notes">No pinned notes</div>
              )}
            </div>
          )}
        </div>

        {/* Regular Notes Section */}
        <div className="notes-section">
          <div className="section-header" onClick={() => toggleSection('notes')}>
            <span className={`section-arrow ${sections.notes ? 'expanded' : ''}`}>▼</span>
            <span className="section-title">Notes</span>
          </div>
          {sections.notes && (
            <div className="notes-list">
              {regularNotes.length > 0 ? (
                regularNotes.map(note => (
                  <div
                    key={note.noteId}
                    className={`note-item ${selectedNoteId === note.noteId ? 'selected' : ''}`}
                    onClick={() => onSelectNote(note.noteId)}
                  >
                    <div className="note-title">{note.title}</div>
                    <div className="note-preview">{note.content ? note.content.substring(0, 100) : ''}</div>
                  </div>
                ))
              ) : (
                <div className="no-notes">No notes found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
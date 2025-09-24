import { useState } from 'react';
import '../styles/Sidebar.css';
import NotesLogo from '../assets/Notes.png';

function Sidebar({ notes, loading, onCreateNote, onSelectNote }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSection, setExpandedSection] = useState('notes');

  // Helper function to get priority emoji
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High': return '🔴';
      case 'Medium': return '🟡';
      case 'Low': return '🟢';
      default: return '🟡';
    }
  };

  const filteredNotes = notes.filter(note =>
    (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     note.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pinnedNotes = filteredNotes.filter(note => note.isPinned && !note.isDeleted);
  const regularNotes = filteredNotes.filter(note => !note.isPinned && !note.isDeleted);
  const trashNotes = filteredNotes.filter(note => note.isDeleted);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <img src={NotesLogo} alt="Masikip Notes" className="app-logo" />
          <span>Masikip Notes</span>
        </div>
        <div className="sidebar-actions">
          <button className="action-btn" title="Sort">
            <span>⇅</span>
          </button>
          <button className="action-btn" title="View options">
            <span>☰</span>
          </button>
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
        {loading ? (
          <div className="loading-notes">
            <div className="loading-spinner">Loading notes...</div>
          </div>
        ) : (
          <>
            <div className="notes-section">
          <div className="section-header" onClick={() => toggleSection('pinned')}>
            <span className={`section-arrow ${expandedSection === 'pinned' ? 'expanded' : ''}`}>
              ▼
            </span>
            <span className="section-title">Pinned</span>
          </div>
          
          {expandedSection === 'pinned' && (
            <div className="notes-list">
              {pinnedNotes.length > 0 ? (
                pinnedNotes.map(note => (
                  <div
                    key={note.id}
                    className={`note-item ${note.isSelected ? 'selected' : ''}`}
                    onClick={() => onSelectNote(note.id)}
                  >
                    <div className="note-title">
                      📌 {getPriorityIcon(note.priority)} {note.title}
                    </div>
                    <div className="note-meta">
                      <span className="note-date">{note.time}</span>
                      <span className="note-status">📄 Notes</span>
                      <span className="note-priority">Priority: {note.priority || 'Medium'}</span>
                    </div>
                    <div className="note-preview">{note.preview}</div>
                  </div>
                ))
              ) : (
                <div className="no-notes">No pinned notes</div>
              )}
            </div>
          )}
        </div>

        <div className="notes-section">
          <div className="section-header" onClick={() => toggleSection('notes')}>
            <span className={`section-arrow ${expandedSection === 'notes' ? 'expanded' : ''}`}>
              ▼
            </span>
            <span className="section-title">Notes</span>
          </div>
          
          {expandedSection === 'notes' && (
            <div className="notes-list">
              {regularNotes.length > 0 ? (
                regularNotes.map(note => (
                  <div
                    key={note.id}
                    className={`note-item ${note.isSelected ? 'selected' : ''}`}
                    onClick={() => onSelectNote(note.id)}
                  >
                    <div className="note-title">
                      {getPriorityIcon(note.priority)} {note.title}
                    </div>
                    <div className="note-meta">
                      <span className="note-date">{note.time}</span>
                      <span className="note-status">📄 Notes</span>
                      <span className="note-priority">Priority: {note.priority || 'Medium'}</span>
                    </div>
                    <div className="note-preview">{note.preview}</div>
                  </div>
                ))
              ) : (
                <div className="no-notes">No notes found</div>
              )}
            </div>
          )}
        </div>

        <div className="notes-section">
          <div className="section-header" onClick={() => toggleSection('trash')}>
            <span className={`section-arrow ${expandedSection === 'trash' ? 'expanded' : ''}`}>
              ▼
            </span>
            <span className="section-title">Trash</span>
          </div>

          {expandedSection === 'trash' && (
            <div className="notes-list">
              {trashNotes.length > 0 ? (
                trashNotes.map(note => (
                  <div
                    key={note.id}
                    className={`note-item ${note.isSelected ? 'selected' : ''}`}
                    onClick={() => onSelectNote(note.id)}
                    title={note.deletedAt ? `Deleted ${new Date(note.deletedAt).toLocaleString()}` : 'Deleted note'}
                  >
                    <div className="note-title">
                      🗑️ {getPriorityIcon(note.priority)} {note.title}
                    </div>
                    <div className="note-meta">
                      <span className="note-date">{note.time}</span>
                      <span className="note-status">Deleted</span>
                      <span className="note-priority">Priority: {note.priority || 'Medium'}</span>
                    </div>
                    <div className="note-preview">{note.preview}</div>
                  </div>
                ))
              ) : (
                <div className="no-notes">Trash is empty</div>
              )}
            </div>
          )}
        </div>
          </>
        )}
      </div>

      <div className="sidebar-footer">
        <button className="folder-btn" title="New Folder">
          📁 New Folder
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
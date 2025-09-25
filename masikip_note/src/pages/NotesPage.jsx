import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import NoteEditor from '../components/NoteEditor';
import '../styles/NotesPage.css';

// The Vite proxy will handle redirecting this to http://localhost:8080
const API_BASE_URL = '/api/notes';

function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  // 1. Fetch all notes from the backend when the component first loads
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error('Failed to fetch notes:', error);
      }
    };
    fetchNotes();
  }, []); // The empty array [] means this effect runs only once on mount

  // 2. CREATE a new note
  const createNewNote = async () => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Note', content: '' }),
      });
      const newNoteFromServer = await response.json();

      setNotes(prevNotes => [newNoteFromServer, ...prevNotes]);
      setSelectedNoteId(newNoteFromServer.noteId); // Use noteId from backend
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const selectNote = (noteId) => {
    setSelectedNoteId(noteId);
  };

  // 3. UPDATE a note
  const updateNote = async (noteId, content) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content }), // Backend expects only content
      });
      const updatedNoteFromServer = await response.json();

      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.noteId === noteId ? updatedNoteFromServer : note // Use noteId
        )
      );
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };
  
  // 4. DELETE a note
  const deleteNote = async (noteId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${noteId}`, { 
        method: 'DELETE' 
      });

      if (response.ok) {
        // Remove the note from the local state to update the UI
        setNotes(prevNotes => prevNotes.filter(note => note.noteId !== noteId));
        setSelectedNoteId(null);
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  // 5. PIN a note
  const togglePin = async (noteId) => {
    const noteToToggle = notes.find(n => n.noteId === noteId);
    if (!noteToToggle) return;
    
    const isCurrentlyPinned = noteToToggle.priority === 'High';
    const newPinStatus = !isCurrentlyPinned;

    try {
      const response = await fetch(`${API_BASE_URL}/${noteId}/priority`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: newPinStatus }),
      });
      const updatedNoteFromServer = await response.json();

      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.noteId === noteId ? updatedNoteFromServer : note
        )
      );
    } catch (error) {
      console.error('Failed to toggle pin:', error);
    }
  };

  const selectedNote = notes.find(note => note.noteId === selectedNoteId);

  return (
    <div className="notes-app">
      <Sidebar 
        notes={notes}
        onCreateNote={createNewNote}
        onSelectNote={selectNote}
        selectedNoteId={selectedNoteId}
      />
      <NoteEditor 
        note={selectedNote}
        onUpdateNote={updateNote}
        onTogglePin={togglePin}
        onDeleteNote={deleteNote}
      />
    </div>
  );
}

export default NotesPage;
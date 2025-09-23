import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import NoteEditor from '../components/NoteEditor';
import '../styles/NotesPage.css';

/**
 * BLOCKCHAIN INTEGRATION ROADMAP
 * ==============================
 * 
 * This component implements the frontend for a blockchain-based notes application.
 * Each note operation will be recorded as a transaction block in the chain.
 * 
 * TRANSACTION TYPES:
 * 
 * 1. CREATE_NOTE - Creates new note transaction block
 *    - noteId: Unique identifier
 *    - title: First line of content
 *    - content: Full note content
 *    - tags: Array of optional tags
 *    - timestamp: Unix timestamp
 *    - metadata: { isPinned, createdAt, lastModified }
 * 
 * 2. UPDATE_NOTE - Updates existing note (creates new block, links to previous)
 *    - noteId: Reference to original note
 *    - title, content: Updated values
 *    - lastModified: Timestamp of edit
 *    - previousHash: Hash of previous version for chain integrity
 * 
 * 3. SET_PRIORITY - Changes note priority/pinning status
 *    - noteId: Note identifier
 *    - isPinned: Boolean priority status
 *    - priorityLevel: 'HIGH' | 'NORMAL'
 * 
 * 4. STYLE_NOTE - Future: Text formatting/styling changes
 * 5. DELETE_NOTE - Future: Note deletion (tombstone transaction)
 * 6. AUTO_SAVE - Future: Automatic save transactions
 * 
 * BACKEND API ENDPOINTS (To be implemented):
 * - POST /api/notes/create - Create note transaction
 * - PUT /api/notes/{id}/update - Update note transaction  
 * - PATCH /api/notes/{id}/priority - Priority change transaction
 * - GET /api/notes - Fetch all notes from blockchain
 * - GET /api/notes/{id}/history - Get note version history
 * 
 * BLOCKCHAIN STRUCTURE:
 * Each transaction will contain:
 * - blockHash: SHA-256 hash of block content
 * - previousHash: Hash of previous block (for chain integrity)
 * - timestamp: Block creation time
 * - transactionData: Note operation data
 * - signature: Digital signature for authenticity
 */

function NotesPage() {
  const [notes, setNotes] = useState([]);
  
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  const createNewNote = () => {
    // Generate unique note with blockchain-ready structure
    const newNote = {
      id: `note-${Date.now()}`, // Will be used as transaction ID in blockchain
      title: 'New Note',
      preview: '',
      content: '',
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(), // Unix timestamp for blockchain transaction
      isSelected: false,
      isPinned: false,
      tags: [] // Optional tags for categorization
    };

    // TODO: Backend Integration - CREATE_NOTE Transaction
    // When backend is ready, replace local state update with API call:
    // 
    // const transactionData = {
    //   type: 'CREATE_NOTE',
    //   noteId: newNote.id,
    //   title: newNote.title,
    //   content: newNote.content,
    //   tags: newNote.tags,
    //   timestamp: newNote.timestamp,
    //   metadata: {
    //     isPinned: newNote.isPinned,
    //     createdAt: newNote.timestamp,
    //     lastModified: newNote.timestamp
    //   }
    // };
    // 
    // try {
    //   const response = await fetch('/api/notes/create', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(transactionData)
    //   });
    //   const blockchainResponse = await response.json();
    //   // blockchainResponse should contain: blockHash, transactionId, timestamp
    // } catch (error) {
    //   console.error('Failed to create note transaction:', error);
    // }

    // Frontend-only implementation (current)
    const updatedNotes = notes.map(note => ({ ...note, isSelected: false }));
    updatedNotes.unshift({ ...newNote, isSelected: true });
    setNotes(updatedNotes);
    setSelectedNoteId(newNote.id);
  };

  const selectNote = (noteId) => {
    const updatedNotes = notes.map(note => ({
      ...note,
      isSelected: note.id === noteId
    }));
    setNotes(updatedNotes);
    setSelectedNoteId(noteId);
  };

  const updateNote = (noteId, content) => {
    const updatedNotes = notes.map(note => {
      if (note.id === noteId) {
        const lines = content.split('\n');
        const title = lines[0] || 'New Note';
        
        // Generate preview from content excluding the first line (title)
        const contentWithoutTitle = lines.slice(1).join('\n').trim();
        const preview = contentWithoutTitle.slice(0, 100) + (contentWithoutTitle.length > 100 ? '...' : '');
        
        // TODO: Backend Integration - UPDATE_NOTE Transaction
        // When backend is ready, replace local state update with API call:
        // 
        // const transactionData = {
        //   type: 'UPDATE_NOTE',
        //   noteId: noteId,
        //   title: title,
        //   content: content,
        //   lastModified: Date.now(),
        //   previousHash: note.blockHash, // Reference to previous version
        //   metadata: {
        //     wordCount: content.split(' ').length,
        //     characterCount: content.length,
        //     lastEditTime: new Date().toISOString()
        //   }
        // };
        // 
        // try {
        //   const response = await fetch(`/api/notes/${noteId}/update`, {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(transactionData)
        //   });
        //   const blockchainResponse = await response.json();
        //   // Creates new block linking to previous version
        // } catch (error) {
        //   console.error('Failed to update note transaction:', error);
        // }
        
        return {
          ...note,
          title: title.toUpperCase(),
          preview,
          content,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          lastModified: Date.now() // Track modification timestamp for blockchain
        };
      }
      return note;
    });
    setNotes(updatedNotes);
  };

  const togglePin = (noteId) => {
    const updatedNotes = notes.map(note => {
      if (note.id === noteId) {
        // TODO: Backend Integration - SET_PRIORITY Transaction
        // When backend is ready, replace local state update with API call:
        // 
        // const transactionData = {
        //   type: 'SET_PRIORITY',
        //   noteId: noteId,
        //   isPinned: !note.isPinned,
        //   priorityLevel: !note.isPinned ? 'HIGH' : 'NORMAL',
        //   timestamp: Date.now(),
        //   previousHash: note.blockHash
        // };
        // 
        // try {
        //   const response = await fetch(`/api/notes/${noteId}/priority`, {
        //     method: 'PATCH',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(transactionData)
        //   });
        //   const blockchainResponse = await response.json();
        // } catch (error) {
        //   console.error('Failed to update priority transaction:', error);
        // }
        
        return {
          ...note,
          isPinned: !note.isPinned,
          lastModified: Date.now()
        };
      }
      return note;
    });
    setNotes(updatedNotes);
  };

  const selectedNote = notes.find(note => note.id === selectedNoteId);

  return (
    <div className="notes-app">
      <Sidebar 
        notes={notes}
        onCreateNote={createNewNote}
        onSelectNote={selectNote}
      />
      <NoteEditor 
        note={selectedNote}
        onUpdateNote={updateNote}
        onTogglePin={togglePin}
      />
    </div>
  );
}

export default NotesPage;
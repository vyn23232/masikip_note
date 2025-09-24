// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class NoteService {
  // Helper method for making API calls
  async makeRequest(url, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle no content responses (like DELETE)
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Create a new note
  async createNote(title, content = '') {
    const requestData = {
      title: title,
      content: content
    };

    console.log('Creating note with data:', requestData);

    console.log('CREATE_NOTE Transaction:', {
      type: 'CREATE_NOTE',
      title: title,
      content: content,
      timestamp: Date.now(),
      blockHash: `hash-${Date.now()}`
    });

    const result = await this.makeRequest('/notes', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
    
    console.log('Create note result:', result);
    return result;
  }

  // Get all notes
  async getAllNotes() {
    return await this.makeRequest('/notes', {
      method: 'GET'
    });
  }

  // Update note content
  async updateNote(noteId, content) {
    console.log('noteService.updateNote called with:', { noteId, content });
    
    if (!noteId || noteId === 'undefined') {
      throw new Error('Invalid noteId: ' + noteId);
    }
    
    const requestData = {
      content: content
    };

    console.log('UPDATE_NOTE Transaction:', {
      type: 'UPDATE_NOTE',
      noteId: noteId,
      content: content,
      timestamp: Date.now(),
      blockHash: `hash-${Date.now()}`
    });

    return await this.makeRequest(`/notes/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify(requestData)
    });
  }

  // Update note priority (isPinned status)
  async updateNotePriority(noteId, isPinned) {
    console.log('updateNotePriority called with:', { noteId, isPinned });
    
    if (!noteId || noteId === 'undefined') {
      throw new Error('Invalid noteId for priority update: ' + noteId);
    }
    
    const requestData = {
      isPinned: isPinned
    };

    console.log('SET_PRIORITY Transaction:', {
      type: 'SET_PRIORITY',
      noteId: noteId,
      isPinned: isPinned,
      priority: isPinned ? 'High' : 'Medium',
      timestamp: Date.now(),
      blockHash: `hash-${Date.now()}`
    });

    return await this.makeRequest(`/notes/${noteId}/priority`, {
      method: 'PATCH',
      body: JSON.stringify(requestData)
    });
  }

  // Alternative method to update priority directly (if you want to add this endpoint later)
  async updateNotePriorityDirect(noteId, priority) {
    console.log('updateNotePriorityDirect called with:', { noteId, priority });
    
    if (!noteId || noteId === 'undefined') {
      throw new Error('Invalid noteId for priority update: ' + noteId);
    }
    
    const requestData = {
      priority: priority
    };

    return await this.makeRequest(`/notes/${noteId}/priority-direct`, {
      method: 'PATCH', 
      body: JSON.stringify(requestData)
    });
  }

  // Delete a note
  async deleteNote(noteId) {
    console.log('DELETE_NOTE Transaction:', {
      type: 'DELETE_NOTE',
      noteId: noteId,
      timestamp: Date.now(),
      blockHash: `hash-${Date.now()}`
    });

    return await this.makeRequest(`/notes/${noteId}`, {
      method: 'DELETE'
    });
  }

  // Transform backend note to frontend format
  transformNote(backendNote) {
    console.log('Raw backend note:', JSON.stringify(backendNote, null, 2));
    
    if (!backendNote) {
      throw new Error('Backend note is null or undefined');
    }
    
    // Your backend uses 'noteId' not 'id'
    const noteId = backendNote.noteId || backendNote.id;
    if (!noteId) {
      console.error('Backend note missing noteId:', backendNote);
      throw new Error('Backend note missing noteId');
    }
    
    const now = new Date();
    // Your backend uses 'updatedAt' not 'lastModified'
    const noteDate = new Date(backendNote.updatedAt || backendNote.createdAt || now);
    
    console.log('Backend isActive value:', backendNote.isActive, 'type:', typeof backendNote.isActive);
    console.log('Backend active field:', backendNote.active, 'type:', typeof backendNote.active);
    
    // Handle different possible field names for active status
    const isActive = backendNote.isActive !== undefined ? backendNote.isActive : backendNote.active;
    const isDeleted = isActive === false;
    
    console.log('Final isActive:', isActive, 'isDeleted:', isDeleted);
    
    const transformed = {
      id: noteId, // Map noteId to id for frontend
      title: (backendNote.title || 'Untitled').toUpperCase(),
      content: backendNote.content || '',
      preview: this.generatePreview(backendNote.content || ''),
      date: noteDate.toLocaleDateString(),
      time: noteDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date(backendNote.createdAt || now).getTime(),
      lastModified: new Date(backendNote.updatedAt || now).getTime(),
      // Map priority string to isPinned boolean for backwards compatibility
      isPinned: backendNote.priority === 'High',
      priority: backendNote.priority || 'Medium', // Use actual priority field from backend
      isDeleted: isDeleted, // Use calculated value
      isSelected: false,
      tags: backendNote.tags || [],
      deletedAt: isDeleted ? new Date(backendNote.updatedAt || now).getTime() : undefined
    };
    
    console.log('Transformed note:', transformed);
    return transformed;
  }

  // Generate preview from content
  generatePreview(content) {
    if (!content) return '';
    
    const lines = content.split('\n');
    const contentWithoutTitle = lines.slice(1).join('\n').trim();
    return contentWithoutTitle.slice(0, 100) + (contentWithoutTitle.length > 100 ? '...' : '');
  }

  // Transform frontend priority to backend isPinned (for API compatibility)
  priorityToPinned(priority) {
    return priority === 'High';
  }

  // Transform backend priority to frontend priority
  backendPriorityToFrontend(backendPriority) {
    // Use the actual priority from backend, fallback to Medium
    return backendPriority || 'Medium';
  }

  // Transform backend isPinned to frontend priority (for API responses)
  pinnedToPriority(isPinned) {
    return isPinned ? 'High' : 'Medium';
  }
}

// Export a singleton instance
export default new NoteService();
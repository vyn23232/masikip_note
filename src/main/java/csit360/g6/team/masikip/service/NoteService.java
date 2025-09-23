
package csit360.g6.team.masikip.service;

import csit360.g6.team.masikip.model.ActionType;
import csit360.g6.team.masikip.model.Note;
import csit360.g6.team.masikip.model.NoteTransaction;
import csit360.g6.team.masikip.repository.NoteRepository;
import csit360.g6.team.masikip.repository.NoteTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private NoteTransactionRepository noteTransactionRepository;

    /**
     * Creates a new note and logs the creation as the first transaction in its history.
     * This method is transactional, meaning both operations (creating the note and its transaction log)
     * must succeed together. If one fails, the other is rolled back.
     */

    @Transactional
    public Note createNote(String title, String content) {
        // Step 1: Create and save the new Note entity.
        Note newNote = new Note();
        newNote.setTitle(title);
        newNote.setContent(content);
        newNote.setCreatedAt(LocalDateTime.now());
        newNote.setUpdatedAt(LocalDateTime.now());
        newNote.setActive(true);
        newNote.setPriority("Medium");

        // We save the note first to get its generated ID from the database.
        Note savedNote = noteRepository.save(newNote);

        // Step 2: Create and save the corresponding "CREATE_NOTE" transaction.
        NoteTransaction transaction = new NoteTransaction();
        transaction.setNoteId(savedNote.getNoteId());
        transaction.setActionType(ActionType.CREATE_NOTE);
        transaction.setContentBefore(null);
        transaction.setContentAfter(content);
        transaction.setTimestamp(LocalDateTime.now());
        transaction.setMetadata("Note created with title: '" + title + "'");

        noteTransactionRepository.save(transaction);

        return savedNote;
    }
}
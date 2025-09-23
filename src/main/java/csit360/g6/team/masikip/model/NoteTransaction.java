// NoteTransaction.java

package com.example.notesapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "note_transactions")
public class NoteTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId; // Unique ID for this transaction

    @Column(nullable = false)
    private Long noteId; // The ID of the note this transaction belongs to

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActionType actionType; // e.g., CREATE_NOTE, UPDATE_NOTE

    @Column(columnDefinition = "TEXT")
    private String contentBefore; // The state of the content *before* this transaction

    @Column(columnDefinition = "TEXT")
    private String contentAfter; // The state of the content *after* this transaction

    @Column(nullable = false)
    private LocalDateTime timestamp; // When the transaction occurred

    private String metadata; // Optional field for other data (e.g., priority change, style)

    // --- Getters and Setters ---

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public Long getNoteId() {
        return noteId;
    }

    public void setNoteId(Long noteId) {
        this.noteId = noteId;
    }

    public ActionType getActionType() {
        return actionType;
    }

    public void setActionType(ActionType actionType) {
        this.actionType = actionType;
    }

    public String getContentBefore() {
        return contentBefore;
    }

    public void setContentBefore(String contentBefore) {
        this.contentBefore = contentBefore;
    }

    public String getContentAfter() {
        return contentAfter;
    }

    public void setContentAfter(String contentAfter) {
        this.contentAfter = contentAfter;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getMetadata() {
        return metadata;
    }

    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }
}

// We also need an Enum to define the types of actions
enum ActionType {
    CREATE_NOTE,
    UPDATE_NOTE,
    DELETE_NOTE,
    SET_PRIORITY,
    STYLE_NOTE,
    AUTO_SAVE
}
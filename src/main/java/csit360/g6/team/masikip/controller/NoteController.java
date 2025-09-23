
package csit360.g6.team.masikip.controller;

import csit360.g6.team.masikip.dto.CreateNoteRequest;
import csit360.g6.team.masikip.model.Note;
import csit360.g6.team.masikip.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @PostMapping
    public ResponseEntity<Note> createNote(@RequestBody CreateNoteRequest request) {
        Note createdNote = noteService.createNote(request.getTitle(), request.getContent());
        return new ResponseEntity<>(createdNote, HttpStatus.CREATED);
    }
}
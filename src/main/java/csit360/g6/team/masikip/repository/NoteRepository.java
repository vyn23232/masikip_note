package csit360.g6.team.masikip.repository;

import csit360.g6.team.masikip.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    @Query("SELECT n FROM Note n WHERE n.isActive = true")
    List<Note> findByIsActiveTrue();

}
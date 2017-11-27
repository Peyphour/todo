package fr.bnancy.todo.data

import org.springframework.format.annotation.DateTimeFormat
import java.time.Instant
import java.util.*
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id

@Entity
data class Todo(
        @Id
        @GeneratedValue
        var id: Long = 0,
        var title: String = "",
        var description: String = "",
        @DateTimeFormat(pattern = "yyyy-MM-dd")
        var dueDate: Date = Date.from(Instant.now()),
        var priority: TodoPriority = TodoPriority.NORMAL,
        var status: TodoStatus = TodoStatus.TODO
)
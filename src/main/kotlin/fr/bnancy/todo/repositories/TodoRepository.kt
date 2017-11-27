package fr.bnancy.todo.repositories

import fr.bnancy.todo.data.Todo
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface TodoRepository: CrudRepository<Todo, Long> {
    fun findByDueDateBetween(
            @Param("before") @DateTimeFormat(pattern = "yyyy-MM-dd") before: Date,
            @Param("after") @DateTimeFormat(pattern = "yyyy-MM-dd") after: Date
    ): List<Todo>
}
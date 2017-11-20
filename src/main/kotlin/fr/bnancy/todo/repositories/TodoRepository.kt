package fr.bnancy.todo.repositories

import fr.bnancy.todo.data.Todo
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface TodoRepository: CrudRepository<Todo, Long>
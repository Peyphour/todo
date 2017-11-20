package fr.bnancy.todo

import fr.bnancy.todo.data.Todo
import org.springframework.data.repository.CrudRepository

interface TodoRepository: CrudRepository<Todo, Long>
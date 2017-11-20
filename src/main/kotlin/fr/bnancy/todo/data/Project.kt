package fr.bnancy.todo.data

import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id

@Entity
data class Project(
        @Id
        @GeneratedValue
        var id: Long = 0,
        var title: String = "",
        var todos: List<Todo> = emptyList()
)
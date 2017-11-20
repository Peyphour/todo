package fr.bnancy.todo.data

import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.OneToMany

@Entity
data class Project(
        @Id
        @GeneratedValue
        var id: Long = 0,
        var title: String = "",
        @OneToMany
        var todos: List<Todo> = emptyList()
)
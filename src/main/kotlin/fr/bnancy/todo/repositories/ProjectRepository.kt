package fr.bnancy.todo.repositories

import fr.bnancy.todo.data.Project
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface ProjectRepository: CrudRepository<Project, Long>
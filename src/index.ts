import { db } from './database/knex';
import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
  try {
    res.status(200).send({ message: "Pong!" })
  } catch (error) {
    console.log(error)

    if (req.statusCode === 200) {
      res.status(500)
    }

    if (error instanceof Error) {
      res.send(error.message)
    } else {
      res.send("Erro inesperado")
    }
  }
})

/* USERS */

app.get("/users", async (req: Request, res: Response) => {
  try {

    const result = await db("users")
    res.status(200).send(result)

  } catch (error) {
    console.log(error)

    if (req.statusCode === 200) {
      res.status(500)
    }

    if (error instanceof Error) {
      res.send(error.message)
    } else {
      res.send("Erro inesperado")
    }
  }
})

app.post("/users", async (req: Request, res: Response) => {
  try {
    const id = req.body.id
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    if (!id || !name || !email || !password) {
      res.status(400)
      throw new Error("todos os dados são obrigatórios, por favor insira um id, name, email e password válidos.")
    }

    if (id) {
      if (typeof id !== "string") {
        res.status(400)
        throw new Error("'id' deve ser uma string.")
      }
    }

    if (name) {
      if (typeof name !== "string") {
        res.status(400)
        throw new Error("'name' deve ser uma string.")
      }
    }

    if (email) {
      if (typeof email !== "string") {
        res.status(400)
        throw new Error("'email' deve ser uma string.")
      }
    }

    if (password) {
      if (typeof password !== "string") {
        res.status(400)
        throw new Error("'password' deve ser uma string.")
      }
    }

    const newUser = {
      id: id,
      name: name,
      email: email,
      password: password
    }

    await db("users").insert(newUser)
    res.status(200).send({ message: "User adicionado com sucesso!" })

  } catch (error) {
    console.log(error)

    if (req.statusCode === 200) {
      res.status(500)
    }

    if (error instanceof Error) {
      res.send(error.message)
    } else {
      res.send("Erro inesperado")
    }
  }
})

app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const idToDelete = req.params.id

    const [user] = await db("users").where({ id: idToDelete })

    if (user) {

      await db("users").del().where({ id: idToDelete })

    } else {
      res.status(400)
      throw new Error("'id' não encontrada.")
    }

    res.status(200).send({message: "User deletado com sucesso."})

  } catch (error) {
    console.log(error)

    if (req.statusCode === 200) {
      res.status(500)
    }

    if (error instanceof Error) {
      res.send(error.message)
    } else {
      res.send("Erro inesperado")
    }
  }
})

/* TASKS */

app.get("/tasks", async (req: Request, res: Response) => {
  try {

    const result = await db("tasks")
    res.status(200).send(result)

  } catch (error) {
    console.log(error)

    if (req.statusCode === 200) {
      res.status(500)
    }

    if (error instanceof Error) {
      res.send(error.message)
    } else {
      res.send("Erro inesperado")
    }
  }
})

app.post("/tasks", async (req: Request, res: Response) => {
  try {
    const id = req.body.id
    const title = req.body.title
    const description = req.body.description


    if (!id || !title || !description) {
      res.status(400)
      throw new Error("todos os dados são obrigatórios, por favor insira um id, title e description válidos.")
    }

    if (id) {
      if (typeof id !== "string") {
        res.status(400)
        throw new Error("'id' deve ser uma string.")
      }
    }

    if (title) {
      if (typeof title !== "string") {
        res.status(400)
        throw new Error("'title' deve ser uma string.")
      }
    }

    if (description) {
      if (typeof description !== "string") {
        res.status(400)
        throw new Error("'description' deve ser uma string.")
      }
    }

    const newTask = {
      id: id,
      title: title,
      description: description
    }

    await db("tasks").insert(newTask)
    res.status(200).send({ message: "Task adicionada com sucesso!" })

  } catch (error) {
    console.log(error)

    if (req.statusCode === 200) {
      res.status(500)
    }

    if (error instanceof Error) {
      res.send(error.message)
    } else {
      res.send("Erro inesperado")
    }
  }
})

app.put("/tasks/:id", async (req: Request, res: Response) => {
  try {
    const idToEdit = req.params.id

    const newId = req.body.id
    const newTitle = req.body.title
    const newDescription = req.body.description

    if (newId !== undefined) {
      if (typeof newId !== "string") {
        res.status(400)
        throw new Error("'id' deve ser uma string.")
      }
      if (newId.length < 1) {
        res.status(400)
        throw new Error("'id' deve conter no mínimo 1 caractere.")
      }
    }

    if (newTitle !== undefined) {
      if (typeof newTitle !== "string") {
        res.status(400)
        throw new Error("'title' deve ser uma string.")
      }
      if (newTitle.length < 1) {
        res.status(400)
        throw new Error("'title' deve conter no mínimo 1 caractere.")
      }
    }

    if (newDescription !== undefined) {
      if (typeof newDescription !== "string") {
        res.status(400)
        throw new Error("'description' deve ser uma string.")
      }
      if (newDescription.length < 1) {
        res.status(400)
        throw new Error("'description' deve conter no mínimo 1 caractere.")
      }
    }

    const [task] = await db("tasks").where({ id: idToEdit })

    if (task) {

      const updatedTask = {
        id: newId || task.id,
        title: newTitle || task.title,
        description: newDescription || task.description
      }

      await db("tasks").update(updatedTask).where({ id: idToEdit })

    } else {
      res.status(400)
      throw new Error("'id' não encontrada")
    }

    res.status(200).send({ message: "Atualização realizada com sucesso." })

  } catch (error) {
    console.log(error)

    if (req.statusCode === 200) {
      res.status(500)
    }

    if (error instanceof Error) {
      res.send(error.message)
    } else {
      res.send("Erro inesperado")
    }
  }
})

app.delete("/tasks/:id", async (req: Request, res: Response) => {
  try {
    const idToDelete = req.params.id

    const [task] = await db("tasks").where({ id: idToDelete })

    if (!task) {
      res.status(400)
      throw new Error("'id' não encontrada.")
    }

    await db("tasks").del().where({ id: idToDelete })

    res.status(200).send({message: "Task deletado com sucesso."})

  } catch (error) {
    console.log(error)

    if (req.statusCode === 200) {
      res.status(500)
    }

    if (error instanceof Error) {
      res.send(error.message)
    } else {
      res.send("Erro inesperado")
    }
  }
})

/* TASKS TO USERS */

app.get("/tasks/users", async (req: Request, res: Response) => {
  try {

    const result = await db("tasks")
      .select(
        "tasks.id AS taskId",
        "title", 
        "description", 
        "created_at AS createdAt", 
        "status", 
        "user_id AS userId", 
        "name", 
        "email", 
        "password"
      )
      .leftJoin("users_tasks", "users_tasks.task_id", "=", "tasks.id")
      .leftJoin("users", "users_tasks.user_id", "=", "users.id")


    res.status(200).send(result)

  } catch (error) {
    console.log(error)

    if (req.statusCode === 200) {
      res.status(500)
    }

    if (error instanceof Error) {
      res.send(error.message)
    } else {
      res.send("Erro inesperado")
    }
  }
})


app.delete("/tasks/:taskId/users/:userId", async (req: Request, res: Response) => {
  try {

    const userIdToDelete = req.params.userId
    const taskIdToDelete = req.params.taskId

    const [ task ] = await db("tasks").where({id: taskIdToDelete})

    if (!task){
      res.status(400)
      throw new Error ("'taskId' não encontrada")
    }

    const [ user ] = await db("users").where({id: userIdToDelete})

    if (!user){
      res.status(400)
      throw new Error ("'userId' não encontrada")
    }

    await db("users_tasks").del()
    .where({task_id: taskIdToDelete})
    .andWhere({user_id: userIdToDelete})

    res.status(200).send({message: "User removido da tarefa com sucesso."})

  } catch (error) {
    console.log(error)

    if (req.statusCode === 200) {
      res.status(500)
    }

    if (error instanceof Error) {
      res.send(error.message)
    } else {
      res.send("Erro inesperado")
    }
  }
})

app.post("/tasks/:taskId/users/:userId", async (req: Request, res: Response) => {
  try {

    const taskId = req.params.taskId 
    const userId = req.params.userId 

    const [ task ] = await db("tasks").where({id: taskId})

    if (!task){
      res.status(400)
      throw new Error ("'taskId' não encontrada")
    }

    const [ user ] = await db("users").where({id: userId})

    if (!user){
      res.status(400)
      throw new Error ("'userId' não encontrada")
    } 

    const newUserTask = {
      task_id: taskId,
      user_id: userId
    }

    await db("users_tasks").insert(newUserTask)

    res.status(200).send({message: "User atribuido a tarefa com sucesso."})

  } catch (error) {
    console.log(error)

    if (req.statusCode === 200) {
      res.status(500)
    }

    if (error instanceof Error) {
      res.send(error.message)
    } else {
      res.send("Erro inesperado")
    }
  }
})
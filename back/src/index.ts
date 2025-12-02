import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import AppDataSource from './data-source'
import userRouter from './routes/userRouters'
import pacientesRouter from './routes/pacientes.router'
import pacientesMasivosRouter from './routes/pacientesMasivos.router'
import { newUsersRouter } from './routes/newUsers.router'
import cirugiasRouter from './routes/cirugia.router'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

const upload = multer({ dest: 'uploads/' })

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
)

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true")
  next()
})

app.use(express.json())

AppDataSource.initialize()
  .then(() => {
    console.log('Conexión con la base de datos establecida correctamente')

    app.use('/api/users', userRouter)
    app.use('/api', pacientesRouter)
    app.use('/api', pacientesMasivosRouter)
    app.use('/api/auth', newUsersRouter)
    app.use('/api', cirugiasRouter)

    app.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`)
    })
  })
  .catch((error: unknown) => {
    console.error('Error al conectar con la base de datos', error)
  })

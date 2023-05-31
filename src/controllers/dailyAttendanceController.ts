import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { createDailyAttendance } from '@/lib/prisma/daily_attendance/create'

const prisma = new PrismaClient()
const router = Router()

router.get('/', async (req, res) => {
  const allDailyWorkData = await prisma.daily_attendance.findMany()
  res.json({ allDailyWorkData })
})

router.get('/:id', async (req, res) => {
  const dailyWorkDataByUserId = await prisma.daily_attendance.findMany({
    where: { userId: Number(req.params.id) }
  })
  res.json({ dailyWorkDataByUserId })
})

router.put('/:id', async (req, res) => {
  const { id } = req.body
  const updatedWork = await prisma.daily_attendance.update({
    where: { id: id },
    data: req.body
  })
  res.json({ updatedWork })
})

// もとのポスト
// router.post('/', async (req, res) => {
//   try {
//     const newWork = await createDailyAttendance(req.body)
//     if (newWork instanceof Error) {
//       throw new Error(`${newWork}`)
//     }
//     res.status(200).json({ message: `新規の日勤データを登録しました：${newWork}` })
//   } catch (error) {
//     res.status(400).json({ message: `日勤データの登録に失敗しました` })
//   }
// })
// })

//重複対策のポスト
router.post('/', async (req, res) => {
  const existingWork = await prisma.daily_attendance.findFirst({
    where: {
      userId: req.body.userId,
      date: req.body.date
    }
  })

  if (existingWork) {
    const updatedWork = await prisma.daily_attendance.update({
      where: { id: existingWork.id },
      data: req.body
    })

    return res.json({ updatedWork })
  } else {
    const newWork = await prisma.daily_attendance.create({
      data: req.body
    })

    return res.json({ newWork })
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.body
  const deletedWork = await prisma.daily_attendance.delete({
    where: { id: id }
  })
  res.json({ deletedWork })
})

export default router

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()



async function main() {
  console.log('hi')
    const allUsers = await prisma.test.findMany()
    console.log(allUsers)
    // await prisma.test.create({
    //   data: {username:'guyel'
    //     }
    // })
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
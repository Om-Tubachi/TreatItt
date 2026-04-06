import {prisma} from '../db/prisma.js'

const test = async () => {
    try{
        const user = {
            name: 'HArry',
            age: 23
        }
        const createUser = await prisma.demo.createManyAndReturn({
            data:[ user ]
        })
        if(createUser){
            console.log('created')
        }
    }
    catch(err){
        console.error(err)
    }
    finally {
        prisma.$disconnect()
        console.log('disconnected')
    }
}
test()
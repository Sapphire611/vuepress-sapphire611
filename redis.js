const Redis = require('ioredis');
const client = new Redis(6379, "127.0.0.1");

async function send(msg){
    const cur = await client.llen('test_queue');
    console.log(cur);

    if(cur > 5){
        console.error('size more than 5');
        return;
    }
    await client.lpush('test_queue',msg);
}

async function poll(){
    try{
        const message = await client.rpop('test_queue');
        if(message){
            console.debug(message);
        }
    } catch (err){
        console.error(err);
    }

    process.nextTick(poll);
}


poll();

// async function main(){
//     await send('111');
//     await send('222');
//     await send('333');
//     await send('444');
//     await send('555');
//     await send('666');
// }

// main();



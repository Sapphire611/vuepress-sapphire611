const redis = require('ioredis');
const client = redis.createClient();

// 添加成员和分数到排行榜
function addMemberToLeaderboard(member, score) {
    client.zadd('leaderboard', score, member, (err, reply) => {
        if (err) {
            console.error('Failed to add member to leaderboard:', err);
        } else {
            console.log('Member added to leaderboard:', member);
        }
    });
}

// 获取排行榜前十名的数据
function getTopTenFromLeaderboard() {
    client.zrevrange('leaderboard', 0, 9, 'WITHSCORES', (err, results) => {
        if (err) {
            console.error('Failed to get top ten from leaderboard:', err);
        } else {
            console.debug(results);
            // [
            //     'PlayerL', '123',     'PlayerI',
            //     '122',     'PlayerF', '121',
            //     'PlayerC', '120',     'PlayerJ',
            //     '103',     'PlayerG', '102',
            //     'PlayerD', '101',     'PlayerA',
            //     '100',     'PlayerK', '83',
            //     'PlayerH', '82'
            //   ]
            console.log('Top ten from leaderboard:');
            for (let i = 0; i < results.length; i += 2) {
                const member = results[i];
                const score = results[i + 1];
                console.log(`${i / 2 + 1}. Member: ${member}, Score: ${score}`);
            }
        }
    });
}

// 示例添加成员和分数到排行榜
addMemberToLeaderboard('PlayerA', 100);
addMemberToLeaderboard('PlayerB', 80);
addMemberToLeaderboard('PlayerC', 120);

addMemberToLeaderboard('PlayerD', 101);
addMemberToLeaderboard('PlayerE', 81);
addMemberToLeaderboard('PlayerF', 121);

addMemberToLeaderboard('PlayerG', 102);
addMemberToLeaderboard('PlayerH', 82);
addMemberToLeaderboard('PlayerI', 122);

addMemberToLeaderboard('PlayerJ', 103);
addMemberToLeaderboard('PlayerK', 83);
addMemberToLeaderboard('PlayerL', 123);

// 查询排行榜前十名的数据
getTopTenFromLeaderboard();
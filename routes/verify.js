var express = require('express');
var router = express.Router();
const db = require('../util/db');
const mail = require('../util/email.js');

router.get('/', function(req, res, next) {
    res.status(404).send("404")
});

router.all('/requestVerify', async function(req, res, next) {
    if (!req.query.username || !req.query.grade || !req.query.class || !req.query.number) {
        res.status(500).send("REQUIRE PARAMS");
        return;
    }
    try {
        const pinNum = generateRandomCode(6);
        const guild = `${req.query.grade}학년 ${req.query.class}반`
        const email = `2022${req.query.grade}${req.query.class}${req.query.number}@gudeok.hs.kr`
        let emailParam = {
            toEmail: email,     // 수신할 이메일
            subject: '구덕서버 메일 인증',   // 메일 제목
            text: `${req.query.username}님의 인증 번호입니다.\nPIN: ${pinNum}`   // 메일 내용
        };
        await db.execute(`INSERT INTO whitelist (name, guild, email, pin, verify) VALUES (?, ?, ?, ?, ?);`, [req.query.username, guild, email, pinNum, false])
        mail.sendGmail(emailParam)
        return res.status(200).send({
            ok: true,
            msg: "이메일 전송 완료"
        });
    } catch(e) {
        if (e.errno == 1062) {
            return res.status(400).send({
                ok: false,
                msg: "이미 인증되었습니다. 재인증은 디스코드로 문의바랍니다."
            })
        } else if(e.errno == 1452) {
            return res.status(400).send({
                ok: false,
                msg: "올바른 학/반을 적어주세요"
            })
        }
        console.log(e)
        return res.status(400).send({
            ok: false,
            msg: "이메일 전송 실패"
        });
    }
});

router.all('/foreignSchools', async function(req, res, next) {
    try {
        const [list] = await db.query(`SELECT name FROM gudeokmine.guilds WHERE \`foreign\`=1;`)
        var schools = [];
        for (school of list) {
            schools.push(school.name)
        }
        return res.status(200).send({
            ok: true,
            msg: schools
        });
    } catch(e) {
        console.log(e)
        return res.status(400).send({
            ok: false,
            msg: "내부 서버 오류"
        });
    }
})

router.all('/foreignVerify', async function(req, res, next) {
    try {
        if (!req.query.username || !req.query.guild) {
            res.status(500).send("REQUIRE PARAMS");
            return;
        }
        await db.execute(`INSERT INTO whitelist (name, guild, email, pin, verify) VALUES (?, ?, ?, ?, ?);`, [req.query.username, req.query.guild, new Date().getTime().toString(36), 0, true])
        return res.status(200).send({
            ok: true,
            msg: "인증 완료"
        });
    } catch(e) {
        if (e.errno == 1062) {
            return res.status(400).send({
                ok: false,
                msg: "이미 인증되었습니다. 재인증은 디스코드로 문의바랍니다."
            })
        }
        console.log(e)
        return res.status(400).send({
            ok: false,
            msg: "내부 서버 오류"
        });
    }
})

router.all('/verify', async function(req, res, next) {
    if (!req.query.username || !req.query.email || !req.query.pin) {
        res.status(500).send("REQUIRE PARAMS");
        return;
    }
    try {
        const [dupe] = await db.query(`SELECT * FROM gudeokmine.whitelist where name=? and email=? and pin=?`, [req.query.username, req.query.email, req.query.pin])
        if (dupe.length == 0) {
            //실패
            if (dupe[0].verify) {
                //이미 인증완료
                return res.status(400).send({
                    ok: false,
                    msg: "이미 인증된 사용자입니다"
                }); 
            }

            return res.status(400).send({
                ok: false,
                msg: "핀번호가 잘못됨"
            });   
        }

        await db.execute(`UPDATE gudeokmine.whitelist SET verify = '1' WHERE (name = ?);`, [req.query.username])
        return res.status(400).send({
            ok: true,
            msg: "학교 인증완료"
        });

    } catch(e) {
        console.log(e)
        return res.status(400).send({
            ok: false,
            msg: "내부 서버 오류"
        });
    }
});

function generateRandomCode(n) {
    let str = ''
    for (let i = 0; i < n; i++) {
      str += Math.floor(Math.random() * 10)
    }
    return str
}

module.exports = router;

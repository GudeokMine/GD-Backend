var express = require('express');
var router = express.Router();
const mcutil = require('minecraft-server-util')


const options = {
    timeout: 5000,
    enableSRV: true
}
const Server = 'hypixel.net'
const getServerInfo = async () => {
    try {
        const response = await mcutil.status('hypixel.net', 25565,options)
        return response
    } catch (error) {
        console.error(error)
    }
}
const getOnlinePlayers = async () => {
    try {
        const ServerInfo = await getServerInfo()
        return ServerInfo.players.online.toString()
    } catch (error) {
        console.error(error)
    }
}
router.get('/', async (req, res, next) =>{
    const ServerInfo = await getOnlinePlayers()
    res.status(200).json({
            ok: true,
            msg: ServerInfo
        })
})

module.exports = router;
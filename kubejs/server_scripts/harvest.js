// courtesy of ChiefArug and KubeJS Discord
let Block = java('net.minecraft.world.level.block.Block')
onEvent('block.right_click', event => {
    let block = event.block
    if (block.hasTag('minecraft:crops') || block.hasTag('mysticalagriculture:crops')) {
        let mcLevel = event.level.minecraftLevel
        let blockState = mcLevel.getBlockState(block.pos)
        let mcBlock = blockState.block
        let mcPlayer = event.player.minecraftPlayer
        if (mcBlock.isMaxAge(blockState)) {
            let loot = Block.getDrops(blockState, mcLevel, block.pos, null, mcPlayer, mcPlayer.getMainHandItem())
            let seedYeeted = false
            for (let i in loot) {
                if (loot[i].asKJS().id == mcBlock.getCloneItemStack(mcLevel, block.pos, blockState).asKJS().id) {
                    loot[i].count--
                    seedYeeted = true
                    break
                }
            }
            loot.forEach(item => {
                Block.popResource(mcLevel, block.pos, item)
            })
            if (seedYeeted || block.hasTag('minecraft:leaves')) {
                block.set(block.id, {age: '0'})
                event.server.runCommandSilent(`playsound minecraft:block.crop.break block @a ${block.x} ${block.y} ${block.z}`)
            } else { //if no seed was dropped for some odd reason
                mcLevel.destroyBlock(block.pos, true, null, 32)
            }
            event.cancel()
            event.player.swingArm(event.hand)
        }
    }
})
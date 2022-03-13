(async () => {
    // Settings
    const delayDefault = 5 * 1000 // The current example is 5 seconds. I don't recomend to change it.
    const delayAfterClick = 2 * 1000 // The current example is 2 seconds. I don't recomend to change it.
    const minAmountOfEnergy = 250 // If value of current energy is equal or less, energy will be restored. You can set any value you want.
    const repairDurabilityPercent = 50 // Current value is percent. For example chainsaw will be repaired when it hit 450/900 durability, because (450/900)*100 = 50%. You can set any value you want.

    // Click the 'map' button
    let result = {}
    const mapButton = document.querySelector('.navbar-group--icon[alt="Map"]')
    mapButton.click()

    // Infinity loop
    while (true) {
        for (let mapId = 0; mapId < 4; ++mapId) {
            if (typeof result[mapId] === 'undefined') result[mapId] = {}
            await new Promise((res) => setTimeout(res, delayDefault))
            const map = document.querySelectorAll('.map-container-bg')[mapId]
            if (map.style.filter === 'grayscale(1)') continue
            map.click()
            await new Promise((res) => setTimeout(res, delayAfterClick))
            const itemsContainer = document.querySelector('section.vertical-carousel-container')
            if (itemsContainer) {
                const children = itemsContainer.children
                for (child of children) {
                    document.getElementById('root').click()

                    // ENERGY RESTORE START
                    const energy = document.querySelectorAll('.resource__group')[3]
                    const energyCheck = energy.innerText.split('\n/')
                    if (energyCheck[0] <= minAmountOfEnergy) {
                        document.querySelector('.resource-energy--plus').click()
                        await new Promise((res) => setTimeout(res, delayAfterClick))
                        const energyToRestore = Math.floor((energyCheck[1] - energyCheck[0]) / 5)
                        for (let i = 0; i < energyToRestore; i++) {
                            document.querySelector('img[alt="Plus Icon"]').click()
                        }
                        Array.from(document.querySelectorAll("div.plain-button")).find(el => el.textContent == 'Exchange').click()
                    }
                    // ENERGY RESTORE END

                    child.click()
                    await new Promise((res) => setTimeout(res, delayAfterClick))

                    // REPAIR START
                    document.getElementById('root').click()
                    const cardName = document.querySelector('div.info-title-name').innerText
                    if (!cardName.includes('Member') && mapId === 0) {
                        const repairButton = document.querySelectorAll('.info-section .plain-button')[1];
                        const currentDurability = +document.querySelector('.card-number').innerText.split('/ ')[0]
                        const maxDurability = +document.querySelector('.card-number').innerText.split('/ ')[1]
                        const percentageRatio = (currentDurability / maxDurability) * 100
                        if (percentageRatio <= repairDurabilityPercent) {
                            repairButton.click()
                            await new Promise((res) => setTimeout(res, delayAfterClick * 3))
                        }
                    }
                    // REPAIR END

                    // MINE OR CLAIM START
                    document.getElementById('root').click()
                    const mineClaimButton = document.getElementsByClassName('button-section set-height')[0]
                    if (mineClaimButton.innerText === 'Mine' || mineClaimButton.innerText === 'Claim') {
                        mineClaimButton.click()
                        await new Promise((res) => setTimeout(res, delayDefault * 2))
                        while (!mineClaimButton.innerText === 'Countdown' || document.getElementsByClassName('plain-button short undefined')[0]) {
                            const modalButton = document.getElementsByClassName('plain-button short undefined')[0]
                            if (modalButton && modalButton.innerText.toUpperCase() === 'OK') {
                                modalButton.click()
                                await new Promise((res) => setTimeout(res, delayAfterClick))
                            } else {
                                document.getElementById('root').click() 
                                await new Promise((res) => setTimeout(res, delayAfterClick))
                            }
                        }
                    }
                    // MINE OR CLAIM END
                }
            }
            mapButton.click()
            await new Promise((res) => setTimeout(res, delayDefault))
        }
    }
})()
import * as _ from 'lodash'
import { images, oppositeColor } from '../utils'
import { fixationHTML } from './fixation'


const getImage = (position, blockSettings) => {
  const color = (position === 'left') ? blockSettings.color_on_left : oppositeColor(blockSettings.color_on_left) ;
  const payout = blockSettings.bead_settings[color].correct
  const image = _.filter(images, (o) => o.includes(`${color}_payout_correct_${payout}`))[0]
  return image
}

const moneyBags = (blockSettings) => {
  const left = getImage('left', blockSettings)
  const right = getImage('right', blockSettings)

  return (
    `<div class="beads_container">
    <div class="money_bag"><img src="${left}"/></div>
    ${fixationHTML}
    <div class="money_bag"><img src="${right}"/></div>
    </div>`
  )
}

export {
  moneyBags
}

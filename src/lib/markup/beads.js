import { oppositeColor } from '../utils'
import { lang } from '../../config/main'
import { fixationHTML } from './fixation'

// get the width of a bead given the number of beads they
const getBeadWidth = (numBeads, height, width) => {
  // area divided by num beads
  const area = height * width
  const areaPerBead = Math.floor(area / numBeads)
  const beadWidth = Math.floor(Math.sqrt(areaPerBead))

  return Math.min(beadWidth, 6)
}


const beadsHtml = (colour, count, width) => {
  return (
    `<span class='fas fa-circle text-${colour}' style='height: ${width}px; margin-bottom: ${width+4}px;'></span>`.repeat(count)
  )
}

// returns html for beads, arguments: number of orange beads, number of blue beads, and if orange is the lefthand color (boolean)
const beadsMarkup = (orangeCount, blueCount, colorOnLeft, height, width) => {
  const maxBeads = Math.max(orangeCount, blueCount)
  const beadWidth = getBeadWidth(maxBeads, height, width)

  const countLeft = (colorOnLeft === lang.color.orange) ? orangeCount : blueCount
  const countRight = orangeCount + blueCount - countLeft

  return (
    `<div class='beads_container'>
      <div class='beads_inner_container' id='left_beads'>
        ${beadsHtml(colorOnLeft, countLeft, beadWidth)}
      </div>
      ${fixationHTML}
      <div class='beads_inner_container' id='right_beads'>
        ${beadsHtml(oppositeColor(colorOnLeft), countRight, beadWidth)}
      </div>
    </div>`
  )
}

export {
  beadsMarkup,
  beadsHtml
}

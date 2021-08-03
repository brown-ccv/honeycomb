import { formatDollars } from "../utils"

const earningsDisplay = (earnings, slow = false) => {
  const bclass = (earnings >= 0) ? "success" : "danger"

  return (
    `<div class='center_container'>
    <h1>${slow ? "Too slow!<br><br>" : ""}<span class='text-${bclass}'>${formatDollars(earnings)}</span></h1>
    </div>`
  )
}

export {
  earningsDisplay
}

const baseStimulus = (element, prompt=false) => {
  const class_ = (prompt) ? 'main-prompt': 'main'
  return (
    `<div class='beads_container'>
    <header>
	  <h1>${element}</h1>
    </header>
    </div>`
  )
}


export {
  baseStimulus
}

// Abre/cierra el menú dropdown del avatar al hacer clic.
// Se cierra al pulsar fuera o al pulsar Escape.

(function () {
  const boton = document.getElementById('botonAvatar')
  const menu = document.getElementById('menuDropdown')
  if (!boton || !menu) return

  const cerrar = () => {
    menu.hidden = true
    boton.setAttribute('aria-expanded', 'false')
  }

  const toggleMenu = () => {
    const abierto = !menu.hidden
    menu.hidden = abierto
    boton.setAttribute('aria-expanded', String(!abierto))
  }

  boton.addEventListener('click', (e) => {
    e.stopPropagation()
    toggleMenu()
  })

  document.addEventListener('click', (e) => {
    if (!menu.hidden && !menu.contains(e.target)) {
      cerrar()
    }
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) {
      cerrar()
      boton.focus()
    }
  })
})()
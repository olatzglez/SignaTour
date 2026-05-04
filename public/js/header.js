// Maneja el dropdown del avatar y el menú lateral móvil.
// Cierre por click fuera, Escape y atributos ARIA actualizados.

(function () {
  // ---------- Dropdown avatar ----------
  const botonAvatar = document.getElementById('botonAvatar')
  const menu = document.getElementById('menuDropdown')

  if (botonAvatar && menu) {
    const cerrarDropdown = () => {
      menu.hidden = true
      botonAvatar.setAttribute('aria-expanded', 'false')
    }

    botonAvatar.addEventListener('click', (e) => {
      e.stopPropagation()
      const abierto = !menu.hidden
      menu.hidden = abierto
      botonAvatar.setAttribute('aria-expanded', String(!abierto))
    })

    document.addEventListener('click', (e) => {
      if (!menu.hidden && !menu.contains(e.target)) cerrarDropdown()
    })

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) {
        cerrarDropdown()
        botonAvatar.focus()
      }
    })
  }

  // ---------- Menú lateral móvil ----------
  const botonHamburguesa = document.getElementById('botonHamburguesa')
  const menuLateral = document.getElementById('menuLateral')
  const overlay = document.getElementById('menuLateralOverlay')
  const botonCerrarMenu = document.getElementById('botonCerrarMenu')

  if (botonHamburguesa && menuLateral && overlay) {
    const abrirMenu = () => {
      menuLateral.classList.add('abierto')
      overlay.classList.add('abierto')
      menuLateral.setAttribute('aria-hidden', 'false')
      botonHamburguesa.setAttribute('aria-expanded', 'true')
      document.body.style.overflow = 'hidden'
    }

    const cerrarMenu = () => {
      menuLateral.classList.remove('abierto')
      overlay.classList.remove('abierto')
      menuLateral.setAttribute('aria-hidden', 'true')
      botonHamburguesa.setAttribute('aria-expanded', 'false')
      document.body.style.overflow = ''
      botonHamburguesa.focus()
    }

    botonHamburguesa.addEventListener('click', abrirMenu)
    overlay.addEventListener('click', cerrarMenu)
    if (botonCerrarMenu) botonCerrarMenu.addEventListener('click', cerrarMenu)

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuLateral.classList.contains('abierto')) {
        cerrarMenu()
      }
    })
  }
})()
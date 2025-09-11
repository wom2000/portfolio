const icons = document.querySelectorAll('.desktop .icon');

icons.forEach(icon => {
  icon.ondragstart = () => false;

  icon.addEventListener('mousedown', dragStart);

  function dragStart(e) {
    // Pega a posição atual do ícone na tela
    const rect = icon.getBoundingClientRect();
    icon.style.position = 'absolute';
    icon.style.left = rect.left + 'px';
    icon.style.top = rect.top + 'px';
    icon.style.zIndex = 1000; // garante que fique acima dos outros

    let shiftX = e.clientX - rect.left;
    let shiftY = e.clientY - rect.top;

    function moveAt(pageX, pageY) {
      icon.style.left = pageX - shiftX + 'px';
      icon.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(e) {
      moveAt(e.pageX, e.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    document.addEventListener('mouseup', function mouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', mouseUp);
    });
  }
});

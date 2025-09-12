// Seleciona elementos do DOM
const noteForm = document.getElementById("noteForm");
const notesList = document.getElementById("notesList");

// Função para carregar notas do localStorage
function loadNotes() {
  const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
  notesList.innerHTML = ""; // Limpa a lista antes de mostrar
  savedNotes.forEach((note, index) => {
    const noteDiv = document.createElement("div");
    noteDiv.classList.add("note");
    noteDiv.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.content}</p>
      <button class="delete-btn" onclick="deleteNote(${index})">Excluir</button>
    `;
    notesList.appendChild(noteDiv);
  });
}

// Função para adicionar nota
noteForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const title = document.getElementById("noteTitle").value;
  const content = document.getElementById("noteContent").value;

  if (!title || !content) return;

  const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
  savedNotes.push({ title, content });
  localStorage.setItem("notes", JSON.stringify(savedNotes));

  noteForm.reset();
  loadNotes();
});

// Função para excluir nota
function deleteNote(index) {
  const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
  savedNotes.splice(index, 1); // Remove a nota do array
  localStorage.setItem("notes", JSON.stringify(savedNotes));
  loadNotes(); // Atualiza a lista na tela
}

// Carrega as notas ao iniciar a página
loadNotes();

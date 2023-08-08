// each
function each(coll, f) { 
    if (Array.isArray(coll)) { 
          for (var i = 0 ;i < coll.length; i++) { 
                f(coll[i], i) 
          } 
    } else { 
          for (var key in coll) { 
                f(coll[key], key) 
          } 
    } 
}


// map
function map(array, f) { 
    var acc = [] 
    each(array, function(element, i) { 
          acc.push(f(element, i)) 
    }) 
    return acc 
}


// filter
function filter(array, predicate) {
    var acc = []
    each(array, function(element) {
        if (predicate(element)) {
            acc.push(element)
        }
    })
    return acc
}


//reduce
 function reduce(array, f, acc) { 
       if (acc === undefined) { 
             acc = array[0] 
             array = array.slice(1) 
       } 
       each(array, function(element, i) { 
             acc = f(acc, element, i) 
       }) 
       return acc 
 }
 //////////let's start//////////
 $(document).ready(function() {
    var notesContainer = $("#app")
    var addNoteButton = notesContainer.find(".add-note")
    ///////
// Define (username and password)
var users = [
  { username: "user1", password: "password1" },
  { username: "user2", password: "password2" },
  // we can add as many as we want
]

var currentUser = null

//click event listener to the login button
$("#login-button").on("click", function() {
  var username = $("#username").val()
  var password = $("#password").val()

  // Check if the password and username match
  var loggedInUser = users.find(function(user) {
      return user.username === username && user.password === password
  })

  if (loggedInUser) {
      // If the user and password are correctdisplay notes
      currentUser = loggedInUser
      displayUserNotes()
      // Hide the login form after successful login
      $("#login-container").hide()
  } else {
      // If the user and password are incorrect, show an error message
      $("#login-error").text("Invalid username or password. Please try again.")
  }
})


function displayUserNotes() {
  // Get the notes for user from the local storage
  var userNotes = getNotesForCurrentUser()

  // Loop through the user's notes and create the note elements
  userNotes.forEach(function(note) {
      var noteElement = createNoteElement(note.id, note.content)
      notesContainer[0].insertBefore(noteElement, addNoteButton[0])
  })
}

function getNotesForCurrentUser() {
  // Get all notes from the local storage
  var allNotes = getNotes()

  // Filter out notes that belong to the current user
  var userNotes = allNotes.filter(function(note) {
      return note.userId === currentUser.username
  })

  return userNotes
}
    ///////
 //get note for each click
    getNotes().forEach(function(note) {
      var noteElement = createNoteElement(note.id, note.content)
      notesContainer[0].insertBefore(noteElement, addNoteButton[0])
    })
  
    addNoteButton.on("click", function() {
      addNote()
    })
  
    function getNotes() {
      return JSON.parse(localStorage.getItem("stickynotes-notes") || "[]")
    }
  
    function saveNotes(notes) {
      localStorage.setItem("stickynotes-notes", JSON.stringify(notes))
    }
  
    function createNoteElement(id, content) {
      var element = $("<div>");
    
      element.addClass("note");
    
      var textArea = $("<textarea>");
      textArea.val(content);
      textArea.attr("placeholder", "Empty Sticky Note");
    
      var dateTime = $("<div>");
      dateTime.addClass("note-datetime");
    
      var currentDate = new Date();
      var dateString = currentDate.toLocaleDateString();
      var timeString = currentDate.toLocaleTimeString();
    
      dateTime.text(dateString + " " + timeString);
    
      var deleteButton = $("<button>");
      deleteButton.addClass("note-delete-button");
      deleteButton.text("X");
    
      element.append(deleteButton);
      element.append(textArea);
      element.append(dateTime);
    //click on the button to delete
      deleteButton.on("click", function() {
        var doDelete = confirm("Are you sure you wish to delete this sticky note?");
        if (doDelete) {
          deleteNote(id, element);
        }
      });
    
      textArea.on("change", function() {
        updateNote(id, textArea.val());
      });
    //dbl click to delete 
      textArea.on("dblclick", function() {
        var doDelete = confirm("Are you sure you wish to delete this sticky note?");
        if (doDelete) {
          deleteNote(id, element);
        }
      });
      return element[0];
    }
  
    function addNote() {
      var notes = getNotes();
      var noteObject = {
        id: Math.floor(Math.random() * 100000),
        content: "",
        userId: currentUser.username 
      }
  
      var noteElement = createNoteElement(noteObject.id, noteObject.content,noteObject.userId)
      notesContainer[0].insertBefore(noteElement, addNoteButton[0])
  
      notes.push(noteObject)
      saveNotes(notes)
    }
  
    function updateNote(id, newContent) {
      var notes = getNotes()
      var targetNote = notes.filter(function(note) {
        return note.id == id
      })[0]
  
      targetNote.content = newContent
      saveNotes(notes)
    }
  
    function deleteNote(id, element) {
      var notes = getNotes().filter(function(note) {
        return note.id != id
      })
  
      saveNotes(notes)
      element.remove()
    }
    
  })
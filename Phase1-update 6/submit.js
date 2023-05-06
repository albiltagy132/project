const form = document.getElementById('submission-form');

    form.addEventListener('submit', function(event) {
      event.preventDefault();
    
      // Get form data
      const formData = new FormData(form);
      
      // Convert presenter checkbox value to boolean
      formData.set('author1-presenter', form.elements['author1-presenter'].checked);
      formData.set('author2-presenter', form.elements['author2-presenter'].checked);
      
      // Send form data to server
      fetch('submit-form.php', {
        method: 'POST',
        body: formData
      })
      .then(response => response.text())
      .then(data => {
        alert(data);
      })
      .catch(error => {
        console.error(error);
      });
    });
    
    
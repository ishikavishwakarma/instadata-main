ScrollTrigger.matchMedia({
	"(min-width: 1024px)": function hello() {
    
document.querySelector(".moreopen").addEventListener("click", function (e) {
  var moreOption = document.querySelector("#moreoption");
  if (moreOption.classList.contains("active")) {
    moreOption.style.display = "none";
    moreOption.classList.remove("active");
  } else {
    moreOption.style.display = "initial";
    moreOption.classList.add("active");
  }
});


document.querySelector("#noty").addEventListener("click",function(){
  document.querySelector("#left").style.width="25%"
  document.querySelector("#right").style.width="75%"
  document.querySelector("#notyparent").style.left="13%"
  document.querySelector("#notyparent").style.opacity=1
  document.querySelector("#notyparent").style.display="initial"
})
document.querySelector("#notyparentnav h5").addEventListener("click",function(){
  document.querySelector("#left").style.width="15%"
  document.querySelector("#right").style.width="85%"
  document.querySelector("#notyparent").style.left="-100%"
  document.querySelector("#notyparent").style.opacity=0
  document.querySelector("#notyparent").style.display="none"
})

document.querySelector("#search").addEventListener("click",function(){
  document.querySelector("#left").style.width="25%"
  document.querySelector("#right").style.width="75%"
  document.querySelector("#searchparent").style.left="13%"
  document.querySelector("#searchparent").style.opacity=1
})
document.querySelector("#searchparentnav h5").addEventListener("click",function(){
  document.querySelector("#left").style.width="15%"
  document.querySelector("#right").style.width="85%"
  document.querySelector("#searchparent").style.left="-100%"
  document.querySelector("#searchparent").style.opacity=0
})

document.querySelector("#postkro button").addEventListener("click", function(){
  document.querySelector("#uploadfileinput").click()
})
document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById("uploadfileinput");
  const imagePreview = document.getElementById('postpreview');
  const videoPreview = document.createElement('video');
  videoPreview.setAttribute('controls', 'controls'); // Add controls for video playback

  fileInput.addEventListener('change', (event) => {
      document.querySelector("#postkro").style.display = "none";
      imagePreview.style.display = "initial";
      document.querySelector("#caption").style.display = "initial";
      document.querySelector("#postsubmit").style.display = "initial";

      const file = event.target.files[0];

      if (file) {
          if (file.type.startsWith('image/')) {
              // Display image preview
              const reader = new FileReader();
              reader.onload = () => {
                  const img = new Image();
                  img.src = reader.result;
                  imagePreview.innerHTML = '';
                  imagePreview.appendChild(img);
              };
              reader.readAsDataURL(file);
          } else if (file.type.startsWith('video/')) {
              // Display video preview
              const reader = new FileReader();
              reader.onload = () => {
                  videoPreview.src = reader.result;
                  imagePreview.innerHTML = '';
                  imagePreview.appendChild(videoPreview);
              };
              reader.readAsDataURL(file);
          } else {
              // Unsupported file type
              console.error('Unsupported file type');
          }
      } else {
          imagePreview.innerHTML = '';
      }
  });
});

document.querySelectorAll("#icons svg").forEach(function(dets){
    dets.addEventListener("mousemove",function(){
        dets.style.scale=1.3,
        dets.style.transition="all linear .2s"
    })
    dets.addEventListener("mouseleave",function(){
        dets.style.scale=1,
        dets.style.transition="all linear .2s"
    })
})
document.querySelector(".uploadpost").addEventListener("click",function(){
    document.querySelector("#newpostpage").style.display="flex"
})
document.querySelector("#newpostpage i").addEventListener("click",function(){
    document.querySelector("#newpostpage").style.display="none"
})


// Function to show the progress bar
function showTopLoader() {
  const topLoader = document.getElementById('topLoader');
  topLoader.style.display = 'block';
}
// Function to hide the progress bar
function hideTopLoader() {
  const topLoader = document.getElementById('topLoader');
  topLoader.style.display = 'none';
}
// Function to update the progress bar
function updateProgressBar(progress) {
  const progressBar = document.getElementById('progressBar');
  progressBar.style.width = progress + '%';
}
// Event listener to detect route changes
$(document).ready(function() {
  $(document).on('click', 'a', function() {
    showTopLoader();
    setTimeout(hideTopLoader, 100); // Hide after 1 second (100 milliseconds)
  });
  $(window).on('popstate', function() {
    showTopLoader();
    setTimeout(hideTopLoader, 100); // Hide after 1 second (100 milliseconds)
  });
});
// Update progress bar when the page is finished loading
$(window).on('load', function() {
  setTimeout(hideTopLoader, 100); // Hide after 1 second (100 milliseconds)
});

  
  document.getElementById('searchInput').addEventListener('input', function() {
    const searchQuery = this.value.toLowerCase();
    const userElements = document.querySelectorAll('.username');

    userElements.forEach(function(userElement) {
        const username = userElement.innerText.toLowerCase();

        if (username.includes(searchQuery)) {
            userElement.style.display = 'flex';
        } else {
            userElement.style.display = 'none';
        }
    });
});
  },hello(){}
});


ScrollTrigger.matchMedia({
  "(max-width:600px)": function() {

    
document.querySelector("#postkro button").addEventListener("click", function(){
  document.querySelector("#uploadfileinput").click()
})
document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById("uploadfileinput");
  const imagePreview = document.getElementById('postpreview');
  const videoPreview = document.createElement('video');
  videoPreview.setAttribute('controls', 'controls'); // Add controls for video playback

  fileInput.addEventListener('change', (event) => {
      document.querySelector("#postkro").style.display = "none";
      imagePreview.style.display = "initial";
      document.querySelector("#caption").style.display = "initial";
      document.querySelector("#postsubmit").style.display = "initial";

      const file = event.target.files[0];

      if (file) {
          if (file.type.startsWith('image/')) {
              // Display image preview
              const reader = new FileReader();
              reader.onload = () => {
                  const img = new Image();
                  img.src = reader.result;
                  imagePreview.innerHTML = '';
                  imagePreview.appendChild(img);
              };
              reader.readAsDataURL(file);
          } else if (file.type.startsWith('video/')) {
              // Display video preview
              const reader = new FileReader();
              reader.onload = () => {
                  videoPreview.src = reader.result;
                  imagePreview.innerHTML = '';
                  imagePreview.appendChild(videoPreview);
              };
              reader.readAsDataURL(file);
          } else {
              // Unsupported file type
              console.error('Unsupported file type');
          }
      } else {
          imagePreview.innerHTML = '';
      }
  });
});

    document.getElementById('searchInput').addEventListener('input', function() {
      const searchQuery = this.value.toLowerCase();
      const userElements = document.querySelectorAll('.username');
  
      userElements.forEach(function(userElement) {
          const username = userElement.innerText.toLowerCase();
  
          if (username.includes(searchQuery)) {
              userElement.style.display = 'flex';
          } else {
              userElement.style.display = 'none';
          }
      });
  });

    document.querySelector("#notywala").addEventListener("click", function() {
      document.querySelector("#notyparent").style.display = "initial";
    });

    document.querySelector("#notyparentnav h5").addEventListener("click", function() {
      document.querySelector("#notyparent").style.display = "none";
    });

    document.querySelector(".uploadpost").addEventListener("click",function(){
      document.querySelector("#newpostpage").style.display="flex"
  })
  document.querySelector("#newpostpage i").addEventListener("click",function(){
      document.querySelector("#newpostpage").style.display="none"
  })


  },
  "hello1()": function() {}
});

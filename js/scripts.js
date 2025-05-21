async function loadNavbar() {
    try {
        const response = await fetch('navbar.html');
        if (!response.ok) {
            console.error('Failed to load navbar:', response.status);
            return;
        }
        const navbarHTML = await response.text();

        const navbarContainer = document.createElement('div');
        navbarContainer.classList.add('sidebar-container'); // Add a class for easier targeting
        navbarContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            z-index: 1000; /* Ensure it's above other content */
        `;
        navbarContainer.innerHTML = navbarHTML;
        document.body.insertBefore(navbarContainer, document.body.firstChild);

        // Initialize sidebar functionality *after* it's loaded
        const sidebar = document.querySelector('.sidebar');
        const logoDiv = document.querySelector('.sidebar .logo'); // Target the logo div
        const dropdownLink = document.querySelector('.nav-links > a');
        const dropdownContent = document.querySelector('.dropdown-content');
        const collapseToggle = document.createElement('div');
        collapseToggle.classList.add('collapse-toggle');
        collapseToggle.innerHTML = '<span class="arrow-collapsed">&gt;</span><span class="arrow-expanded">&lt;</span>';
        sidebar.appendChild(collapseToggle);

        // Set initial logo text
        if (logoDiv) {
            logoDiv.textContent = sidebar.classList.contains('collapsed') ? 'DLL' : 'DELULU';
        }

        // Toggle dropdown
        dropdownLink.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default link behavior in both states
            if (dropdownContent.style.maxHeight === '0px' || dropdownContent.style.maxHeight === '') {
                dropdownContent.style.maxHeight = '500px'; // Adjust the value as needed to fit your content
            } else {
                dropdownContent.style.maxHeight = '0';
            }
            this.classList.toggle('active');
        });

        // Function to update body padding
        function updateBodyPadding() {
            const navbarWidth = sidebar.offsetWidth;
            document.body.style.paddingLeft = sidebar.classList.contains('collapsed') ? '70px' : `250px`;
        }

        // Call updateBodyPadding initially
        updateBodyPadding();

        // Toggle sidebar collapse
        collapseToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            this.innerHTML = sidebar.classList.contains('collapsed') 
            ? '<span class="arrow-expanded">&gt;</span>'  // Hiện mũi tên trái để "mở rộng"
            : '<span class="arrow-collapsed">&lt;</span>'; // Hiện mũi tên phải để "thu gọn"

            // Change logo text on collapse
            if (logoDiv) {
                logoDiv.textContent = sidebar.classList.contains('collapsed') ? 'DLL' : 'DELULU';
            }

            // Hide or show special links text based on collapse state
            const specialLinks = document.querySelectorAll('.special-links span');
            specialLinks.forEach(link => {
                link.style.display = sidebar.classList.contains('collapsed') ? 'none' : 'inline'; // Hide text in collapsed state
            });

            // Update body padding on collapse/expand
            updateBodyPadding();
        });

        // Highlight the current active page in the sidebar
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (currentPath === linkPath) {
                link.classList.add('active');
            }
        });

    } catch (error) {
        console.error('Error loading navbar:', error);
    }
}

// Call the function to load the navbar when the page loads
window.onload = loadNavbar;
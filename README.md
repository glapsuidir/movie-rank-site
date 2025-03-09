# Movie Ranking Website

## Overview
This is a simple movie ranking website where users can input movie details (name, cover image URL, and ranking) and generate a dynamically sorted list. The project is built using HTML, CSS, and JavaScript and is hosted on GitHub Pages. It can be found at https://glapsuidir.github.io/movie-rank-site.

## Potential Concern Explanation
In the fourth line of code in the 'script.js' file, there is a hardcoded API key. It is for the OMDb API, which is not linked to any payment methods, and is accessible for free on their website. Due to the static nature of GitHub Pages, the ease of accessibility of ones own key, and the lack of security threat it poses, it isn't feasible to find an additional way to store the key for access in the website.

## Features
- Add movies with a name, cover image, and ranking.
- Automatically sorts movies based on ranking.
- Stores data in `localStorage` for persistence.
- Allows users to edit or delete movie entries.
- Responsive and visually appealing design.

## Technologies Used
- **HTML**: Structure of the webpage.
- **CSS**: Styling and layout.
- **JavaScript**: Handles form submission, sorting, and local storage.
- **GitHub Pages**: Hosting the website.

## Installation & Usage
1. Clone the repository:
   ```sh
   git clone https://github.com/glapsuidir/movie-rank-site.git
   ```
2. Open `index.html` in a web browser.
3. Add movies using the form, and they will be displayed in a sorted list.

## License
This project is open-source under the MIT License.


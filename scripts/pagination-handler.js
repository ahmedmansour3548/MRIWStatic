AFRAME.registerComponent('pagination-handler', {
    init: function () {
        this.pageNum = 1; // Start at page 1
        this.buttonsPerPage = 10;
        this.totalButtons = 0; // Initialize to zero
        this.errorText = document.querySelector('#error-text');
        // Fetch folder details from GitHub API
        this.fetchGitHubFolders().then(folders => {
            // Sort folders numerically
            folders.sort((a, b) => parseInt(a.name) - parseInt(b.name));
            
            this.totalButtons = folders.length;
            this.totalPages = Math.ceil(this.totalButtons / this.buttonsPerPage);

            // Event listeners
            document.querySelector('#next-plane').addEventListener('click', this.nextPage.bind(this));
            document.querySelector('#previous-plane').addEventListener('click', this.previousPage.bind(this));

            // Initial button update
            this.updateButtons(folders);
        });
    },

/**
 * Fetches the contents of the root directory of a GitHub repository.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of folder items.
 */
fetchGitHubFolders : async function() {
    const repoOwner = "ahmedmansour3548";
    const repoName = "MRInteractiveWallPage";
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents`;
  
    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'request',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const repoContent = await response.json();
  
      // Filter out numbered folders
      return repoContent.filter(item => {
        return item.type === 'dir' && !isNaN(parseInt(item.name));
      }).map(item => ({
        name: item.name,
        type: item.type,
        download_url: item.download_url,
      }));
    } catch (error) {
      console.error('Error fetching GitHub folders:', error);
      return [];
    }
  },

    

    nextPage: function () {
        if (this.pageNum < this.totalPages) {
            this.pageNum++;
            this.fetchGitHubFolders().then(folders => {
                folders.sort((a, b) => parseInt(a.name) - parseInt(b.name)); // Ensure sorting on page change
                this.updateButtons(folders);
            });
        }
    },

    previousPage: function () {
        if (this.pageNum > 1) {
            this.pageNum--;
            this.fetchGitHubFolders().then(folders => {
                folders.sort((a, b) => parseInt(a.name) - parseInt(b.name)); // Ensure sorting on page change
                this.updateButtons(folders);
            });
        }
    },

    updateButtons: function (folders) {
        const startIdx = (this.pageNum - 1) * this.buttonsPerPage;

        for (let i = 1; i <= this.buttonsPerPage; i++) {
            const buttonId = `ID-${i}`;
            const textId = `text-${i}`;
            const frameId = `frame-ID-${i}`;
            const buttonElement = document.querySelector(`#${buttonId}`);
            const textElement = document.querySelector(`#${textId}`);
            const frameElement = document.querySelector(`#${frameId}`);

            const dataIndex = startIdx + i - 1;

            if (dataIndex < this.totalButtons) {
                const folder = folders[dataIndex];
                console.log("foldername", folder.name);
                console.log("Updating button:", buttonId, "with folder:", folder); // Log button update details

                buttonElement.setAttribute('visible', true);
                frameElement.setAttribute('visible', true);
                buttonElement.setAttribute('class', 'clickable');
                buttonElement.setAttribute('name', folder.name);

                // Pad the folder name with zeros to ensure it is 3 digits long
                const paddedName = folder.name.padStart(3, '0');
                textElement.setAttribute('value', paddedName);
            } else {
                buttonElement.setAttribute('visible', false);
                frameElement.setAttribute('visible', false);
                buttonElement.setAttribute('class', '');
            }
        }
    },

    getPageNum: function() {
        return this.pageNum;
    },

    getTotalPages: function() {
        return this.totalPages;
    }
});

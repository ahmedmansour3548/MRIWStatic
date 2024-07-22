/**
 * This script contains the custom component to handle click interaction in the AR scene.
 * It defines the animations for the doors and models that occur on click.
 *
 * @version 1.0
 * @name Ahmed Mansour
 * @date 6/20/2024
 *
 */

AFRAME.registerComponent("click-listener", {
  init: function () {
    // Bind the onClick function to this component instance and listen for click events on the scene
    this.onClick = this.onClick.bind(this);
    this.el.addEventListener("click", this.onClick);

    // Get references to elements in the scene to manipulate them easier
    this.initElements();

    // Tracking Variables
    this.initTrackingVariables();

    // Enable fog in the scene
    this.el.sceneEl.object3D.fog = new THREE.Fog(0x000000, 15, 20); // Fog color and density

    // Fetch and store folder information
    this.fetchLocalContent().then((labMembersContent) => {
      // Convert Map to array to sort it numerically
      const sortedLabMembersContentArray = Array.from(
        labMembersContent.entries()
      ).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
      const sortedLabMembersContent = new Map(sortedLabMembersContentArray);

      // Store sorted folder information
      this.labMembersContent = sortedLabMembersContent;
      this.totalButtons = sortedLabMembersContent.size;
      this.totalPages = Math.ceil(this.totalButtons / this.buttonsPerPage);
      console.log(labMembersContent);
      // Initial button update
      this.updateButtons();
    });
    // Bind all external functions to this context
    this.bindFunctions();
  },

  initElements: function () {
    // Get references to all elements in the scene to manipulate them easier
    this.doorLeft = this.el.sceneEl.querySelector("#doorleft");
    this.doorRight = this.el.sceneEl.querySelector("#doorright");
    this.centerEntity = this.el.sceneEl.querySelector("#centerEntity");
    this.labMemberNumber = this.el.sceneEl.querySelector("#lab-member-number");
    this.labMemberName = this.el.sceneEl.querySelector("#lab-member-name");
    this.labMemberRole = this.el.sceneEl.querySelector("#lab-member-role");
    this.labMemberNote = this.el.sceneEl.querySelector("#lab-member-note");
    this.labMemberYearsActive = this.el.sceneEl.querySelector(
      "#lab-member-years-active"
    );
    this.labMemberStartYear = this.el.sceneEl.querySelector(
      "#lab-member-start-year"
    );
    this.labMemberEndYear = this.el.sceneEl.querySelector(
      "#lab-member-end-year"
    );
    this.modelCredit = this.el.sceneEl.querySelector("#model-credit");
    this.virtualRoomNumber = this.el.sceneEl.querySelector(
      "#virtual-room-number"
    );
    this.leftArrowButton = this.el.sceneEl.querySelector("#left-arrow-button");
    this.leftArrowContainer = this.el.sceneEl.querySelector(
      "#left-arrow-container"
    );
    this.rightArrowButton = this.el.sceneEl.querySelector(
      "#right-arrow-button"
    );
    this.rightArrowContainer = this.el.sceneEl.querySelector(
      "#right-arrow-container"
    );
    this.leftArrow = this.el.sceneEl.querySelector("#left-arrow");
    this.rightArrow = this.el.sceneEl.querySelector("#right-arrow");
    this.labMemberButtons = Array.from(
      this.el.sceneEl.querySelectorAll('[id^="ID"]')
    );
    this.labMemberButtonFrames = Array.from(
      this.el.sceneEl.querySelectorAll('[id^="frame-ID"]')
    );
    this.previousPageButton = this.el.sceneEl.querySelector("#previous-plane");
    this.previousPageButtonFrame = this.el.sceneEl.querySelector(
      "#previous-plane-frame"
    );
    this.nextPageButtonFrame =
      this.el.sceneEl.querySelector("#next-plane-frame");
    this.nextPageButton = this.el.sceneEl.querySelector("#next-plane");
    this.leftPanelMenuButton = this.el.sceneEl.querySelector(
      "#left-panel-menu-button"
    );
    this.rain = this.el.sceneEl.querySelector("#rain").components["particle-system"];
    this.topQuotes = this.el.sceneEl.querySelector("#top-quotes");
    this.bottomQuotes = this.el.sceneEl.querySelector("#bottom-quotes");
    this.leftLineDivider = this.el.sceneEl.querySelector("#left-line-divider");
    this.labMemberNumberBox = this.el.sceneEl.querySelector(
      "#labMemberNumberBox"
    );
    this.labMemberYearsBox =
      this.el.sceneEl.querySelector("#labMemberYearsBox");
    this.labMemberYearDash =
      this.el.sceneEl.querySelector("#labMemberYearDash");
    this.rightPanelBottomLeftButton = this.el.sceneEl.querySelector(
      "#right-panel-bottom-left-button"
    );
    this.rightPanelBottomLeftButtonText = this.el.sceneEl.querySelector(
      "#right-panel-bottom-left-button-text"
    );
    this.rightPanelBottomLeftButtonIcon = this.el.sceneEl.querySelector(
      "#right-panel-bottom-left-button-icon"
    );
    this.rightPanelBottomRightButton = this.el.sceneEl.querySelector(
      "#right-panel-bottom-right-button"
    );
    this.rightPanelBottomAnimationButton = this.el.sceneEl.querySelector(
      "#right-panel-bottom-animation-button"
    );
    this.rightPanelBottomLinkButton = this.el.sceneEl.querySelector(
      "#right-panel-bottom-link-button"
    );
    this.rightPanelBottomAnimationButtonText = this.el.sceneEl.querySelector(
      "#right-panel-bottom-animation-button-text"
    );
    this.rightPanelBottomAnimationButtonIcon = this.el.sceneEl.querySelector(
      "#right-panel-bottom-animation-button-icon"
    );
    this.marker = this.el.sceneEl.querySelector("#centerMarker");
    this.errorText = document.querySelector("#error-text");
    this.smokeEmitter =
      this.el.sceneEl.querySelector("#smoke").components["particle-system"];
    this.animationNum = 0;
    this.labMemberAudio = new Audio();
    this.doorOpenAudio = new Audio('./assets/effects/dooropen.mp3');
    this.doorCloseAudio = new Audio('./assets/effects/doorclose.mp3');
    this.doorButtonAudio = new Audio('./assets/effects/doorbutton.mp3');
    this.secretFoundAudio = new Audio('./assets/effects/secret.mp3');

  },

  initTrackingVariables: function () {
    this.labMembersContent = new Map(); // Lab member content
    this.doorsOpen = false; // Current state of doors
    this.pageNum = 1;
    this.maxPageNum = 2;
    this.isDoorAnimating = false; // Track if a door animation is in progress
    this.isModelAnimating = true;
    this.currentClip = null;
    this.currentLabMember = null; // Track the current lab member ID
    this.memberURL = null;
    this.hasAnimation = false;
    this.hasLink = false;
    this.textAnimation = null;
    this.buttonsPerPage = 12;
    this.totalButtons = 0;
    this.noteMaximumSize = 0.03; // Largest allowable font size
    this.history = new IDHistory();
    this.pi = [3, 1, 4, 1, 5];
    this.euler = [2, 1, 7, 8];
    this.birth = [4, 12, 1, 9, 9, 9];
    // Animation Variables - Modify these to adjust animation timings and positions
    this.doorOpenDuration = 1000; // Duration of opening animation (Default: 1000)
    this.doorOpenPosition = 0.35; // Absolute value of x position of doors in their opened state (Default: 0.35)
    this.doorOpenEasing = "easeInOutQuad"; // Easing (Default: 'easeInOutQuad')

    this.doorCloseDuration = 1000; // Duration of closing animation (Default: 1000)
    this.doorClosePosition = 0; // Absolute value of x position of doors in their closed state (Default: 0)
    this.doorCloseEasing = "easeInOutQuad"; // Easing (Default: 'easeInOutQuad')

    this.modelEnterDuration = 1000; // Duration of entering animation (Default: 1000)
    this.modelEnterPosition = 0.3; // Final y position of model upon entering (Default: 0.25)
    this.modelEnterDelay = 25; // Duration of delay between doors opening and model movement (Default: 25)
    this.modelEnterEasing = "easeInOutQuad"; // Easing (Default: 'easeInOutQuad')

    this.modelExitDuration = 1000; // Duration of exiting animation (Default: 1000)
    this.modelExitPosition = -2; // Final y position of model upon exiting (Default: 0)
    this.modelExitEasing = "easeInOutQuad"; // Easing (Default: 'easeInOutQuad')

    this.doorOpenPause = 500; // Time delay between click and door opening (Default: 500)
    this.doorReopenPause = 500; // Time delay between door closing and reopening (Default: 500)
    this.highlightDuration = 75; // Duration of button highlight upon click (Default: 75)
    this.smokeBlasterDuration = 2000; // Duration of active door steam blasters

    this.buttonColor = "#FFC904"; // Default color of button planes
    this.highlightColor = "#d0a50a"; // Highlight color upon click

    // Lab Member Note Attributes
    this.noteMaximumSize = 0.03; // Largest allowable font size (Default: 0.03)
  },

  bindFunctions: function () {
    this.openDoors = this.openDoors.bind(this);
    this.closeDoors = this.closeDoors.bind(this);
    this.displayModel = this.displayModel.bind(this);
    this.hideModel = this.hideModel.bind(this);
    this.viewLabMember = this.viewLabMember.bind(this);
    this.hideModelAndCloseDoors = this.hideModelAndCloseDoors.bind(this);
    this.highlightButton = this.highlightButton.bind(this);
    this.onLeftArrowClick = this.onLeftArrowClick.bind(this);
    this.onRightArrowClick = this.onRightArrowClick.bind(this);
    this.highlightCurrentLabMemberButton =
      this.highlightCurrentLabMemberButton.bind(this);
    this.loadLabMembers = this.loadLabMembers.bind(this);
    this.showLabMember = this.showLabMember.bind(this);
  },

  fetchLocalContent: async function () {
    const metadataUrl = '/assets/content/metadata.json';

    try {
        // Fetch metadata.json to get the number of members
        const response = await fetch(metadataUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const metadata = await response.json();
        const numMembers = metadata.numMembers;

        const labMembersContent = new Map();

        // Iterate through each folder from '1' to 'numMembers'
        for (let i = 1; i <= numMembers; i++) {
            const folderName = i.toString();
            const folderContent = await this.fetchFolderContent(folderName);
            labMembersContent.set(folderName, folderContent);
        }

        return labMembersContent;
    } catch (error) {
        console.error('Error fetching local content:', error);
        this.displayErrorMessage();
        return new Map();
    }
},

fetchFolderContent: async function (folderName) {
  const folderPath = `/assets/content/${folderName}`;
  const paramFilePath = `${folderPath}/param.json`;

  try {
      // Fetch the param.json file
      const response = await fetch(paramFilePath);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const paramData = await response.json();

      // Extract the audio and model file names from param.json
      const modelFileName = paramData.model.modelFile;
      const audioFileName = paramData.member.audioFile;

      // Construct the full URLs for the model and audio files
      const modelFileUrl = modelFileName ? `${folderPath}/${modelFileName}` : `/assets/content/${folderName}/model.glb`;
      const audioFileUrl = audioFileName ? `${folderPath}/${audioFileName}` : null;

      return {
          modelUrl: modelFileUrl,
          jsonUrl: paramFilePath,
          audioUrl: audioFileUrl,
      };
  } catch (error) {
      console.error("Error fetching folder content:", error);
      this.displayErrorMessage();
      return {};
  }
},

  displayErrorMessage: function () {
    this.errorText.setAttribute("visible", true);
  },

  nextPage: function () {
    if (this.pageNum < this.totalPages) {
      this.pageNum++;
      this.updateButtons();

      // If we're on the last page, remove the Next Page button
      if (this.pageNum == this.totalPages) {
        this.nextPageButton.setAttribute("visible", false);
        this.nextPageButton.setAttribute("class", "");
        this.nextPageButtonFrame.setAttribute("visible", false);
      }

      // After incrementing pageNum, enable Previous Page button
      this.previousPageButton.setAttribute("visible", true);
      this.previousPageButton.setAttribute("class", "clickable");
      this.previousPageButtonFrame.setAttribute("visible", true);
    }
  },

  previousPage: function () {
    if (this.pageNum > 1) {
      this.pageNum--;
      this.updateButtons();

      // If we're on the first page, remove the Previous Page button
      if (this.pageNum == 1) {
        this.previousPageButton.setAttribute("visible", false);
        this.previousPageButton.setAttribute("class", "");
        this.previousPageButtonFrame.setAttribute("visible", false);
      }

      // After decrementing pageNum, enable Next Page button
      this.nextPageButton.setAttribute("visible", true);
      this.nextPageButton.setAttribute("class", "clickable");
      this.nextPageButtonFrame.setAttribute("visible", true);
    }
  },

  updateButtons: function () {
    const startIdx = (this.pageNum - 1) * this.buttonsPerPage;
    const labMembersContentArray = Array.from(this.labMembersContent.entries());

    for (let i = 1; i <= this.buttonsPerPage; i++) {
      const buttonId = `ID-${i}`;
      const textId = `text-${i}`;
      const frameId = `frame-ID-${i}`;
      const buttonElement = document.querySelector(`#${buttonId}`);
      const textElement = document.querySelector(`#${textId}`);
      const frameElement = document.querySelector(`#${frameId}`);

      const dataIndex = startIdx + i - 1;

      if (dataIndex < this.totalButtons) {
        const [folderName, folderContent] = labMembersContentArray[dataIndex];
        console.log("foldername", folderName);
        console.log("Updating button:", buttonId, "with folder:", folderName); // Log button update details

        buttonElement.setAttribute("visible", true);
        frameElement.setAttribute("visible", true);
        buttonElement.setAttribute("class", "clickable");
        buttonElement.setAttribute("name", folderName);

        // Pad the folder name with zeros to ensure it is 3 digits long
        const paddedName = folderName.padStart(3, "0");
        textElement.setAttribute("value", paddedName);
      } else {
        buttonElement.setAttribute("visible", false);
        frameElement.setAttribute("visible", false);
        buttonElement.setAttribute("class", "");
      }
    }
  },

  /**
   * Open the doors
   *
   * @param callback The model
   */
  openDoors: function (callback) {
    // If doors are not open and all animations are finished
    if (!this.doorsOpen) {
      // Start the particle emitter
      this.smokeEmitter.startParticles();
      // Animate the doors to open
      AFRAME.ANIME({
        targets: [
          this.doorLeft.object3D.position,
          this.doorRight.object3D.position,
        ],
        x: (obj) =>
          obj === this.doorLeft.object3D.position
            ? -this.doorOpenPosition
            : this.doorOpenPosition,
        duration: this.doorOpenDuration,
        easing: this.doorOpenEasing,
        update: () => {
          this.doorLeft.setAttribute(
            "position",
            this.doorLeft.object3D.position
          );
          this.doorRight.setAttribute(
            "position",
            this.doorRight.object3D.position
          );
        },
        complete: () => {
          // Once complete, mark doors as open
          this.doorsOpen = true;
          // Start the callback to begin the model animation
          if (callback) callback();
        },
      });
    }
  },

  closeDoors: function (callback) {
    if (this.doorsOpen) {
      AFRAME.ANIME({
        targets: [
          this.doorLeft.object3D.position,
          this.doorRight.object3D.position,
        ],
        x: this.doorClosePosition,
        duration: this.doorCloseDuration,
        easing: this.doorCloseEasing,
        update: () => {
          this.doorLeft.setAttribute(
            "position",
            this.doorLeft.object3D.position
          );
          this.doorRight.setAttribute(
            "position",
            this.doorRight.object3D.position
          );
        },
        complete: () => {
          this.doorsOpen = false;
          if (callback) callback();
        },
      });
    }
  },

  displayModel: function () {
    AFRAME.ANIME({
      targets: this.centerEntity.object3D.position,
      y: this.modelEnterPosition,
      duration: this.modelEnterDuration,
      easing: this.modelEnterEasing,
      update: () => {
        this.centerEntity.setAttribute(
          "position",
          this.centerEntity.object3D.position
        );
      },
      complete: () => {
        this.isDoorAnimating = false;
      },
    });
  },

  hideModel: function (callback) {
    AFRAME.ANIME({
      targets: this.centerEntity.object3D.position,
      y: this.modelExitPosition,
      duration: this.modelExitDuration,
      easing: this.modelExitEasing,
      update: () => {
        this.centerEntity.setAttribute(
          "position",
          this.centerEntity.object3D.position
        );
      },
      complete: () => {
        if (callback) callback();
      },
    });
  },

  writeText: function (element, text, speed = 10) {
    let currentIndex = 0;
    const textLength = text.length;

    // Store the animation instance
    this.textAnimation = AFRAME.ANIME({
      targets: { index: currentIndex },
      index: textLength,
      easing: "linear",
      duration: speed * textLength, // Total duration based on speed and text length
      update: (anim) => {
        const currentProgress = anim.animations[0].currentValue; // Get current value of the animation
        const currentText = text.substring(0, Math.ceil(currentProgress)); // Update text content
        element.setAttribute("value", currentText);
      },
      complete: () => {
        element.setAttribute("value", text); // Set final text value after animation completes
      },
    });
  },

  stopTextAnimation: function () {
    if (this.textAnimation) {
      this.textAnimation.pause();
    }
  },

  remove: function () {
    // Clean up by removing the event listener if the component is removed
    this.el.sceneEl.removeEventListener("click", this.onClick);
  },

  onClick: function (evt) {
    // Stop concurrent animations
    console.log("is Animating? ", this.isDoorAnimating);
    console.log("clicked on" + evt.detail.intersectedEl.id);
    if (this.isDoorAnimating) return;
    this.playDoorButtonAudio();
    switch (evt.detail.intersectedEl.id) {
      case "previous-plane": // Previous Page
        this.highlightButton(evt.detail.intersectedEl);
        this.previousPage();
        return;
      case "next-plane": // Next Page
        this.highlightButton(evt.detail.intersectedEl);
        this.nextPage();
        return;
      case "left-arrow-button": // Previous Lab Member
        this.highlightButton(evt.detail.intersectedEl);
        this.hasAnimation = false;
        this.hasLink = false;
        this.stopTextAnimation();
        this.onLeftArrowClick();
        return;
      case "right-arrow-button": // Next Lab Member
        this.highlightButton(evt.detail.intersectedEl);
        this.hasAnimation = false;
        this.hasLink = false;
        this.stopTextAnimation();
        this.onRightArrowClick();
        return;
      case "left-panel-menu-button": // Back to Menu
        this.hideModelAndCloseDoors(() => {
          this.stopTextAnimation();
          this.showMenuButtons();
          this.hideLabMemberObjects();
          this.hideRightPanelButtons();
          this.clearLabMemberInfo();
          this.currentLabMember = null;
          this.hasAnimation = false;
          this.hasLink = false;
          this.egg();
        });
        return;
      case "right-panel-bottom-right-button": // Link to Personals
      case "right-panel-bottom-link-button":
        window.open(this.memberURL, "_blank");
        return;
      case "right-panel-bottom-left-button": // Play/Pause Animation
      case "right-panel-bottom-animation-button":
        this.toggleModelAnimation();
        return;
      default: // Clicked on ID
        break;
    }

    // Get the 'name' attribute of the clicked button
    const buttonName = evt.detail.intersectedEl.getAttribute("name");
    const buttonId = parseInt(buttonName); // Extract the ID number from the 'name'
    // If the clicked button is the currently set member, do nothing
    if (this.currentLabMember == buttonId) return;
    // Update the currentLabMember and highlight the button
    this.currentLabMember = buttonId;

    // Hide lab member buttons
    this.hideMenuButtons();

    // Show Menu button
    this.showLabMemberObjects();
    //this.highlightCurrentLabMemberButton();

    // If doors are already open, close them before reopening
    if (this.doorsOpen) {
      console.log("Closing doors and hiding model!");
      this.hideModelAndCloseDoors(() => {
        // Add a delay before opening doors and displaying model
        setTimeout(() => {
          console.log("viewing lab member at point 1");
          this.playDoorCloseAudio();
          this.viewLabMember(buttonId);
        }, this.doorReopenPause);
      });
    } else {
      // Add a delay before opening doors and displaying model
      setTimeout(() => {
        this.viewLabMember(buttonId);
      }, this.doorOpenPause);
    }
  },

  hideMenuButtons: function () {
    if (this.currentLabMember) {
      this.labMemberButtons.forEach((button) => {
        button.setAttribute("visible", "false");
        button.setAttribute("class", "");
      });
      this.labMemberButtonFrames.forEach((frame) => {
        frame.setAttribute("visible", "false");
      });
      this.nextPageButton.setAttribute("visible", "false");
      this.nextPageButton.setAttribute("class", "");
      this.nextPageButtonFrame.setAttribute("visible", "false");
      this.previousPageButton.setAttribute("visible", "false");
      this.previousPageButton.setAttribute("class", "");
      this.previousPageButtonFrame.setAttribute("visible", "false");
    }
  },

  showMenuButtons: function () {
    this.updateButtons();
    this.nextPageButton.setAttribute("visible", this.pageNum < this.totalPages);
    this.nextPageButton.setAttribute(
      "class",
      this.pageNum < this.totalPages ? "clickable" : ""
    );
    this.nextPageButtonFrame.setAttribute(
      "visible",
      this.pageNum < this.totalPages
    );
    this.previousPageButton.setAttribute("visible", this.pageNum > 1);
    this.previousPageButton.setAttribute(
      "class",
      this.pageNum > 1 ? "clickable" : ""
    );
    this.previousPageButtonFrame.setAttribute("visible", this.pageNum > 1);
  },

  showLabMemberObjects: function () {
    this.leftPanelMenuButton.setAttribute("visible", true);
    this.leftPanelMenuButton.setAttribute("class", "clickable");
    this.leftLineDivider.setAttribute("visible", true);
    this.topQuotes.setAttribute("visible", true);
    this.bottomQuotes.setAttribute("visible", true);
    this.labMemberNumberBox.setAttribute("visible", true);
    this.labMemberYearsBox.setAttribute("visible", true);
    this.labMemberYearDash.setAttribute("visible", true);
    this.labMemberYearDash.setAttribute("visible", true);
    this.labMemberYearsActive.setAttribute("visible", true);
    this.leftArrow.setAttribute("visible", true);
    this.leftArrowButton.setAttribute("class", "clickable");
    this.leftArrowContainer.setAttribute("visible", true);
    this.rightArrow.setAttribute("visible", true);
    this.rightArrowButton.setAttribute("class", "clickable");
    this.rightArrowContainer.setAttribute("visible", true);
  },

  hideLabMemberObjects: function () {
    this.leftPanelMenuButton.setAttribute("visible", false);
    this.leftPanelMenuButton.setAttribute("class", "");
    this.leftLineDivider.setAttribute("visible", false);
    this.topQuotes.setAttribute("visible", false);
    this.bottomQuotes.setAttribute("visible", false);
    this.labMemberNumberBox.setAttribute("visible", false);
    this.labMemberYearsBox.setAttribute("visible", false);
    this.labMemberYearDash.setAttribute("visible", false);
    this.labMemberYearsActive.setAttribute("visible", false);
    this.modelCredit.setAttribute("value", "");
    this.leftArrow.setAttribute("visible", false);
    this.leftArrowButton.setAttribute("class", "");
    this.leftArrowContainer.setAttribute("visible", false);
    this.rightArrow.setAttribute("visible", false);
    this.rightArrowButton.setAttribute("class", "");
    this.rightArrowContainer.setAttribute("visible", false);
  },

  hideRightPanelButtons: function () {
    this.rightPanelBottomLeftButton.setAttribute("class", "");
    this.rightPanelBottomLeftButton.setAttribute("visible", false);
    this.rightPanelBottomRightButton.setAttribute("class", "");
    this.rightPanelBottomRightButton.setAttribute("visible", false);
    this.rightPanelBottomAnimationButton.setAttribute("class", "");
    this.rightPanelBottomAnimationButton.setAttribute("visible", false);
    this.rightPanelBottomLinkButton.setAttribute("class", "");
    this.rightPanelBottomLinkButton.setAttribute("visible", false);
  },

  clearLabMemberInfo: function () {
    this.labMemberNumber.setAttribute("value", "");
    this.labMemberName.setAttribute("value", "");
    this.labMemberRole.setAttribute("value", "");
    this.labMemberNote.setAttribute("value", "");
    this.labMemberStartYear.setAttribute("value", "");
    this.labMemberEndYear.setAttribute("value", "");
  },

  setPanelButtons: function () {
    if (this.hasAnimation && this.hasLink) {
      // Enable the two button setup
      this.rightPanelBottomLeftButton.setAttribute("class", "clickable");
      this.rightPanelBottomLeftButton.setAttribute("visible", true);
      this.rightPanelBottomRightButton.setAttribute("class", "clickable");
      this.rightPanelBottomRightButton.setAttribute("visible", true);
    } else if (this.hasAnimation) {
      // Enable only the animation button
      this.rightPanelBottomAnimationButton.setAttribute("class", "clickable");
      this.rightPanelBottomAnimationButton.setAttribute("visible", true);
    } else if (this.hasLink) {
      // Enable only the link button
      this.rightPanelBottomLinkButton.setAttribute("class", "clickable");
      this.rightPanelBottomLinkButton.setAttribute("visible", true);
    }
  },

  resetModelAnimation: function () {
    this.isModelAnimating = false;
    this.rightPanelBottomLeftButtonText.setAttribute(
      "value",
      "Pause Animation"
    );
    this.rightPanelBottomLeftButtonIcon.setAttribute("src", "#pauseIcon");
    this.rightPanelBottomAnimationButtonText.setAttribute(
      "value",
      "Pause Animation"
    );
    this.rightPanelBottomAnimationButtonIcon.setAttribute("src", "#pauseIcon");
    if (this.hasAnimation) {
      this.currentClip.play();
      this.currentClip.setEffectiveTimeScale(1);
    }
  },

  toggleModelAnimation: function () {
    console.log("toggline ", this.isModelAnimating);
    if (!this.isModelAnimating) {
      if (this.hasLink) {
        this.rightPanelBottomLeftButtonText.setAttribute(
          "value",
          "Play Animation"
        );
        this.rightPanelBottomLeftButtonIcon.setAttribute("src", "#playIcon");
      } else {
        this.rightPanelBottomAnimationButtonText.setAttribute(
          "value",
          "Play Animation"
        );
        this.rightPanelBottomAnimationButtonIcon.setAttribute(
          "src",
          "#playIcon"
        );
      }

      this.currentClip.halt();
    } else {
      if (this.hasLink) {
        this.rightPanelBottomLeftButtonText.setAttribute(
          "value",
          "Pause Animation"
        );
        this.rightPanelBottomLeftButtonIcon.setAttribute("src", "#pauseIcon");
      } else {
        this.rightPanelBottomAnimationButtonText.setAttribute(
          "value",
          "Pause Animation"
        );
        this.rightPanelBottomAnimationButtonIcon.setAttribute(
          "src",
          "#pauseIcon"
        );
      }
      this.currentClip.play();
      this.currentClip.setEffectiveTimeScale(1);
    }
    this.isModelAnimating = !this.isModelAnimating;
  },

  highlightButton: function (plane) {
    // Change the button color to highlight color
    plane.setAttribute("material", "color", this.highlightColor);

    // Revert back to the original color after the highlight duration
    setTimeout(() => {
      plane.setAttribute("material", "color", this.buttonColor);
    }, this.highlightDuration);
  },

  onLeftArrowClick: function () {
    if (this.isDoorAnimating || this.currentLabMember == null) return;
    // Determine the previous lab member ID
    const prevLabMember = this.currentLabMember - 1;

    if (prevLabMember < 1) {
      // If it's the first member on the current page, move to the previous page
      this.pageNum = Math.max(this.pageNum - 1, 1);
      this.loadLabMembers(this.pageNum);
    } else {
      this.showLabMember(prevLabMember);
    }
  },

  onRightArrowClick: function () {
    if (this.isDoorAnimating) return;

    if (this.currentLabMember == null) {
      this.currentLabMember = 0;
    }

    // Determine the next lab member ID
    const nextLabMember = this.currentLabMember + 1;
    if (nextLabMember > 12) {
      // If it's the last member on the current page, move to the next page
      this.pageNum = Math.min(this.pageNum + 1, this.maxPageNum);
      this.loadLabMembers(this.pageNum);
    } else {
      this.showLabMember(nextLabMember);
    }
  },

  playLabMemberAudio: function () {
    this.labMemberAudio.play();
  },

  stopLabMemberAudio: function () {
    this.labMemberAudio.pause();
  },

  playDoorOpenAudio: function () {
    this.doorOpenAudio.play();
  },

  playDoorCloseAudio: function () {
    this.doorCloseAudio.play();
  },

  playDoorButtonAudio: function () {
    this.doorButtonAudio.play();
  },

  playSecretFoundAudio: function () {
    this.secretFoundAudio.play();
  },

  viewLabMember: function (markerID) {
    this.playDoorOpenAudio();
    // Track the current lab member
    this.currentLabMember = markerID;
    this.labMemberNote.setAttribute("value", "");
    this.modelCredit.setAttribute("value", "");
    this.animationNum = 0;
    this.history.add(markerID);
    // Check if the markerID exists in the labMembersContent Map
    const labMemberContent = this.labMembersContent.get(markerID.toString());
    if (!labMemberContent) {
      console.error("Lab member content not found");
      return;
    }

    const { modelUrl, jsonUrl, audioUrl } = labMemberContent;
    if (!modelUrl || !jsonUrl) {
      console.error("Model or JSON file URL not found");
      return;
    }

    // Fetch the JSON parameter file
    fetch(jsonUrl)
      .then((response) => response.json())
      .then((jsonData) => {
        console.log(jsonData);
        if (jsonData.model) {
          // Apply custom model parameters
          const modelParams = {
            scale: "scale",
            position: "position",
            rotation: "rotation",
            color: "color",
            opacity: "opacity",
            visible: "visible",
            castShadow: "cast-shadow",
            receiveShadow: "receive-shadow",
          };
          for (const [key, attr] of Object.entries(modelParams)) {
            if (jsonData.model[key]) {
              console.log("setting param ", key);
              this.centerEntity.setAttribute(attr, jsonData.model[key]);
            } else {
              // Set default values
              switch (attr) {
                case "scale":
                  this.centerEntity.setAttribute(attr, "0.2 0.2 0.2");
                  break;
                case "position":
                  console.log("setting default pos");
                  this.centerEntity.setAttribute(attr, "0 -2 0");
                  break;
                case "rotation":
                  this.centerEntity.setAttribute(attr, "-90 0 0");
                  break;
                case "color":
                  this.centerEntity.setAttribute(attr, "#ffffff");
                  break;
                case "opacity":
                  this.centerEntity.setAttribute(attr, "1");
                  break;
                case "visible":
                  this.centerEntity.setAttribute(attr, "true");
                  break;
                case "cast-shadow":
                  this.centerEntity.setAttribute(attr, "true");
                  break;
                case "receive-shadow":
                  this.centerEntity.setAttribute(attr, "true");
                  break;
              }
            }
          }
        }
        // Set the gltf-model attribute of the center entity to the model URL
        this.centerEntity.setAttribute("gltf-model", modelUrl);

        // If lab member included a link
        if (jsonData.member.link) {
          this.hasLink = true;
          this.memberURL = jsonData.member.link;
        }

        // If lab member included an animation index
        if (jsonData.model.animationIndex) {
          this.animationNum = parseInt(jsonData.model.animationIndex);
        }

        // If model must be credited
        if (jsonData.model.credit) {
          this.modelCredit.setAttribute("value", jsonData.model.credit);
        }

        // Check for animations in the loaded model
        this.centerEntity.addEventListener("model-loaded", () => {
          const model = this.centerEntity.getObject3D("mesh");
          if (model && model.animations && model.animations.length > 0) {
            this.hasAnimation = true;
            // Create a mixer to play the animations
            this.mixer = new THREE.AnimationMixer(model);
            this.clips = model.animations;

            // Play the animation
            this.currentClip = this.mixer.clipAction(
              this.clips[this.animationNum]
            );
            this.currentClip.play();

            // Update the animation on each frame
            this.tick = (time, deltaTime) => {
              if (this.mixer) {
                this.mixer.update(deltaTime / 1000);
              }
            };
            this.el.sceneEl.addBehavior(this);
          }
          // Set the panel buttons here to ensure animations are checked before
          this.hideRightPanelButtons();
          this.setPanelButtons();
          this.resetModelAnimation();

          // Set the value of the text attributes to the extracted information
          // Dynamically set the font size depending on character length
          this.labMemberNote.setAttribute(
            "font-size",
            Math.max(
              0.07 -
                (jsonData.member.note.length / 100) *
                  (0.07 - this.noteMaximumSize),
              this.noteMaximumSize
            )
          );
          this.labMemberNumber.setAttribute("value", jsonData.member.labID);
          this.labMemberName.setAttribute("value", jsonData.member.name);
          this.labMemberRole.setAttribute("value", jsonData.member.role);
          this.labMemberNote.setAttribute("value", jsonData.member.note);
          this.labMemberStartYear.setAttribute(
            "value",
            jsonData.member.startYear == null
              ? "2024"
              : jsonData.member.startYear
          );
          this.labMemberEndYear.setAttribute(
            "value",
            jsonData.member.endYear == null
              ? "Present"
              : jsonData.member.endYear
          );
          this.virtualRoomNumber.setAttribute("value", jsonData.member.labID);
          this.labMemberAudio.src = audioUrl;
          if (this.labMemberAudio.src) this.playLabMemberAudio();

          // Now that the model and info are ready, open the doors and display the model
          this.isDoorAnimating = true;
          this.openDoors(() => {
            // Small delay before moving model
            setTimeout(() => {
              this.displayModel();
            }, this.modelEnterDelay);
          });
        });
      })
      .catch((error) => console.error("Error fetching JSON file:", error));
  },

  hideModelAndCloseDoors: function (callback) {
    // Stop the particle emitter
    this.smokeEmitter.stopParticles();
    this.playDoorCloseAudio();
    this.stopLabMemberAudio();
    this.isDoorAnimating = true;
    this.hideModel(() => {
      this.closeDoors(callback);
    });
    this.isDoorAnimating = false;
  },

  // Does nothing, no need to look here
  egg: function () {
    console.log(this.history.getHistory());
    if (this.history.checkPattern(this.pi)) {
      this.playSecretFoundAudio();
      this.startRain();
    }
  },

  showLabMember: function (labMemberId) {
    if (this.isDoorAnimating) return;

    if (this.doorsOpen) {
      this.isDoorAnimating = true;
      this.hideModelAndCloseDoors(() => {
        this.viewLabMember(labMemberId);
      });
    } else {
      this.viewLabMember(labMemberId);
    }
  },

  highlightCurrentLabMemberButton: function () {
    this.labMemberButtons.forEach((button) => {
      const buttonName = button.getAttribute("name");
      const buttonId = parseInt(buttonName);
      //console.log("comparing: " + buttonId + ", to " +  this.currentLabMember);
      if (buttonId === this.currentLabMember)
        button.setAttribute("color", this.highlightColor);
      else button.setAttribute("color", this.buttonColor);
    });
  },
  loadLabMembers: function (page) {
    // Logic to load lab members for the given page number
    // This can include fetching data and updating the labMemberButtons array
    // Update this.labMemberButtons to reflect the new set of buttons for the page
  },


  startRain: function () {
    this.rain.startParticles();

  }
});

// AFRAME.registerComponent("model-rotator", {
//   init: function () {
//     // Store initial rotation and mouse position
//     this.initialRotation = { x: 0, y: 0 };
//     this.initialMousePosition = { x: 0, y: 0 };

//     // Bind event handlers to component instance
//     this.onMouseDown = this.onMouseDown.bind(this);
//     this.onMouseMove = this.onMouseMove.bind(this);
//     this.onMouseUp = this.onMouseUp.bind(this);

//     // Add event listeners for mouse events
//     this.el.addEventListener("mousedown", this.onMouseDown);
//     this.el.addEventListener("mouseup", this.onMouseUp);
//     window.addEventListener("mousemove", this.onMouseMove);
//   },

//   remove: function () {
//     // Remove event listeners when the component is removed
//     this.el.removeEventListener("mousedown", this.onMouseDown);
//     this.el.removeEventListener("mouseup", this.onMouseUp);
//     window.removeEventListener("mousemove", this.onMouseMove);
//   },

//   onMouseDown: function (event) {
//     // Store initial mouse position and rotation
//     this.initialMousePosition.x = event.clientX;
//     this.initialMousePosition.y = event.clientY;
//     this.initialRotation.x = this.el.object3D.rotation.x;
//     this.initialRotation.y = this.el.object3D.rotation.y;
//   },

//   onMouseMove: function (event) {
//     // Check if mouse button is pressed
//     if (event.buttons === 1) {
//       // Calculate rotation change based on mouse movement
//       const rotationChangeX =
//         (event.clientX - this.initialMousePosition.x) / 500;
//       const rotationChangeY =
//         (event.clientY - this.initialMousePosition.y) / 500;

//       // Apply rotation change to the model
//       this.el.object3D.rotation.x = this.initialRotation.x - rotationChangeY;
//       this.el.object3D.rotation.y = this.initialRotation.y + rotationChangeX;
//     }
//   },

//   onMouseUp: function () {
//     // Reset initial mouse position and rotation
//     this.initialMousePosition.x = 0;
//     this.initialMousePosition.y = 0;
//     this.initialRotation.x = 0;
//     this.initialRotation.y = 0;
//   },
// });

class IDHistory {
  constructor(maxSize = 5) {
    this.maxSize = maxSize;
    this.history = [];
  }

  add(id) {
    // Add new ID
    this.history.push(id);

    // Remove the oldest ID if needed
    if (this.history.length > this.maxSize) {
      this.history.shift();
    }
  }

  getHistory() {
    return this.history;
  }

  checkPattern(pattern) {
    return JSON.stringify(this.history) === JSON.stringify(pattern);
  }
}

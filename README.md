# Project Name

Welcome to the Project Name repository! This project is designed to [brief description of the project].

## Table of Contents
- [About the Project](#about-the-project)
- [Uploading New Content](#uploading-new-content)
  - [Adding New Entries](#adding-new-entries)
- [Useful Websites for 3D Models](#useful-websites-for-3d-models)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About the Project

This repository hosts the Mixed Reality Interactive Wall project as well as houses the content for each lab member.


## Uploading New Content
### Adding New Entries

To add a new lab member or entry:

- Create a new directory: Create a new directory for the member under /assets/content/ with a unique identifier.

```
  /assets/content/<member_id>/
```
- Prepare your model: Ensure your model file is in the correct format (e.g., .glb, .gltf).

- Update param.json: Ensure the param.json file in the same directory has the correct modelFile entry:

param.json example:

```json
{
  "member": {
    "name": "John Doe",
    "labID": "002",
    "role": "Graduate Research Assistant",
    "note": "Exploring the intersection of AR and VR",
    "link": "https://johndoe.com",
    "startYear": "2021",
    "audioFile": "audio.mp3"
  },
  "model": {
    "modelFile": "model.glb",
    "position": "0 -2 0.5",
    "scale": "0.4 0.4 0.4",
    "animationIndex": "2",
    "credit" : "CREDIT INFORMATION HERE"
  }
}
```
- (Optional) include an audio.mp3 or audio.ogg in the directory and specify it in the param.json

## Useful Websites for 3D Models

Freemium AI tool to convert text into a 3D model

https://www.meshy.ai/features/text-to-3d


https://sketchfab.com/

https://www.turbosquid.com/

https://free3d.com/

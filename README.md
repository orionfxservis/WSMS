# WSMS Project Structure

This repository contains the codebase for the Water Supply Management System (WSMS). The project adheres to a clean, modular workflow to separate styling, scripts, structure, and assets.

## Directory Workflow

The workflow and file structure is organized as follows:

```
/css/style.css
    - Contains all global styles, themes, and responsive design rules.
/js/script.js
    - Contains all JavaScript logic, state management, and interactivity for the dashboard and pages. All JS files should be placed here.
/images/logo/logo.png
    - Contains image assets. The main vector logo is placed here.
/pages/about.html
    - The "About Us" page detailing company information.
/pages/cookies.html
    - The Cookie Policy.
/pages/privacy.html
    - The Privacy Notice.
/pages/terms.html
    - The Terms of Service.
index.html
    - The main landing page, authentication, and comprehensive dashboard view.
```

## How to Contribute
- **Styling Changes:** Make all updates to `/css/style.css`.
- **Script Changes:** Place all new scripts and modifications in the `/js/` folder.
- **New Pages:** Add any new secondary or legal pages to the `/pages/` directory and ensure they link the global CSS and JS properly.

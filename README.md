# app-invontery

This repository contains an inventory management web app built with Python and Flask.

## Run locally

1. Create and activate a Python virtual environment:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```
2. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
3. Start the app:
   ```powershell
   python app.py
   ```
4. Open the browser at `http://127.0.0.1:5000`

## Deploy live with Render

This project is ready to deploy on [Render](https://render.com/) or any service that supports Python WSGI apps.

1. Push this repository to GitHub.
2. Create a new Web Service on Render.
3. Connect your GitHub repository.
4. Set the following build and runtime settings:
   - **Environment**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
5. Deploy and open the live URL provided by Render.

## Files added for deployment

- `requirements.txt` — Flask and Gunicorn dependencies
- `Procfile` — tells Render how to start the app
- `runtime.txt` — specifies the Python version
- `.gitignore` — ignores local environment and build artifacts
- `.nojekyll` — ensures GitHub Pages serves the static site correctly

## GitHub Pages live site

The repository now includes a static root `index.html` and JavaScript inventory logic, so GitHub Pages can host the app as a live website.

If Pages is enabled for this repo, the live link should be:

`https://bashiirabshircali7772-blip.github.io/app-invontery/`

If the page is not yet live, open your repo Settings > Pages and set the source to the `main` branch and the root folder `/`.

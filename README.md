# react-flask-base
WIP

## Running locally
* Frontend (`cd frontend`)
  * Setup: `npm install`
  * Running locally: `npm run start`
* Backend (`cd backend`)
  * Setup:
    * Set up virtualenv. For example, `virtualenv venv; source venv/bin/activate`
      * This project supports latest version of python 3.6. I'm using `3.6.8`. Later versions may have issues on our deployment framework (Zappa) which deploys to AWS Lambda.
    * `pip install -r requirements.txt`
    * Set up .env file
      ```
      FLASK_CONFIG=development
      DB_USERNAME=postgres
      DB_PASSWORD=<YOUR_DB_PASSWORD>
      DB_ENDPOINT=<YOUR_DB_ENDPOINT>
      DB_PORT=5432
      DB_NAME=<YOUR_DB_NAME>
      MAIL_DEFAULT_SENDER=no-reply@<YOUR DOMAIN>
      SENDGRID_API_KEY=<YOUR_SENDGRID_KEY>
      FRONTEND_URL=http://localhost:3000
      ```
    * `python manage.py recreate_db`
    * `python manage.py setup_dev`
  * Running locally: `python manage.py runserver`

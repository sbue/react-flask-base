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
    * `pip install -r dev-requirements.txt`
    * Set up `config.env` file
      ```
      FLASK_CONFIG=default
      DATABASE_URL=data-dev.sqlite	
      ADMIN_EMAIL=flask-base-admin@example.com
      ADMIN_PASSWORD=password
      FRONTEND_URL=http://localhost:3000
      # Sendgrid configs. Only configure if you need to send mail.
      MAIL_DEFAULT_SENDER=no-reply@<YOUR DOMAIN> 
      SENDGRID_API_KEY=<YOUR_SENDGRID_KEY>
      # DB configs for production
      DB_NAME=postgres
      DB_USERNAME=<YOUR_DB_USERNAME>
      DB_PASSWORD=<YOUR_DB_PASSWORD>
      DB_ENDPOINT=<YOUR_DB_ENDPOINT>
      DB_PORT=5432
      ```
      * `FLASK_CONFIG` can be `default`, `development`, `staging`, and `production`. `default` resolves to `development`
      * DB configs are only necessary for production environments
    * `python manage.py recreate_db`
    * `python manage.py setup_dev`
  * Running locally: `python manage.py runserver`

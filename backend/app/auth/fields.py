from marshmallow import fields, validate

name_validate = validate.Length(min=2, max=50)
name_field = fields.Str(required=True, validate=name_validate)
email_validate = validate.Length(min=4, max=250)
email_field = fields.Email(required=True, validate=email_validate)
password_validate = validate.Length(min=8, max=250)
password_field = fields.Str(required=True, validate=password_validate)

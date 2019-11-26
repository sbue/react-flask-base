from marshmallow import fields, validate

name_field = fields.Str(required=True, validate=validate.Length(min=2, max=50))
email_field = fields.Email(required=True, validate=validate.Length(min=4, max=250))
password_field = fields.Str(required=True, validate=validate.Length(min=8, max=250))

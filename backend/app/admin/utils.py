from app.utils import to_camel_case
from app import s3_fs


def get_user_payload(user):
    data = {
        'role': user.role.value,
        'verified_email': user.verified_email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'profile_photo_url': None,
    }
    if user.profile_photo_s3_key:
        data['profile_photo_url'] = s3_fs.url(user.profile_photo_s3_key)
    return to_camel_case(data)

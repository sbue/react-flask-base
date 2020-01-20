from app.utils import to_camel_case


def get_user_payload(user):
    data = {
        'role': user.role.value,
        'verified_email': user.verified_email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'profile_photo_url': user.profile_photo_url(),
        'allow_resend_invite': user.password_hash is None,
    }
    return to_camel_case(data)

from app.utils import to_camel_case


def get_user_payload(user):
    return to_camel_case({
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'role': user.role.value,
        'verified_email': user.verified_email,
    })

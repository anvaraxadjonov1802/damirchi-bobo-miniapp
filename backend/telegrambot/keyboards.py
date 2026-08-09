def main_menu_keyboard(webapp_url: str) -> dict:
    return {
        "inline_keyboard": [
            [
                {
                    "text": "Menyuni ochish",
                    "web_app": {"url": webapp_url},
                }
            ],
            [
                {"text": "Aloqa", "callback_data": "bot_info:contact"},
                {"text": "Yordam", "callback_data": "bot_info:help"},
            ],
            [
                {"text": "Damirchi haqida", "callback_data": "bot_info:about"},
            ],
        ]
    }


def back_to_menu_keyboard(webapp_url: str) -> dict:
    return {
        "inline_keyboard": [
            [
                {
                    "text": "Menyuni ochish",
                    "web_app": {"url": webapp_url},
                }
            ],
            [
                {"text": "Asosiy sahifa", "callback_data": "bot_info:home"},
            ],
        ]
    }

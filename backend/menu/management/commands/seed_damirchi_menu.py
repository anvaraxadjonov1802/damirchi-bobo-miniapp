from django.core.management.base import BaseCommand

from menu.models import Category, Product


MENU = [
    {
        "name_uz": "Ovqatlar 1",
        "name_ru": "Блюда 1",
        "sort_order": 1,
        "products": [
            ("Mastava", 40000),
            ("Qaynatma Shorva", 35000),
            ("Balaza", 40000),
            ("Olot somsa", 12000),
        ],
    },
    {
        "name_uz": "Ovqatlar 2",
        "name_ru": "Блюда 2",
        "sort_order": 2,
        "products": [
            ("Vaguri", 300000),
            ("Fele jiz", 310000),
            ("Avg’on jiz", 310000),
            ("Avashnoy jiz", 310000),
            ("Qovurilgan Qanotcha", 90000),
            ("Tabaka", 90000),
            ("Xorazim baliq", 130000),
            ("Xorazim baliq barbekiyu", 150000),
            ("Payli osh", 40000),
            ("Tandir somsa", 12000),
        ],
    },
    {
        "name_uz": "Shashliklar",
        "name_ru": "Шашлыки",
        "sort_order": 3,
        "products": [
            ("Qiyma", 25000),
            ("Mol jaz", 30000),
            ("Qoy jaz", 30000),
            ("Krilishka", 25000),
            ("Avashnoy", 18000),
            ("Barbekyu", 300000),
            ("Tobuq barbekyu", 90000),
        ],
    },
    {
        "name_uz": "Salatlar",
        "name_ru": "Салаты",
        "sort_order": 4,
        "products": [
            ("Achichuk", 30000),
            ("Chiroqchi", 32000),
            ("Sveji asarti", 38000),
            ("Mujiskoy Kapriz", 45000),
            ("Sezar", 45000),
            ("Aliviya", 35000),
            ("Smak", 40000),
            ("Yaponiskiy", 45000),
            ("Gurman", 45000),
            ("Baqlajon xurustiyashiy", 45000),
            ("Marinoviniy asarti", 30000),
            ("Mesnoy asarti", 220000),
            ("Frukta asarti", 180000),
        ],
    },
    {
        "name_uz": "Ichimliklar",
        "name_ru": "Напитки",
        "sort_order": 5,
        "products": [
            ("Kola 1l", 15000),
            ("Fanta 1l", 15000),
            ("Spite 1l", 15000),
            ("Billis 1 l", 20000),
            ("Flesh 0.33", 16000),
            ("Flesh 0.45", 25000),
            ("18+ 0.33", 25000),
            ("18+ 0.45", 40000),
            ("Red bull 0.33", 38000),
            ("Red bull 0.45", 48000),
            ("Adrenalin 0.33", 18000),
            ("Adrenalin 0.45", 25000),
            ("Chortoq 1l", 15000),
            ("Borjomi 1l", 20000),
            ("Obi hayot 1l", 15000),
        ],
    },
]


class Command(BaseCommand):
    help = "Create/update the Damirchi restaurant menu in MongoDB Atlas."

    def handle(self, *args, **options):
        created_categories = 0
        updated_categories = 0
        created_products = 0
        updated_products = 0

        for category_data in MENU:
            category, category_created = Category.objects.update_or_create(
                name_uz=category_data["name_uz"],
                defaults={
                    "name_ru": category_data["name_ru"],
                    "is_active": True,
                    "sort_order": category_data["sort_order"],
                },
            )

            if category_created:
                created_categories += 1
            else:
                updated_categories += 1

            for product_order, (product_name, price) in enumerate(
                category_data["products"],
                start=1,
            ):
                _product, product_created = Product.objects.update_or_create(
                    category=category,
                    name_uz=product_name,
                    defaults={
                        "price": price,
                        "is_available": True,
                        "is_active": True,
                        "sort_order": product_order,
                    },
                )

                if product_created:
                    created_products += 1
                else:
                    updated_products += 1

        self.stdout.write(
            self.style.SUCCESS(
                "Damirchi menu seeded: "
                f"categories +{created_categories}/~{updated_categories}, "
                f"products +{created_products}/~{updated_products}. "
                "Alcohol products were intentionally excluded."
            )
        )

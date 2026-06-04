"""
Data Migration — cria automaticamente a Application OAuth2 do tipo
Resource Owner Password Credentials (grant_type=password).

client_id fixo: "gerenciecoisas-dev-client"
client_secret: "" (público — client_type=public)

Isso permite que o frontend faça:
  POST /o/token/
  grant_type=password&username=...&password=...&client_id=gerenciecoisas-dev-client
sem precisar configurar nada manualmente no admin.
"""

from django.db import migrations


CLIENT_ID = "gerenciecoisas-dev-client"
APP_NAME  = "GerencieCoisas Dev"


def create_application(apps, schema_editor):
    Application = apps.get_model("oauth2_provider", "Application")
    # Evita duplicata em caso de re-run
    if not Application.objects.filter(client_id=CLIENT_ID).exists():
        Application.objects.create(
            name=APP_NAME,
            client_id=CLIENT_ID,
            client_secret="",                      # client público
            client_type="public",
            authorization_grant_type="password",   # Resource Owner Password
            redirect_uris="",
        )


def delete_application(apps, schema_editor):
    Application = apps.get_model("oauth2_provider", "Application")
    Application.objects.filter(client_id=CLIENT_ID).delete()


class Migration(migrations.Migration):
    
    dependencies = [
            ("produtos", "0002_produto_user"),
            ("oauth2_provider", "0014_alter_help_text"),
        ]

    operations = [
        migrations.RunPython(create_application, delete_application),
    ]
from celery import Celery
from flask import Flask

def create_celery_app(app: Flask = None) -> Celery:
    """
    Creates a Celery application instance.
    """
    app = app or Flask(__name__)
    celery = Celery(
        app.import_name,
        broker=app.config["CELERY_BROKER_URL"],
        backend=app.config["CELERY_RESULT_BACKEND"],
    )
    celery.conf.update(app.config)

    class ContextTask(celery.Task):
        """Make celery work with Flask context."""

        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery